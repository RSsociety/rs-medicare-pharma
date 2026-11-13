import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/queries";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const staticRoutes = [
    "", "/about", "/products", "/categories", "/glov-x", "/glov-x/products", "/how-to-order",
    "/bulk-orders", "/dealer-enquiry", "/become-a-dealer", "/hospital-supply", "/distributor-network",
    "/business-enquiry", "/contact", "/faq", "/shipping-policy", "/returns-policy",
    "/privacy-policy", "/terms", "/offers", "/resources", "/catalogue", "/track",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const products = await getProducts();
  const productRoutes = products.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
