"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async (body: Record<string, unknown>, method: "PATCH" | "DELETE" = "PATCH") => {
    setBusy(true);
    await fetch(`/api/admin/products/${id}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link href={`/admin/products/${id}`} className="rounded-md border border-slate-200 px-2 py-1 text-[10.5px] font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-700">Edit</Link>
      <button type="button" disabled={busy} onClick={() => run({ action: "toggle" })} className="rounded-md border border-slate-200 px-2 py-1 text-[10.5px] font-semibold text-slate-600 hover:border-amber-300 hover:text-amber-700 disabled:opacity-50">
        {status === "active" ? "Deactivate" : "Activate"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => { if (window.confirm("Delete this product permanently?")) run({ action: "delete" }); }}
        className="rounded-md border border-slate-200 px-2 py-1 text-[10.5px] font-semibold text-slate-500 hover:border-rose-300 hover:text-rose-600 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
