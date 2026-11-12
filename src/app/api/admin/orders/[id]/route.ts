import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers, orders } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { logAdminAction } from "@/lib/orders";
import { ORDER_STATUSES, PAYMENT_STATUSES, SHIPMENT_MODES, type ShipmentMode } from "@/lib/site";
import { normaliseFreightBreakdown, round2 } from "@/lib/pricing";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const orderId = Number(id);
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const [existing] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!existing) return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });

  const status = String(body.status ?? existing.status);
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return NextResponse.json({ ok: false, error: "Invalid order status." }, { status: 400 });
  }
  const paymentStatus = String(body.paymentStatus ?? existing.paymentStatus);
  if (!PAYMENT_STATUSES.some((item) => item.value === paymentStatus)) {
    return NextResponse.json({ ok: false, error: "Invalid payment status." }, { status: 400 });
  }

  const freightRaw = body.freight;
  let freight: number | null = existing.freight;
  if (freightRaw === null || freightRaw === "" || typeof freightRaw === "undefined") {
    freight = typeof body.clearFreight === "boolean" && body.clearFreight ? null : existing.freight;
  } else {
    const parsed = Number(freightRaw);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return NextResponse.json({ ok: false, error: "Freight must be a positive number." }, { status: 400 });
    }
    freight = round2(parsed);
  }

  const shipmentMode = SHIPMENT_MODES.includes(String(body.shipmentMode) as ShipmentMode)
    ? String(body.shipmentMode)
    : existing.shipmentMode;

  let billableWeightKg = existing.billableWeightKg;
  if (body.billableWeightKg === null || body.billableWeightKg === "") {
    billableWeightKg = existing.estimatedWeightKg;
  } else {
    const parsedWeight = Number(body.billableWeightKg);
    if (Number.isFinite(parsedWeight) && parsedWeight >= 0) billableWeightKg = round2(parsedWeight);
  }

  let freightBreakdown = existing.freightBreakdown;
  if (body.freightBreakdown && typeof body.freightBreakdown === "object") {
    const input = body.freightBreakdown as Record<string, unknown>;
    freightBreakdown = {
      ...normaliseFreightBreakdown(input),
      notes: typeof input.notes === "string" ? input.notes.slice(0, 400) : "",
    } as unknown as Record<string, string | number>;
  }

  const discountRaw = Number(body.discount ?? existing.discount);
  const discount = Number.isFinite(discountRaw) && discountRaw >= 0 ? round2(discountRaw) : existing.discount;
  const finalTotal = round2(existing.subtotal + existing.taxTotal + (freight ?? 0) - discount);

  await db
    .update(orders)
    .set({
      status,
      paymentStatus,
      freight,
      freightMode: "manual",
      shipmentMode,
      billableWeightKg,
      freightBreakdown,
      discount,
      finalTotal,
      trackingNumber: String(body.trackingNumber ?? existing.trackingNumber ?? "") || null,
      transporter: String(body.transporter ?? existing.transporter ?? "") || null,
      internalNotes: String(body.internalNotes ?? existing.internalNotes ?? "") || null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  if (existing.customerId) {
    const [customer] = await db.select().from(customers).where(eq(customers.id, existing.customerId)).limit(1);
    if (customer) {
      const outstanding =
        paymentStatus === "paid" ? Math.max(0, round2(customer.outstandingAmount - existing.finalTotal)) : customer.outstandingAmount;
      await db
        .update(customers)
        .set({ outstandingAmount: outstanding, updatedAt: new Date() })
        .where(eq(customers.id, customer.id));
    }
  }

  await logAdminAction("order.updated", "order", existing.orderNumber, `${status} · ${paymentStatus} · freight ${freight ?? "pending"}`);
  return NextResponse.json({ ok: true, finalTotal });
}
