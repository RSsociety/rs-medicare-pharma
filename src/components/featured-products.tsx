"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { ProductWithMeta } from "@/lib/queries";

const TABS = [
  { key: "best", label: "Best Sellers" },
  { key: "glovx", label: "Glov-X" },
  { key: "consumables", label: "Medical Consumables" },
  { key: "pharma", label: "Pharmaceuticals" },
  { key: "new", label: "New Products" },
] as const;

export function FeaturedProducts({ products }: { products: ProductWithMeta[] }) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("best");

  const filtered = useMemo(() => {
    const byTab: Record<string, ProductWithMeta[]> = {
      best: products.filter((product) => product.isBestSeller),
      glovx: products.filter((product) => product.brandSlug === "glov-x"),
      consumables: products.filter((product) => product.categoryGroup === "consumables"),
      pharma: products.filter((product) => product.categoryGroup === "pharma"),
      new: products.filter((product) => product.isNewArrival),
    };
    const list = byTab[active] ?? [];
    return (list.length > 0 ? list : products).slice(0, 4);
  }, [active, products]);

  return (
    <div>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold transition ${
              active === tab.key
                ? "bg-navy-900 text-white shadow-[0_10px_24px_-16px_rgba(11,37,69,0.9)]"
                : "border border-navy-100 bg-white text-navy-500 hover:border-navy-300 hover:text-navy-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
