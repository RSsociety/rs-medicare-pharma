import type { Metadata } from "next";
import Link from "next/link";
import { inr, formatDate, statusTone } from "@/lib/pricing";
import { getDashboardData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin Dashboard", robots: { index: false, follow: false } };

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const maxDaily = Math.max(...data.dailySales.map((day) => day.value), 1);
  const stats = [
    { label: "Total orders", value: data.totalOrders, hint: `${data.todayOrders} today` },
    { label: "Monthly orders", value: data.monthOrders, hint: "Current month" },
    { label: "Sales value", value: inr(data.totalSales), hint: "Excludes cancelled" },
    { label: "Pending payments", value: data.pendingPayments, hint: "Awaiting confirmation" },
    { label: "Delivered", value: data.completedOrders, hint: "Completed orders" },
    { label: "Customers", value: data.customers, hint: "Auto-created records" },
    { label: "New enquiries", value: data.newEnquiries, hint: `${data.bulkEnquiries} bulk` },
    { label: "Cancelled", value: data.cancelledOrders, hint: "Order exceptions" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Business overview</h1>
          <p className="mt-1 text-[12px] text-slate-500">Live operational snapshot from the product, order and enquiry database.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/new" className="btn btn-primary !py-2 !text-[11.5px]">Add Product</Link>
          <Link href="/admin/orders" className="btn btn-ghost !py-2 !text-[11.5px]">Manage Orders</Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{stat.label}</p>
            <p className="mt-1.5 font-display text-xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-0.5 text-[10.5px] text-slate-400">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[13px] font-bold text-slate-900">Daily sales — last 14 days</h2>
              <p className="text-[10.5px] text-slate-400">Order value including GST, excluding cancelled orders</p>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Peak {inr(maxDaily)}</span>
          </div>
          <div className="mt-4 flex h-40 items-end gap-1.5">
            {data.dailySales.map((day) => (
              <div key={day.date} className="group flex flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[8.5px] font-semibold text-slate-400 opacity-0 transition group-hover:opacity-100">{day.value > 0 ? inr(day.value) : ""}</span>
                <div className="w-full rounded-t bg-navy-100 transition group-hover:bg-brand-500" style={{ height: `${Math.max(3, (day.value / maxDaily) * 100)}%` }} />
                <span className="text-[8px] text-slate-400">{day.label.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-[13px] font-bold text-slate-900">Order status mix</h2>
          <div className="mt-3 space-y-2">
            {data.statusBreakdown.length === 0 ? <p className="text-[11.5px] text-slate-400">No orders yet.</p> : null}
            {data.statusBreakdown.map((row) => (
              <div key={row.status}>
                <div className="flex justify-between text-[10.5px] text-slate-500"><span>{row.status}</span><span className="font-semibold text-slate-700">{row.count}</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${(row.count / Math.max(data.totalOrders, 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3"><h2 className="text-[13px] font-bold text-slate-900">Top products by value</h2></div>
          <div className="divide-y divide-slate-100">
            {data.topProducts.length === 0 ? <p className="px-4 py-4 text-[11.5px] text-slate-400">No sales recorded yet.</p> : null}
            {data.topProducts.map((product) => (
              <div key={product.sku} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[11.5px] font-semibold text-slate-800">{product.name}</p>
                  <p className="text-[9.5px] text-slate-400">{product.sku} · {product.quantity} units</p>
                </div>
                <span className="shrink-0 text-[11.5px] font-bold text-slate-900">{inr(product.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3"><h2 className="text-[13px] font-bold text-slate-900">Low stock alerts</h2></div>
          <div className="divide-y divide-slate-100">
            {data.lowStockProducts.length === 0 ? <p className="px-4 py-4 text-[11.5px] text-slate-400">All products above threshold.</p> : null}
            {data.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[11.5px] font-semibold text-slate-800">{product.name}</p>
                  <p className="text-[9.5px] text-slate-400">{product.sku} · threshold {product.lowStockThreshold}</p>
                </div>
                <span className="shrink-0 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">{product.stockQuantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="text-[13px] font-bold text-slate-900">Recent orders</h2>
          <Link href="/admin/orders" className="text-[11px] font-semibold text-brand-700 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-[11.5px]">
            <thead className="bg-slate-50 text-[9.5px] uppercase tracking-[0.1em] text-slate-400">
              <tr><th className="px-4 py-2 font-semibold">Order</th><th className="px-4 py-2 font-semibold">Customer</th><th className="px-4 py-2 font-semibold">Date</th><th className="px-4 py-2 font-semibold">Status</th><th className="px-4 py-2 text-right font-semibold">Total</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentOrders.length === 0 ? <tr><td colSpan={5} className="px-4 py-5 text-center text-slate-400">No orders yet. Place a test order from the storefront.</td></tr> : null}
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-semibold text-slate-800"><Link href={`/admin/orders/${order.id}`} className="hover:text-brand-700">{order.orderNumber}</Link></td>
                  <td className="px-4 py-2.5 text-slate-500">{order.customerName}<span className="block text-[9.5px] text-slate-400">{order.companyName ?? order.customerType}</span></td>
                  <td className="px-4 py-2.5 text-slate-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-2.5"><span className={`chip ring-1 ring-inset ${statusTone(order.status)}`}>{order.status}</span></td>
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
