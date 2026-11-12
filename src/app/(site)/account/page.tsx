import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Account & Repeat Orders",
  description: "Guest ordering stays available at RS Medicare Pharma. Optional customer accounts are intended for saved addresses, order history and faster repeat orders.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <>
      <PageHero
        eyebrow="Customer account"
        title="Guest ordering first. Optional accounts next."
        description="You never need an account to browse or order. Accounts are being prepared for customers who want saved addresses, order history and faster repeat procurement."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />
      <section className="shell py-12 sm:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { title: "Order as a guest", body: "Full catalogue access with guest checkout — the fastest route for a one-time requirement.", cta: "Go to catalogue", href: "/products" },
            { title: "Track an existing order", body: "Use your Order ID with the mobile number or email used at checkout. No login needed.", cta: "Track order", href: "/track" },
            { title: "Reorder in one step", body: "Open a tracked order and use the reorder action to rebuild your cart from that consignment.", cta: "Find my order", href: "/track" },
          ].map((card) => (
            <div key={card.title} className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <h2 className="text-[14px] font-bold text-navy-900">{card.title}</h2>
              <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-navy-500">{card.body}</p>
              <Link href={card.href} className="btn btn-ghost mt-4 !py-2 !text-[12px]">{card.cta}</Link>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-navy-100 bg-navy-50/60 p-5">
          <h2 className="text-[13.5px] font-bold text-navy-900">Planned account features</h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-navy-500">
            Saved delivery addresses, business profile with GSTIN, order history, saved product lists and a reorder
            view. Guest ordering will remain available alongside accounts.
          </p>
          <Link href="/contact" className="mt-3 inline-flex text-[11.5px] font-semibold text-brand-700 hover:underline">Ask about account access →</Link>
        </div>
      </section>
    </>
  );
}
