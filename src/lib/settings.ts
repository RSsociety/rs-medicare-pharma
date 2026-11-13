import { db } from "@/db";
import { settings } from "@/db/schema";
import { defaultSettings } from "@/db/seed-data";
import { ensureSeeded } from "@/db/seed";

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type FooterConfig = {
  description: string;
  columns: FooterColumn[];
  socials: { facebook: string; instagram: string; linkedin: string; youtube: string };
  copyright: string;
  disclaimer: string;
};

export const DEFAULT_FOOTER: FooterConfig = {
  description:
    "A B2B pharmaceutical and medical-products distribution partner for retailers, clinics, hospitals, diagnostic centres and wholesalers. Centralised pricing, transparent GST, and freight confirmed per delivery location.",
  columns: [
    { title: "Company", links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "How to Order", href: "/how-to-order" },
      { label: "Distributor Network", href: "/distributor-network" },
      { label: "Resources", href: "/resources" },
    ]},
    { title: "Products", links: [
      { label: "All Products", href: "/products" },
      { label: "Glov-X Range", href: "/glov-x" },
      { label: "Glov-X Products", href: "/glov-x/products" },
      { label: "Categories", href: "/categories" },
      { label: "Product Catalogue", href: "/catalogue" },
    ]},
    { title: "Business", links: [
      { label: "Bulk & Institutional", href: "/bulk-orders" },
      { label: "Become a Dealer", href: "/become-a-dealer" },
      { label: "Hospital & Clinic Supply", href: "/hospital-supply" },
      { label: "Retailer Enquiry", href: "/dealer-enquiry" },
      { label: "Business Enquiry", href: "/business-enquiry" },
    ]},
    { title: "Support", links: [
      { label: "Track Order", href: "/track" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping & Freight", href: "/shipping-policy" },
      { label: "Returns & Cancellation", href: "/returns-policy" },
    ]},
  ],
  socials: { facebook: "", instagram: "", linkedin: "", youtube: "" },
  copyright: "",
  disclaimer:
    "Product images and specifications are indicative. Availability, packaging and batch details are confirmed at order review. Product information on this website is intended for trade and institutional buyers and is not medical advice.",
};

const safeHref = (value: string) => {
  const href = String(value ?? "").trim();
  if (!href) return "";
  return /^(https?:\/\/|\/|mailto:|tel:)/.test(href) ? href.slice(0, 400) : "";
};

export function sanitiseFooter(input: unknown): FooterConfig {
  const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const rawColumns = Array.isArray(source.columns) ? source.columns : [];
  const columns: FooterColumn[] = rawColumns
    .slice(0, 5)
    .map((column) => {
      const item = (column ?? {}) as Record<string, unknown>;
      const rawLinks = Array.isArray(item.links) ? item.links : [];
      return {
        title: String(item.title ?? "").slice(0, 32).trim(),
        links: rawLinks
          .slice(0, 12)
          .map((link) => {
            const entry = (link ?? {}) as Record<string, unknown>;
            return { label: String(entry.label ?? "").slice(0, 48).trim(), href: safeHref(String(entry.href ?? "")) };
          })
          .filter((link) => link.label && link.href),
      };
    })
    .filter((column) => column.title && column.links.length > 0);

  const rawSocials = (source.socials ?? {}) as Record<string, unknown>;
  const socials = {
    facebook: safeHref(String(rawSocials.facebook ?? "")),
    instagram: safeHref(String(rawSocials.instagram ?? "")),
    linkedin: safeHref(String(rawSocials.linkedin ?? "")),
    youtube: safeHref(String(rawSocials.youtube ?? "")),
  };

  return {
    description: String(source.description ?? DEFAULT_FOOTER.description).slice(0, 700),
    columns: columns.length > 0 ? columns : DEFAULT_FOOTER.columns,
    socials,
    copyright: String(source.copyright ?? "").slice(0, 220),
    disclaimer: String(source.disclaimer ?? DEFAULT_FOOTER.disclaimer).slice(0, 800),
  };
}

export async function getFooterConfig(): Promise<FooterConfig> {
  try {
    const store = await getSettings();
    return sanitiseFooter((store as unknown as Record<string, unknown>).footerConfig ?? DEFAULT_FOOTER);
  } catch {
    return DEFAULT_FOOTER;
  }
}

export async function saveFooterConfig(input: unknown) {
  const clean = sanitiseFooter(input);
  await updateSettings({ footerConfig: clean });
  return clean;
}

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
  companyState: string;
  footerConfig: FooterConfig;
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
