import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/ui";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact RS Medicare Pharma — Sales, Supply & Support",
  description:
    "Contact RS Medicare Pharma for product enquiries, bulk quotes, institutional supply and order support. Phone, email, WhatsApp and office address with business hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const cards = [
    { label: "Sales & product enquiries", value: site.email, href: `mailto:${site.email}`, hint: "Availability, pricing and product specification queries" },
    { label: "Order support", value: site.supportEmail, href: `mailto:${site.supportEmail}`, hint: "Order status, freight updates and dispatch queries" },
    { label: "Phone", value: site.phone, href: `tel:${site.phoneHref}`, hint: site.hours },
    { label: "WhatsApp", value: "Chat with our team", href: whatsappLink("Hello RS Medicare Pharma, I have an enquiry."), hint: "Share product names, SKU and quantity for a faster reply" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to our sales and supply desk"
        description="Whether you need a single product confirmation or an institutional quote, reach us on the channel that suits you. Business buyers get a response from a person, not an autoresponder."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {cards.map((card) => (
                <a key={card.label} href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined} className="rounded-2xl border border-navy-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-navy-400">{card.label}</p>
                  <p className="mt-1.5 text-[12.5px] font-semibold text-navy-900">{card.value}</p>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-navy-400">{card.hint}</p>
                </a>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <h2 className="text-[14px] font-bold text-navy-900">Distribution office</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-navy-600">
                {site.name}<br />
                {site.address.line1}<br />
                {site.address.city}, {site.address.state} {site.address.pincode}<br />
                {site.address.country}
              </p>
              <p className="mt-3 text-[11.5px] text-navy-500"><span className="font-semibold text-navy-700">Business hours:</span> {site.hours}</p>
              <div className="mt-3 overflow-hidden rounded-xl border border-navy-100">
                <iframe
                  title="RS Medicare Pharma office location"
                  src="https://www.google.com/maps?q=Sector%2018%20Gurugram%20Haryana&output=embed"
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-2 text-[10px] text-navy-400">Map shows the general area for reference. Please call before visiting.</p>
            </div>

            <div className="mt-5 rounded-2xl border border-navy-100 bg-navy-50/60 p-4">
              <p className="text-[11.5px] font-semibold text-navy-800">Looking for a specific answer?</p>
              <div className="mt-2 flex flex-wrap gap-3 text-[11.5px] font-semibold text-brand-700">
                <Link href="/faq" className="hover:underline">Read FAQs</Link>
                <Link href="/track" className="hover:underline">Track an order</Link>
                <Link href="/shipping-policy" className="hover:underline">Freight policy</Link>
                <Link href="/returns-policy" className="hover:underline">Returns policy</Link>
              </div>
            </div>
          </div>

          <EnquiryForm
            type="contact"
            cta="Send Message"
            showRequirement={false}
            heading="Send us a message"
            description="Product questions, supply requirements and order support requests all reach the same team."
          />
        </div>
      </section>
    </>
  );
}
