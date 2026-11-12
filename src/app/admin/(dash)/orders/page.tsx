import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, inr, statusTone } from "@/lib/pricing";
import { getOrders } from "@/lib/queries";
import { ORDER_STATUSES } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Orders", robots: { index: false, follow: false } };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const orders = await getOrders(status);
  const tabs = ["all", ...ORDER_STATUSES];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Order management</h1>
          <p className="mt-1 text-[12px] text-slate-500">Confirm freight, verify payments, add tracking and export order data.</p>
        </div>
        <a href="/api/admin/orders/export" className="btn btn-ghost !py-2 !text-[11.5px]">Export CSV</a>
      </div>

      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={`/admin/orders${tab === "all" ? "" : `?status=${encodeURIComponent(tab)}`}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[10.5px] font-semibold transition ${status === tab ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-500 hover:text-slate-800"}`}
          >
            {tab === "all" ? "All orders" : tab}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead className="bg-slate-50 text-[9.5px] uppercase tracking-[0.1em] text-slate-400">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Order</th>
                <th className="px-4 py-2.5 font-semibold">Customer</th>
                <th className="px-4 py-2.5 font-semibold">Date</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold">Payment</th>
                <th className="px-4 py-2.5 font-semibold">Freight</th>
                <th className="px-4 py-2.5 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No orders in this view.</td></tr> : null}
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/orders/${order.id}`} className="font-semibold text-slate-800 hover:text-brand-700">{order.orderNumber}</Link>
                    {order.riskFlag ? <span className="ml-1.5 rounded bg-amber-50 px-1 py-0.5 text-[9px] font-bold text-amber-700">RISK</span> : null}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{order.customerName}<span className="block text-[9.5px] text-slate-400">{order.companyName ?? order.customerType} · {order.mobile}</span></td>
                  <td className="px-4 py-2.5 text-slate-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-2.5"><span className={`chip ring-1 ring-inset ${statusTone(order.status)}`}>{order.status}</span></td>
                  <td className="px-4 py-2.5 text-slate-500">{order.paymentStatus.replace(/_/g, " ")}</td>
                  <td className="px-4 py-2.5 text-slate-500">{order.freight === null ? <span className="text-amber-700">Under review</span> : inr(order.freight)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-900">{inr(order.finalTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
