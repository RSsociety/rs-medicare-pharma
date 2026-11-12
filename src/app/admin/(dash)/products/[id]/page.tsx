import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getBrands, getCategories, getProductById } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Edit Product", robots: { index: false, follow: false } };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    getProductById(Number(id)),
    getCategories(),
    getBrands(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <Link href="/admin/products" className="text-[11px] font-semibold text-slate-500 hover:text-slate-800">← Back to products</Link>
          <h1 className="mt-1.5 text-xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-0.5 text-[11.5px] text-slate-500">SKU {product.sku} · <Link href={`/products/${product.slug}`} className="text-brand-700 hover:underline">view on storefront</Link></p>
        </div>
        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[10.5px] font-semibold text-slate-500">Product ID #{product.id}</span>
      </div>
      <ProductForm product={product} categories={categories} brands={brands} />
    </div>
  );
}
