import type { Product } from "@/db/schema";

export type FreightSettings = {
  mode: "manual" | "auto";
  flatFreight: number;
  freeFreightThreshold: number;
  taxEnabled: boolean;
  defaultTaxRate: number;
};

export const DEFAULT_FREIGHT_SETTINGS: FreightSettings = {
  mode: "manual",
  flatFreight: 0,
  freeFreightThreshold: 0,
  taxEnabled: true,
  defaultTaxRate: 12,
};

export const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export const inr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

export const formatDate = (value: Date | string | null | undefined) => {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatDateTime = (value: Date | string | null | undefined) => {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/** Indian GST slabs, selectable per product in the admin panel. */
export const GST_SLABS = [
  { rate: 0, label: "Nil / Exempt", code: "EXEMPT" },
  { rate: 5, label: "5%", code: "GST 5%" },
  { rate: 12, label: "12%", code: "GST 12%" },
  { rate: 18, label: "18%", code: "GST 18%" },
  { rate: 28, label: "28%", code: "GST 28%" },
] as const;

export function gstSlabLabel(rate: number) {
  const slab = GST_SLABS.find((item) => item.rate === rate);
  return slab ? slab.code : `GST ${rate}%`;
}

/**
 * Splits a tax amount into IGST (inter-state) or CGST + SGST (intra-state).
 * Display helper for invoices — actual filings must follow your GST advisor's setup.
 */
export function splitTax(taxAmount: number, taxRate: number, interState: boolean) {
  const amount = round2(taxAmount);
  if (amount <= 0) return { igst: 0, cgst: 0, sgst: 0, taxRate, mode: "NIL" as const };
  if (interState) return { igst: amount, cgst: 0, sgst: 0, taxRate, mode: "IGST" as const };
  const half = round2(amount / 2);
  return { igst: 0, cgst: half, sgst: round2(amount - half), taxRate, mode: "CGST+SGST" as const };
}

/**
 * Works out whether an order is intra-state (CGST + SGST) or inter-state (IGST)
 * by comparing the delivery state with the company's registered state.
 */
export function orderTaxRows(
  order: { subtotal: number; taxTotal: number; shippingAddress: Record<string, string> | unknown },
  companyState: string,
) {
  const address = (order.shippingAddress ?? {}) as Record<string, string>;
  const deliveryState = String(address.state ?? "").trim();
  const interState =
    Boolean(companyState) &&
    Boolean(deliveryState) &&
    deliveryState.toLowerCase() !== companyState.trim().toLowerCase();
  const effectiveRate =
    order.subtotal > 0 ? Math.round((order.taxTotal / order.subtotal) * 100 * 100) / 100 : 0;
  const split = splitTax(order.taxTotal, effectiveRate, interState);
  return { ...split, deliveryState, companyState, interState };
}

/** Cart line identity — a product with a chosen variant is a separate cart line. */
export function lineKey(line: { productId: number; variantIds?: number[] | null }) {
  const ids = [...(line.variantIds ?? [])].sort((a, b) => a - b);
  return `${line.productId}::${ids.join("-") || "0"}`;
}

export type CartLine = {
  productId: number;
  variantIds?: number[];
  variantLabel?: string | null;
  variantPriceDelta?: number;
  sku: string;
  slug: string;
  name: string;
  brand?: string | null;
  image?: string | null;
  packSize?: string | null;
  unit: string;
  basePrice: number;
  taxRate: number;
  moq: number;
  quantity: number;
};

export type PricedLine = CartLine & {
  lineSubtotal: number;
  lineTax: number;
  lineTotal: number;
};

export function priceLine(
  line: Pick<CartLine, "basePrice" | "taxRate" | "quantity">,
  taxEnabled = true,
): { lineSubtotal: number; lineTax: number; lineTotal: number } {
  const lineSubtotal = round2(line.basePrice * line.quantity);
  const lineTax = taxEnabled ? round2((lineSubtotal * line.taxRate) / 100) : 0;
  return { lineSubtotal, lineTax, lineTotal: round2(lineSubtotal + lineTax) };
}

export const FREIGHT_UNDER_REVIEW_NOTE =
  "Freight charged separately — calculated by our dispatch team from the delivery location, order weight, quantity and shipment mode.";

/** Option A: freight is never estimated on the storefront. It is always under review. */
export function manualFreightReview(): { freight: null; note: string } {
  return { freight: null, note: FREIGHT_UNDER_REVIEW_NOTE };
}

/** Itemised manual freight components, summed by the admin freight worksheet. */
export type FreightBreakdown = {
  transport: number;
  handling: number;
  fuel: number;
  loading: number;
  insurance: number;
  other: number;
};

export const FREIGHT_COMPONENTS: { key: keyof FreightBreakdown; label: string; hint: string }[] = [
  { key: "transport", label: "Line-haul / courier charge", hint: "Transporter or courier rate for the route" },
  { key: "handling", label: "Packing & handling", hint: "Cartons, shrink wrap, documentation" },
  { key: "fuel", label: "Fuel surcharge", hint: "Surcharge applied by the transporter" },
  { key: "loading", label: "Loading / unloading", hint: "Labour at origin or destination" },
  { key: "insurance", label: "Transit insurance", hint: "Optional, on declared consignment value" },
  { key: "other", label: "Other charges", hint: "Out-of-area delivery, tolls, detention" },
];

export const EMPTY_FREIGHT_BREAKDOWN: FreightBreakdown = {
  transport: 0,
  handling: 0,
  fuel: 0,
  loading: 0,
  insurance: 0,
  other: 0,
};

export function normaliseFreightBreakdown(input: unknown): FreightBreakdown {
  const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  return FREIGHT_COMPONENTS.reduce((acc, component) => {
    const parsed = Number(source[component.key]);
    acc[component.key] = Number.isFinite(parsed) && parsed > 0 ? round2(parsed) : 0;
    return acc;
  }, {} as FreightBreakdown);
}

export function sumFreight(breakdown: FreightBreakdown) {
  return round2(
    FREIGHT_COMPONENTS.reduce((sum, component) => sum + (breakdown[component.key] ?? 0), 0),
  );
}

export function describeFreightBreakdown(breakdown: FreightBreakdown) {
  return FREIGHT_COMPONENTS.filter((component) => (breakdown[component.key] ?? 0) > 0).map(
    (component) => ({ label: component.label, value: breakdown[component.key] }),
  );
}

/** Turns a display weight such as "3 g" or "500 g" into kilograms. */
export function parseWeightKg(value: string | null | undefined) {
  if (!value) return 0;
  const match = value.toLowerCase().match(/([\d.]+)\s*(kg|g|gram|grams|gm)?/);
  if (!match) return 0;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return 0;
  const unit = match[2] ?? "kg";
  if (unit === "g" || unit === "gram" || unit === "grams" || unit === "gm") return amount / 1000;
  return amount;
}

export function totalOrderWeightKg(
  lines: { quantity: number; weightKg?: number | null; weight?: string | null }[],
) {
  const total = lines.reduce(
    (sum, line) =>
      sum + (line.weightKg && line.weightKg > 0 ? line.weightKg : parseWeightKg(line.weight)) * line.quantity,
    0,
  );
  return total > 0 ? round2(Math.ceil(total * 100) / 100) : null;
}

export function weightDisplay(kg: number | null | undefined) {
  if (!kg || kg <= 0) return "—";
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  return `${kg.toFixed(2)} kg`;
}

export function productTitle(product: Pick<Product, "name" | "packSize" | "unit">) {
  return product.packSize ? `${product.name}` : product.name;
}

export function availability(product: Pick<Product, "stockQuantity" | "lowStockThreshold">) {
  if (product.stockQuantity <= 0) return { label: "Out of stock", tone: "rose" as const };
  if (product.stockQuantity <= product.lowStockThreshold)
    return { label: "Limited stock", tone: "amber" as const };
  return { label: "In stock", tone: "emerald" as const };
}

export const stockToneClass: Record<"rose" | "amber" | "emerald", string> = {
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function statusTone(status: string) {
  if (status === "Delivered") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "Cancelled") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (["Dispatched", "In Transit", "Packed"].includes(status))
    return "bg-sky-50 text-sky-700 ring-sky-200";
  if (["Payment Confirmed", "Processing"].includes(status))
    return "bg-teal-50 text-teal-700 ring-teal-200";
  if (["Freight Under Review", "Order Under Review"].includes(status))
    return "bg-violet-50 text-violet-700 ring-violet-200";
  if (["Freight Calculated", "Payment Pending"].includes(status))
    return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export function isValidMobile(value: string) {
  return /^[6-9]\d{9}$/.test(value.replace(/[\s-]/g, "").replace(/^\+91/, ""));
}

export function isValidEmail(value: string) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function isValidPincode(value: string) {
  return /^\d{6}$/.test(value.trim());
}

export function normaliseMobile(value: string) {
  return value.replace(/[\s-]/g, "").replace(/^\+91/, "").slice(-10);
}

export const ORDER_SEQUENCE_SQL = `CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;`;

export function buildOrderNumber(year: number, sequence: number) {
  return `RSM-${year}-${String(sequence).padStart(6, "0")}`;
}
