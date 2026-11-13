import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const CATEGORY_GROUPS = ["pharma", "consumables", "glovx"] as const;
export type CategoryGroup = (typeof CATEGORY_GROUPS)[number];

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  tagline: text("tagline"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  group: varchar("group", { length: 32 }).notNull().default("consumables"),
  parentId: integer("parent_id"),
  description: text("description"),
  tagline: text("tagline"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  optionType: varchar("option_type", { length: 20 }).notNull().default("size"),
  label: varchar("label", { length: 80 }).notNull(),
  skuSuffix: varchar("sku_suffix", { length: 24 }),
  priceDelta: doublePrecision("price_delta").notNull().default(0),
  swatch: varchar("swatch", { length: 30 }),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 64 }).notNull().unique(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 240 }).notNull(),
  brandId: integer("brand_id"),
  categoryId: integer("category_id"),
  subcategory: varchar("subcategory", { length: 120 }),
  shortDescription: text("short_description"),
  description: text("description"),
  specifications: jsonb("specifications").$type<Record<string, string>>().notNull().default({}),
  applications: jsonb("applications").$type<string[]>().notNull().default([]),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  packSize: varchar("pack_size", { length: 120 }),
  unit: varchar("unit", { length: 40 }).notNull().default("unit"),
  weight: varchar("weight", { length: 60 }),
  weightKg: doublePrecision("weight_kg").notNull().default(0),
  basePrice: doublePrecision("base_price").notNull().default(0),
  taxRate: doublePrecision("tax_rate").notNull().default(12),
  freightRule: text("freight_rule").notNull().default("Freight charged separately"),
  moq: integer("moq").notNull().default(1),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(100),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isBestSeller: boolean("is_best_seller").notNull().default(false),
  isNewArrival: boolean("is_new_arrival").notNull().default(false),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  companyName: varchar("company_name", { length: 200 }),
  mobile: varchar("mobile", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 200 }),
  gstin: varchar("gstin", { length: 20 }),
  customerType: varchar("customer_type", { length: 40 }).notNull().default("Retailer"),
  address: text("address"),
  city: varchar("city", { length: 120 }),
  state: varchar("state", { length: 120 }),
  pincode: varchar("pincode", { length: 12 }),
  country: varchar("country", { length: 80 }).notNull().default("India"),
  totalOrders: integer("total_orders").notNull().default(0),
  totalValue: doublePrecision("total_value").notNull().default(0),
  outstandingAmount: doublePrecision("outstanding_amount").notNull().default(0),
  notes: text("notes"),
  lastOrderAt: timestamp("last_order_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 40 }).notNull().unique(),
  customerId: integer("customer_id"),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  companyName: varchar("company_name", { length: 200 }),
  mobile: varchar("mobile", { length: 20 }).notNull(),
  email: varchar("email", { length: 200 }),
  gstin: varchar("gstin", { length: 20 }),
  customerType: varchar("customer_type", { length: 40 }).notNull().default("Retailer"),
  billingAddress: jsonb("billing_address").$type<Record<string, string>>().notNull().default({}),
  shippingAddress: jsonb("shipping_address").$type<Record<string, string>>().notNull().default({}),
  subtotal: doublePrecision("subtotal").notNull().default(0),
  taxTotal: doublePrecision("tax_total").notNull().default(0),
  freight: doublePrecision("freight"),
  freightMode: varchar("freight_mode", { length: 20 }).notNull().default("manual"),
  shipmentMode: varchar("shipment_mode", { length: 40 }).notNull().default("Road"),
  estimatedWeightKg: doublePrecision("estimated_weight_kg"),
  billableWeightKg: doublePrecision("billable_weight_kg"),
  freightBreakdown: jsonb("freight_breakdown")
    .$type<Record<string, string | number>>()
    .notNull()
    .default({}),
  discount: doublePrecision("discount").notNull().default(0),
  finalTotal: doublePrecision("final_total").notNull().default(0),
  paymentMethod: varchar("payment_method", { length: 60 }).notNull().default("bank_transfer"),
  paymentStatus: varchar("payment_status", { length: 40 }).notNull().default("pending"),
  status: varchar("status", { length: 60 }).notNull().default("Order Received"),
  trackingNumber: varchar("tracking_number", { length: 120 }),
  transporter: varchar("transporter", { length: 120 }),
  customerNotes: text("customer_notes"),
  internalNotes: text("internal_notes"),
  riskFlag: boolean("risk_flag").notNull().default(false),
  riskReason: text("risk_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id"),
  sku: varchar("sku", { length: 64 }).notNull(),
  name: varchar("name", { length: 240 }).notNull(),
  slug: varchar("slug", { length: 180 }),
  packSize: varchar("pack_size", { length: 120 }),
  unit: varchar("unit", { length: 40 }).notNull().default("unit"),
  variantId: integer("variant_id"),
  variantLabel: varchar("variant_label", { length: 120 }),
  variantPriceDelta: doublePrecision("variant_price_delta").notNull().default(0),
  unitPrice: doublePrecision("unit_price").notNull().default(0),
  taxRate: doublePrecision("tax_rate").notNull().default(0),
  quantity: integer("quantity").notNull().default(1),
  lineSubtotal: doublePrecision("line_subtotal").notNull().default(0),
  lineTax: doublePrecision("line_tax").notNull().default(0),
  lineTotal: doublePrecision("line_total").notNull().default(0),
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 40 }).notNull().default("contact"),
  name: varchar("name", { length: 160 }).notNull(),
  company: varchar("company", { length: 200 }),
  mobile: varchar("mobile", { length: 20 }).notNull(),
  email: varchar("email", { length: 200 }),
  gstin: varchar("gstin", { length: 20 }),
  productName: varchar("product_name", { length: 240 }),
  quantity: varchar("quantity", { length: 80 }),
  deliveryLocation: varchar("delivery_location", { length: 200 }),
  message: text("message"),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 80 }).notNull().default("General"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const settings = pgTable("settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: jsonb("value").$type<unknown>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const freightRules = pgTable("freight_rules", {
  id: serial("id").primaryKey(),
  state: varchar("state", { length: 120 }).notNull(),
  minOrderValue: doublePrecision("min_order_value").notNull().default(0),
  freightAmount: doublePrecision("freight_amount").notNull().default(0),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Admin-uploaded product images. Bytes live in Postgres so uploads survive rebuilds. */
export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 240 }).notNull(),
  contentType: varchar("content_type", { length: 60 }).notNull().default("image/jpeg"),
  byteSize: integer("byte_size").notNull().default(0),
  /** Base64-encoded image bytes (no data-URL prefix). */
  data: text("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actor: varchar("actor", { length: 120 }).notNull().default("admin"),
  action: varchar("action", { length: 120 }).notNull(),
  entity: varchar("entity", { length: 80 }).notNull(),
  entityId: varchar("entity_id", { length: 80 }),
  details: text("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProductVariant = typeof productVariants.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
