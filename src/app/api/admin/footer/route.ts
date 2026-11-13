import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { logAdminAction } from "@/lib/orders";
import { saveFooterConfig } from "@/lib/settings";

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  try {
    // saveFooterConfig validates and sanitises every field before it reaches the database.
    const saved = await saveFooterConfig(body);
    const linkCount = saved.columns.reduce((sum, column) => sum + column.links.length, 0);
    await logAdminAction(
      "footer.updated",
      "settings",
      "footerConfig",
      `${saved.columns.length} columns · ${linkCount} links · ${Object.values(saved.socials).filter(Boolean).length} socials`,
    );
    return NextResponse.json({ ok: true, footer: saved });
  } catch (error) {
    console.error("[admin/footer] update failed", error);
    return NextResponse.json({ ok: false, error: "Could not save the footer settings." }, { status: 500 });
  }
}
