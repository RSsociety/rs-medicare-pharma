import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FreightWorksheet } from "@/components/admin/freight-worksheet";
import { OrderManager } from "@/components/admin/order-manager";
import { PrintButton } from "@/components/print-button";
import { describeFreightBreakdown, formatDateTime, inr, normaliseFreightBreakdown, orderTaxRows, statusTone, weightDisplay } from "@/lib/pricing";
import { getSettings } from "@/lib/settings";
import { getOrderById } from "@/lib/queries";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Order Detail", robots: { index: false, follow: false } };

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getOrderById(Number(id));
  if (!result) notFound();
  const { order, items } = result;
  const address = order.shippingAddress as Record<string, string>;
  const settings = await getSettings();
  const tax = orderTaxRows(order, settings.companyState);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="no-print text-[11px] font-semibold text-slate-500 hover:text-slate-800">← Back to orders</Link>
          <h1 className="mt-1.5 text-xl font-bold text-slate-900">{order.orderNumber}</h1>
          <p className="mt-0.5 text-[11.5px] text-slate-500">
            Placed {formatDateTime(order.createdAt)} · {order.customerName}{order.companyName ? ` · ${order.companyName}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip ring-1 ring-inset ${statusTone(order.status)}`}>{order.status}</span>
          {order.riskFlag ? <span className="chip bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200">Risk: {order.riskReason}</span> : null}
          <PrintButton label="Print invoice" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <p className="font-display text-[15px] font-extrabold text-slate-900">RS MEDICARE PHARMA</p>
              <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.16em] text-brand-700">Pharmaceutical & Medical Products Supply</p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">{site.address.line1}, {site.address.city}, {site.address.state} {site.address.pincode}<br />{site.phone} · {site.email}</p>
            </div>
            <div className="text-right">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">Order / Invoice</p>
              <p className="mt-0.5 font-display text-[13px] font-bold text-slate-900">{order.orderNumber}</p>
              <p className="text-[9.5px] text-slate-500">{formatDateTime(order.createdAt)}</p>
            </div>
          </div>

          <div className="grid gap-3 border-b border-slate-100 py-3 sm:grid-cols-2">
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">Customer</p>
              <p className="mt-1 text-[11.5px] font-semibold text-slate-800">{order.customerName}</p>
              <p className="text-[10.5px] leading-relaxed text-slate-500">{order.companyName}<br />{order.mobile}{order.email ? <><br />{order.email}</> : null}{order.gstin ? <><br />GSTIN: {order.gstin}</> : null}<br />Type: {order.customerType}</p>
            </div>
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400">Delivery address</p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-slate-500">{address.line1}<br />{address.city}, {address.state} {address.pincode}<br />{address.country}</p>
            </div>
          </div>

          <table className="mt-3 w-full text-left text-[11px]">
            <thead className="text-[9px] uppercase tracking-[0.1em] text-slate-400">
              <tr><th className="pb-1.5 font-semibold">Item</th><th className="pb-1.5 font-semibold">Qty</th><th className="pb-1.5 font-semibold">Rate</th><th className="pb-1.5 font-semibold">GST</th><th className="pb-1.5 text-right font-semibold">Amount</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 pr-2"><span className="font-medium text-slate-800">{item.name}</span><span className="block text-[9px] text-slate-400">{item.sku} · {item.packSize} · {item.unit}{item.variantLabel ? ` · ${item.variantLabel}` : ""}</span></td>
                  <td className="py-2 text-slate-600">{item.quantity}</td>
                  <td className="py-2 text-slate-600">{inr(item.unitPrice)}</td>
                  <td className="py-2 text-slate-600">{item.taxRate}%</td>
                  <td className="py-2 text-right font-semibold text-slate-800">{inr(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <dl className="ml-auto mt-3 w-full max-w-xs space-y-1 border-t border-slate-100 pt-2 text-[11px]">
            <div className="flex justify-between text-slate-500"><dt>Product value</dt><dd>{inr(order.subtotal)}</dd></div>
            {tax.interState ? (
              <div className="flex justify-between text-slate-500"><dt>IGST</dt><dd>{inr(tax.igst)}</dd></div>
            ) : (
              <>
                <div className="flex justify-between text-slate-500"><dt>CGST</dt><dd>{inr(tax.cgst)}</dd></div>
                <div className="flex justify-between text-slate-500"><dt>SGST</dt><dd>{inr(tax.sgst)}</dd></div>
              </>
            )}
            <div className="flex justify-between text-[9.5px] text-slate-400">
              <dt>{tax.interState ? "Inter-state supply (IGST)" : "Intra-state supply (CGST+SGST)"}</dt>
              <dd>{tax.deliveryState || "—"} · company state {tax.companyState}</dd>
            </div>
            <div className="flex justify-between text-slate-500"><dt>Freight ({order.shipmentMode})</dt><dd>{order.freight === null ? "Under review" : inr(order.freight)}</dd></div>
            {describeFreightBreakdown(normaliseFreightBreakdown(order.freightBreakdown)).map((row) => (
              <div key={row.label} className="flex justify-between pl-3 text-[10px] text-slate-400"><dt>{row.label}</dt><dd>{inr(row.value)}</dd></div>
            ))}
            {order.billableWeightKg ? (
              <div className="flex justify-between text-[10px] text-slate-400"><dt>Billable weight</dt><dd>{weightDisplay(order.billableWeightKg)}</dd></div>
            ) : null}
            {order.discount > 0 ? <div className="flex justify-between text-slate-500"><dt>Discount</dt><dd>− {inr(order.discount)}</dd></div> : null}
            <div className="flex justify-between border-t border-slate-200 pt-1.5 text-[12px] font-bold text-slate-900"><dt>Final payable</dt><dd>{inr(order.finalTotal)}</dd></div>
          </dl>
          <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-2 text-[9.5px] text-slate-400">
            <span>Payment preference: {order.paymentMethod.replace(/_/g, " ")} · {order.paymentStatus.replace(/_/g, " ")}</span>
            <span>{order.trackingNumber ? `Tracking ${order.trackingNumber}${order.transporter ? ` (${order.transporter})` : ""}` : "Tracking not assigned"}</span>
          </div>
          <p className="mt-2 text-[8.5px] leading-relaxed text-slate-400">
            Invoice generated from the order management system. Product base prices are centralised; GST and freight are itemised separately. No certification or regulatory approval claim is made on this document.
          </p>
        </div>

        <div className="space-y-4">
          <FreightWorksheet
            orderId={order.id}
            freight={order.freight}
            shipmentMode={order.shipmentMode}
            estimatedWeightKg={order.estimatedWeightKg}
            billableWeightKg={order.billableWeightKg}
            freightBreakdown={order.freightBreakdown}
            shippingAddress={address}
            subtotal={order.subtotal}
            taxTotal={order.taxTotal}
            units={items.reduce((sum, item) => sum + item.quantity, 0)}
          />
          <OrderManager order={order} />
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-[10.5px] leading-relaxed text-slate-500">
            <h2 className="text-[12px] font-bold text-slate-900">Customer record</h2>
            <p className="mt-1">Order for {order.mobile} is linked to customer #{order.customerId}. Outstanding balances update automatically when payment status is set to paid.</p>
            <Link href="/admin/customers" className="mt-2 inline-flex text-[10.5px] font-semibold text-brand-700 hover:underline">Open customer database →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
