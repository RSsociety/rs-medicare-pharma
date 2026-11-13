import { NextResponse } from "next/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { isValidEmail, isValidMobile, normaliseMobile } from "@/lib/pricing";
import { rateLimit, requestKey } from "@/lib/rate-limit";

const TYPES = ["bulk", "dealer", "institutional", "business", "contact", "product", "distributor"];

export async function POST(request: Request) {
  const limit = rateLimit(requestKey(request, "enquiries"), 20);
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const text = (key: string) => String(body[key] ?? "").trim();
  const name = text("name");
  const mobile = normaliseMobile(text("mobile"));
  const email = text("email");
  const type = TYPES.includes(text("type")) ? text("type") : "contact";

  if (name.length < 2) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  if (!isValidMobile(mobile)) return NextResponse.json({ ok: false, error: "Enter a valid 10-digit mobile number." }, { status: 400 });
  if (email && !isValidEmail(email)) return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });

  try {
    const [created] = await db
      .insert(enquiries)
      .values({
        type,
        name,
        company: text("company") || null,
        mobile,
        email: email || null,
        gstin: text("gstin") || null,
        productName: text("productName") || null,
        quantity: text("quantity") || null,
        deliveryLocation: text("deliveryLocation") || null,
        message: text("message") || null,
      })
      .returning({ id: enquiries.id });
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[api/enquiries] failed", error);
    return NextResponse.json({ ok: false, error: "Could not submit your enquiry. Please retry." }, { status: 500 });
  }
}
