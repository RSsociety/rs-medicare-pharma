import { sql } from "drizzle-orm";
import { db } from "@/db";
import { brands, categories, faqs, products, productVariants, settings } from "@/db/schema";
import {
  defaultSettings,
  GST_BY_SKU,
  PACK_WEIGHT_KG,
  seedBrands,
  seedCategories,
  seedFaqs,
  seedProducts,
  seedVariants,
} from "@/db/seed-data";

let seedPromise: Promise<void> | null = null;

/** Order number sequence used for RSM-YYYY-###### IDs. */
async function ensureSequence() {
  await db.execute(sql`CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1`).catch(() => undefined);
}

async function seedCatalogue() {
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
  const categoryBySlug = new Map(categoryRows.map((category) => [category.slug, category.id]));

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
        taxRate: GST_BY_SKU[product.sku] ?? product.taxRate,
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
}

/** Backfills size / colour options. Runs once — guarded so it never duplicates. */
async function ensureVariants() {
  const existing = await db.select({ id: productVariants.id }).from(productVariants).limit(1);
  if (existing.length > 0) return;

  const productRows = await db.select().from(products);
  const productBySku = new Map(productRows.map((row) => [row.sku, row.id]));

  for (const variant of seedVariants) {
    const parentId = productBySku.get(variant.sku);
    if (!parentId) continue;
    await db
      .insert(productVariants)
      .values({
        productId: parentId,
        optionType: variant.optionType,
        label: variant.label,
        skuSuffix: variant.skuSuffix ?? null,
        priceDelta: variant.priceDelta ?? 0,
        swatch: variant.swatch ?? null,
        stockQuantity: variant.stockQuantity,
        sortOrder: seedVariants.indexOf(variant),
      })
      .onConflictDoNothing();
  }
}

async function runSeed() {
  try {
    await ensureSequence();

    const existingProducts = await db.select({ id: products.id }).from(products).limit(1);
    if (existingProducts.length === 0) {
      await seedCatalogue();
    }

    // These are safe to run against a database that already has catalogue data.
    await ensureVariants();
    for (const [key, value] of Object.entries(defaultSettings)) {
      await db.insert(settings).values({ key, value }).onConflictDoNothing();
    }
  } catch (error) {
    console.error("[seed] failed", error);
    seedPromise = null;
  }
}

/**
 * Idempotent bootstrap. Safe to call on every request — it only fills what is
 * missing (catalogue, size/colour variants, settings keys).
 */
export function ensureSeeded() {
  if (!seedPromise) seedPromise = runSeed();
  return seedPromise;
}
