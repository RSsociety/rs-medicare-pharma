"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageManager } from "@/components/admin/image-manager";
import type { Brand, Category } from "@/db/schema";
import type { ProductWithMeta } from "@/lib/queries";

export function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: ProductWithMeta | null;
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    slug: product?.slug ?? "",
    brandId: product?.brandId ? String(product.brandId) : "",
    categoryId: product?.categoryId ? String(product.categoryId) : "",
    subcategory: product?.subcategory ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    specifications: Object.entries(product?.specifications ?? {}).map(([key, value]) => `${key}: ${value}`).join("\n"),
    applications: (product?.applications ?? []).join(", "),
    images: (product?.images ?? []).join("\n"),
    packSize: product?.packSize ?? "",
    unit: product?.unit ?? "pc",
    weight: product?.weight ?? "",
    weightKg: product ? String(product.weightKg ?? 0) : "0",
    basePrice: product ? String(product.basePrice) : "",
    taxRate: product ? String(product.taxRate) : "12",
    freightRule: product?.freightRule ?? "Freight charged separately",
    moq: product ? String(product.moq) : "1",
    stockQuantity: product ? String(product.stockQuantity) : "0",
    lowStockThreshold: product ? String(product.lowStockThreshold) : "500",
    status: product?.status ?? "active",
    isFeatured: product?.isFeatured ?? false,
    isBestSeller: product?.isBestSeller ?? false,
    isNewArrival: product?.isNewArrival ?? false,
    seoTitle: product?.seoTitle ?? "",
    seoDescription: product?.seoDescription ?? "",
    seoKeywords: product?.seoKeywords ?? "",
  });

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = event.target as HTMLInputElement;
    setForm((current) => ({ ...current, [key]: target.type === "checkbox" ? target.checked : target.value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const specifications: Record<string, string> = {};
    form.specifications.split("\n").forEach((line) => {
      const [key, ...rest] = line.split(":");
      if (key?.trim() && rest.length > 0) specifications[key.trim()] = rest.join(":").trim();
    });
    const payload = {
      ...form,
      specifications,
      applications: form.applications,
      images: form.images,
      brandId: form.brandId ? Number(form.brandId) : null,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    };
    try {
      const response = await fetch(
        product ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Could not save the product.");
        setSaving(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error. Please retry.");
      setSaving(false);
    }
  };

  const input = (key: keyof typeof form) => ({ value: String(form[key]), onChange: update(key) });

  return (
    <form onSubmit={submit} className="space-y-4">
      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-[11.5px] font-medium text-rose-700">{error}</p> : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-[12.5px] font-bold text-slate-900">Core details</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="p-name">Product name *</label>
            <input id="p-name" required className="field" {...input("name")} />
          </div>
          <div>
            <label className="label" htmlFor="p-sku">SKU *</label>
            <input id="p-sku" required className="field uppercase" {...input("sku")} />
          </div>
          <div>
            <label className="label" htmlFor="p-slug">URL slug</label>
            <input id="p-slug" className="field" placeholder="auto-generated from name" {...input("slug")} />
          </div>
          <div>
            <label className="label" htmlFor="p-brand">Brand</label>
            <select id="p-brand" className="field" {...input("brandId")}>
              <option value="">—</option>
              {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="p-category">Category</label>
            <select id="p-category" className="field" {...input("categoryId")}>
              <option value="">—</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.parentId ? "— " : ""}{category.name} ({category.group})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="p-subcategory">Subcategory label</label>
            <input id="p-subcategory" className="field" {...input("subcategory")} />
          </div>
          <div>
            <label className="label" htmlFor="p-status">Status</label>
            <select id="p-status" className="field" {...input("status")}>
              <option value="active">Active</option>
              <option value="draft">Draft / inactive</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="p-short">Short description</label>
            <textarea id="p-short" rows={2} className="field resize-none" {...input("shortDescription")} />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="p-desc">Detailed description</label>
            <textarea id="p-desc" rows={5} className="field" {...input("description")} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-[12.5px] font-bold text-slate-900">Pricing, tax & stock</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="p-price">Base price (₹) *</label>
            <input id="p-price" type="number" step="0.01" min="0" required className="field" {...input("basePrice")} />
          </div>
          <div>
            <label className="label" htmlFor="p-tax">Tax rate (%)</label>
            <input id="p-tax" type="number" step="0.01" min="0" max="100" className="field" {...input("taxRate")} />
          </div>
          <div>
            <label className="label" htmlFor="p-moq">MOQ</label>
            <input id="p-moq" type="number" min="1" className="field" {...input("moq")} />
          </div>
          <div>
            <label className="label" htmlFor="p-stock">Stock quantity</label>
            <input id="p-stock" type="number" min="0" className="field" {...input("stockQuantity")} />
          </div>
          <div>
            <label className="label" htmlFor="p-low">Low stock threshold</label>
            <input id="p-low" type="number" min="0" className="field" {...input("lowStockThreshold")} />
          </div>
          <div>
            <label className="label" htmlFor="p-unit">Unit</label>
            <input id="p-unit" className="field" {...input("unit")} />
          </div>
          <div>
            <label className="label" htmlFor="p-pack">Pack size</label>
            <input id="p-pack" className="field" {...input("packSize")} />
          </div>
          <div>
            <label className="label" htmlFor="p-weight">Unit weight (display)</label>
            <input id="p-weight" className="field" placeholder="e.g. 3 g" {...input("weight")} />
          </div>
          <div>
            <label className="label" htmlFor="p-weightkg">Weight per unit (kg)</label>
            <input id="p-weightkg" type="number" step="0.0001" min="0" className="field" {...input("weightKg")} />
          </div>
          <div>
            <label className="label" htmlFor="p-freight">Freight rule</label>
            <input id="p-freight" className="field" {...input("freightRule")} />
          </div>
          <p className="sm:col-span-3 text-[10px] text-slate-400">
            Weight per unit drives the consignment weight used in the manual freight worksheet. Enter the real
            shipping weight of one sellable unit (e.g. a 100-glove box ≈ 0.5 kg).
          </p>
        </div>
        <p className="mt-2 text-[10px] text-slate-400">
          Base price is always centralised. Freight must never be added into the product price — it is confirmed per order.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-[12.5px] font-bold text-slate-900">Specifications, applications & images</h2>
        <div className="mt-3 grid gap-3">
          <div>
            <label className="label" htmlFor="p-specs">Specifications (one per line — <code>Key: Value</code>)</label>
            <textarea id="p-specs" rows={6} className="field font-mono !text-[11.5px]" placeholder={"Material: Nitrile\nWeight: 3 gram\nPacking: 100 gloves per box"} {...input("specifications")} />
          </div>
          <div>
            <label className="label" htmlFor="p-apps">Applications (comma separated)</label>
            <input id="p-apps" className="field" {...input("applications")} />
          </div>
          <ImageManager
            value={form.images}
            onChange={(next) => setForm((current) => ({ ...current, images: next }))}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-[12.5px] font-bold text-slate-900">Merchandising & SEO</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-[11.5px] text-slate-600">
          {([
            ["isFeatured", "Featured on homepage"],
            ["isBestSeller", "Best seller badge"],
            ["isNewArrival", "New arrival badge"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.checked }))}
                className="accent-brand-600"
              />
              {label}
            </label>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="p-seotitle">SEO title</label>
            <input id="p-seotitle" className="field" {...input("seoTitle")} />
          </div>
          <div>
            <label className="label" htmlFor="p-seokeywords">SEO keywords</label>
            <input id="p-seokeywords" className="field" {...input("seoKeywords")} />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="p-seodesc">SEO description</label>
            <textarea id="p-seodesc" rows={2} className="field resize-none" {...input("seoDescription")} />
          </div>
        </div>
      </section>

      <div className="sticky bottom-3 flex flex-wrap items-center justify-end gap-2 rounded-xl border border-slate-200 bg-white/95 p-3 backdrop-blur">
        <button type="button" onClick={() => router.push("/admin/products")} className="btn btn-ghost !py-2 !text-[12px]">Cancel</button>
        <button type="submit" disabled={saving} className="btn btn-primary !py-2 !text-[12px] disabled:opacity-60">
          {saving ? "Saving…" : product ? "Update product" : "Create product"}
        </button>
      </div>
    </form>
  );
}
