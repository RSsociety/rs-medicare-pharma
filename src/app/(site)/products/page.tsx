import type { Metadata } from "next";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { PageHero } from "@/components/ui";
import { getBrands, getCategories, getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products — Pharmaceutical & Medical Consumables Catalogue",
  description:
    "Browse the RS Medicare Pharma catalogue: pharmaceuticals, medical consumables and the Glov-X examination glove range. Search by product, SKU, brand or specification. Base prices shown with GST and freight calculated separately.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Product Catalogue | RS Medicare Pharma",
    description: "Pharmaceuticals, medical consumables and Glov-X examination gloves for B2B buyers.",
    url: "/products",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; brand?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [products, categories, brands] = await Promise.all([getProducts(), getCategories(), getBrands()]);

  return (
    <>
      <PageHero
        eyebrow="Product catalogue"
        title="Pharmaceuticals, medical consumables & Glov-X — in one B2B catalogue"
        description="Search by product name, SKU, brand, category or specification. Base prices are shown per unit; applicable GST and freight are clearly itemised at checkout."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      >
        <a href="/catalogue" className="btn btn-brand">Download Catalogue</a>
        <a href="/bulk-orders" className="btn btn-outline-light">Bulk Enquiry</a>
      </PageHero>

      <section className="shell py-10 sm:py-14">
        <CatalogueBrowser
          products={products}
          categories={categories}
          brands={brands.map((brand) => ({ id: brand.id, slug: brand.slug, name: brand.name }))}
          initialQuery={params.q ?? ""}
          initialCategory={params.category ?? ""}
          initialBrand={params.brand ?? ""}
          initialSort={params.sort ?? "featured"}
        />

        <div className="mt-12 rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-bold text-navy-900">About the RS Medicare Pharma catalogue</h2>
          <div className="prose-premium mt-3 max-w-4xl">
            <p>
              Our catalogue is organised around how healthcare businesses actually buy: pharmaceutical
              formulations for pharmacy counters, single-use medical consumables for wards and OPDs,
              and the Glov-X examination glove range specified by material and weight. Each listing
              carries its own SKU, pack size, unit, minimum order quantity, tax rate and stock status
              so procurement teams can compare like-for-like.
            </p>
            <p>
              Prices shown are centralised base prices per unit. We do not embed location-specific
              freight into product prices — GST is applied at checkout and freight is confirmed after
              your delivery location and order volume are reviewed. For high-volume requirements,
              hospitals, clinics and distributors can request a written commercial quote through the
              bulk enquiry desk.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
