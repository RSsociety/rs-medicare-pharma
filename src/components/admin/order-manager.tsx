"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inr, round2 } from "@/lib/pricing";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/site";

type Props = {
  order: {
    id: number;
    status: string;
    paymentStatus: string;
    freight: number | null;
    discount: number;
    subtotal: number;
    taxTotal: number;
    trackingNumber: string | null;
    transporter: string | null;
    internalNotes: string | null;
  };
};

export function OrderManager({ order }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    status: order.status,
    paymentStatus: order.paymentStatus,
    discount: String(order.discount ?? 0),
    trackingNumber: order.trackingNumber ?? "",
    transporter: order.transporter ?? "",
    internalNotes: order.internalNotes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = async (overrides: Record<string, unknown> = {}) => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...overrides }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Could not update the order.");
      } else {
        setMessage("Order updated. Customer tracking reflects the change immediately.");
        router.refresh();
      }
    } catch {
      setError("Network error. Please retry.");
    }
    setSaving(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-[13px] font-bold text-slate-900">Operations controls</h2>
      <p className="mt-0.5 text-[10.5px] text-slate-400">Freight and payment confirmation update the customer's final payable amount.</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="o-status">Order status</label>
          <select id="o-status" className="field" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="o-payment">Payment status</label>
          <select id="o-payment" className="field" value={form.paymentStatus} onChange={(event) => setForm({ ...form, paymentStatus: event.target.value })}>
            {PAYMENT_STATUSES.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="o-discount">Discount (₹)</label>
          <input id="o-discount" type="number" min="0" step="0.01" className="field" value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="o-tracking">Tracking number</label>
          <input id="o-tracking" className="field" value={form.trackingNumber} onChange={(event) => setForm({ ...form, trackingNumber: event.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="o-transporter">Transporter</label>
          <input id="o-transporter" className="field" value={form.transporter} onChange={(event) => setForm({ ...form, transporter: event.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="o-notes">Internal notes (not shown to customer)</label>
          <textarea id="o-notes" rows={2} className="field resize-none" value={form.internalNotes} onChange={(event) => setForm({ ...form, internalNotes: event.target.value })} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
        <p className="text-[11px] text-slate-500">
          Final payable
          <span className="block text-[9.5px] text-slate-400">
            Freight is confirmed in the freight worksheet, not here.
          </span>
        </p>
        <p className="font-display text-[14px] font-bold text-slate-900">
          {inr(round2(order.subtotal + order.taxTotal + (order.freight ?? 0) - (Number(form.discount) || 0)))}
        </p>
      </div>

      {message ? <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-medium text-rose-700">{error}</p> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" disabled={saving} onClick={() => save()} className="btn btn-primary !py-2 !text-[11.5px] disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button type="button" disabled={saving} onClick={() => save({ status: "Payment Confirmed", paymentStatus: "paid" })} className="btn btn-ghost !py-2 !text-[11.5px]">
          Mark payment confirmed
        </button>
        <button type="button" disabled={saving} onClick={() => save({ status: "Dispatched" })} className="btn btn-ghost !py-2 !text-[11.5px]">
          Mark dispatched
        </button>
      </div>
    </div>
  );
}
