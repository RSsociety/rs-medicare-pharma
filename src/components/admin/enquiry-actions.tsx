"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["new", "contacted", "quoted", "converted", "closed"];

export function EnquiryActions({ id, status, notes }: { id: number; status: string; notes: string | null }) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState(status);
  const [adminNotes, setAdminNotes] = useState(notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, adminNotes }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)} className="rounded-md border border-slate-200 px-2 py-1 text-[10.5px] font-semibold text-slate-600">
        {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <input value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} placeholder="Internal note" className="w-32 rounded-md border border-slate-200 px-2 py-1 text-[10.5px]" />
      <button type="button" onClick={save} disabled={saving} className="rounded-md bg-slate-900 px-2 py-1 text-[10.5px] font-semibold text-white disabled:opacity-50">
        {saving ? "…" : saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
