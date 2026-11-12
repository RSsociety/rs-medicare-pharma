"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { inr, round2 } from "@/lib/pricing";
import { CUSTOMER_TYPES, INDIAN_STATES } from "@/lib/site";

type PaymentOption = { value: string; label: string };

export function CheckoutForm({
  paymentOptions,
  taxEnabled,
}: {
  paymentOptions: PaymentOption[];
  taxEnabled: boolean;
}) {
  const cart = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]?.value ?? "bank_transfer");
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    companyName: "",
    mobile: "",
    email: "",
    gstin: "",
    customerType: "Retailer",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    customerNotes: "",
  });

  const subtotal = cart.subtotal;
  const taxTotal = taxEnabled ? cart.taxTotal : 0;
  // Option A — freight is never estimated at checkout. It is reviewed by our dispatch team.
  const total = round2(subtotal + taxTotal);

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!consent) {
      setError("Please confirm the order declaration before placing the order.");
      return;
    }
    if (cart.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod,
          items: cart.items.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string; orderNumber?: string };
      if (!response.ok || !data.ok || !data.orderNumber) {
        setError(data.error ?? "We could not place the order. Please retry.");
        setSubmitting(false);
        return;
      }
      cart.clear();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch {
      setError("Network error. Please check your connection and retry.");
      setSubmitting(false);
    }
  };

  if (cart.ready && cart.items.length === 0) {
    return (
      <div className="card p-10 text-center">
        <h2 className="text-lg font-bold text-navy-900">There is nothing to check out</h2>
        <p className="mt-2 text-[13px] text-navy-500">Add products to your cart before completing checkout.</p>
        <Link href="/products" className="btn btn-primary mt-5">Browse Products</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_23rem] lg:items-start">
      <div className="space-y-5">
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-navy-900">1 · Customer information</h2>
            <span className="chip bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200">Guest checkout</span>
          </div>
          <p className="mt-1 text-[11.5px] text-navy-400">No account required. Fields marked * are required.</p>
          <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="customerName">Full name *</label>
              <input id="customerName" required value={form.customerName} onChange={update("customerName")} className="field" placeholder="Your full name" />
            </div>
            <div>
              <label className="label" htmlFor="companyName">Company / business name</label>
              <input id="companyName" value={form.companyName} onChange={update("companyName")} className="field" placeholder="Clinic, medical store, hospital…" />
            </div>
            <div>
              <label className="label" htmlFor="mobile">Mobile number *</label>
              <input id="mobile" required inputMode="numeric" value={form.mobile} onChange={update("mobile")} className="field" placeholder="10-digit mobile number" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email} onChange={update("email")} className="field" placeholder="name@business.com" />
            </div>
            <div>
              <label className="label" htmlFor="gstin">GSTIN (optional)</label>
              <input id="gstin" value={form.gstin} onChange={update("gstin")} className="field uppercase" placeholder="For B2B invoicing" maxLength={15} />
            </div>
            <div>
              <label className="label" htmlFor="customerType">Customer type *</label>
              <select id="customerType" value={form.customerType} onChange={update("customerType")} className="field">
                {CUSTOMER_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <h2 className="text-[15px] font-bold text-navy-900">2 · Delivery address</h2>
          <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="address">Address *</label>
              <textarea id="address" required value={form.address} onChange={update("address")} rows={2} className="field resize-none" placeholder="Building, street, area, landmark" />
            </div>
            <div>
              <label className="label" htmlFor="city">City *</label>
              <input id="city" required value={form.city} onChange={update("city")} className="field" placeholder="City / town" />
            </div>
            <div>
              <label className="label" htmlFor="state">State *</label>
              <select id="state" required value={form.state} onChange={update("state")} className="field">
                <option value="">Select state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="pincode">Pincode *</label>
              <input id="pincode" required inputMode="numeric" maxLength={6} value={form.pincode} onChange={update("pincode")} className="field" placeholder="6-digit pincode" />
            </div>
            <div>
              <label className="label" htmlFor="country">Country *</label>
              <input id="country" required value={form.country} onChange={update("country")} className="field" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="customerNotes">Order notes (optional)</label>
              <textarea id="customerNotes" value={form.customerNotes} onChange={update("customerNotes")} rows={2} className="field resize-none" placeholder="Delivery instructions, preferred dispatch timing, PO reference…" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <h2 className="text-[15px] font-bold text-navy-900">3 · Payment preference</h2>
          <p className="mt-1 text-[11.5px] text-navy-400">
            Available methods are controlled by our operations team. No card details are collected or stored on this website.
          </p>
          <div className="mt-4 grid gap-2">
            {paymentOptions.map((option) => (
              <label key={option.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-[12.5px] transition ${paymentMethod === option.value ? "border-brand-400 bg-brand-50/50" : "border-navy-100 hover:border-navy-200"}`}>
                <input type="radio" name="paymentMethod" value={option.value} checked={paymentMethod === option.value} onChange={() => setPaymentMethod(option.value)} className="accent-brand-600" />
                <span className="font-semibold text-navy-800">{option.label}</span>
              </label>
            ))}
          </div>
          <label className="mt-4 flex items-start gap-2.5 rounded-xl bg-navy-50/70 p-3 text-[11.5px] leading-relaxed text-navy-600">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 accent-brand-600" />
            <span>
              I confirm these products are being purchased for business or institutional use and that the
              delivery details provided are correct. I understand freight will be confirmed separately after review.
            </span>
          </label>
        </section>
      </div>

      <div className="lg:sticky lg:top-28">
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <h2 className="text-[15px] font-bold text-navy-900">Order summary</h2>
          <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
            {cart.items.map((line) => (
              <li key={line.productId} className="flex justify-between gap-2 text-[11.5px]">
                <span className="min-w-0 text-navy-500">
                  <span className="line-clamp-2 font-medium text-navy-800">{line.name}</span>
                  <span className="text-navy-400">{line.quantity} × {inr(line.basePrice)}</span>
                </span>
                <span className="shrink-0 font-semibold text-navy-800">{inr(round2(line.basePrice * line.quantity))}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-2 border-t border-navy-100 pt-3 text-[12.5px]">
            <div className="flex justify-between text-navy-500"><dt>Product value</dt><dd className="font-semibold text-navy-800">{inr(subtotal)}</dd></div>
            <div className="flex justify-between text-navy-500"><dt>Applicable GST</dt><dd className="font-semibold text-navy-800">{inr(taxTotal)}</dd></div>
            <div className="flex justify-between text-navy-500">
              <dt>Freight</dt>
              <dd className="text-right font-semibold text-brand-700">
                Under review
                <span className="block text-[9.5px] font-medium text-navy-400">based on pincode, weight &amp; mode</span>
              </dd>
            </div>
            <div className="flex justify-between border-t border-navy-100 pt-2.5 text-navy-900">
              <dt className="font-semibold">Total before freight</dt>
              <dd className="font-display text-base font-bold">{inr(total)}</dd>
            </div>
          </dl>
          {error ? <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[11.5px] font-medium text-rose-700">{error}</p> : null}
          <button type="submit" disabled={submitting} className="btn btn-brand mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Placing order…" : "Place Order"}
          </button>
          <p className="mt-2 text-center text-[10.5px] leading-relaxed text-navy-400">
            You will receive an Order ID immediately. Our team then reviews freight and payments.
          </p>
          <Link href="/cart" className="mt-3 block text-center text-[11px] font-semibold text-navy-500 hover:text-navy-800">← Back to cart</Link>
        </div>
      </div>
    </form>
  );
}
