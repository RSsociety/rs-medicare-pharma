import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Retailer / Dealer Enquiry — Partner With RS Medicare Pharma",
  description:
    "Retailers, chemists and medical stores can enquire about a supply relationship with RS Medicare Pharma: product range, trade pricing, regular supply and order support.",
  alternates: { canonical: "/dealer-enquiry" },
};

const benefits = [
  { title: "Product availability", body: "Pharmaceutical lines and medical consumables from one supply desk, with stock confirmed before dispatch." },
  { title: "Trade pricing", body: "Centralised base prices with applicable GST shown separately — straightforward to reconcile at your counter." },
  { title: "Repeat-order support", body: "Reuse a previous order to rebuild your cart, and share regular requirement lists with our team." },
  { title: "Clear documentation", body: "Order IDs, itemised GST and freight on the invoice, plus status updates you can track without logging in." },
];

export default function DealerEnquiryPage() {
  return (
    <>
      <PageHero
        eyebrow="Retailer / dealer"
        title="Partner with RS Medicare Pharma"
        description="A supply relationship built around availability, clear pricing and responsive support for retail medical stores, chemists and healthcare retailers."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Retailer / Dealer Enquiry" }]}
      />
      <section className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <h2 className="text-xl font-bold text-navy-900">What a supply relationship includes</h2>
            <div className="mt-5 space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="rounded-xl border border-navy-100 bg-white p-4 shadow-card">
                  <h3 className="text-[12.5px] font-bold text-navy-900">{benefit.title}</h3>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-navy-500">{benefit.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-navy-100 bg-navy-50/60 p-4 text-[11.5px] leading-relaxed text-navy-600">
              <p className="font-semibold text-navy-800">No commitment required</p>
              <p className="mt-1">This is an enquiry, not a contract. Share your requirement and our team will explain the current range, ordering process and commercial terms.</p>
            </div>
          </div>
          <EnquiryForm
            type="dealer"
            cta="Become a Dealer / Retail Partner"
            heading="Retailer / dealer enquiry"
            description="Tell us about your store and the product lines you would like to discuss."
          />
        </div>
      </section>
    </>
  );
}
