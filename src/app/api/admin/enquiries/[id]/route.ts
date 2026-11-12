import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { logAdminAction } from "@/lib/orders";

const STATUSES = ["new", "contacted", "quoted", "converted", "closed"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const status = String(body.status ?? "new");
  if (!STATUSES.includes(status)) return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  await db
    .update(enquiries)
    .set({ status, adminNotes: String(body.adminNotes ?? "") || null })
    .where(eq(enquiries.id, Number(id)));
  await logAdminAction("enquiry.updated", "enquiry", id, status);
  return NextResponse.json({ ok: true });
}
