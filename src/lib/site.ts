export const site = {
  name: "RS MEDICARE PHARMA",
  shortName: "RS Medicare",
  legalName: "RS Medicare Pharma",
  tagline: "Pharmaceutical & medical product supply for businesses",
  description:
    "RS Medicare Pharma is a B2B pharmaceutical and medical-products distribution partner supplying retailers, chemists, clinics, hospitals, diagnostic centres and distributors with dependable stock, transparent pricing and clear order tracking.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rsmedicarepharma.com",
  phone: "+91 98100 00000",
  phoneHref: "+919810000000",
  whatsapp: "919810000000",
  email: "sales@rsmedicarepharma.com",
  supportEmail: "support@rsmedicarepharma.com",
  address: {
    line1: "Distribution Office, Plot 24, Sector 18",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122015",
    country: "India",
  },
  hours: "Monday – Saturday, 9:30 AM – 7:00 PM IST",
  gstin: "GSTIN available on invoice / B2B orders",
} as const;

export const whatsappLink = (message?: string) => {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Glov-X", href: "/glov-x" },
  { label: "B2B / Bulk", href: "/bulk-orders" },
  { label: "How to Order", href: "/how-to-order" },
  { label: "Contact", href: "/contact" },
] as const;

export const CUSTOMER_TYPES = [
  "Retailer",
  "Medical Store",
  "Clinic",
  "Hospital",
  "Distributor",
  "Wholesaler",
  "Other",
] as const;

export const ORDER_STATUSES = [
  "Order Received",
  "Order Under Review",
  "Freight Under Review",
  "Freight Calculated",
  "Payment Pending",
  "Payment Confirmed",
  "Processing",
  "Packed",
  "Dispatched",
  "In Transit",
  "Delivered",
  "Cancelled",
] as const;

/** Manual freight (Option A) — freight is always reviewed by our dispatch desk. */
export const SHIPMENT_MODES = [
  "Road",
  "Courier",
  "Air",
  "Rail",
  "Customer Pickup",
] as const;

export type ShipmentMode = (typeof SHIPMENT_MODES)[number];

export const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "verification_pending", label: "Verification Pending" },
  { value: "paid", label: "Paid" },
  { value: "cod_due", label: "COD Due" },
  { value: "failed", label: "Failed" },
] as const;

export const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer / NEFT", enabled: true },
  { value: "upi", label: "UPI", enabled: true },
  { value: "payment_gateway", label: "Payment Gateway (Cards / Net Banking)", enabled: false },
  { value: "cod", label: "Cash on Delivery", enabled: false },
  { value: "manual_verification", label: "Manual Payment Verification", enabled: true },
] as const;

export const ENQUIRY_TYPES = {
  bulk: "Bulk / Institutional",
  dealer: "Retailer / Dealer",
  institutional: "Hospital & Clinic Supply",
  business: "Business Enquiry",
  contact: "Contact",
  product: "Product Enquiry",
  distributor: "Distributor Network",
} as const;

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;
