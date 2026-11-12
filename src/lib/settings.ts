import { db } from "@/db";
import { settings } from "@/db/schema";
import { defaultSettings } from "@/db/seed-data";
import { ensureSeeded } from "@/db/seed";

export type StoreSettings = {
  storeName: string;
  companyPhone: string;
  whatsappNumber: string;
  salesEmail: string;
  supportEmail: string;
  officeAddress: string;
  businessHours: string;
  announcement: string;
  freightMode: "manual" | "auto";
  flatFreight: number;
  freeFreightThreshold: number;
  taxEnabled: boolean;
  defaultTaxRate: number;
  paymentBankTransfer: boolean;
  paymentUpi: boolean;
  paymentGateway: boolean;
  paymentCod: boolean;
  paymentManualVerification: boolean;
  abandonedCartReminder: boolean;
  lowStockAlert: boolean;
  riskOrderValueThreshold: number;
  bulkEnquiryEmail: string;
};

export const STORE_SETTING_KEYS = Object.keys(defaultSettings) as (keyof StoreSettings)[];

export async function getSettings(): Promise<StoreSettings> {
  const merged: Record<string, unknown> = { ...defaultSettings };
  try {
    await ensureSeeded();
    const rows = await db.select().from(settings);
    for (const row of rows) {
      merged[row.key] = row.value;
    }
  } catch (error) {
    console.error("[settings] falling back to defaults", error);
  }
  return merged as unknown as StoreSettings;
}

export async function updateSettings(values: Record<string, unknown>) {
  for (const [key, value] of Object.entries(values)) {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
  }
}

/**
 * Freight architecture is manual-only (Option A). The automated/flat-freight mode was removed so
 * base product prices can never absorb freight. Tax configuration remains admin-controlled.
 */
export async function getFreightSettings() {
  const store = await getSettings();
  return {
    mode: "manual" as const,
    taxEnabled: Boolean(store.taxEnabled),
    defaultTaxRate: Number(store.defaultTaxRate) || 0,
  };
}

export function enabledPaymentMethods(store: StoreSettings) {
  return [
    { value: "bank_transfer", label: "Bank Transfer / NEFT", enabled: store.paymentBankTransfer },
    { value: "upi", label: "UPI", enabled: store.paymentUpi },
    { value: "payment_gateway", label: "Payment Gateway (Cards / Net Banking)", enabled: store.paymentGateway },
    { value: "cod", label: "Cash on Delivery", enabled: store.paymentCod },
    { value: "manual_verification", label: "Manual Payment Verification", enabled: store.paymentManualVerification },
  ].filter((method) => method.enabled);
}
