import type { Metadata } from "next";
import { formatDate, inr } from "@/lib/pricing";
import { getCustomers, getOrders } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Customers", robots: { index: false, follow: false } };

export default async function AdminCustomersPage() {
  const [customers, orders] = await Promise.all([getCustomers(), getOrders()]);
  const totalValue = customers.reduce((sum, customer) => sum + customer.totalValue, 0);
  const outstanding = customers.reduce((sum, customer) => sum + customer.outstandingAmount, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Customer database</h1>
        <p className="mt-1 text-[12px] text-slate-500">
          {customers.length} customer records · {inr(totalValue)} lifetime value · {inr(outstanding)} outstanding — the foundation for CRM and repeat-order follow-up.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-[11.5px]">
            <thead className="bg-slate-50 text-[9.5px] uppercase tracking-[0.1em] text-slate-400">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Customer</th>
                <th className="px-4 py-2.5 font-semibold">Contact</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">Location</th>
                <th className="px-4 py-2.5 font-semibold">Orders</th>
                <th className="px-4 py-2.5 font-semibold">Lifetime value</th>
                <th className="px-4 py-2.5 font-semibold">Outstanding</th>
                <th className="px-4 py-2.5 font-semibold">Last order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">No customers yet. Place an order to create the first record.</td></tr> : null}
              {customers.map((customer) => {
                const customerOrders = orders.filter((order) => order.customerId === customer.id);
                return (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-slate-800">{customer.name}</p>
                      <p className="text-[9.5px] text-slate-400">{customer.companyName ?? "—"}{customer.gstin ? ` · ${customer.gstin}` : ""}</p>
                      {customerOrders.length > 0 ? (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-[9.5px] font-semibold text-brand-700">Order history ({customerOrders.length})</summary>
                          <ul className="mt-1 space-y-0.5">
                            {customerOrders.slice(0, 5).map((order) => (
                              <li key={order.id} className="text-[9.5px] text-slate-500">
                                {order.orderNumber} · {formatDate(order.createdAt)} · {inr(order.finalTotal)} · {order.status}
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : null}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{customer.mobile}<span className="block text-[9.5px] text-slate-400">{customer.email ?? "—"}</span></td>
                    <td className="px-4 py-2.5 text-slate-500">{customer.customerType}</td>
                    <td className="px-4 py-2.5 text-slate-500">{customer.city ?? "—"}<span className="block text-[9.5px] text-slate-400">{customer.state} {customer.pincode}</span></td>
                    <td className="px-4 py-2.5 font-semibold text-slate-700">{customer.totalOrders}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">{inr(customer.totalValue)}</td>
                    <td className="px-4 py-2.5 text-slate-600">{inr(customer.outstandingAmount)}</td>
                    <td className="px-4 py-2.5 text-slate-500">{customer.lastOrderAt ? formatDate(customer.lastOrderAt) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
