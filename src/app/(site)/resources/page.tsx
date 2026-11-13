import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Resources — Procurement Guides for Healthcare Buyers",
  description: "Practical procurement guides for healthcare buyers: comparing examination gloves, planning freight, and building a repeatable B2B ordering process.",
  alternates: { canonical: "/resources" },
};

const articles = [
  {
    title: "How to compare examination gloves before ordering",
    category: "Glov-X guide",
    intro: "Material and weight decide most of the cost conversation. Here is a practical comparison framework for procurement teams.",
    points: [
      "Material: nitrile (synthetic), latex (natural rubber) and vinyl (light use) behave differently in handling and storage conditions.",
      "Weight in grams: a 3 g economic glove reduces cost per use, while 4–5 g specifications add substance and tactile feedback.",
      "Packing: 100 gloves per box is convenient for counters and wards; confirm carton quantity for bulk dispatch.",
      "MOQ: align the minimum order quantity with your monthly consumption so stock does not age on the shelf.",
      "Documentation: ask what product documentation is supplied with the consignment before you standardise on a line.",
    ],
    href: "/glov-x/products",
    cta: "Compare Glov-X specifications",
  },
  {
    title: "Understanding product price, GST and freight as separate lines",
    category: "Pricing guide",
    intro: "A clear price architecture reduces reconciliation effort for finance teams. This is how our invoices are structured.",
    points: [
      "Base price: one centralised catalogue price per unit, identical across territories.",
      "GST: applied per product tax rate at checkout, itemised on the order and invoice.",
      "Freight: charged separately and based on delivery location, volume, weight and shipment mode.",
      "Freight confirmation: manual review by default; automated freight can be enabled for account customers.",
      "Final payable: product value plus GST plus confirmed freight, less any approved discount.",
    ],
    href: "/shipping-policy",
    cta: "Read the freight policy",
  },
  {
    title: "Building a repeatable ordering process for clinics",
    category: "Operations guide",
    intro: "Small facilities usually order frequently and in smaller quantities. A simple process keeps stock predictable.",
    points: [
      "Maintain a core list of consumables with pack size and monthly usage against each line.",
      "Set a reorder trigger based on consumption rather than shelf quantity alone.",
      "Use order tracking checkpoints to plan receipt and avoid stock-outs before dispatch.",
      "Use the reorder action on a previous order, then adjust quantities before checkout.",
      "Review freight efficiency periodically by consolidating lines into fewer shipments.",
    ],
    href: "/how-to-order",
    cta: "Read the ordering guide",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Procurement notes for healthcare buyers"
        description="Short, practical guides on specification comparison, pricing structure and ordering discipline. Written for trade buyers, not consumers."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
      >
        <Link href="/catalogue" className="btn btn-brand">Product Catalogue</Link>
        <Link href="/bulk-orders" className="btn btn-outline-light">Bulk Orders</Link>
      </PageHero>
      <section className="shell py-12 sm:py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.title} className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <span className="chip w-fit bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200">{article.category}</span>
              <h2 className="mt-3 text-[15px] font-bold leading-snug text-navy-900">{article.title}</h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-navy-500">{article.intro}</p>
              <ul className="mt-3 flex-1 space-y-1.5 text-[11.5px] leading-relaxed text-navy-500">
                {article.points.map((point) => (
                  <li key={point} className="flex gap-2"><span className="text-brand-600">•</span>{point}</li>
                ))}
              </ul>
              <Link href={article.href} className="mt-4 text-[11.5px] font-semibold text-brand-700 hover:underline">{article.cta} →</Link>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-navy-100 bg-navy-50/60 p-5 text-[11.5px] leading-relaxed text-navy-600">
          <p className="font-semibold text-navy-800">Editorial note</p>
          <p className="mt-1">
            These notes describe general procurement practice and our own operating process. They are not medical,
            legal or regulatory advice. Buyers should validate specifications, storage requirements and applicable
            compliance obligations for their own facility before purchasing.
          </p>
        </div>
      </section>
    </>
  );
}
