"use client";

import { useState } from "react";
import { CUSTOMER_TYPES } from "@/lib/site";

type Props = {
  type: string;
  cta?: string;
  defaultProduct?: string;
  defaultSku?: string;
  showRequirement?: boolean;
  compact?: boolean;
  heading?: string;
  description?: string;
};

export function EnquiryForm({
  type,
  cta = "Submit Enquiry",
  defaultProduct = "",
  defaultSku = "",
  showRequirement = true,
  compact = false,
  heading,
  description,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    mobile: "",
    email: "",
    gstin: "",
    customerType: "Retailer",
    productName: defaultProduct ? `${defaultProduct}${defaultSku ? ` (${defaultSku})` : ""}` : "",
    quantity: "",
    deliveryLocation: "",
    message: "",
  });
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("submitting");
    setMessage(null);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? "Could not submit the enquiry. Please retry.");
        return;
      }
      setState("success");
      setMessage("Enquiry received. Our sales desk will respond on the mobile number provided, usually within one business day.");
      setForm({ ...form, productName: defaultProduct, quantity: "", message: "" });
    } catch {
      setState("error");
      setMessage("Network error. Please retry or contact us on WhatsApp.");
    }
  };

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-7 text-center">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-white">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <h3 className="mt-3 text-lg font-bold text-navy-900">Enquiry submitted</h3>
        <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-navy-600">{message}</p>
        <button type="button" onClick={() => setState("idle")} className="btn btn-ghost mt-4 !py-2 !text-[12px]">Submit another enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`rounded-2xl border border-navy-100 bg-white shadow-card ${compact ? "p-5" : "p-5 sm:p-6"}`}>
      {heading ? <h2 className="text-[16px] font-bold text-navy-900">{heading}</h2> : null}
      {description ? <p className="mt-1 text-[12px] leading-relaxed text-navy-500">{description}</p> : null}
      <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="eq-name">Full name *</label>
          <input id="eq-name" required value={form.name} onChange={update("name")} className="field" placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="eq-company">Company / institution</label>
          <input id="eq-company" value={form.company} onChange={update("company")} className="field" placeholder="Business name" />
        </div>
        <div>
          <label className="label" htmlFor="eq-mobile">Mobile number *</label>
          <input id="eq-mobile" required inputMode="numeric" value={form.mobile} onChange={update("mobile")} className="field" placeholder="10-digit mobile" />
        </div>
        <div>
          <label className="label" htmlFor="eq-email">Email</label>
          <input id="eq-email" type="email" value={form.email} onChange={update("email")} className="field" placeholder="name@business.com" />
        </div>
        <div>
          <label className="label" htmlFor="eq-type">Customer type</label>
          <select id="eq-type" value={form.customerType} onChange={update("customerType")} className="field">
            {CUSTOMER_TYPES.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="eq-gstin">GSTIN (optional)</label>
          <input id="eq-gstin" value={form.gstin} onChange={update("gstin")} className="field uppercase" maxLength={15} placeholder="For B2B quotes" />
        </div>
        {showRequirement ? (
          <>
            <div>
              <label className="label" htmlFor="eq-product">Product / product list *</label>
              <input id="eq-product" required value={form.productName} onChange={update("productName")} className="field" placeholder="e.g. Glov-X Nitrile 3 g, 3-ply masks" />
            </div>
            <div>
              <label className="label" htmlFor="eq-qty">Quantity required</label>
              <input id="eq-qty" value={form.quantity} onChange={update("quantity")} className="field" placeholder="e.g. 200 boxes" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="eq-location">Delivery location</label>
              <input id="eq-location" value={form.deliveryLocation} onChange={update("deliveryLocation")} className="field" placeholder="City, state, pincode" />
            </div>
          </>
        ) : null}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="eq-message">Message</label>
          <textarea id="eq-message" rows={3} value={form.message} onChange={update("message")} className="field resize-none" placeholder="Tell us about your requirement, timelines or existing supply arrangements." />
        </div>
      </div>
      {state === "error" && message ? (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[11.5px] font-medium text-rose-700">{message}</p>
      ) : null}
      <button type="submit" disabled={state === "submitting"} className="btn btn-brand mt-4 w-full disabled:opacity-60">
        {state === "submitting" ? "Submitting…" : cta}
      </button>
      <p className="mt-2 text-center text-[10.5px] text-navy-400">
        Your details are used only to respond to this enquiry. No marketing spam.
      </p>
    </form>
  );
}
