"use client";

import { useState } from "react";
import { GST_SLABS, inr, round2, splitTax } from "@/lib/pricing";

/**
 * Dedicated GST section for the admin product form.
 * Indian slabs only (0 / 5 / 12 / 18 / 28) with a live CGST+SGST / IGST preview.
 */
export function GstField({
  value,
  onChange,
}: {
  value: number;
  onChange: (rate: number) => void;
}) {
  const [custom, setCustom] = useState(false);
  const isStandard = GST_SLABS.some((slab) => slab.rate === value);
  const sample = 1000;
  const taxAmount = round2((sample * value) / 100);
  const intra = splitTax(taxAmount, value, false);
  const inter = splitTax(taxAmount, value, true);

  return (
    <div>
      <p className="label">GST rate for this product</p>
      <p className="mt-[-2px] text-[10px] text-slate-400">
        Each product can carry its own slab. In India, medicines are commonly 5% or 12%, consumables 12% or 18%.
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {GST_SLABS.map((slab) => (
          <button
            key={slab.rate}
            type="button"
            onClick={() => {
              onChange(slab.rate);
              setCustom(false);
            }}
            className={`rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${
              !custom && value === slab.rate
                ? "border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-300"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {slab.rate}%
            <span className="ml-1 text-[9px] font-medium opacity-60">{slab.rate === 0 ? "Nil" : ""}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCustom(true)}
          className={`rounded-lg border px-3 py-2 text-[11px] font-semibold transition ${
            custom || !isStandard
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          Custom
        </button>
      </div>

      {custom || !isStandard ? (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="field !w-28 !py-1.5 !text-[12px]"
            aria-label="Custom GST rate"
          />
          <span className="text-[11px] font-semibold text-slate-500">% GST</span>
          <span className="text-[9.5px] text-slate-400">Must be one of: 0, 5, 12, 18, 28</span>
        </div>
      ) : null}

      <div className="mt-3 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">On {inr(sample)} of value</p>
          <p className="mt-0.5 font-display text-[13px] font-bold text-slate-900">Tax {inr(taxAmount)}</p>
          <p className="text-[9px] text-slate-400">at {value}% GST</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Intra-state (same state)</p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-700">
            CGST {inr(intra.cgst)} + SGST {inr(intra.sgst)}
          </p>
          <p className="text-[9px] text-slate-400">each {value / 2}%</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Inter-state (other state)</p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-700">IGST {inr(inter.igst)}</p>
          <p className="text-[9px] text-slate-400">full {value}%</p>
        </div>
      </div>

      <p className="mt-2 text-[9.5px] leading-relaxed text-slate-400">
        The invoice splits tax automatically: CGST + SGST when the delivery state matches the company state, IGST otherwise.
        Confirm slab mapping with your GST advisor before filing.
      </p>
    </div>
  );
}
