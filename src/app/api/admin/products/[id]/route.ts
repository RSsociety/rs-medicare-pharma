import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { buildProductValues, buildVariantRows } from "@/lib/admin-products";
import { isAdminAuthenticated } from "@/lib/auth";
import { logAdminAction } from "@/lib/orders";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) return NextResponse.json({ ok: false, error: "Invalid product id." }, { status: 400 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  // Quick inline edits from the product list: price, tax, MOQ and stock only.
  if (body.action === "quick") {
    const patch: Record<string, number> = {};
    const numericKeys = [
      { key: "basePrice", min: 0, max: 10_000_000, label: "Base price" },
      { key: "taxRate", min: 0, max: 100, label: "Tax rate" },
      { key: "moq", min: 1, max: 1_000_000, label: "MOQ" },
      { key: "stockQuantity", min: 0, max: 100_000_000, label: "Stock" },
    ] as const;

    for (const field of numericKeys) {
      if (typeof body[field.key] === "undefined") continue;
      const parsed = Number(body[field.key]);
      if (!Number.isFinite(parsed) || parsed < field.min || parsed > field.max) {
        return NextResponse.json(
          { ok: false, error: `${field.label} must be a number between ${field.min} and ${field.max}.` },
          { status: 400 },
        );
      }
      patch[field.key] = field.key === "moq" || field.key === "stockQuantity" ? Math.round(parsed) : Math.round(parsed * 100) / 100;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: false, error: "Nothing to update." }, { status: 400 });
    }

    await db.update(products).set({ ...patch, updatedAt: new Date() }).where(eq(products.id, productId));
    const [updated] = await db
      .select({ name: products.name, basePrice: products.basePrice, taxRate: products.taxRate, moq: products.moq, stockQuantity: products.stockQuantity })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);
    await logAdminAction(
      "product.quick_update",
      "product",
      String(productId),
      `${updated?.name ?? ""} · price ${updated?.basePrice} · tax ${updated?.taxRate}% · moq ${updated?.moq} · stock ${updated?.stockQuantity}`,
    );
    return NextResponse.json({ ok: true, product: updated });
  }

  if (body.action === "toggle" || body.action === "delete") {
    if (body.action === "delete") {
      await db.delete(products).where(eq(products.id, productId));
      await logAdminAction("product.deleted", "product", String(productId));
      return NextResponse.json({ ok: true });
    }
    const [existing] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!existing) return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });
    const nextStatus = existing.status === "active" ? "draft" : "active";
    await db.update(products).set({ status: nextStatus, updatedAt: new Date() }).where(eq(products.id, productId));
    await logAdminAction("product.status", "product", String(productId), nextStatus);
    return NextResponse.json({ ok: true, status: nextStatus });
  }

  const parsed = buildProductValues(body);
  if ("error" in parsed) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  const variants = buildVariantRows(body.variants);
  if ("error" in variants) return NextResponse.json({ ok: false, error: variants.error }, { status: 400 });
  try {
    await db.update(products).set(parsed.values).where(eq(products.id, productId));
    if (typeof body.variants !== "undefined") {
      await db.delete(productVariants).where(eq(productVariants.productId, productId));
      if (variants.rows.length > 0) {
        await db.insert(productVariants).values(variants.rows.map((row) => ({ ...row, productId })));
      }
    }
    await logAdminAction("product.updated", "product", String(productId), parsed.values.name);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/products] update failed", error);
    return NextResponse.json({ ok: false, error: "Could not update the product. Check SKU and slug uniqueness." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(products).where(eq(products.id, Number(id)));
  await logAdminAction("product.deleted", "product", id);
  return NextResponse.json({ ok: true });
}
