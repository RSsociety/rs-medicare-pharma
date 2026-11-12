"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Badge } from "@/components/ui";
import { availability, inr, stockToneClass } from "@/lib/pricing";
import type { ProductWithMeta } from "@/lib/queries";

export function ProductCard({ product, compact = false }: { product: ProductWithMeta; compact?: boolean }) {
  const cart = useCart();
  const stock = availability(product);
  const image = product.images?.[0] || "/images/glovx-nitrile.jpg";

  const add = () => {
    cart.addItem({
      productId: product.id,
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      brand: product.brandName,
      image,
      packSize: product.packSize,
      unit: product.unit,
      basePrice: product.basePrice,
      taxRate: product.taxRate,
      moq: product.moq,
    });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-navy-50">
        <div className="aspect-[4/3] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-navy-700 shadow-sm">
            {product.brandName ?? product.categoryName ?? "RS Medicare"}
          </span>
          <span className={`chip ${stockToneClass[stock.tone]} shadow-sm`}>{stock.label}</span>
        </div>
        {product.isBestSeller ? (
          <span className="absolute bottom-3 left-3 rounded-md bg-navy-900/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Best seller
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-700">
          {product.categoryName ?? product.subcategory}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-[14.5px] font-semibold leading-snug text-navy-900">
          <Link href={`/products/${product.slug}`} className="transition hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        {!compact ? (
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-navy-500">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10.5px] text-navy-500">
          <span className="rounded bg-navy-50 px-1.5 py-0.5 font-medium">{product.packSize}</span>
          <span className="rounded bg-navy-50 px-1.5 py-0.5 font-medium">SKU {product.sku}</span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="font-display text-lg font-bold leading-none text-navy-900">
                {inr(product.basePrice)}
                <span className="ml-1 text-[11px] font-medium text-navy-400">/ {product.unit}</span>
              </p>
              <p className="mt-1 text-[10.5px] text-navy-400">+ {product.taxRate}% GST · freight separate</p>
            </div>
            <Badge tone="neutral">MOQ {product.moq}</Badge>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={add} className="btn btn-primary !py-2 !text-[12px]" aria-label={`Add ${product.name} to cart`}>
              Add to Cart
            </button>
            <Link href={`/products/${product.slug}`} className="btn btn-ghost !py-2 !text-[12px]">
              View Details
            </Link>
          </div>
          <Link
            href={`/bulk-orders?product=${encodeURIComponent(product.name)}&sku=${product.sku}`}
            className="mt-2 block text-center text-[11px] font-semibold text-brand-700 transition hover:text-brand-800"
          >
            Bulk enquiry for this product →
          </Link>
        </div>
      </div>
    </article>
  );
}
