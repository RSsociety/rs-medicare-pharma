import type { products } from "@/db/schema";

type ProductInsert = typeof products.$inferInsert;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 170);

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
