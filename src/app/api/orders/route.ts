import { NextResponse } from "next/server";
import { createOrder, type CheckoutPayload } from "@/lib/orders";
import { rateLimit, requestKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(requestKey(request, "orders"), 15);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many order attempts. Please try again later or call our sales desk." },
      { status: 429 },
    );
  }

  let payload: CheckoutPayload;
  try {
    payload = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  try {
    const result = await createOrder(payload);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[api/orders] failed", error);
    return NextResponse.json(
      { ok: false, error: "We could not place your order right now. Please retry or contact support." },
      { status: 500 },
    );
  }
}
