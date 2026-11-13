"use client";

import { useRef, useState } from "react";

/**
 * Product image manager for the admin product form.
 * Uploads are stored in the database and served from /api/uploads/<id>,
 * so images survive rebuilds and need no server file access.
 */
export function ImageManager({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  const list = value.split("\n").map((item) => item.trim()).filter(Boolean);

  const write = (next: string[]) => onChange(next.join("\n"));

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("file", file);
      try {
        const response = await fetch("/api/admin/uploads", { method: "POST", body });
        const data = (await response.json()) as { ok: boolean; url?: string; error?: string };
        if (response.ok && data.ok && data.url) added.push(data.url);
        else setError(data.error ?? `Could not upload ${file.name}.`);
      } catch {
        setError(`Network error while uploading ${file.name}.`);
      }
    }
    if (added.length > 0) write([...list, ...added]);
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    if (!/^https?:\/\/|^\/api\/uploads\/|^\/images\//.test(url)) {
      setError("Enter a full URL (https://…) or a path starting with /images/.");
      return;
    }
    write([...list, url]);
    setUrlDraft("");
    setError(null);
  };

  const removeAt = (index: number) => write(list.filter((_, position) => position !== index));

  const makePrimary = (index: number) => {
    if (index === 0) return;
    const next = [...list];
    const [item] = next.splice(index, 1);
    write([item, ...next]);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="label !mb-0">Product images — the first image is the main image</p>
        <span className="text-[10px] font-semibold text-slate-400">{list.length} image{list.length === 1 ? "" : "s"}</span>
      </div>

      {list.length > 0 ? (
        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {list.map((image, index) => (
            <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-24 w-full object-cover" />
              {index === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-slate-900/90 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-white">
                  Main
                </span>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-slate-900/80 to-transparent p-1 opacity-0 transition group-hover:opacity-100">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => makePrimary(index)}
                    className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 hover:bg-white"
                  >
                    Make main
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold text-white hover:bg-rose-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-[10.5px] text-slate-400">
          No images yet. Upload a product photo or paste an image URL below.
        </p>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="hidden"
          onChange={(event) => upload(event.target.files)}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="btn btn-primary !py-1.5 !text-[11px] disabled:opacity-60"
        >
          {busy ? "Uploading…" : "⬆ Upload image"}
        </button>
        <input
          value={urlDraft}
          onChange={(event) => setUrlDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addUrl();
            }
          }}
          placeholder="…or paste an image URL"
          className="field !w-auto flex-1 !py-1.5 !text-[11px]"
        />
        <button type="button" onClick={addUrl} className="btn btn-ghost !py-1.5 !text-[11px]">
          Add URL
        </button>
      </div>

      {error ? (
        <p className="mt-1.5 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[10.5px] font-medium text-rose-700">{error}</p>
      ) : null}

      <p className="mt-1.5 text-[9.5px] leading-relaxed text-slate-400">
        Recommended: 1200 × 900 px, JPG or WEBP, under 300 KB. Max 4 MB. Uploaded images are saved in the database
        and stay attached to this product even after a rebuild. Existing bundled photos can still be referenced as
        <code className="mx-1 rounded bg-slate-100 px-1 text-slate-500">/images/glovx-nitrile.jpg</code>.
      </p>
    </div>
  );
}
