import type { Metadata } from "next";
import Link from "next/link";
import { OrderTimeline } from "@/components/order-timeline";
import { ReorderButton } from "@/components/reorder-button";
import { PageHero } from "@/components/ui";
import { describeFreightBreakdown, formatDateTime, inr, normaliseFreightBreakdown, statusTone, weightDisplay } from "@/lib/pricing";
import { findOrdersForTracking } from "@/lib/queries";
import { whatsappLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Track your RS Medicare Pharma order with your Order ID and registered mobile number or email. No account or login required.",
  alternates: { canonical: "/track" },
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; contact?: string }>;
}) {
  const params = await searchParams;
  const orderQuery = (params.order ?? "").trim();
  const contact = (params.contact ?? "").trim();
  const searched = orderQuery.length > 0 && contact.length > 0;

  let result: Awaited<ReturnType<typeof findOrdersForTracking>> = null;
  let error: string | null = null;
  if (searched) {
    try {
      result = await findOrdersForTracking(orderQuery, contact);
      if (!result) error = "No order matched those details. Check the Order ID and use the same mobile number or email used while ordering.";
    } catch {
      error = "We could not look up the order right now. Please retry or contact support.";
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Order tracking"
        title="Track your order without logging in"
        description="Enter your Order ID (for example RSM-2026-000001) along with the mobile number or email used while placing the order."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Track Order" }]}
      />
      <section className="shell py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
          <form action="/track" method="get" className="card p-5">
            <h2 className="text-[15px] font-bold text-navy-900">Find your order</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label" htmlFor="order">Order ID *</label>
                <input id="order" name="order" required defaultValue={orderQuery} placeholder="RSM-2026-000001" className="field uppercase" />
              </div>
              <div>
                <label className="label" htmlFor="contact">Mobile or email *</label>
                <input id="contact" name="contact" required defaultValue={contact} placeholder="Mobile number or email" className="field" />
              </div>
              <button type="submit" className="btn btn-brand w-full">Track Order</button>
            </div>
            <p className="mt-3 text-[10.5px] leading-relaxed text-navy-400">
              Use the mobile number or email exactly as entered at checkout. For privacy, only that
              contact can retrieve the order.
            </p>
            <div className="mt-4 rounded-xl bg-navy-50/70 p-3 text-[11px] leading-relaxed text-navy-600">
              Need help? <a href={whatsappLink("Hello RS Medicare Pharma, I need help tracking my order.")} className="font-semibold text-brand-700 hover:underline">Message us on WhatsApp</a> with your Order ID.
            </div>
          </form>

          <div>
            {!searched ? (
              <div className="card p-8">
                <h2 className="text-[15px] font-bold text-navy-900">Order status checkpoints</h2>
                <p className="mt-1 text-[12px] text-navy-500">Every order moves through these visible stages so buyers know exactly where their supply stands.</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {[
                    "Order Received", "Order Under Review", "Freight Calculated", "Payment Pending",
                    "Payment Confirmed", "Processing", "Packed", "Dispatched", "In Transit", "Delivered",
                  ].map((status, index) => (
                    <div key={status} className="flex items-center gap-2.5 rounded-lg border border-navy-100 bg-navy-50/40 px-3 py-2">
                      <span className="grid h-6 w-6 place-items-center rounded-md bg-white text-[10px] font-bold text-navy-500 ring-1 ring-navy-100">{index + 1}</span>
                      <span className="text-[12px] font-medium text-navy-700">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="card p-8">
                <h2 className="text-[15px] font-bold text-navy-900">No order found</h2>
                <p className="mt-2 text-[12.5px] text-navy-500">{error}</p>
                <Link href="/contact" className="btn btn-primary mt-4">Contact Support</Link>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-navy-400">Order</p>
                      <p className="font-display text-xl font-extrabold text-navy-900">{result.order.orderNumber}</p>
                      <p className="mt-1 text-[11.5px] text-navy-500">Placed {formatDateTime(result.order.createdAt)} · {result.order.customerName}</p>
                    </div>
                    <span className={`chip ring-1 ring-inset ${statusTone(result.order.status)}`}>{result.order.status}</span>
                  </div>
                  <div className="mt-5"><OrderTimeline status={result.order.status} /></div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Product value", value: inr(result.order.subtotal) },
                      { label: "GST", value: inr(result.order.taxTotal) },
                      { label: `Freight (${result.order.shipmentMode})`, value: result.order.freight === null ? "Under review" : inr(result.order.freight) },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-navy-100 bg-navy-50/40 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-400">{item.label}</p>
                        <p className="mt-0.5 text-[12.5px] font-semibold text-navy-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between rounded-xl bg-navy-900 px-4 py-3 text-white">
                    <span className="text-[12px] font-semibold">{result.order.freight === null ? "Total before freight" : "Final total"}</span>
                    <span className="font-display text-base font-bold">{inr(result.order.finalTotal)}</span>
                  </div>
                  {result.order.freight === null ? (
                    <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800">
                      Freight is under review. Our dispatch team is calculating it from your delivery location, consignment weight
                      {result.order.estimatedWeightKg ? ` (${weightDisplay(result.order.estimatedWeightKg)})` : ""} and shipment mode. The amount will appear here once confirmed.
                    </p>
                  ) : (
                    <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-[11px] font-medium text-emerald-800">
                      <p>Freight confirmed: {inr(result.order.freight)} via {result.order.shipmentMode}{result.order.billableWeightKg ? ` · ${weightDisplay(result.order.billableWeightKg)}` : ""}</p>
                      {describeFreightBreakdown(normaliseFreightBreakdown(result.order.freightBreakdown)).length > 0 ? (
                        <ul className="mt-1.5 space-y-0.5 font-normal text-emerald-800/85">
                          {describeFreightBreakdown(normaliseFreightBreakdown(result.order.freightBreakdown)).map((row) => (
                            <li key={row.label}>{row.label}: {inr(row.value)}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  )}
                  {result.order.trackingNumber ? (
                    <p className="mt-3 rounded-lg bg-sky-50 px-3 py-2 text-[11.5px] font-medium text-sky-800">
                      Tracking: {result.order.trackingNumber}{result.order.transporter ? ` · ${result.order.transporter}` : ""}
                    </p>
                  ) : null}
                </div>

                <div className="card p-5">
                  <h2 className="text-[14px] font-bold text-navy-900">Products in this order</h2>
                  <ul className="mt-2 divide-y divide-navy-100">
                    {result.items.map((item) => (
                      <li key={item.id} className="flex justify-between gap-3 py-2 text-[12px]">
                        <span className="text-navy-600">{item.name} <span className="text-navy-400">× {item.quantity}</span></span>
                        <span className="font-semibold text-navy-800">{inr(item.lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ReorderButton lines={result.items.map((item) => ({ ...item, productId: item.productId, slug: item.slug }))} label="Reorder these products" className="btn btn-primary !py-2 !text-[12px]" />
                    <Link href={`/order-confirmation/${result.order.orderNumber}`} className="btn btn-ghost !py-2 !text-[12px]">View confirmation</Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
