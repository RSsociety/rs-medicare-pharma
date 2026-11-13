import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { PageHero } from "@/components/ui";
import { getBrands, getCategories, getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} — Supplier & Distributor`,
    description: `${category.description} Browse ${category.name.toLowerCase()} from RS Medicare Pharma with centralised base prices, GST applied at checkout and freight confirmed separately.`,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories, products, brands] = await Promise.all([getCategories(), getProducts(), getBrands()]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const children = categories.filter((item) => item.parentId === category.id);
  const parent = category.parentId ? categories.find((item) => item.id === category.parentId) : null;

  return (
    <>
      <PageHero
        eyebrow={parent ? parent.name : "Category"}
        title={`${category.name} — B2B supply`}
        description={category.description ?? "Browse products in this category."}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          ...(parent ? [{ label: parent.name, href: `/categories/${parent.slug}` }] : []),
          { label: category.name },
        ]}
      >
        <Link href="/bulk-orders" className="btn btn-brand">Request Bulk Quote</Link>
        <Link href="/catalogue" className="btn btn-outline-light">Download Catalogue</Link>
      </PageHero>

      <section className="shell py-10 sm:py-14">
        {children.length > 0 ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {children.map((child) => (
              <Link key={child.id} href={`/categories/${child.slug}`} className="rounded-full border border-navy-100 bg-white px-3 py-1.5 text-[11.5px] font-medium text-navy-600 transition hover:border-brand-300 hover:text-brand-700">
                {child.name} <span className="text-navy-300">({child.productCount})</span>
              </Link>
            ))}
          </div>
        ) : null}
        <CatalogueBrowser
          products={products}
          categories={categories}
          brands={brands.map((brand) => ({ id: brand.id, slug: brand.slug, name: brand.name }))}
          initialCategory={category.slug}
        />
      </section>
    </>
  );
}
