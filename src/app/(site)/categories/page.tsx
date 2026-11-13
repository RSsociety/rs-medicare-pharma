import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeading } from "@/components/ui";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product Categories — Pharma, Consumables & Glov-X",
  description:
    "Explore RS Medicare Pharma product categories: pharmaceuticals, medical consumables and the Glov-X examination glove range. Category-level procurement for clinics, hospitals, retailers and distributors.",
  alternates: { canonical: "/categories" },
};

const groupLabels: Record<string, { title: string; description: string; href: string }> = {
  pharma: { title: "Pharmaceuticals", description: "High-rotation formulations for pharmacy counters and institutional requirements.", href: "/categories/pharmaceuticals" },
  consumables: { title: "Medical Consumables", description: "Single-use clinical supplies for OPD, ward, diagnostic and nursing use.", href: "/categories/medical-consumables" },
  glovx: { title: "Glov-X Range", description: "Examination gloves across material and specification tiers.", href: "/glov-x" },
};

export default async function CategoriesPage() {
  const categories = await getCategories();
  const groups = ["pharma", "consumables", "glovx"] as const;

  return (
    <>
      <PageHero
        eyebrow="Product categories"
        title="Browse healthcare supply categories"
        description="Every category is managed in our catalogue system so ranges, specifications and availability can be updated as supply changes."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Categories" }]}
      />
      <section className="shell py-12 sm:py-16">
        <div className="space-y-12">
          {groups.map((group) => {
            const meta = groupLabels[group];
            const parents = categories.filter((category) => category.group === group && !category.parentId);
            if (parents.length === 0) return null;
            return (
              <div key={group}>
                <SectionHeading eyebrow={meta.title} title={meta.title} description={meta.description} action={<Link href={meta.href} className="btn btn-ghost !py-2 !text-[12px]">View range</Link>} />
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {parents.map((parent) => {
                    const children = categories.filter((category) => category.parentId === parent.id);
                    return (
                      <div key={parent.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[14.5px] font-bold text-navy-900">{parent.name}</h3>
                          <span className="chip bg-navy-50 text-navy-500">{parent.productCount}</span>
                        </div>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-navy-500">{parent.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {children.map((child) => (
                            <Link key={child.id} href={`/categories/${child.slug}`} className="rounded-full border border-navy-100 bg-navy-50/60 px-2.5 py-1 text-[10.5px] font-medium text-navy-600 transition hover:border-brand-300 hover:text-brand-700">
                              {child.name}
                            </Link>
                          ))}
                        </div>
                        <Link href={`/categories/${parent.slug}`} className="mt-4 inline-flex text-[11.5px] font-semibold text-brand-700 hover:underline">
                          Browse {parent.name} →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
