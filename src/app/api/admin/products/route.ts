import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { buildProductValues } from "@/lib/admin-products";
import { isAdminAuthenticated } from "@/lib/auth";
import { logAdminAction } from "@/lib/orders";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const parsed = buildProductValues(body);
  if ("error" in parsed) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  try {
    const [created] = await db.insert(products).values(parsed.values).returning({ id: products.id });
    await logAdminAction("product.created", "product", String(created.id), parsed.values.name);
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[admin/products] create failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not create the product. Check that SKU and slug are unique." },
      { status: 400 },
    );
  }
}
