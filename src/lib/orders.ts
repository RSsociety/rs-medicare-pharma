import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, customers, orderItems, orders, products } from "@/db/schema";
import {
  buildOrderNumber,
  isValidEmail,
  isValidMobile,
  isValidPincode,
  manualFreightReview,
  normaliseMobile,
  round2,
  totalOrderWeightKg,
} from "@/lib/pricing";
import { enabledPaymentMethods, getSettings } from "@/lib/settings";

export type CheckoutPayload = {
  customerName?: string;
  companyName?: string;
  mobile?: string;
  email?: string;
  gstin?: string;
  customerType?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  paymentMethod?: string;
  customerNotes?: string;
  items?: { productId?: number; quantity?: number }[];
};

export type OrderResult =
  | { ok: true; orderNumber: string; orderId: number; finalTotal: number }
  | { ok: false; error: string; field?: string };

async function nextOrderSequence() {
  await db.execute(sql`CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1`).catch(() => undefined);
  const result = await db.execute<{ n: string }>(sql`SELECT nextval('order_number_seq') AS n`);
  return Number(result.rows[0]?.n ?? Date.now() % 900000);
}

export async function createOrder(payload: CheckoutPayload): Promise<OrderResult> {
  const settings = await getSettings();
  const name = (payload.customerName ?? "").trim();
  const mobile = normaliseMobile(payload.mobile ?? "");
  const email = (payload.email ?? "").trim();
  const customerType = (payload.customerType ?? "Retailer").trim();
  const address = (payload.address ?? "").trim();
  const city = (payload.city ?? "").trim();
  const state = (payload.state ?? "").trim();
  const pincode = (payload.pincode ?? "").trim();
  const country = (payload.country ?? "India").trim();
  const paymentMethod = (payload.paymentMethod ?? "bank_transfer").trim();
  const items = payload.items ?? [];

  if (name.length < 2) return { ok: false, error: "Please enter the customer name.", field: "customerName" };
  if (!isValidMobile(mobile)) return { ok: false, error: "Enter a valid 10-digit Indian mobile number.", field: "mobile" };
  if (email && !isValidEmail(email)) return { ok: false, error: "Enter a valid email address.", field: "email" };
  if (!address) return { ok: false, error: "Delivery address is required.", field: "address" };
  if (!city) return { ok: false, error: "City is required.", field: "city" };
  if (!state) return { ok: false, error: "State is required.", field: "state" };
  if (!isValidPincode(pincode)) return { ok: false, error: "Enter a valid 6-digit pincode.", field: "pincode" };
  if (items.length === 0) return { ok: false, error: "Your cart is empty." };

  const allowed = enabledPaymentMethods(settings).map((method) => method.value);
  if (!allowed.includes(paymentMethod)) {
    return { ok: false, error: "The selected payment method is not currently available. Please choose another option." };
  }

  const ids = items.map((item) => Number(item.productId)).filter((id) => Number.isFinite(id));
  if (ids.length === 0) return { ok: false, error: "Your cart is empty." };
  const rows = await db.select().from(products).where(inArray(products.id, ids));
  if (rows.length === 0) return { ok: false, error: "Products in your cart are no longer available." };

  const lines = [] as {
    productId: number;
    sku: string;
    name: string;
    slug: string;
    packSize: string | null;
    unit: string;
    unitPrice: number;
    taxRate: number;
    quantity: number;
    lineSubtotal: number;
    lineTax: number;
    lineTotal: number;
  }[];

  let subtotal = 0;
  let taxTotal = 0;
  let totalUnits = 0;

  for (const item of items) {
    const product = rows.find((row) => row.id === Number(item.productId));
    if (!product) return { ok: false, error: "One of the products in your cart is no longer available." };
    if (product.status !== "active") return { ok: false, error: `${product.name} is not available for ordering right now.` };
    const quantity = Math.max(product.moq, Math.round(Number(item.quantity) || product.moq));
    if (product.stockQuantity > 0 && quantity > product.stockQuantity) {
      return { ok: false, error: `Only ${product.stockQuantity} ${product.unit}(s) of ${product.name} are currently available.` };
    }
    const lineSubtotal = round2(product.basePrice * quantity);
    const taxRate = settings.taxEnabled ? product.taxRate : 0;
    const lineTax = round2((lineSubtotal * taxRate) / 100);
    subtotal = round2(subtotal + lineSubtotal);
    taxTotal = round2(taxTotal + lineTax);
    totalUnits += quantity;
    lines.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      packSize: product.packSize,
      unit: product.unit,
      unitPrice: product.basePrice,
      taxRate,
      quantity,
      lineSubtotal,
      lineTax,
      lineTotal: round2(lineSubtotal + lineTax),
    });
  }

  // Option A — manual freight. Freight is never calculated or estimated at checkout.
  const freightReview = manualFreightReview();
  const freight = freightReview.freight;
  const finalTotal = round2(subtotal + taxTotal);
  const estimatedWeightKg = totalOrderWeightKg(
    lines.map((line) => ({
      quantity: line.quantity,
      weightKg: rows.find((row) => row.id === line.productId)?.weightKg ?? 0,
      weight: rows.find((row) => row.id === line.productId)?.weight ?? null,
    })),
  );

  const riskReasons: string[] = [];
  if (finalTotal > Number(settings.riskOrderValueThreshold || 100000)) riskReasons.push("High order value");
  if (totalUnits > 20000) riskReasons.push("High unit quantity");
  if (!address || address.length < 8) riskReasons.push("Short address");

  const shippingAddress = { line1: address, city, state, pincode, country };
  // Option A — every order enters the manual freight review workflow on creation.
  const status = riskReasons.length > 0 ? "Order Under Review" : "Freight Under Review";

  const sequence = await nextOrderSequence();
  const orderNumber = buildOrderNumber(new Date().getFullYear(), sequence);

  const existingCustomer = await db
    .select()
    .from(customers)
    .where(eq(customers.mobile, mobile))
    .limit(1);

  let customerId: number;
  if (existingCustomer[0]) {
    customerId = existingCustomer[0].id;
    await db
      .update(customers)
      .set({
        name,
        companyName: payload.companyName?.trim() || existingCustomer[0].companyName,
        email: email || existingCustomer[0].email,
        gstin: payload.gstin?.trim() || existingCustomer[0].gstin,
        customerType,
        address,
        city,
        state,
        pincode,
        totalOrders: existingCustomer[0].totalOrders + 1,
        totalValue: round2(existingCustomer[0].totalValue + finalTotal),
        outstandingAmount: round2(existingCustomer[0].outstandingAmount + finalTotal),
        lastOrderAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(customers.id, existingCustomer[0].id));
  } else {
    const [created] = await db
      .insert(customers)
      .values({
        name,
        companyName: payload.companyName?.trim() || null,
        mobile,
        email: email || null,
        gstin: payload.gstin?.trim() || null,
        customerType,
        address,
        city,
        state,
        pincode,
        totalOrders: 1,
        totalValue: finalTotal,
        outstandingAmount: finalTotal,
        lastOrderAt: new Date(),
      })
      .returning({ id: customers.id });
    customerId = created.id;
  }

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerId,
      customerName: name,
      companyName: payload.companyName?.trim() || null,
      mobile,
      email: email || null,
      gstin: payload.gstin?.trim() || null,
      customerType,
      billingAddress: shippingAddress,
      shippingAddress,
      subtotal,
      taxTotal,
      freight,
      freightMode: "manual",
      shipmentMode: "Road",
      estimatedWeightKg,
      billableWeightKg: estimatedWeightKg,
      freightBreakdown: {},
      finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "cod_due" : "pending",
      status,
      customerNotes: payload.customerNotes?.trim() || null,
      riskFlag: riskReasons.length > 0,
      riskReason: riskReasons.join(", ") || null,
    })
    .returning({ id: orders.id });

  await db.insert(orderItems).values(
    lines.map((line) => ({
      orderId: order.id,
      productId: line.productId,
      sku: line.sku,
      name: line.name,
      slug: line.slug,
      packSize: line.packSize,
      unit: line.unit,
      unitPrice: line.unitPrice,
      taxRate: line.taxRate,
      quantity: line.quantity,
      lineSubtotal: line.lineSubtotal,
      lineTax: line.lineTax,
      lineTotal: line.lineTotal,
    })),
  );

  for (const line of lines) {
    const product = rows.find((row) => row.id === line.productId);
    if (!product) continue;
    await db
      .update(products)
      .set({
        stockQuantity: Math.max(0, product.stockQuantity - line.quantity),
        updatedAt: new Date(),
      })
      .where(eq(products.id, product.id));
  }

  await db.insert(auditLogs).values({
    actor: "storefront",
    action: "order.created",
    entity: "order",
    entityId: orderNumber,
    details: `${name} · ${mobile} · ${finalTotal} · ${status}`,
  });

  return { ok: true, orderNumber, orderId: order.id, finalTotal };
}

export async function logAdminAction(action: string, entity: string, entityId?: string, details?: string) {
  await db.insert(auditLogs).values({ action, entity, entityId, details, actor: "admin" }).catch(() => undefined);
}
