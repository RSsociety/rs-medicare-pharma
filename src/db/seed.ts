import { sql } from "drizzle-orm";
import { db } from "@/db";
import { brands, categories, faqs, products, settings } from "@/db/schema";
import {
  defaultSettings,
  PACK_WEIGHT_KG,
  seedBrands,
  seedCategories,
  seedFaqs,
  seedProducts,
} from "@/db/seed-data";

let seedPromise: Promise<void> | null = null;

async function runSeed() {
  await db.execute(
    sql`CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1`,
  ).catch(() => undefined);

  const existing = await db.select({ id: products.id }).from(products).limit(1);
  if (existing.length > 0) return;

  for (const brand of seedBrands) {
    await db.insert(brands).values(brand).onConflictDoNothing();
  }

  const roots = seedCategories.filter((category) => !category.parentSlug);
  const children = seedCategories.filter((category) => category.parentSlug);

  for (const category of roots) {
    await db
      .insert(categories)
      .values({
        slug: category.slug,
        name: category.name,
        group: category.group,
        description: category.description,
        tagline: category.tagline,
        image: category.image,
        sortOrder: category.sortOrder,
      })
      .onConflictDoNothing();
  }

  const inserted = await db.select().from(categories);
  const bySlug = new Map(inserted.map((category) => [category.slug, category.id]));

  for (const category of children) {
    await db
      .insert(categories)
      .values({
        slug: category.slug,
        name: category.name,
        group: category.group,
        parentId: bySlug.get(category.parentSlug ?? "") ?? null,
        description: category.description,
        tagline: category.tagline,
        image: category.image,
        sortOrder: category.sortOrder,
      })
      .onConflictDoNothing();
  }

  const brandRows = await db.select().from(brands);
  const brandBySlug = new Map(brandRows.map((brand) => [brand.slug, brand.id]));
  const categoryRows = await db.select().from(categories);
  const categoryBySlug = new Map(
    categoryRows.map((category) => [category.slug, category.id]),
  );

  for (const product of seedProducts) {
    await db
      .insert(products)
      .values({
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        brandId: brandBySlug.get(product.brandSlug) ?? null,
        categoryId: categoryBySlug.get(product.categorySlug) ?? null,
        subcategory: product.subcategory,
        shortDescription: product.shortDescription,
        description: product.description,
        specifications: product.specifications,
        applications: product.applications,
        images: product.images,
        packSize: product.packSize,
        unit: product.unit,
        weight: product.weight,
        weightKg: PACK_WEIGHT_KG[product.sku] ?? 0,
        basePrice: product.basePrice,
        taxRate: product.taxRate,
        moq: product.moq,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold ?? 500,
        isFeatured: product.isFeatured ?? false,
        isBestSeller: product.isBestSeller ?? false,
        isNewArrival: product.isNewArrival ?? false,
        seoTitle: `${product.name} | RS Medicare Pharma`,
        seoDescription: product.shortDescription,
        seoKeywords: `${product.name}, ${product.subcategory}, medical supplier, B2B pharma`,
      })
      .onConflictDoNothing();
  }

  for (const faq of seedFaqs) {
    await db.insert(faqs).values(faq).onConflictDoNothing();
  }

  for (const [key, value] of Object.entries(defaultSettings)) {
    await db.insert(settings).values({ key, value }).onConflictDoNothing();
  }
}

/** Idempotent demo/initial catalogue bootstrap. Safe to call on every request. */
export function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      console.error("[seed] failed", error);
    });
  }
  return seedPromise;
}
