import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Business Enquiry",
  description: "General business and corporate healthcare enquiries for RS Medicare Pharma — supply partnerships, product sourcing and procurement requirements.",
  alternates: { canonical: "/business-enquiry" },
};

export default function BusinessEnquiryPage() {
  return (
    <>
      <PageHero
        eyebrow="Business enquiry"
        title="A single route for business requirements"
        description="Corporate healthcare buyers, procurement teams and new trade accounts can use this form for requirements that do not fit a standard product order."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Business Enquiry" }]}
      />
      <section className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <h2 className="text-xl font-bold text-navy-900">What to include</h2>
            <div className="mt-4 space-y-2.5">
              {[
                "Product or category you are sourcing",
                "Estimated monthly or quarterly quantity",
                "Delivery city and state (for freight planning)",
                "Any specification or packaging requirement",
                "GSTIN if you need a formal quotation",
              ].map((item) => (
                <p key={item} className="flex gap-2 rounded-lg border border-navy-100 bg-white px-3 py-2 text-[11.5px] text-navy-600 shadow-card">
                  <span className="text-brand-600">✓</span>{item}
                </p>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-navy-100 bg-navy-50/60 p-4 text-[11.5px] leading-relaxed text-navy-600">
              <p className="font-semibold text-navy-800">Response expectations</p>
              <p className="mt-1">Enquiries are reviewed on business days. If your requirement is urgent, message us on WhatsApp with the enquiry reference.</p>
            </div>
          </div>
          <EnquiryForm type="business" cta="Submit Business Enquiry" heading="Business enquiry form" />
        </div>
      </section>
    </>
  );
}
