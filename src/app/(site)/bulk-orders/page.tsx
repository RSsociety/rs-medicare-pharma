import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/ui";
import { whatsappLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bulk & Institutional Orders — Request a Quote",
  description:
    "Request a bulk or institutional quote from RS Medicare Pharma for hospitals, clinics, diagnostic centres, medical stores, retailers, distributors and corporate healthcare buyers.",
  alternates: { canonical: "/bulk-orders" },
};

const process = [
  { title: "Share requirement", body: "Product list, specification, quantity and delivery location. GSTIN optional but recommended for B2B quotes." },
  { title: "Sales review", body: "We verify stock position, packing configuration and dispatch feasibility for the quantity requested." },
  { title: "Written quote", body: "You receive product value, applicable GST and freight as separate line items with validity." },
  { title: "Order & supply", body: "On confirmation, the order is processed, packed and dispatched with tracking details." },
];

export default async function BulkOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; sku?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="B2B / bulk orders"
        title="Bulk & institutional orders, quoted properly"
        description="For hospitals, clinics, diagnostic centres, medical stores, distributors, wholesalers and corporate healthcare buyers. Send your requirement — we respond with availability, commercials and freight."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Bulk & Institutional Orders" }]}
      >
        <a href={whatsappLink("Hello RS Medicare Pharma, I would like to discuss a bulk order requirement.")} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">WhatsApp Our Sales Desk</a>
      </PageHero>

      <section className="shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <h2 className="text-xl font-bold text-navy-900">Institutional procurement, without website friction</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-navy-500">
              Bulk requirements usually involve specification choices, size mixes and freight planning.
              This desk captures all of that in one enquiry so our team can respond with a usable quote
              instead of a generic catalogue link.
            </p>
            <div className="mt-6 space-y-3">
              {process.map((step, index) => (
                <div key={step.title} className="flex gap-3.5 rounded-xl border border-navy-100 bg-white p-4 shadow-card">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-50 font-display text-[11.5px] font-bold text-navy-700">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[12.5px] font-bold text-navy-900">{step.title}</h3>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-navy-500">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-navy-100 bg-navy-50/60 p-5">
              <h3 className="text-[13px] font-bold text-navy-900">Who this desk is for</h3>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {["Hospitals", "Clinics", "Diagnostic centres", "Medical stores", "Retailers", "Distributors", "Wholesalers", "Corporate healthcare"].map((item) => (
                  <span key={item} className="chip bg-white text-navy-600 ring-1 ring-inset ring-navy-100">{item}</span>
                ))}
              </div>
              <p className="mt-3 text-[11.5px] leading-relaxed text-navy-500">
                Only have a small order? You can place it directly through{" "}
                <Link href="/products" className="font-semibold text-brand-700 hover:underline">the catalogue</Link> with guest checkout.
              </p>
            </div>
          </div>

          <EnquiryForm
            type="bulk"
            cta="Request Bulk Quote"
            defaultProduct={params.product ?? ""}
            defaultSku={params.sku ?? ""}
            heading="Bulk / institutional requirement"
            description="Fields marked * are required. Our team responds on the mobile number provided."
          />
        </div>
      </section>
    </>
  );
}
