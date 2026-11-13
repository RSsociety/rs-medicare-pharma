"use client";

export function PrintButton({ label = "Print / Save PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-ghost no-print">
      {label}
    </button>
  );
}
