import Link from "next/link";
import { FeaturedProducts } from "@/components/featured-products";
import { Reveal } from "@/components/reveal";
import { SectionHeading, TrustStrip } from "@/components/ui";
import { getCategories, getFaqs, getProducts } from "@/lib/queries";
import { inr } from "@/lib/pricing";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const valueProps = [
  {
    title: "Reliable supply",
    body: "Consistent product availability with stock confirmed before dispatch and clear communication when a line is short.",
    icon: "M4 7h16M4 12h10M4 17h7",
  },
  {
    title: "Competitive B2B pricing",
    body: "One centralised base price per product with applicable GST shown separately — built for long-term trade partnerships.",
    icon: "M12 3v18M7 7h7a3 3 0 0 1 0 6H7h8a3 3 0 0 1 0 6",
  },
  {
    title: "Wide product range",
    body: "Pharmaceutical lines and essential medical consumables — including the Glov-X range — sourced for healthcare businesses.",
    icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  },
  {
    title: "B2B focused operations",
    body: "Ordering designed for retailers, chemists, clinics, hospitals, diagnostic centres and distributors.",
    icon: "M3 21h18M6 21V9l6-4 6 4v12M10 13h4v8",
  },
  {
    title: "Fast enquiry response",
    body: "Bulk and institutional enquiries routed directly to the sales desk with product, quantity and location captured upfront.",
    icon: "M4 5h16v11H8l-4 4z",
  },
  {
    title: "Transparent ordering",
    body: "No hidden freight baked into product prices. Product value, GST and freight each appear as separate line items.",
    icon: "M9 12l2 2 4-4M12 3l7 4v10l-7 4-7-4V7z",
  },
];

const steps = [
  { title: "Browse & compare", body: "Search by product, SKU, brand or specification. Check pack size, MOQ, stock status and base price." },
  { title: "Add to cart", body: "Order without creating an account. Guest checkout is available for every customer." },
  { title: "Share delivery details", body: "Add business details, GSTIN (optional) and delivery address. Tax is applied automatically." },
  { title: "Freight & confirmation", body: "We review the delivery location and order volume, confirm freight, then process dispatch." },
];

const segments = [
  { name: "Retailers & Chemists", href: "/dealer-enquiry", note: "Repeat pharmacy stock" },
  { name: "Clinics & Nursing Homes", href: "/hospital-supply", note: "OPD and ward consumables" },
  { name: "Hospitals & Institutions", href: "/bulk-orders", note: "Bulk procurement support" },
  { name: "Distributors & Wholesalers", href: "/distributor-network", note: "Territory supply conversations" },
];

export default async function HomePage() {
  const [products, categories, faqs] = await Promise.all([getProducts(), getCategories(), getFaqs()]);
  const glovx = products.find((product) => product.sku === "GLX-NIT-ECO-3G") ?? products[0];
  const topCategories = categories.filter((category) => !category.parentId).slice(0, 3);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.slice(0, 5).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-50 via-white to-white">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-navy-100/60 blur-3xl" />
        <div className="shell relative grid gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip bg-white text-navy-700 ring-1 ring-inset ring-navy-200">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                B2B pharmaceutical & medical supply
              </span>
              <span className="chip bg-navy-900 text-white">Guest ordering available</span>
            </div>

            <h1 className="mt-6 text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-navy-900 text-balance sm:text-5xl lg:text-[3.35rem]">
              Reliable pharmaceutical & medical product supply for businesses
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-navy-500 sm:text-base">
              Quality products, competitive pricing and dependable supply for retailers, clinics,
              hospitals and healthcare businesses. Centralised base pricing, transparent GST and
              freight confirmed per delivery location.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-primary">Explore Products</Link>
              <Link href="/products?sort=best" className="btn btn-brand">Order Now</Link>
              <Link href="/bulk-orders" className="btn btn-ghost">Request Bulk Quote</Link>
            </div>

            <dl className="mt-9 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 border-t border-navy-100 pt-6 sm:grid-cols-3">
              {[
                { value: "11", label: "Order status checkpoints" },
                { value: "Guest", label: "Checkout — no login needed" },
                { value: "B2B", label: "Pricing & invoicing ready" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="font-display text-xl font-bold text-navy-900">{item.value}</dt>
                  <dd className="mt-1 text-[11.5px] leading-snug text-navy-500">{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white bg-navy-100 shadow-lift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-supply.jpg"
                alt="RS Medicare Pharma medical distribution operations"
                className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[460px]"
              />
            </div>

            {glovx ? (
              <div className="absolute -bottom-6 left-4 w-[15.5rem] rounded-2xl border border-navy-100 bg-white/95 p-4 shadow-lift backdrop-blur sm:left-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">Featured · Glov-X</p>
                <p className="mt-1.5 text-[13px] font-semibold leading-snug text-navy-900">{glovx.name}</p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="font-display text-xl font-bold text-navy-900">
                    {inr(glovx.basePrice)}
                    <span className="ml-1 text-[10px] font-medium text-navy-400">/ {glovx.unit}</span>
                  </p>
                  <span className="text-[10px] font-semibold text-brand-700">+ GST · freight separate</span>
                </div>
                <Link href={`/products/${glovx.slug}`} className="mt-3 block text-[11.5px] font-semibold text-navy-800 underline-offset-2 hover:underline">
                  View product details →
                </Link>
              </div>
            ) : null}

            <div className="absolute -right-2 top-6 hidden rounded-xl border border-navy-100 bg-white/95 px-3.5 py-2.5 shadow-lift backdrop-blur sm:block">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-navy-400">Order pipeline</p>
              <p className="mt-1 text-[11.5px] font-semibold text-navy-800">Received → Freight → Dispatch</p>
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3, 4].map((step) => (
                  <span key={step} className={`h-1 w-6 rounded-full ${step < 3 ? "bg-brand-500" : "bg-navy-100"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Value props */}
      <section className="shell py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Why healthcare businesses buy from us"
            title="A supply partner built around B2B procurement realities"
            description="Small recurring orders and large institutional requirements are handled on the same platform — with clear pack sizes, MOQs and pricing."
            action={<Link href="/about" className="btn btn-ghost">About RS Medicare</Link>}
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((prop, index) => (
            <Reveal key={prop.title} delay={index * 60}>
              <div className="group h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-50 text-navy-800 transition group-hover:bg-brand-50 group-hover:text-brand-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={prop.icon} />
                  </svg>
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-navy-900">{prop.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-navy-500">{prop.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-navy-100 bg-navy-50/60 py-16 sm:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Product categories"
              title="Procurement-ready ranges under one platform"
              description="Pharmaceutical formulations, medical consumables and the Glov-X examination glove range. Every category is administered through the catalogue management system."
              action={<Link href="/categories" className="btn btn-ghost">All Categories</Link>}
            />
          </Reveal>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {topCategories.map((category, index) => (
              <Reveal key={category.id} delay={index * 70}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative h-40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={category.image || "/images/product-mask.jpg"} alt={category.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute right-3 top-3 chip bg-white/95 text-navy-700">{category.productCount} products</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[15.5px] font-bold text-navy-900">{category.name}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-navy-500">{category.tagline || category.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-700">
                      Browse category
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden><path d="M7 4l6 6-6 6-1.4-1.4L10.2 10 5.6 5.4 7 4z" /></svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="shell py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Featured products"
            title="High-rotation lines, ready to order"
            description="Base prices shown per unit. GST is applied at checkout and freight is confirmed after delivery-location review."
            action={<Link href="/products" className="btn btn-ghost">View Full Catalogue</Link>}
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-8">
            <FeaturedProducts products={products} />
          </div>
        </Reveal>
      </section>

      {/* Glov-X brand band */}
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20">
        <div className="absolute inset-0 grid-noise opacity-40" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="shell relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="eyebrow text-brand-300">Brand spotlight</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-[2.4rem]">
                GLOV-X<span className="text-brand-400">.</span> Examination gloves, specified clearly.
              </h2>
              <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-white/70">
                Economic, standard and premium specifications across nitrile, latex and vinyl.
                Every Glov-X listing states material, weight, packing and MOQ, so procurement teams
                can compare specifications before ordering.
              </p>
              <dl className="mt-7 grid max-w-lg grid-cols-3 gap-4 border-y border-white/10 py-5">
                {[
                  { value: "3", label: "Specification tiers" },
                  { value: "3", label: "Glove materials" },
                  { value: "100", label: "Gloves per box" },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="font-display text-2xl font-bold text-white">{item.value}</dt>
                    <dd className="mt-1 text-[10.5px] leading-snug text-white/50">{item.label}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/glov-x" className="btn btn-brand">Explore Glov-X Products</Link>
                <Link href="/glov-x/products" className="btn btn-outline-light">Compare Specifications</Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-white/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/glovx-nitrile.jpg" alt="Glov-X nitrile examination gloves" loading="lazy" className="h-[300px] w-full object-cover sm:h-[380px]" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/15 bg-navy-900/90 p-4 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-300">Product architecture</p>
                <div className="mt-2 flex items-center justify-between gap-3 text-[11.5px]">
                  <span className="text-white/70">Base price</span>
                  <span className="text-white/40">+</span>
                  <span className="text-white/70">Applicable GST</span>
                  <span className="text-white/40">+</span>
                  <span className="text-white/70">Freight</span>
                  <span className="text-white/40">=</span>
                  <span className="font-semibold text-brand-300">Final payable</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ordering flow + pricing */}
      <section className="shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow="How ordering works"
                title="From product discovery to confirmed freight, in four clear steps"
                description="Guest checkout is standard. No account, subscription or minimum website registration is required to place a product order."
              />
              <ol className="mt-8 space-y-3">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-900 font-display text-[13px] font-bold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[13.5px] font-semibold text-navy-900">{step.title}</h3>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-navy-500">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/how-to-order" className="btn btn-ghost">Read Ordering Guide</Link>
                <Link href="/track" className="btn btn-primary">Track an Order</Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="rounded-3xl border border-navy-100 bg-navy-50/60 p-6 sm:p-7">
              <p className="eyebrow">Pricing architecture</p>
              <h2 className="mt-3 font-display text-xl font-bold text-navy-900">One base price. Tax and freight shown separately.</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-navy-500">
                Product pricing stays centralised across territories. Applicable GST is applied at
                checkout, while freight is reviewed against the delivery location, quantity and
                shipment mode before it is confirmed on your order.
              </p>
              <div className="mt-5 space-y-2.5">
                {[
                  { label: "Product base value", value: "Centralised catalogue price", tone: "text-navy-800" },
                  { label: "Applicable GST", value: "Calculated per product tax rate", tone: "text-navy-800" },
                  { label: "Freight", value: "Confirmed after location review", tone: "text-brand-700" },
                  { label: "Final payable", value: "Product + GST + freight", tone: "text-navy-900" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl border border-navy-100 bg-white px-3.5 py-2.5">
                    <span className="text-[12px] font-semibold text-navy-600">{row.label}</span>
                    <span className={`text-[11.5px] font-medium ${row.tone}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-white p-3.5 text-[11.5px] leading-relaxed text-navy-500 ring-1 ring-navy-100">
                <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" fill="currentColor" aria-hidden><path d="M10 1.7 3 4.6v5.1c0 4.2 2.9 7.3 7 8.6 4.1-1.3 7-4.4 7-8.6V4.6L10 1.7Zm1 12.6H9v-2h2v2Zm0-3.5H9V5.3h2v5.5Z" /></svg>
                Manual and automated freight modes are both supported. Ask our team about automated freight for repeat institutional accounts.
              </div>
              <Link href="/shipping-policy" className="mt-5 inline-flex text-[11.5px] font-semibold text-navy-700 underline-offset-2 hover:underline">
                Read the shipping & freight policy →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Segments */}
      <section className="border-y border-navy-100 bg-navy-50/60 py-16 sm:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Who we supply"
              title="Built for the buyers who keep healthcare running"
              description="Tell us your requirement and we will respond with availability, commercials and dispatch timelines."
              align="center"
            />
          </Reveal>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map((segment, index) => (
              <Reveal key={segment.name} delay={index * 60}>
                <Link href={segment.href} className="group flex h-full flex-col justify-between rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
                  <div>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-50 text-navy-700 group-hover:bg-brand-50 group-hover:text-brand-700">
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M4 21V7h16v14M9 21v-6h6v6M8 11h2M14 11h2" strokeLinecap="round" /></svg>
                    </span>
                    <h3 className="mt-3.5 text-[13.5px] font-bold text-navy-900">{segment.name}</h3>
                    <p className="mt-1 text-[11.5px] text-navy-500">{segment.note}</p>
                  </div>
                  <span className="mt-4 text-[11.5px] font-semibold text-brand-700">Enquire →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk CTA */}
      <section className="shell py-16 sm:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="absolute inset-0 grid-noise opacity-40" />
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="eyebrow text-brand-300">Bulk & institutional orders</p>
                <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight sm:text-[2rem]">
                  Sourcing for a hospital, clinic chain or distribution territory?
                </h2>
                <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/70">
                  Share your product list, quantities and delivery location. Our sales desk reviews
                  availability, works out freight and responds with a written quote — no website
                  account required.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <Link href="/bulk-orders" className="btn btn-brand w-full">Request Bulk Quote</Link>
                <Link href="/hospital-supply" className="btn btn-outline-light w-full">Institutional Supply</Link>
                <a href={`mailto:${site.email}`} className="btn btn-outline-light w-full">Talk to Sales</a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ preview */}
      <section className="shell pb-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div>
              <SectionHeading eyebrow="Buyer questions" title="Answers before you order" description="The operational details B2B buyers ask us most often." />
              <Link href="/faq" className="btn btn-ghost mt-5">See all FAQs</Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white shadow-card">
              {faqs.slice(0, 5).map((faq) => (
                <details key={faq.id} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13.5px] font-semibold text-navy-900">
                    {faq.question}
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-navy-200 text-navy-500 transition group-open:rotate-45 group-open:border-brand-300 group-open:text-brand-700">+</span>
                  </summary>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-navy-500">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
