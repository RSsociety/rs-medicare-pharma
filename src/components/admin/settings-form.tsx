"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SettingsForm({ initial }: { initial: Record<string, unknown> }) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string | boolean>>(() => {
    const next: Record<string, string | boolean> = {};
    Object.entries(initial).forEach(([key, value]) => {
      next[key] = typeof value === "boolean" ? value : String(value ?? "");
    });
    return next;
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const text = (key: string) => String(form[key] ?? "");
  const checked = (key: string) => Boolean(form[key]);

  const set = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json()) as { ok: boolean; error?: string };
    setSaving(false);
    setMessage(data.ok ? "Settings saved. Storefront reflects changes on refresh." : data.error ?? "Could not save settings.");
    router.refresh();
  };

  const field = (key: string, label: string, type = "text") => (
    <div key={key}>
      <label className="label" htmlFor={`s-${key}`}>{label}</label>
      <input id={`s-${key}`} type={type} className="field" value={text(key)} onChange={(event) => set(key, event.target.value)} />
    </div>
  );

  const toggle = (key: string, label: string, hint?: string) => (
    <label key={key} className="flex items-start gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5">
      <input type="checkbox" checked={checked(key)} onChange={(event) => set(key, event.target.checked)} className="mt-0.5 accent-brand-600" />
      <span>
        <span className="block text-[11.5px] font-semibold text-slate-700">{label}</span>
        {hint ? <span className="block text-[10px] text-slate-400">{hint}</span> : null}
      </span>
    </label>
  );

  return (
    <form onSubmit={save} className="space-y-4">
      {message ? <p className="rounded-lg bg-brand-50 px-3 py-2 text-[11.5px] font-medium text-brand-800">{message}</p> : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-[12.5px] font-bold text-slate-900">Company & contact</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {field("storeName", "Store name")}
          {field("companyPhone", "Phone")}
          {field("whatsappNumber", "WhatsApp number (with country code)")}
          {field("salesEmail", "Sales email", "email")}
          {field("supportEmail", "Support email", "email")}
          {field("businessHours", "Business hours")}
          <div className="sm:col-span-2">{field("officeAddress", "Office address")}</div>
          <div className="sm:col-span-2">{field("announcement", "Header announcement")}</div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-[12.5px] font-bold text-slate-900">Tax & freight architecture</h2>
        <p className="mt-0.5 text-[10.5px] text-slate-400">Product base prices are never modified by freight. Configure the applicable calculation here.</p>
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] font-semibold text-slate-700">Freight mode: manual review only</p>
          <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
            Freight is calculated per order on the order&apos;s freight worksheet from delivery location, billable
            weight, shipment mode and transporter charges. Automated and flat-rate freight have been removed so
            freight can never be baked into a product price. Set the status to &ldquo;Freight Under Review&rdquo; while
            calculating and &ldquo;Freight Calculated&rdquo; once confirmed.
          </p>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {field("defaultTaxRate", "Default tax rate (%)", "number")}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {toggle("taxEnabled", "Enable tax calculation", "When disabled, no GST is applied at checkout.")}
          {toggle("lowStockAlert", "Low stock alerts on dashboard")}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-[12.5px] font-bold text-slate-900">Payment methods</h2>
        <p className="mt-0.5 text-[10.5px] text-slate-400">Only enabled methods appear at checkout. Gateway and COD are off until operations are ready.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {toggle("paymentBankTransfer", "Bank transfer / NEFT")}
          {toggle("paymentUpi", "UPI")}
          {toggle("paymentGateway", "Payment gateway (cards / net banking)", "Requires gateway credentials and compliance review.")}
          {toggle("paymentCod", "Cash on delivery", "Enable only for supported pincodes.")}
          {toggle("paymentManualVerification", "Manual payment verification")}
          {toggle("abandonedCartReminder", "Abandoned cart reminders", "Future-ready; no messages are sent from this build.")}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-[12.5px] font-bold text-slate-900">Risk & communication</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {field("riskOrderValueThreshold", "Flag orders above value (₹)", "number")}
          {field("bulkEnquiryEmail", "Bulk enquiry email", "email")}
        </div>
      </section>

      <div className="sticky bottom-3 flex justify-end rounded-xl border border-slate-200 bg-white/95 p-3 backdrop-blur">
        <button type="submit" disabled={saving} className="btn btn-primary !py-2 !text-[12px] disabled:opacity-60">
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
