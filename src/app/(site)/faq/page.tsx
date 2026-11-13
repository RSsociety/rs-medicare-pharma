import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { getFaqs } from "@/lib/queries";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Ordering, Pricing & Freight",
  description: "Answers on guest ordering, GST, freight review, MOQ, payments, order tracking, bulk quotes and product specifications at RS Medicare Pharma.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  const groups = [...new Set(faqs.map((faq) => faq.category))];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHero
        eyebrow="Support"
        title="Frequently asked questions"
        description="Operational answers for trade and institutional buyers. If your question is not covered, our sales desk will respond directly."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      >
        <Link href="/contact" className="btn btn-brand">Ask Our Team</Link>
        <Link href="/track" className="btn btn-outline-light">Track an Order</Link>
      </PageHero>
      <section className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.02fr]">
          <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-[14px] font-bold text-navy-900">Still need help?</h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-navy-500">Our team handles product availability, freight questions and institutional quoting on business days.</p>
            <div className="mt-4 space-y-2 text-[12px] text-navy-600">
              <p><span className="font-semibold text-navy-800">Phone:</span> {site.phone}</p>
              <p><span className="font-semibold text-navy-800">Email:</span> {site.email}</p>
              <p><span className="font-semibold text-navy-800">Hours:</span> {site.hours}</p>
            </div>
            <Link href="/contact" className="btn btn-primary mt-4 w-full !py-2 !text-[12px]">Contact Us</Link>
            <Link href="/how-to-order" className="btn btn-ghost mt-2 w-full !py-2 !text-[12px]">Ordering Guide</Link>
            <div className="mt-4 border-t border-navy-100 pt-3 text-[11px] leading-relaxed text-navy-400">
              Product information on this website is for trade buyers and is not medical advice. Confirm
              specifications that are critical to your protocol before ordering.
            </div>
          </div>
          <div className="space-y-7">
            {groups.map((group) => (
              <div key={group}>
                <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-brand-700">{group}</h2>
                <div className="mt-2.5 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white shadow-card">
                  {faqs.filter((faq) => faq.category === group).map((faq) => (
                    <details key={faq.id} className="group px-5 py-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-semibold text-navy-900">
                        {faq.question}
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-navy-200 text-navy-500 transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-navy-500">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
