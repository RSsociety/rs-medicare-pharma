"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Fields = { basePrice: number; taxRate: number; moq: number; stockQuantity: number };

/**
 * Inline price / tax / MOQ / stock editing straight from the admin product list.
 * Saves with a partial update — no need to open the full product form.
 */
export function QuickPriceEditor({
  productId,
  productLabel,
  initial,
  unit,
}: {
  productId: number;
  productLabel: string;
  initial: Fields;
  unit: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Fields>(initial);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => setValues(initial), [initial]);

  const dirty =
    values.basePrice !== initial.basePrice ||
    values.taxRate !== initial.taxRate ||
    values.moq !== initial.moq ||
    values.stockQuantity !== initial.stockQuantity;

  const save = async () => {
    setState("saving");
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "quick", ...values }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? "Could not save.");
        return;
      }
      setState("saved");
      setOpen(false);
      router.refresh();
      window.setTimeout(() => setState("idle"), 2200);
    } catch {
      setState("error");
      setMessage("Network error. Please retry.");
    }
  };

  const number = (key: keyof Fields, label: string, step = "0.01") => (
    <label className="block">
      <span className="block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</span>
      <input
        type="number"
        step={step}
        min={key === "moq" ? 1 : 0}
        value={Number.isFinite(values[key]) ? values[key] : ""}
        onChange={(event) => setValues((current) => ({ ...current, [key]: Number(event.target.value) }))}
        className="field !py-1.5 !text-[12px]"
      />
    </label>
  );

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="text-right">
        <p className="text-[11.5px] font-semibold text-slate-800">
          ₹{values.basePrice}
          <span className="ml-1 text-[9px] font-medium text-slate-400">/ {unit}</span>
        </p>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-brand-700 hover:text-brand-800"
        >
          {open ? "close" : state === "saved" ? "✓ updated" : "edit price"}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" aria-label={`Edit pricing for ${productLabel}`}>
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900">Quick price &amp; stock update</h3>
                <p className="mt-0.5 text-[10.5px] text-slate-500">{productLabel}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-md px-2 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {number("basePrice", "Base price (₹)")}
              {number("taxRate", "GST rate (%)")}
              {number("moq", "MOQ", "1")}
              {number("stockQuantity", "Stock quantity", "1")}
            </div>

            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-800">
              Base price is centralised and applies to every market. Do <span className="font-bold">not</span> add
              freight into this field — freight is confirmed per order on the freight worksheet.
            </p>

            {message ? <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[10.5px] font-medium text-rose-700">{message}</p> : null}

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => { setValues(initial); setOpen(false); }} className="btn btn-ghost !py-1.5 !text-[11px]">
                Cancel
              </button>
              <button type="button" onClick={save} disabled={!dirty || state === "saving"} className="btn btn-primary !py-1.5 !text-[11px] disabled:opacity-50">
                {state === "saving" ? "Saving…" : dirty ? "Save change" : "No changes"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
