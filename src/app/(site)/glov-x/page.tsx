import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { PageHero, SectionHeading } from "@/components/ui";
import { getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Glov-X Medical Examination Gloves — Nitrile, Latex & Vinyl",
  description:
    "Glov-X is the RS Medicare Pharma medical consumables line. Explore economic, standard and premium examination gloves in nitrile, latex and vinyl, with clear specifications, MOQ and B2B pricing.",
  alternates: { canonical: "/glov-x" },
};

const specs = [
  { tier: "Economic", weight: "3 g", use: "High-rotation, cost-sensitive procurement", moq: "100 gloves" },
  { tier: "Standard", weight: "4 g", use: "Routine OPD, ward and laboratory handling", moq: "100 gloves" },
  { tier: "Premium", weight: "5 g", use: "Heavier feel and tactile feedback", moq: "100 gloves" },
];

export default async function GlovXPage() {
  const products = await getProducts();
  const glovx = products.filter((product) => product.brandSlug === "glov-x");

  return (
    <>
      <PageHero
        eyebrow="Brand spotlight"
        title="GLOV-X — examination gloves specified for procurement clarity"
        description="A medical consumables line distributed by RS Medicare Pharma. Economic, standard and premium specifications across nitrile, latex and vinyl, with declared weight, packing and minimum order quantity on every listing."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Glov-X" }]}
        image="/images/glovx-nitrile.jpg"
      >
        <Link href="/glov-x/products" className="btn btn-brand">Explore Glov-X Products</Link>
        <Link href="/bulk-orders" className="btn btn-outline-light">Bulk Glov-X Enquiry</Link>
      </PageHero>

      <section className="shell py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow="Glov-X overview"
                title="One brand, three specifications, no ambiguity"
                description="Glov-X exists because glove procurement is usually decided on two variables — material and weight — and both should be visible before an order is placed."
              />
              <div className="prose-premium mt-4">
                <p>
                  Each Glov-X listing declares the glove material, weight in grams, non-sterile
                  examination classification, powder status, available sizes, colour, surface finish,
                  usage and packing configuration. Minimum order quantity is shown per listing so
                  small clinics and large institutions can plan the same way.
                </p>
                <p>
                  Prices shown are centralised base prices per glove. Applicable GST is added at
                  checkout and freight is reviewed against delivery location and shipment volume. We
                  do not publish sterility, protection-level, certification or regulatory-approval
                  claims unless they are explicitly confirmed in the supply documentation.
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { value: "Nitrile", label: "Synthetic" },
                  { value: "Latex", label: "Powder-free" },
                  { value: "Vinyl", label: "Light use" },
                  { value: "100", label: "Gloves / box" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-navy-100 bg-navy-50/50 px-3 py-2.5">
                    <p className="font-display text-[13.5px] font-bold text-navy-900">{item.value}</p>
                    <p className="mt-0.5 text-[10px] text-navy-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-3xl border border-navy-100 shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/glovx-nitrile.jpg" alt="Glov-X examination gloves" className="h-[360px] w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-navy-100 bg-navy-50/60 py-14">
        <div className="shell">
          <SectionHeading eyebrow="Specification tiers" title="Match the glove to the procurement decision" description="Specification tiers are editable through the admin catalogue — the weights shown here reflect the current Glov-X range." />
          <div className="mt-7 overflow-hidden rounded-2xl border border-navy-100 bg-white">
            <div className="hidden grid-cols-4 gap-3 border-b border-navy-100 bg-navy-900 px-5 py-3 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/70 sm:grid">
              <span>Specification</span><span>Weight</span><span>Typical selection</span><span>MOQ</span>
            </div>
            {specs.map((spec) => (
              <div key={spec.tier} className="grid gap-2 border-b border-navy-100 px-5 py-4 text-[12.5px] last:border-0 sm:grid-cols-4 sm:items-center">
                <span className="font-semibold text-navy-900">{spec.tier}</span>
                <span className="text-navy-600">{spec.weight}</span>
                <span className="text-navy-500">{spec.use}</span>
                <span className="font-medium text-navy-700">{spec.moq}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-14 sm:py-20">
        <SectionHeading
          eyebrow="Glov-X product range"
          title="Examination gloves available to order"
          description="Base price per glove, GST at checkout, freight confirmed separately. Bulk quantities quoted on request."
          action={<Link href="/glov-x/products" className="btn btn-ghost !py-2 !text-[12px]">Full Glov-X catalogue</Link>}
        />
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {glovx.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            { title: "Quality positioning", body: "Glov-X is positioned as a dependable consumable range for routine clinical environments. Product documentation available with each consignment is shared on request — we do not display unverified certification badges." },
            { title: "Bulk orders", body: "Institutions typically procure gloves in cartons. Share the specification, size mix and monthly consumption pattern so we can plan availability and freight together." },
            { title: "Catalogue & QR", body: "The downloadable catalogue includes Glov-X specifications and contact details. Product pages can also be shared through their own link or QR code." },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <h3 className="text-[13.5px] font-bold text-navy-900">{card.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-navy-500">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-navy-900 px-6 py-7 text-white sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Ordering Glov-X for a clinic or hospital?</h2>
              <p className="mt-1.5 text-[12.5px] text-white/70">Send your specification, size mix and monthly requirement for a written quote.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/bulk-orders" className="btn btn-brand">Request Quote</Link>
              <Link href="/catalogue" className="btn btn-outline-light">Download Catalogue</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
