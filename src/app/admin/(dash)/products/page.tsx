import type { Metadata } from "next";
import Link from "next/link";
import { ProductActions } from "@/components/admin/product-actions";
import { QuickPriceEditor } from "@/components/admin/quick-price-editor";
import { getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin · Products", robots: { index: false, follow: false } };

export default async function AdminProductsPage() {
  const products = await getProducts({ includeInactive: true });
  const lowStock = products.filter((product) => product.stockQuantity <= product.lowStockThreshold).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Product management</h1>
          <p className="mt-1 text-[12px] text-slate-500">
            {products.length} products · {lowStock} below stock threshold · base prices are centralised
          </p>
          <p className="mt-1.5 inline-flex flex-wrap items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 text-[10.5px] font-medium text-brand-800">
            <span className="font-bold">Quick edit:</span> click “edit price” on any row to change price, GST, MOQ or stock.
            For images, name, description and SEO, open <span className="font-bold">Edit</span>.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary !py-2 !text-[11.5px]">+ Add Product</Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead className="bg-slate-50 text-[9.5px] uppercase tracking-[0.1em] text-slate-400">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Product</th>
                <th className="px-4 py-2.5 font-semibold">Category</th>
                <th className="px-4 py-2.5 font-semibold">Price &amp; stock</th>
                <th className="px-4 py-2.5 font-semibold">MOQ</th>
                <th className="px-4 py-2.5 font-semibold">Stock</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.images?.[0] || "/images/glovx-nitrile.jpg"} alt="" className="h-9 w-9 rounded-md object-cover" />
                      <div className="min-w-0">
                        <p className="max-w-[19rem] truncate font-semibold text-slate-800">{product.name}</p>
                        <p className="text-[9.5px] text-slate-400">{product.sku} · {product.brandName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{product.categoryName}<span className="block text-[9.5px] text-slate-400">{product.subcategory}</span></td>
                  <td className="px-4 py-2.5">
                    <QuickPriceEditor
                      productId={product.id}
                      productLabel={product.name}
                      unit={product.unit}
                      initial={{ basePrice: product.basePrice, taxRate: product.taxRate, moq: product.moq, stockQuantity: product.stockQuantity }}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{product.moq} {product.unit}</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${product.stockQuantity <= product.lowStockThreshold ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{product.stockQuantity}</span>
                    <span className="block text-[9px] text-slate-400">GST {product.taxRate}%</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${product.status === "active" ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500"}`}>{product.status}</span>
                    {product.isFeatured ? <span className="ml-1 rounded bg-sky-50 px-1.5 py-0.5 text-[9px] font-bold text-sky-700">FEAT</span> : null}
                  </td>
                  <td className="px-4 py-2.5"><ProductActions id={product.id} status={product.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
