import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Distributor Network — Territory Supply Conversations",
  description: "Distributors and wholesalers can discuss territory supply, product range and volume requirements with RS Medicare Pharma.",
  alternates: { canonical: "/distributor-network" },
};

export default function DistributorNetworkPage() {
  return (
    <>
      <PageHero
        eyebrow="Distributor network"
        title="Distribution partnerships, discussed honestly"
        description="We are building supply relationships with distributors and wholesalers. Rather than publishing a coverage map we cannot verify, we invite a direct conversation about territory and volume."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Distributor Network" }]}
      />
      <section className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <h2 className="text-xl font-bold text-navy-900">What we look for in a distribution partner</h2>
            <ul className="prose-premium mt-3">
              <li>Registered trade entity with GSTIN and an established customer base.</li>
              <li>Warehouse capability suited to pharmaceutical and consumable storage requirements.</li>
              <li>Consistent monthly volume planning rather than one-off opportunistic buying.</li>
              <li>Willingness to follow labelling, storage and documentation protocols.</li>
            </ul>
            <div className="mt-6 space-y-3">
              {[
                { title: "Territory", body: "Share the districts or cities you actively supply and your typical order frequency." },
                { title: "Product mix", body: "Tell us which lines you move — pharmaceuticals, consumables, or both." },
                { title: "Logistics", body: "Explain your inbound transport preference so freight can be quoted realistically." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-navy-100 bg-white p-4 shadow-card">
                  <h3 className="text-[12.5px] font-bold text-navy-900">{item.title}</h3>
                  <p className="mt-1 text-[11.5px] text-navy-500">{item.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11.5px] text-navy-500">
              Prefer ordering directly instead? The <Link href="/products" className="font-semibold text-brand-700 hover:underline">product catalogue</Link> is open to all business buyers.
            </p>
          </div>
          <EnquiryForm type="distributor" cta="Submit Distribution Enquiry" heading="Distribution enquiry" description="Tell us about your territory, customer base and monthly requirement." />
        </div>
      </section>
    </>
  );
}
