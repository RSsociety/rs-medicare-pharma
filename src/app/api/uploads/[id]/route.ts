import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { uploads } from "@/db/schema";

export const runtime = "nodejs";

/** Public image delivery for admin-uploaded product images. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uploadId = Number(id);
  if (!Number.isFinite(uploadId)) {
    return NextResponse.json({ ok: false, error: "Invalid image id." }, { status: 400 });
  }

  const [file] = await db
    .select()
    .from(uploads)
    .where(eq(uploads.id, uploadId))
    .limit(1);

  if (!file) {
    return NextResponse.json({ ok: false, error: "Image not found." }, { status: 404 });
  }

  return new Response(Buffer.from(file.data, "base64"), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.byteSize),
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${file.id}-${file.byteSize}"`,
    },
  });
}
