import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "How to Order — Guest Checkout, GST & Freight Explained",
  description:
    "Step-by-step guide to ordering from RS Medicare Pharma: browse the catalogue, add to cart, complete guest checkout, review GST and freight, then track your order — no account required.",
  alternates: { canonical: "/how-to-order" },
};

const steps = [
  { title: "Find the product", body: "Use the catalogue search by product name, SKU, brand or specification — for example “nitrile”, “3 gram” or “glov-x”. Category filters help narrow by range and application.", href: "/products" },
  { title: "Check the specification", body: "Each product page shows pack size, unit, MOQ, stock status, base price, tax rate and declared specifications. Confirm critical parameters with our team if required." },
  { title: "Add to cart", body: "Set the quantity (minimum order quantity applies) and add the product. Use Buy Now to move straight to checkout." },
  { title: "Complete guest checkout", body: "Enter customer, business (GSTIN optional) and delivery details. No account or login is required at any stage.", href: "/checkout" },
  { title: "Review GST and freight", body: "Applicable GST is calculated automatically. Freight is shown as under review for manual freight mode, or calculated automatically where enabled by our team." },
  { title: "Confirm and track", body: "Submit the order to receive an Order ID such as RSM-2026-000001. Track status with your Order ID and registered mobile or email.", href: "/track" },
];

const payments = [
  "Bank transfer / NEFT — details shared against your Order ID",
  "UPI — enabled subject to operations policy",
  "Manual payment verification — for accounts with agreed terms",
  "Payment gateway / cards — enabled when configured by the admin team",
  "Cash on delivery — only when explicitly enabled by the admin team",
];

export default function HowToOrderPage() {
  return (
    <>
      <PageHero
        eyebrow="Ordering guide"
        title="How to order pharmaceutical & medical products from us"
        description="A simple, transparent ordering process designed for trade and institutional buyers — with guest checkout, itemised GST and freight reviewed per delivery location."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "How to Order" }]}
      >
        <Link href="/products" className="btn btn-brand">Start an Order</Link>
        <Link href="/bulk-orders" className="btn btn-outline-light">Ordering in Bulk?</Link>
      </PageHero>

      <section className="shell py-12 sm:py-16">
        <SectionHeading eyebrow="Six steps" title="From catalogue to confirmed supply" />
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-900 font-display text-[12px] font-bold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3.5 text-[13.5px] font-bold text-navy-900">{step.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-navy-500">{step.body}</p>
              {step.href ? <Link href={step.href} className="mt-3 inline-flex text-[11.5px] font-semibold text-brand-700 hover:underline">Open →</Link> : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-navy-100 bg-navy-50/60 py-12 sm:py-16">
        <div className="shell grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-navy-900">Pricing you can reconcile</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-navy-500">
              Product base price is centralised and identical across markets. GST is applied at the product tax rate,
              and freight remains independent of the product price.
            </p>
            <div className="mt-4 rounded-xl bg-navy-900 p-4 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-300">Final payable</p>
              <p className="mt-1.5 font-display text-[15px] font-bold">Product value + GST + Confirmed freight</p>
            </div>
            <ul className="prose-premium mt-4">
              <li>No location-specific pricing embedded in the catalogue.</li>
              <li>Freight confirmed from delivery pincode, volume, weight and mode.</li>
              <li>Invoices itemise product value, tax and freight separately.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-navy-900">Payment options</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-navy-500">
              Enabled methods are shown at checkout. Our admin team can enable or disable each method as operations require.
            </p>
            <ul className="mt-4 space-y-2">
              {payments.map((payment) => (
                <li key={payment} className="flex gap-2 rounded-lg bg-navy-50/60 px-3 py-2 text-[11.5px] text-navy-600">
                  <span className="text-brand-600">✓</span>{payment}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10.5px] leading-relaxed text-navy-400">
              Card details are never collected or stored on this website. Payment gateway integration will be enabled
              through a compliant provider when configured.
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        <div className="rounded-2xl bg-navy-900 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Prefer to speak to procurement first?</h2>
              <p className="mt-1.5 max-w-xl text-[12.5px] text-white/70">Share your requirement list and delivery location. We will respond with availability and commercials.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/bulk-orders" className="btn btn-brand">Request a Quote</Link>
              <Link href="/faq" className="btn btn-outline-light">Read FAQs</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
