import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { getBrands, getCategories } from "@/lib/queries";
import type { VariantRow } from "@/components/admin/variant-editor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · New Product", robots: { index: false, follow: false } };

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);
  return (
    <div className="space-y-4">
      <div>
        <Link href="/admin/products" className="text-[11px] font-semibold text-slate-500 hover:text-slate-800">← Back to products</Link>
        <h1 className="mt-1.5 text-xl font-bold text-slate-900">Add a new product</h1>
        <p className="mt-1 text-[12px] text-slate-500">All fields are stored in the database and appear on the storefront immediately when active.</p>
      </div>
      <ProductForm categories={categories} brands={brands} initialVariants={[]} />
    </div>
  );
}
