import { NextResponse } from "next/server";
import { db } from "@/db";
import { uploads } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/auth";
import { logAdminAction } from "@/lib/orders";

export const runtime = "nodejs";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Upload must be sent as form-data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No image file received." }, { status: 400 });
  }
  if (!ALLOWED[file.type]) {
    return NextResponse.json(
      { ok: false, error: "Only JPG, PNG, WEBP, AVIF or GIF images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Image is too large. Please upload a file under 4 MB (ideally ~1200×900, under 300 KB)." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const [created] = await db
    .insert(uploads)
    .values({
      filename: file.name.slice(0, 240) || `image.${ALLOWED[file.type]}`,
      contentType: file.type,
      byteSize: buffer.length,
      data: buffer.toString("base64"),
    })
    .returning({ id: uploads.id });

  await logAdminAction("upload.created", "upload", String(created.id), `${file.name} (${Math.round(buffer.length / 1024)} KB)`);

  return NextResponse.json({
    ok: true,
    id: created.id,
    url: `/api/uploads/${created.id}`,
    byteSize: buffer.length,
  });
}
