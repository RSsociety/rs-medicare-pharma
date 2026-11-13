import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { inr } from "@/lib/pricing";
import { getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Offers & Volume Pricing Reviews",
  description: "Current commercial programmes at RS Medicare Pharma: volume pricing review, freight planning for institutional orders, and centralised Glov-X base pricing.",
  alternates: { canonical: "/offers" },
};

export default async function OffersPage() {
  const products = await getProducts();
  const picks = products.filter((product) => product.isBestSeller || product.isFeatured).slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow="Offers"
        title="Commercial programmes, stated plainly"
        description="We do not publish countdown timers or inflated discounts. Volume-based commercials are reviewed against quantity, specification and delivery location."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Offers" }]}
      />
      <section className="shell py-12 sm:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Volume pricing review", body: "Institutional and distribution quantities are reviewed for a written commercial offer with itemised GST and freight.", cta: "Request Bulk Quote", href: "/bulk-orders" },
            { title: "Freight planning", body: "Consolidate order lines and plan dispatch frequency with our team to make freight more efficient per unit.", cta: "Read Freight Policy", href: "/shipping-policy" },
            { title: "Repeat-order efficiency", body: "Reorder a previous consignment to rebuild your cart instantly, then adjust quantities before checkout.", cta: "Track & Reorder", href: "/track" },
          ].map((card) => (
            <div key={card.title} className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <h2 className="text-[13.5px] font-bold text-navy-900">{card.title}</h2>
              <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-navy-500">{card.body}</p>
              <Link href={card.href} className="mt-4 text-[11.5px] font-semibold text-brand-700 hover:underline">{card.cta} →</Link>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-navy-100 bg-white shadow-card">
          <div className="border-b border-navy-100 px-5 py-4">
            <h2 className="text-[14px] font-bold text-navy-900">Fast-moving lines — current base prices</h2>
            <p className="mt-0.5 text-[11.5px] text-navy-400">Centralised base price per unit. GST applied at checkout; freight confirmed separately.</p>
          </div>
          <div className="divide-y divide-navy-100">
            {picks.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 transition hover:bg-navy-50/50">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold text-navy-900">{product.name}</p>
                  <p className="text-[10.5px] text-navy-400">{product.brandName} · {product.packSize} · MOQ {product.moq} {product.unit}(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-navy-900">{inr(product.basePrice)} <span className="text-[10px] font-medium text-navy-400">/ {product.unit}</span></p>
                  <p className="text-[10px] text-brand-700">+ {product.taxRate}% GST</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[10.5px] leading-relaxed text-navy-400">
          No discount, coupon or price claim is made on this page beyond the listed base prices. Commercial terms for
          volume orders are confirmed in writing by our sales desk.
        </p>
      </section>
    </>
  );
}
