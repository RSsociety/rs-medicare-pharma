import { NextResponse } from "next/server";
import { adminEmail, adminPassword, setAdminCookie } from "@/lib/auth";
import { rateLimit, requestKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(requestKey(request, "admin-login"), 8, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (email !== adminEmail().toLowerCase() || password !== adminPassword()) {
    return NextResponse.json({ ok: false, error: "Invalid admin credentials." }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
