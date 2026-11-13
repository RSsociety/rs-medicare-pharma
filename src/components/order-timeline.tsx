import { ORDER_STATUSES } from "@/lib/site";

const STAGES = [
  { label: "Order Received", threshold: "Order Received" },
  { label: "Freight Under Review", threshold: "Freight Under Review" },
  { label: "Freight Calculated", threshold: "Freight Calculated" },
  { label: "Payment Confirmed", threshold: "Payment Confirmed" },
  { label: "Dispatched", threshold: "Dispatched" },
  { label: "Delivered", threshold: "Delivered" },
];

export function OrderTimeline({ status }: { status: string }) {
  if (status === "Cancelled") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-[12.5px] font-medium text-rose-800">
        This order has been cancelled. Contact our support desk for clarification or to raise a fresh requirement.
      </div>
    );
  }

  const currentIndex = ORDER_STATUSES.indexOf(status as (typeof ORDER_STATUSES)[number]);

  return (
    <ol className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
      {STAGES.map((stage, index) => {
        const thresholdIndex = ORDER_STATUSES.indexOf(stage.threshold as (typeof ORDER_STATUSES)[number]);
        const done = currentIndex >= thresholdIndex;
        const active = currentIndex === thresholdIndex;
        return (
          <li key={stage.label} className="flex items-center gap-2 sm:flex-col sm:items-start">
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                done
                  ? active
                    ? "bg-brand-600 text-white ring-2 ring-brand-200"
                    : "bg-brand-600 text-white"
                  : "bg-navy-100 text-navy-400"
              }`}
            >
              {done ? "✓" : index + 1}
            </span>
            <span className={`text-[10.5px] font-semibold leading-tight ${done ? "text-navy-800" : "text-navy-400"}`}>
              {stage.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
