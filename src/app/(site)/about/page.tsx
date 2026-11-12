import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { PageHero, SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About RS Medicare Pharma — Healthcare Supply & Distribution",
  description:
    "RS Medicare Pharma is a pharmaceutical and medical-products distribution business supplying retailers, chemists, clinics, hospitals, diagnostic centres, distributors and wholesalers with dependable stock and transparent ordering.",
  alternates: { canonical: "/about" },
};

const principles = [
  { title: "Availability before promises", body: "We confirm stock before committing dispatch dates. If a line is short, we say so and offer an alternative rather than leaving a buyer waiting." },
  { title: "One price architecture", body: "Product base prices stay centralised. GST is shown separately and freight is reviewed per delivery location — so buyers always see what they are paying for." },
  { title: "Trade-first service", body: "Our workflows are built around purchase requirements, pack sizes and repeat procurement, not retail-style impulse buying." },
  { title: "Clear documentation", body: "Orders carry a traceable ID, visible status checkpoints and itemised totals so finance and procurement teams can reconcile easily." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A healthcare supply partner built on dependable distribution"
        description="RS Medicare Pharma supplies pharmaceutical products and medical consumables to businesses that serve patients — pharmacies, clinics, hospitals, diagnostic centres and distribution partners."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        image="/images/about-facility.jpg"
      >
        <Link href="/products" className="btn btn-brand">Explore the Catalogue</Link>
        <Link href="/contact" className="btn btn-outline-light">Talk to Our Team</Link>
      </PageHero>

      <section className="shell py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow="Our story"
                title="Distribution discipline for everyday healthcare procurement"
                description="RS Medicare Pharma was built around a straightforward observation: healthcare businesses do not need more marketing — they need reliable supply, clear pricing and a team that responds."
              />
              <div className="prose-premium mt-5">
                <p>
                  We operate as a distribution partner across two connected categories. On the
                  pharmaceutical side, we supply high-rotation formulations for pharmacy counters and
                  institutional requirements. On the medical-products side, we supply single-use
                  consumables used every day in OPDs, wards, diagnostic rooms and nursing stations —
                  including our Glov-X examination glove range.
                </p>
                <p>
                  Our customers are procurement-focused. A medical store may reorder a handful of
                  lines every month; a hospital may schedule a larger consumable purchase; a
                  distributor may discuss territory coverage. All of them need accurate product
                  information, honest availability and a consistent commercial process.
                </p>
                <p>
                  That is why our platform is built around a centralised catalogue, guest checkout,
                  transparent GST and freight that is quoted separately rather than hidden inside a
                  product price. We would rather show a clear total than an attractive fiction.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/how-to-order" className="btn btn-ghost">How Ordering Works</Link>
                <Link href="/become-a-dealer" className="btn btn-primary">Partner With Us</Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-navy-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/about-facility.jpg" alt="RS Medicare Pharma distribution operations" className="h-[300px] w-full object-cover" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Distribution model", value: "B2B supply" },
                  { label: "Customer base", value: "Trade & institutions" },
                  { label: "Ordering", value: "Guest checkout" },
                  { label: "Pricing", value: "Centralised base price" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-navy-100 bg-navy-50/50 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-400">{item.label}</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-navy-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-navy-100 bg-navy-50/60 py-14 sm:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading eyebrow="How we operate" title="Four commitments that shape every order" align="center" />
          </Reveal>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <div className="h-full rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-900 font-display text-[12px] font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3.5 text-[13.5px] font-bold text-navy-900">{item.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-navy-500">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <h2 className="text-lg font-bold text-navy-900">What we supply</h2>
              <ul className="prose-premium mt-3">
                <li>Pharmaceutical formulations for pharmacy counters and institutions</li>
                <li>Medical consumables: gloves, masks, wound care, injection &amp; infusion, diagnostics, hygiene</li>
                <li>Glov-X examination gloves in economic, standard and premium specifications</li>
                <li>Bulk and scheduled supply support for hospitals and clinics</li>
              </ul>
              <Link href="/categories" className="btn btn-ghost mt-4">Browse categories</Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <h2 className="text-lg font-bold text-navy-900">What we do not claim</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-navy-500">
                We do not publish unverified certifications, invented customer counts, fictional
                partnerships, awards or reviews. Product documentation and batch details are shared
                through the sales desk as available with each consignment. Where a specification is
                critical to your procurement, please confirm it with our team in writing before ordering.
              </p>
              <div className="mt-4 rounded-xl bg-navy-50/70 p-3.5 text-[11.5px] leading-relaxed text-navy-600">
                <p className="font-semibold text-navy-800">Registered contact</p>
                <p className="mt-1">{site.address.line1}, {site.address.city}, {site.address.state} {site.address.pincode}</p>
                <p className="mt-1">{site.phone} · {site.email}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
