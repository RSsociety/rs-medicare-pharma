import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { logAdminAction } from "@/lib/orders";
import { updateSettings } from "@/lib/settings";
import { defaultSettings } from "@/db/seed-data";

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (!(key in defaultSettings)) continue;
    const fallback = defaultSettings[key];
    if (typeof fallback === "number") {
      const parsed = Number(value);
      updates[key] = Number.isFinite(parsed) ? parsed : fallback;
    } else if (typeof fallback === "boolean") {
      updates[key] = value === true || value === "true" || value === "on";
    } else {
      updates[key] = String(value ?? "");
    }
  }
  await updateSettings(updates);
  await logAdminAction("settings.updated", "settings", undefined, Object.keys(updates).join(", "));
  return NextResponse.json({ ok: true });
}
