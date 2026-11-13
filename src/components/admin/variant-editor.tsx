"use client";

import { useState } from "react";

export type VariantRow = {
  optionType: "size" | "color";
  label: string;
  skuSuffix: string;
  priceDelta: number;
  swatch: string;
  stockQuantity: number;
  isActive: boolean;
};

const COLOUR_SWATCHES = [
  { label: "Blue", value: "#2563eb" },
  { label: "Sky", value: "#38bdf8" },
  { label: "Green", value: "#22c55e" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Black", value: "#111827" },
  { label: "White", value: "#f8fafc" },
  { label: "Grey", value: "#6b7280" },
  { label: "Beige", value: "#d6c3a5" },
];

/** Size / colour option editor used in the admin product form. */
export function VariantEditor({
  value,
  onChange,
  unit,
}: {
  value: VariantRow[];
  onChange: (rows: VariantRow[]) => void;
  unit: string;
}) {
  const [tab, setTab] = useState<"size" | "color">("size");
  const rows = value.filter((row) => row.optionType === tab);

  const addRow = (optionType: "size" | "color") => {
    const next: VariantRow = {
      optionType,
      label: "",
      skuSuffix: "",
      priceDelta: 0,
      swatch: optionType === "color" ? "#2563eb" : "",
      stockQuantity: 0,
      isActive: true,
    };
    onChange([...value, next]);
  };

  const patchRow = (index: number, patch: Partial<VariantRow>) =>
    onChange(value.map((row, position) => (position === index ? { ...row, ...patch } : row)));

  const removeRow = (index: number) => onChange(value.filter((_, position) => position !== index));

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="label !mb-0">Size &amp; colour options</p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            Customers choose these on the product page before adding to cart.
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {(["size", "color"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTab(option)}
              className={`rounded-md px-2.5 py-1.5 text-[10.5px] font-semibold transition ${
                tab === option ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-500 hover:text-slate-800"
              }`}
            >
              {option === "size" ? "Sizes" : "Colours"}
              <span className="ml-1 opacity-60">({value.filter((row) => row.optionType === option).length})</span>
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-[10.5px] text-slate-400">
          No {tab === "size" ? "sizes" : "colours"} defined yet. Add one below, or use the quick button for S / M / L / XL.
        </p>
      ) : (
        <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
          <div className="grid grid-cols-[1.3fr_0.9fr_0.8fr_1.1fr_auto] gap-2 bg-slate-50 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
            <span>Label</span>
            <span>Price change</span>
            <span>Stock</span>
            <span>{tab === "size" ? "SKU suffix" : "Colour"}</span>
            <span />
          </div>
          {rows.map((row, rowIndex) => {
            const index = value.indexOf(row);
            return (
              <div
                key={`${row.optionType}-${rowIndex}`}
                className="grid grid-cols-[1.3fr_0.9fr_0.8fr_1.1fr_auto] items-center gap-2 border-t border-slate-100 px-2.5 py-1.5"
              >
                <input
                  value={row.label}
                  onChange={(event) => patchRow(index, { label: event.target.value })}
                  placeholder={tab === "size" ? "e.g. L" : "e.g. Blue"}
                  className="field !py-1 !text-[11px]"
                />
                <input
                  type="number"
                  step="0.01"
                  value={row.priceDelta === 0 ? "" : row.priceDelta}
                  placeholder="0"
                  onChange={(event) => patchRow(index, { priceDelta: Number(event.target.value) || 0 })}
                  className="field !py-1 !text-[11px]"
                  aria-label="Price change"
                />
                <input
                  type="number"
                  min="0"
                  value={row.stockQuantity}
                  onChange={(event) => patchRow(index, { stockQuantity: Math.max(0, Math.round(Number(event.target.value) || 0)) })}
                  className="field !py-1 !text-[11px]"
                  aria-label="Stock"
                />
                {tab === "size" ? (
                  <input
                    value={row.skuSuffix}
                    onChange={(event) => patchRow(index, { skuSuffix: event.target.value })}
                    placeholder="-L"
                    className="field !py-1 !text-[11px] font-mono"
                  />
                ) : (
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={row.swatch || "#2563eb"}
                      onChange={(event) => patchRow(index, { swatch: event.target.value })}
                      className="h-7 w-8 cursor-pointer rounded border border-slate-200"
                      aria-label="Colour swatch"
                    />
                    <select
                      value={row.swatch}
                      onChange={(event) => patchRow(index, { swatch: event.target.value })}
                      className="field !py-1 !text-[10px]"
                      aria-label="Colour preset"
                    >
                      {COLOUR_SWATCHES.map((swatch) => (
                        <option key={swatch.value} value={swatch.value}>{swatch.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="rounded border border-slate-200 px-1.5 py-1 text-[10px] text-rose-600 hover:bg-rose-50"
                  aria-label="Remove option"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => addRow(tab)} className="btn btn-ghost !py-1.5 !text-[10.5px]">
          + Add {tab === "size" ? "size" : "colour"}
        </button>
        {tab === "size" && rows.length === 0 ? (
          <button
            type="button"
            onClick={() =>
              onChange([
                ...value,
                ...["S", "M", "L", "XL"].map((label) => ({
                  optionType: "size" as const,
                  label,
                  skuSuffix: `-${label}`,
                  priceDelta: 0,
                  swatch: "",
                  stockQuantity: 0,
                  isActive: true,
                })),
              ])
            }
            className="btn btn-ghost !py-1.5 !text-[10.5px]"
          >
            ⚡ Add standard S / M / L / XL
          </button>
        ) : null}
      </div>

      <p className="mt-1.5 text-[9.5px] leading-relaxed text-slate-400">
        &ldquo;Price change&rdquo; adjusts the base price for that option only (e.g. +0.15 for a special colour). Leave 0 when
        all options share one price. Stock is tracked per option. Selling unit: {unit}.
      </p>
    </div>
  );
}
