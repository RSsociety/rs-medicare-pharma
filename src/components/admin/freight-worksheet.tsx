"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FREIGHT_COMPONENTS,
  EMPTY_FREIGHT_BREAKDOWN,
  inr,
  round2,
  sumFreight,
  weightDisplay,
  type FreightBreakdown,
} from "@/lib/pricing";
import { SHIPMENT_MODES } from "@/lib/site";

type Props = {
  orderId: number;
  freight: number | null;
  shipmentMode: string;
  estimatedWeightKg: number | null;
  billableWeightKg: number | null;
  freightBreakdown: Record<string, string | number>;
  shippingAddress: Record<string, string>;
  subtotal: number;
  taxTotal: number;
  units: number;
};

export function FreightWorksheet({
  orderId,
  freight,
  shipmentMode,
  estimatedWeightKg,
  billableWeightKg,
  freightBreakdown,
  shippingAddress,
  subtotal,
  taxTotal,
  units,
}: Props) {
  const router = useRouter();
  const initial = useMemo<FreightBreakdown>(() => {
    const next = { ...EMPTY_FREIGHT_BREAKDOWN };
    FREIGHT_COMPONENTS.forEach((component) => {
      const parsed = Number(freightBreakdown?.[component.key]);
      if (Number.isFinite(parsed) && parsed > 0) next[component.key] = round2(parsed);
    });
    return next;
  }, [freightBreakdown]);

  const [components, setComponents] = useState<FreightBreakdown>(initial);
  const [mode, setMode] = useState(shipmentMode);
  const [weight, setWeight] = useState(billableWeightKg === null ? "" : String(billableWeightKg));
  const [notes, setNotes] = useState(
    typeof freightBreakdown?.notes === "string" ? freightBreakdown.notes : "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const calculated = sumFreight(components);
  const weightValue = Number(weight);
  const effectiveWeight = Number.isFinite(weightValue) && weightValue > 0 ? weightValue : estimatedWeightKg ?? 0;
  const perKg = effectiveWeight > 0 ? round2(calculated / effectiveWeight) : null;
  const perUnit = units > 0 ? round2(calculated / units) : null;
  const newTotal = round2(subtotal + taxTotal + calculated);
  const uplift = calculated > 0 ? round2((calculated / Math.max(subtotal + taxTotal, 1)) * 100) : 0;

  const setComponent = (key: keyof FreightBreakdown, value: string) => {
    const parsed = Number(value);
    setComponents((current) => ({
      ...current,
      [key]: Number.isFinite(parsed) && parsed > 0 ? round2(parsed) : 0,
    }));
  };

  const apply = async (nextStatus: string) => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freight: calculated,
          freightBreakdown: { ...components, notes },
          shipmentMode: mode,
          billableWeightKg: weight === "" ? null : weightValue,
          status: nextStatus,
          paymentStatus: nextStatus === "Freight Under Review" ? "pending" : undefined,
        }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Could not save the freight calculation.");
      } else {
        setMessage(
          nextStatus === "Freight Under Review"
            ? "Saved as a draft. Order remains at Freight Under Review."
            : `Freight confirmed at ${inr(calculated)}. Order moved to ${nextStatus}.`,
        );
        router.refresh();
      }
    } catch {
      setError("Network error. Please retry.");
    }
    setSaving(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-bold text-slate-900">Freight worksheet (manual)</h2>
          <p className="mt-0.5 text-[10.5px] text-slate-400">
            Calculate freight from delivery location, consignment weight, shipment mode and transporter charges.
          </p>
        </div>
        <span className={`chip ring-1 ring-inset ${freight === null ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}`}>
          {freight === null ? "Under review" : inr(freight)}
        </span>
      </div>

      <div className="mt-3 grid gap-2 rounded-lg bg-slate-50 p-3 text-[10.5px] sm:grid-cols-2">
        <p><span className="font-semibold text-slate-700">Destination:</span> {shippingAddress.city ?? "—"}, {shippingAddress.state ?? "—"} {shippingAddress.pincode ?? ""}</p>
        <p><span className="font-semibold text-slate-700">Product weight:</span> {weightDisplay(estimatedWeightKg)}</p>
        <p><span className="font-semibold text-slate-700">Total units:</span> {units.toLocaleString("en-IN")}</p>
        <p><span className="font-semibold text-slate-700">Order value (incl. GST):</span> {inr(round2(subtotal + taxTotal))}</p>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fw-mode">Shipment mode</label>
          <select id="fw-mode" className="field" value={mode} onChange={(event) => setMode(event.target.value)}>
            {SHIPMENT_MODES.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="fw-weight">Billable weight (kg)</label>
          <input
            id="fw-weight"
            type="number"
            min="0"
            step="0.01"
            className="field"
            placeholder={estimatedWeightKg ? String(estimatedWeightKg) : "enter chargeable weight"}
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
          />
        </div>
      </div>

      <div className="mt-3">
        <p className="label">Freight components (₹)</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {FREIGHT_COMPONENTS.map((component) => (
            <label key={component.key} className="block">
              <span className="block text-[10px] font-semibold text-slate-500" title={component.hint}>{component.label}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                className="field !py-1.5 !text-[12px]"
                value={components[component.key] === 0 ? "" : String(components[component.key])}
                placeholder="0"
                onChange={(event) => setComponent(component.key, event.target.value)}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <label className="label" htmlFor="fw-notes">Freight notes (route, transporter, slab reference)</label>
        <input id="fw-notes" className="field !py-1.5 !text-[12px]" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="e.g. Gurugram → Nagpur, 40 kg slab, Sharma Transport" />
      </div>

      <div className="mt-3 grid gap-2 rounded-lg bg-slate-900 p-3 text-white sm:grid-cols-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">Calculated freight</p>
          <p className="mt-0.5 font-display text-[15px] font-bold">{inr(calculated)}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">Per kg</p>
          <p className="mt-0.5 font-display text-[15px] font-bold">{perKg === null ? "—" : inr(perKg)}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">Per unit</p>
          <p className="mt-0.5 font-display text-[15px] font-bold">{perUnit === null ? "—" : inr(perUnit)}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">Freight share</p>
          <p className="mt-0.5 font-display text-[15px] font-bold">{uplift.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px]">
        <span className="text-slate-500">New final payable = {inr(subtotal)} + {inr(taxTotal)} + {inr(calculated)}</span>
        <span className="font-display text-[13px] font-bold text-slate-900">{inr(newTotal)}</span>
      </div>

      {error ? <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-medium text-rose-700">{error}</p> : null}
      {message ? <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-700">{message}</p> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" disabled={saving} onClick={() => apply("Freight Calculated")} className="btn btn-primary !py-2 !text-[11.5px] disabled:opacity-60">
          {saving ? "Saving…" : "Confirm freight & notify"}
        </button>
        <button type="button" disabled={saving} onClick={() => apply("Freight Under Review")} className="btn btn-ghost !py-2 !text-[11.5px] disabled:opacity-60">
          Save draft
        </button>
        {freight !== null ? (
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              setComponents({ ...EMPTY_FREIGHT_BREAKDOWN });
              setWeight("");
              setNotes("");
            }}
            className="btn btn-ghost !py-2 !text-[11.5px]"
          >
            Clear worksheet
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-[9.5px] leading-relaxed text-slate-400">
        Product base prices are never adjusted for freight. The confirmed amount is stored separately and itemised on the invoice.
      </p>
    </div>
  );
}
