import type { productVariants, products } from "@/db/schema";
import { GST_SLABS } from "@/lib/pricing";

type ProductInsert = typeof products.$inferInsert;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 170);

export type VariantInput = {
  optionType: "size" | "color";
  label: string;
  skuSuffix: string;
  priceDelta: number;
  swatch: string;
  stockQuantity: number;
  isActive: boolean;
};

export type VariantInsert = Omit<typeof productVariants.$inferInsert, "productId" | "id">;

/** Normalises the size / colour rows posted from the admin product form. */
export function buildVariantRows(input: unknown): { rows: VariantInsert[] } | { error: string } {
  const list = Array.isArray(input) ? input : [];
  if (list.length > 200) return { error: "Too many variants. Please keep it under 200 rows." };
  const rows: VariantInsert[] = [];
  const seen = new Set<string>();
  for (const raw of list) {
    const item = (raw ?? {}) as Record<string, unknown>;
    const label = String(item.label ?? "").trim().slice(0, 80);
    if (!label) continue;
    const optionType = item.optionType === "color" ? "color" : "size";
    const priceDelta = Number(item.priceDelta);
    const stock = Number(item.stockQuantity);
    const key = `${optionType}:${label.toLowerCase()}`;
    if (seen.has(key)) return { error: `Duplicate ${optionType} option: ${label}` };
    seen.add(key);
    rows.push({
      optionType,
      label,
      skuSuffix: String(item.skuSuffix ?? "").trim().slice(0, 24) || null,
      priceDelta: Number.isFinite(priceDelta) && Math.abs(priceDelta) <= 100000 ? Math.round(priceDelta * 100) / 100 : 0,
      swatch: String(item.swatch ?? "").trim().slice(0, 30) || null,
      stockQuantity: Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : 0,
      isActive: item.isActive !== false,
      sortOrder: rows.length,
    });
  }
  return { rows };
}

export function validateGstRate(rate: number): { ok: true } | { error: string } {
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    return { error: "GST rate must be between 0% and 100%." };
  }
  const standard: number[] = GST_SLABS.map((slab) => Number(slab.rate));
  const normalised = Math.round(rate * 100) / 100;
  if (!standard.some((slab) => slab === normalised)) {
    return {
      error: `GST must be one of the Indian slabs: ${standard.join("%, ")}% (you entered ${rate}%).`,
    };
  }
  return { ok: true };
}

export function buildProductValues(body: Record<string, unknown>): { values: ProductInsert } | { error: string } {
  const text = (key: string) => String(body[key] ?? "").trim();
  const num = (key: string, fallback = 0) => {
    const parsed = Number(body[key]);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const bool = (key: string) => body[key] === true || body[key] === "true" || body[key] === "on";

  const name = text("name");
  if (name.length < 3) return { error: "Product name must be at least 3 characters." };
  const sku = text("sku").toUpperCase();
  if (sku.length < 3) return { error: "SKU is required (minimum 3 characters)." };
  const basePrice = num("basePrice");
  if (basePrice < 0) return { error: "Base price cannot be negative." };
  const taxRate = num("taxRate", 12);
  if (taxRate < 0 || taxRate > 100) return { error: "Tax rate must be between 0 and 100." };
  const moq = Math.max(1, Math.round(num("moq", 1)));
  const gst = validateGstRate(taxRate);
  if (!("ok" in gst)) return { error: gst.error };

  const specifications: Record<string, string> = {};
  const rawSpecs = body.specifications;
  if (rawSpecs && typeof rawSpecs === "object" && !Array.isArray(rawSpecs)) {
    for (const [key, value] of Object.entries(rawSpecs as Record<string, unknown>)) {
      if (String(key).trim()) specifications[String(key).trim()] = String(value ?? "");
    }
  }

  const toArray = (value: unknown) => {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === "string") return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
    return [];
  };

  const values: ProductInsert = {
    name,
    sku,
    slug: text("slug") ? slugify(text("slug")) : slugify(name),
    brandId: body.brandId ? Number(body.brandId) : null,
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    subcategory: text("subcategory") || null,
    shortDescription: text("shortDescription") || null,
    description: text("description") || null,
    specifications,
    applications: toArray(body.applications),
    images: toArray(body.images),
    packSize: text("packSize") || null,
    unit: text("unit") || "unit",
    weight: text("weight") || null,
    weightKg: Math.max(0, Number(body.weightKg) || 0),
    basePrice,
    taxRate,
    freightRule: text("freightRule") || "Freight charged separately",
    moq,
    stockQuantity: Math.max(0, Math.round(num("stockQuantity"))),
    lowStockThreshold: Math.max(0, Math.round(num("lowStockThreshold", 500))),
    status: text("status") === "draft" ? "draft" : "active",
    isFeatured: bool("isFeatured"),
    isBestSeller: bool("isBestSeller"),
    isNewArrival: bool("isNewArrival"),
    seoTitle: text("seoTitle") || `${name} | RS Medicare Pharma`,
    seoDescription: text("seoDescription") || text("shortDescription") || null,
    seoKeywords: text("seoKeywords") || null,
    updatedAt: new Date(),
  };

  return { values };
}
