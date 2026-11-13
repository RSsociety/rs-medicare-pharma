import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderTimeline } from "@/components/order-timeline";
import { PrintButton } from "@/components/print-button";
import { ReorderButton } from "@/components/reorder-button";
import { Breadcrumbs } from "@/components/ui";
import { describeFreightBreakdown, formatDateTime, inr, normaliseFreightBreakdown, orderTaxRows, statusTone, weightDisplay } from "@/lib/pricing";
import { getSettings } from "@/lib/settings";
import { getOrderByNumber } from "@/lib/queries";
import { site, whatsappLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const result = await getOrderByNumber(decodeURIComponent(orderNumber)).catch(() => null);
  if (!result) notFound();
  const { order, items } = result;
  const address = order.shippingAddress as Record<string, string>;
  const settings = await getSettings();
  const tax = orderTaxRows(order, settings.companyState);

  return (
    <>
      <div className="border-b border-navy-100 bg-navy-50/50">
        <div className="shell py-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Order Confirmation" }]} />
        </div>
      </div>

      <section className="shell py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-6 text-center sm:p-8">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h1 className="mt-4 text-2xl font-bold text-navy-900">Order received</h1>
            <p className="mt-2 text-[13px] text-navy-600">
              Thank you, {order.customerName}. Our team has received your order and will review stock,
              delivery location and freight before confirming dispatch.
            </p>
            <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 shadow-card">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-400">Order ID</span>
              <span className="font-display text-lg font-extrabold tracking-tight text-navy-900">{order.orderNumber}</span>
              <span className={`chip ring-1 ring-inset ${statusTone(order.status)}`}>{order.status}</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[14px] font-bold text-navy-900">Order progress</h2>
              <span className="text-[11px] text-navy-400">Placed {formatDateTime(order.createdAt)}</span>
            </div>
            <div className="mt-4"><OrderTimeline status={order.status} /></div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <h2 className="text-[14px] font-bold text-navy-900">Products</h2>
              <ul className="mt-3 divide-y divide-navy-100">
                {items.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 py-2.5">
                    <div>
                      <p className="text-[12.5px] font-semibold text-navy-900">{item.name}</p>
                      <p className="mt-0.5 text-[11px] text-navy-400">
                        {item.sku} · {item.packSize} · {item.quantity} × {inr(item.unitPrice)} · GST {item.taxRate}%{item.variantLabel ? ` · ${item.variantLabel}` : ""}
                      </p>
                    </div>
                    <p className="shrink-0 text-[12.5px] font-semibold text-navy-900">{inr(item.lineTotal)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1.5 border-t border-navy-100 pt-3 text-[12.5px]">
                <div className="flex justify-between text-navy-500"><dt>Product value</dt><dd className="font-semibold text-navy-800">{inr(order.subtotal)}</dd></div>
                {tax.interState ? (
                  <div className="flex justify-between text-navy-500">
                    <dt>IGST (effective {tax.taxRate}%)</dt>
                    <dd className="font-semibold text-navy-800">{inr(tax.igst)}</dd>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-navy-500">
                      <dt>CGST</dt>
                      <dd className="font-semibold text-navy-800">{inr(tax.cgst)}</dd>
                    </div>
                    <div className="flex justify-between text-navy-500">
                      <dt>SGST</dt>
                      <dd className="font-semibold text-navy-800">{inr(tax.sgst)}</dd>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-[11px] text-navy-400">
                  <dt>{tax.interState ? "Inter-state supply" : "Intra-state supply"}</dt>
                  <dd>{tax.deliveryState || "—"} {tax.interState ? "→ IGST" : `· ${tax.mode}`}</dd>
                </div>
                <div className="flex justify-between text-navy-500">
                  <dt>Freight ({order.shipmentMode})</dt>
                  <dd className="font-semibold">{order.freight === null ? <span className="text-brand-700">Under review</span> : inr(order.freight)}</dd>
                </div>
                {describeFreightBreakdown(normaliseFreightBreakdown(order.freightBreakdown)).map((row) => (
                  <div key={row.label} className="flex justify-between pl-3 text-[11px] text-navy-400">
                    <dt>{row.label}</dt>
                    <dd>{inr(row.value)}</dd>
                  </div>
                ))}
                {order.discount > 0 ? (
                  <div className="flex justify-between text-navy-500"><dt>Discount</dt><dd className="font-semibold text-emerald-700">− {inr(order.discount)}</dd></div>
                ) : null}
                <div className="flex justify-between border-t border-navy-100 pt-2 text-navy-900">
                  <dt className="font-semibold">{order.freight === null ? "Total before freight" : "Final total"}</dt>
                  <dd className="font-display text-base font-bold">{inr(order.finalTotal)}</dd>
                </div>
              </dl>
              {order.freight === null ? (
                <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2.5 text-[11px] font-medium text-amber-800">
                  <p>Freight is under review.</p>
                  <p className="mt-1 font-normal text-amber-800/85">
                    Our dispatch team is calculating freight for {address.city}, {address.state} {address.pincode} from the
                    consignment weight{order.estimatedWeightKg ? ` (${weightDisplay(order.estimatedWeightKg)})` : ""}, shipment mode and
                    transporter charges. Track this order for the confirmed amount.
                  </p>
                </div>
              ) : (
                <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-[11px] font-medium text-emerald-800">
                  <p>Freight confirmed: {inr(order.freight)} via {order.shipmentMode}{order.billableWeightKg ? ` · ${weightDisplay(order.billableWeightKg)}` : ""}.</p>
                  {typeof order.freightBreakdown?.notes === "string" && order.freightBreakdown.notes ? (
                    <p className="mt-1 font-normal text-emerald-800/85">{order.freightBreakdown.notes}</p>
                  ) : null}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                <h2 className="text-[14px] font-bold text-navy-900">Delivery details</h2>
                <div className="mt-2.5 space-y-1 text-[12px] leading-relaxed text-navy-600">
                  <p className="font-semibold text-navy-800">{order.customerName}{order.companyName ? ` · ${order.companyName}` : ""}</p>
                  <p>{address.line1}</p>
                  <p>{address.city}, {address.state} {address.pincode}</p>
                  <p>{address.country}</p>
                  <p className="pt-1">{order.mobile}{order.email ? ` · ${order.email}` : ""}</p>
                  {order.gstin ? <p>GSTIN: {order.gstin}</p> : null}
                  <p className="pt-1 text-[11px] text-navy-400">Customer type: {order.customerType}</p>
                  <p className="text-[11px] text-navy-400">Payment preference: {order.paymentMethod.replace(/_/g, " ")}</p>
                {items.some((item) => item.variantLabel) ? (
                  <p className="text-[11px] text-navy-400">
                    Options ordered: {items.filter((item) => item.variantLabel).map((item) => item.variantLabel).join(", ")}
                  </p>
                ) : null}
                </div>
              </div>
              <div className="rounded-2xl border border-navy-100 bg-navy-50/60 p-5">
                <h2 className="text-[13px] font-bold text-navy-900">What happens next?</h2>
                <ol className="mt-2 space-y-1.5 text-[11.5px] leading-relaxed text-navy-600">
                  <li>1. Our team verifies stock and computes freight for your pincode, weight and shipment mode.</li>
                  <li>2. Freight and payment instructions are updated on this order.</li>
                  <li>3. After payment confirmation, the order is packed and dispatched.</li>
                  <li>4. Tracking details appear on the order tracking page.</li>
                </ol>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/track" className="btn btn-primary !py-2 !text-[11.5px]">Track Order</Link>
                  <a href={whatsappLink(`Hello RS Medicare Pharma, I need an update on order ${order.orderNumber}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !py-2 !text-[11.5px]">WhatsApp Support</a>
                </div>
              </div>
            </div>
          </div>

          <div className="no-print mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-4">
            <p className="text-[11.5px] text-navy-500">Keep this Order ID for tracking and support: <span className="font-semibold text-navy-900">{order.orderNumber}</span></p>
            <div className="flex flex-wrap gap-2">
              <PrintButton />
              <ReorderButton lines={items.map((item) => ({ ...item, productId: item.productId, slug: item.slug }))} />
              <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
            </div>
          </div>
          <p className="mt-4 text-center text-[10.5px] text-navy-400">
            Order confirmation is displayed here immediately. Email / WhatsApp confirmation is sent according to the
            contact details on file. For assistance call {site.phone}.
          </p>
        </div>
      </section>
    </>
  );
}
