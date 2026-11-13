import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero, SectionHeading } from "@/components/ui";
import { getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hospital & Clinic Supply — Institutional Medical Procurement",
  description:
    "Institutional medical supply for hospitals, clinics and diagnostic centres: medical consumables, regular supply schedules, bulk procurement, product enquiries and repeat order support.",
  alternates: { canonical: "/hospital-supply" },
};

export default async function HospitalSupplyPage() {
  const products = await getProducts();
  const consumables = products.filter((product) => product.categoryGroup !== "pharma").slice(0, 8);

  return (
    <>
      <PageHero
        eyebrow="Institutional supply"
        title="Hospital & clinic supply support"
        description="Procurement support for hospitals, nursing homes, clinics and diagnostic centres — from routine consumables to scheduled requirement lists."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Hospital & Clinic Supply" }]}
        image="/images/about-facility.jpg"
      >
        <Link href="/bulk-orders" className="btn btn-brand">Request Institutional Supply</Link>
        <Link href="/catalogue" className="btn btn-outline-light">Download Catalogue</Link>
      </PageHero>

      <section className="shell py-12 sm:py-16">
        <SectionHeading eyebrow="What we support" title="Built for institutional purchasing realities" />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Medical consumables", body: "Examination gloves, masks, wound care, injection & infusion, diagnostics and hygiene consumables." },
            { title: "Bulk procurement", body: "Share quantity, specification and monthly consumption patterns for a structured commercial quote." },
            { title: "Regular supply", body: "Repeat requirement lists can be reordered from a previous order; delivery schedules are agreed with our dispatch desk." },
            { title: "Product enquiries", body: "Request specification details or equivalent options where a listed configuration does not fit your protocol." },
            { title: "Institutional pricing", body: "Volume-based commercial offers with product value, GST and freight itemised separately." },
            { title: "Repeat order support", body: "Reorder the same lines and quantities from your previous order, then adjust before checkout." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <h3 className="text-[13px] font-bold text-navy-900">{item.title}</h3>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-navy-500">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-navy-100 bg-navy-50/60 py-12 sm:py-16">
        <div className="shell grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <div>
            <h2 className="text-xl font-bold text-navy-900">Commonly requested institutional lines</h2>
            <p className="mt-2 text-[12.5px] text-navy-500">Indicative base prices. Institutional quantities are quoted separately.</p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-navy-100 bg-white">
              {consumables.map((product, index) => (
                <Link key={product.id} href={`/products/${product.slug}`} className={`flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-navy-50/60 ${index % 2 === 0 ? "bg-navy-50/30" : "bg-white"}`}>
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-semibold text-navy-900">{product.name}</p>
                    <p className="text-[10.5px] text-navy-400">{product.brandName} · {product.packSize} · MOQ {product.moq}</p>
                  </div>
                  <span className="shrink-0 text-[12px] font-bold text-navy-800">₹{product.basePrice}</span>
                </Link>
              ))}
            </div>
            <Link href="/products" className="btn btn-ghost mt-4">Browse full catalogue</Link>
          </div>
          <EnquiryForm
            type="institutional"
            cta="Request Institutional Supply"
            heading="Institutional requirement"
            description="Share your product list, monthly quantity and delivery city. Our team will respond with a written offer."
          />
        </div>
      </section>
    </>
  );
}
