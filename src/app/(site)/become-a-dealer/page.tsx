import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Become a Dealer or Retail Partner",
  description: "Retail partners and dealers can apply to work with RS Medicare Pharma for pharmaceutical and medical consumables supply. Enquire about range, commercials and repeat supply.",
  alternates: { canonical: "/become-a-dealer" },
};

export default function BecomeDealerPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner programme"
        title="Become a retail partner or dealer"
        description="A practical, enquiry-first process. No hype, no invented network numbers — just a conversation about range, quantities and reliability."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Become a Dealer" }]}
      >
        <Link href="/dealer-enquiry" className="btn btn-brand">Start Dealer Enquiry</Link>
        <Link href="/products" className="btn btn-outline-light">Review the Catalogue</Link>
      </PageHero>
      <section className="shell py-12 sm:py-16">
        <SectionHeading eyebrow="How the conversation works" title="Three stages, no commitment" />
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            { title: "1 · Requirement", body: "Tell us your counter profile, the categories that move fastest and the areas you serve." },
            { title: "2 · Range & terms", body: "We confirm which lines we can support, pack sizes, MOQ and commercial terms available for your volume." },
            { title: "3 · First order", body: "Place a live order through the platform, or a bulk requirement through the sales desk, and assess supply performance." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <h3 className="text-[13.5px] font-bold text-navy-900">{item.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-navy-500">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-navy-900 px-6 py-7 text-white">
          <h2 className="font-display text-lg font-bold">Ready to discuss a partnership?</h2>
          <p className="mt-1.5 max-w-2xl text-[12.5px] text-white/70">Use the dealer enquiry form. We reply on the mobile number provided, usually within one business day.</p>
          <Link href="/dealer-enquiry" className="btn btn-brand mt-4">Become a Dealer / Retail Partner</Link>
        </div>
      </section>
    </>
  );
}
