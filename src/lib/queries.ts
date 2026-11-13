import { and, asc, desc, eq, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  brands,
  categories,
  customers,
  enquiries,
  faqs,
  orderItems,
  orders,
  products,
  productVariants,
  type Brand,
  type Category,
  type Customer,
  type Enquiry,
  type Faq,
  type Order,
  type OrderItem,
  type Product,
} from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export type ProductWithMeta = Product & {
  brandName: string | null;
  brandSlug: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  categoryGroup: string | null;
  parentCategoryName: string | null;
  parentCategorySlug: string | null;
};

const parentCategory = alias(categories, "parent_category");

function productSelection() {
  return {
    product: products,
    brandName: brands.name,
    brandSlug: brands.slug,
    categoryName: categories.name,
    categorySlug: categories.slug,
    categoryGroup: categories.group,
    parentCategoryName: parentCategory.name,
    parentCategorySlug: parentCategory.slug,
  };
}

function mapProduct(row: {
  product: Product;
  brandName: string | null;
  brandSlug: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  categoryGroup: string | null;
  parentCategoryName: string | null;
  parentCategorySlug: string | null;
}): ProductWithMeta {
  return {
    ...row.product,
    brandName: row.brandName,
    brandSlug: row.brandSlug,
    categoryName: row.categoryName,
    categorySlug: row.categorySlug,
    categoryGroup: row.categoryGroup,
    parentCategoryName: row.parentCategoryName,
    parentCategorySlug: row.parentCategorySlug,
  };
}

export async function getProducts(options: { includeInactive?: boolean } = {}) {
  try {
    await ensureSeeded();
    const query = db
      .select(productSelection())
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(parentCategory, eq(categories.parentId, parentCategory.id))
      .$dynamic();
    const rows = options.includeInactive
      ? await query.orderBy(desc(products.isFeatured), asc(products.name))
      : await query.where(eq(products.status, "active")).orderBy(desc(products.isFeatured), asc(products.name));
    return rows.map(mapProduct);
  } catch (error) {
    console.error("[queries] getProducts failed", error);
    return [] as ProductWithMeta[];
  }
}

export async function getProductBySlug(slug: string) {
  const rows = await getProducts({ includeInactive: true });
  return rows.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: number) {
  const rows = await getProducts({ includeInactive: true });
  return rows.find((product) => product.id === id) ?? null;
}

export async function getCategories(): Promise<(Category & { productCount: number })[]> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
    const productRows = await db
      .select({ categoryId: products.categoryId, status: products.status })
      .from(products);
    const counts = new Map<number, number>();
    for (const product of productRows) {
      if (product.status !== "active" || !product.categoryId) continue;
      counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1);
    }
    return rows.map((category) => {
      const childIds = rows.filter((child) => child.parentId === category.id).map((child) => child.id);
      const total = [category.id, ...childIds].reduce((sum, id) => sum + (counts.get(id) ?? 0), 0);
      return { ...category, productCount: total };
    });
  } catch (error) {
    console.error("[queries] getCategories failed", error);
    return [];
  }
}

export async function getProductVariants(productId: number) {
  try {
    return await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productId))
      .orderBy(asc(productVariants.sortOrder), asc(productVariants.label));
  } catch {
    return [];
  }
}

export async function getAllProductVariants() {
  try {
    return await db.select().from(productVariants).orderBy(asc(productVariants.productId), asc(productVariants.sortOrder));
  } catch {
    return [];
  }
}

export async function getBrands(): Promise<Brand[]> {
  try {
    await ensureSeeded();
    return await db.select().from(brands).orderBy(asc(brands.name));
  } catch {
    return [];
  }
}

export async function getFaqs(): Promise<Faq[]> {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(faqs)
      .where(eq(faqs.isActive, true))
      .orderBy(asc(faqs.sortOrder));
  } catch {
    return [];
  }
}

export async function getOrders(status?: string): Promise<Order[]> {
  try {
    const query = db.select().from(orders).$dynamic();
    const rows = status && status !== "all"
      ? await query.where(eq(orders.status, status)).orderBy(desc(orders.createdAt))
      : await query.orderBy(desc(orders.createdAt));
    return rows;
  } catch (error) {
    console.error("[queries] getOrders failed", error);
    return [];
  }
}

export async function getOrderById(id: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) return null;
  const items = await getOrderItems(order.id);
  return { order, items };
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId)).orderBy(asc(orderItems.id));
}

export async function getOrderByNumber(orderNumber: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(sql`upper(${orders.orderNumber}) = ${orderNumber.trim().toUpperCase()}`)
    .limit(1);
  if (!order) return null;
  return { order, items: await getOrderItems(order.id) };
}

export async function findOrdersForTracking(orderNumber: string, contact: string) {
  const normalised = contact.trim().toLowerCase();
  const digits = normalised.replace(/\D/g, "").slice(-10);
  const [order] = await db
    .select()
    .from(orders)
    .where(
      and(
        sql`upper(${orders.orderNumber}) = ${orderNumber.trim().toUpperCase()}`,
        or(
          sql`lower(coalesce(${orders.email}, '')) = ${normalised}`,
          digits.length === 10 ? sql`right(regexp_replace(${orders.mobile}, '\\D', '', 'g'), 10) = ${digits}` : sql`false`,
        ),
      ),
    )
    .limit(1);
  if (!order) return null;
  return { order, items: await getOrderItems(order.id) };
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    return await db.select().from(customers).orderBy(desc(customers.totalValue));
  } catch {
    return [];
  }
}

export async function getCustomerOrders(customerId: number): Promise<Order[]> {
  return db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
}

export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    return await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
  } catch {
    return [];
  }
}

export type DashboardData = {
  totalOrders: number;
  todayOrders: number;
  monthOrders: number;
  totalSales: number;
  pendingPayments: number;
  completedOrders: number;
  cancelledOrders: number;
  customers: number;
  newEnquiries: number;
  bulkEnquiries: number;
  lowStockProducts: Product[];
  topProducts: { name: string; sku: string; quantity: number; value: number }[];
  dailySales: { date: string; label: string; value: number; orders: number }[];
  statusBreakdown: { status: string; count: number }[];
  recentOrders: Order[];
};

export async function getDashboardData(): Promise<DashboardData> {
  try {
    await ensureSeeded();
    const allOrders = await db.select().from(orders);
    const allItems = await db.select().from(orderItems);
    const allProducts = await db.select().from(products);
    const allCustomers = await db.select().from(customers);
    const allEnquiries = await db.select().from(enquiries);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeOrders = allOrders.filter((order) => order.status !== "Cancelled");

    const productMap = new Map(allProducts.map((product) => [product.id, product]));
    const topMap = new Map<string, { name: string; sku: string; quantity: number; value: number }>();
    for (const item of allItems) {
      const parentOrder = allOrders.find((order) => order.id === item.orderId);
      if (parentOrder?.status === "Cancelled") continue;
      const entry = topMap.get(item.sku) ?? {
        name: productMap.get(item.productId ?? -1)?.name ?? item.name,
        sku: item.sku,
        quantity: 0,
        value: 0,
      };
      entry.quantity += item.quantity;
      entry.value += item.lineTotal;
      topMap.set(item.sku, entry);
    }

    const dailySales = Array.from({ length: 14 }, (_, index) => {
      const day = new Date(startOfToday);
      day.setDate(day.getDate() - (13 - index));
      const next = new Date(day);
      next.setDate(day.getDate() + 1);
      const dayOrders = activeOrders.filter(
        (order) => order.createdAt >= day && order.createdAt < next,
      );
      return {
        date: day.toISOString().slice(0, 10),
        label: day.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        value: dayOrders.reduce((sum, order) => sum + order.finalTotal, 0),
        orders: dayOrders.length,
      };
    });

    const statusCounts = new Map<string, number>();
    for (const order of allOrders) {
      statusCounts.set(order.status, (statusCounts.get(order.status) ?? 0) + 1);
    }

    return {
      totalOrders: allOrders.length,
      todayOrders: allOrders.filter((order) => order.createdAt >= startOfToday).length,
      monthOrders: allOrders.filter((order) => order.createdAt >= startOfMonth).length,
      totalSales: activeOrders.reduce((sum, order) => sum + order.finalTotal, 0),
      pendingPayments: allOrders.filter((order) => order.paymentStatus !== "paid").length,
      completedOrders: allOrders.filter((order) => order.status === "Delivered").length,
      cancelledOrders: allOrders.filter((order) => order.status === "Cancelled").length,
      customers: allCustomers.length,
      newEnquiries: allEnquiries.filter((enquiry) => enquiry.status === "new").length,
      bulkEnquiries: allEnquiries.filter((enquiry) => enquiry.type === "bulk").length,
      lowStockProducts: allProducts
        .filter((product) => product.stockQuantity <= product.lowStockThreshold)
        .sort((a, b) => a.stockQuantity - b.stockQuantity)
        .slice(0, 6),
      topProducts: [...topMap.values()].sort((a, b) => b.value - a.value).slice(0, 6),
      dailySales,
      statusBreakdown: [...statusCounts.entries()].map(([status, count]) => ({ status, count })),
      recentOrders: allOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 8),
    };
  } catch (error) {
    console.error("[queries] getDashboardData failed", error);
    return {
      totalOrders: 0,
      todayOrders: 0,
      monthOrders: 0,
      totalSales: 0,
      pendingPayments: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      customers: 0,
      newEnquiries: 0,
      bulkEnquiries: 0,
      lowStockProducts: [],
      topProducts: [],
      dailySales: [],
      statusBreakdown: [],
      recentOrders: [],
    };
  }
}
