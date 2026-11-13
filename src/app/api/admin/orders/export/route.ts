import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const items = await db.select().from(orderItems);
  const header = [
    "Order ID", "Date", "Customer", "Company", "Mobile", "Email", "GSTIN", "Customer Type",
    "Status", "Payment Status", "Payment Method", "Product Value", "GST", "Freight", "Discount",
    "Final Total", "Tracking", "Items",
  ];
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((order) => {
    const orderLines = items.filter((item) => item.orderId === order.id);
    const itemSummary = orderLines.map((item) => `${item.sku} x ${item.quantity}`).join(" | ");
    return [
      order.orderNumber, order.createdAt.toISOString(), order.customerName, order.companyName, order.mobile,
      order.email, order.gstin, order.customerType, order.status, order.paymentStatus, order.paymentMethod,
      order.subtotal, order.taxTotal, order.freight ?? "", order.discount, order.finalTotal,
      order.trackingNumber, itemSummary,
    ].map(escape).join(",");
  });
  const csv = [header.map(escape).join(","), ...lines].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rs-medicare-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
