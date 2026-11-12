import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartPanel } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { ProductTabs } from "@/components/product-tabs";
import { Badge, Breadcrumbs } from "@/components/ui";
import { availability, inr, stockToneClass } from "@/lib/pricing";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seoTitle || `${product.name} — ${product.brandName}`,
    description: product.seoDescription || product.shortDescription || site.description,
    keywords: product.seoKeywords ?? undefined,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? site.description,
      url: `/products/${product.slug}`,
      images: product.images?.length ? [{ url: product.images[0] }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((item) => item.id !== product.id && (item.categorySlug === product.categorySlug || item.brandSlug === product.brandSlug))
    .slice(0, 4);
  const together = all
    .filter((item) => item.id !== product.id && item.categoryGroup === product.categoryGroup)
    .slice(0, 3);
  const stock = availability(product);
  const images = product.images?.length ? product.images : ["/images/glovx-nitrile.jpg"];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.shortDescription ?? product.description ?? site.description,
    image: images.map((image) => `${site.url}${image}`),
    brand: { "@type": "Brand", name: product.brandName ?? "RS Medicare" },
    category: product.categoryName ?? undefined,
    offers: {
      "@type": "Offer",
      url: `${site.url}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.basePrice.toFixed(2),
      availability: product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: site.name },
      eligibleQuantity: { "@type": "QuantitativeValue", minValue: product.moq, unitText: product.unit },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Products", item: `${site.url}/products` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${site.url}/products/${product.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="border-b border-navy-100 bg-navy-50/50">
        <div className="shell py-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: product.categoryName ?? "Catalogue", href: product.categorySlug ? `/categories/${product.categorySlug}` : "/products" },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <section className="shell py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_25.5rem] xl:gap-12">
          <div>
            <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
              <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[0]} alt={product.name} className="h-[300px] w-full object-cover sm:h-[420px]" />
              </div>
              <div className="flex gap-3 sm:flex-col">
                {images.slice(1, 4).map((image) => (
                  <div key={image} className="h-20 flex-1 overflow-hidden rounded-xl border border-navy-100 bg-white sm:h-24">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={`${product.name} preview`} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ))}
                <div className="hidden flex-1 flex-col justify-center rounded-xl border border-dashed border-navy-200 bg-navy-50/50 px-2 py-3 text-center sm:flex">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-navy-400">Product code</p>
                  <p className="mt-1 break-all text-[10.5px] font-semibold text-navy-700">{product.sku}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand">{product.brandName}</Badge>
                <Badge tone="neutral">{product.categoryName}</Badge>
                {product.isBestSeller ? <Badge tone="amber">Best seller</Badge> : null}
                <span className={`chip ring-1 ring-inset ${stockToneClass[stock.tone]}`}>{stock.label}</span>
              </div>
              <h1 className="mt-3 text-2xl font-bold leading-tight text-navy-900 sm:text-[2rem]">{product.name}</h1>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-navy-500">{product.shortDescription}</p>

              <dl className="mt-5 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Pack size", value: product.packSize ?? "—" },
                  { label: "Unit", value: product.unit },
                  { label: "MOQ", value: `${product.moq}` },
                  { label: "GST", value: `${product.taxRate}%` },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-navy-100 bg-white px-3 py-2.5">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-400">{item.label}</dt>
                    <dd className="mt-0.5 text-[12.5px] font-semibold text-navy-800">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <AddToCartPanel product={product} />
            <div className="mt-3 rounded-xl border border-navy-100 bg-white p-4 text-[11.5px] leading-relaxed text-navy-500">
              <p className="font-semibold text-navy-800">Ordering note</p>
              <p className="mt-1">
                Product value is calculated at the centralised base price of {inr(product.basePrice)} per {product.unit}.
                Applicable GST and freight are itemised separately. Guest checkout is available.
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-semibold">
                <Link href="/shipping-policy" className="text-brand-700 hover:underline">Freight policy</Link>
                <Link href="/returns-policy" className="text-brand-700 hover:underline">Returns</Link>
                <Link href="/faq" className="text-brand-700 hover:underline">FAQ</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <ProductTabs product={product} />
        </div>

        {together.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-navy-900">Frequently ordered together</h2>
            <p className="mt-1 text-[12.5px] text-navy-500">Commonly combined lines for the same procurement cycle.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {together.map((item) => (
                <Link key={item.id} href={`/products/${item.slug}`} className="group flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-3 transition hover:border-brand-200 hover:shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.images?.[0] || "/images/glovx-nitrile.jpg"} alt={item.name} loading="lazy" className="h-16 w-16 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-semibold text-navy-900 group-hover:text-brand-700">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-navy-400">{item.packSize}</p>
                    <p className="mt-0.5 text-[12px] font-bold text-navy-800">{inr(item.basePrice)} <span className="text-[10px] font-medium text-navy-400">/ {item.unit}</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {related.length > 0 ? (
          <div className="mt-12">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Related products</h2>
                <p className="mt-1 text-[12.5px] text-navy-500">Same range or brand — useful for comparing specifications.</p>
              </div>
              <Link href="/products" className="text-[12px] font-semibold text-brand-700 hover:underline">View all →</Link>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} compact />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
