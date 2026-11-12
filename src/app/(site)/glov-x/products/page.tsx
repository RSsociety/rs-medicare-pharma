import type { Metadata } from "next";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { PageHero } from "@/components/ui";
import { getBrands, getCategories, getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Glov-X Products — Examination Gloves Catalogue",
  description:
    "Shop Glov-X examination gloves: nitrile 3 g, 4 g and 5 g, powder-free latex, and vinyl. Compare material, weight, packing, MOQ and base price. B2B ordering with guest checkout.",
  alternates: { canonical: "/glov-x/products" },
};

export default async function GlovXProductsPage() {
  const [products, categories, brands] = await Promise.all([getProducts(), getCategories(), getBrands()]);
  const glovx = products.filter((product) => product.brandSlug === "glov-x");

  return (
    <>
      <PageHero
        eyebrow="Glov-X products"
        title="Glov-X examination glove catalogue"
        description="Compare specification, packing and pricing across the Glov-X range. Every listing shows the declared weight and minimum order quantity."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Glov-X", href: "/glov-x" }, { label: "Products" }]}
      />
      <section className="shell py-10 sm:py-14">
        <div className="mb-6 overflow-hidden rounded-2xl border border-navy-100 bg-white">
          <div className="border-b border-navy-100 bg-navy-50/60 px-5 py-3">
            <h2 className="text-[13px] font-bold text-navy-900">Quickspec comparison</h2>
            <p className="mt-0.5 text-[11px] text-navy-500">Base price per glove · GST applied at checkout · freight confirmed separately</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[12px]">
              <thead className="bg-white text-[10px] uppercase tracking-[0.12em] text-navy-400">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Product</th>
                  <th className="px-4 py-2.5 font-semibold">Material</th>
                  <th className="px-4 py-2.5 font-semibold">Weight</th>
                  <th className="px-4 py-2.5 font-semibold">Specification</th>
                  <th className="px-4 py-2.5 font-semibold">MOQ</th>
                  <th className="px-4 py-2.5 font-semibold">Base price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {glovx.map((product) => (
                  <tr key={product.id} className="hover:bg-navy-50/40">
                    <td className="px-4 py-2.5 font-medium text-navy-900">{product.name}</td>
                    <td className="px-4 py-2.5 text-navy-500">{product.specifications?.Material ?? "—"}</td>
                    <td className="px-4 py-2.5 text-navy-500">{product.specifications?.Weight ?? product.weight ?? "—"}</td>
                    <td className="px-4 py-2.5 text-navy-500">{product.subcategory}</td>
                    <td className="px-4 py-2.5 text-navy-500">{product.moq}</td>
                    <td className="px-4 py-2.5 font-semibold text-navy-800">₹{product.basePrice} / {product.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <CatalogueBrowser
          products={glovx}
          categories={categories}
          brands={brands.map((brand) => ({ id: brand.id, slug: brand.slug, name: brand.name }))}
          initialBrand="glov-x"
        />
      </section>
    </>
  );
}
