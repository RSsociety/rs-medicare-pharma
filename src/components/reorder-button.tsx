"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function ReorderButton({
  lines,
  label = "Reorder these products",
  className = "btn btn-ghost",
}: {
  lines: {
    productId: number | null;
    variantIds?: number[] | null;
    sku: string;
    slug: string | null;
    name: string;
    packSize: string | null;
    unit: string;
    unitPrice: number;
    taxRate: number;
    quantity: number;
  }[];
  label?: string;
  className?: string;
}) {
  const cart = useCart();
  const router = useRouter();
  const [done, setDone] = useState(false);

  const handle = () => {
    lines.forEach((line) => {
      if (!line.productId || !line.slug) return;
      cart.addItem(
        {
          productId: line.productId,
          sku: line.sku,
          slug: line.slug,
          name: line.name,
          image: "/images/glovx-nitrile.jpg",
          packSize: line.packSize ?? "",
          unit: line.unit,
          basePrice: line.unitPrice,
          taxRate: line.taxRate,
          moq: 1,
          variantIds: line.variantIds ?? [],
          variantLabel: (line as { variantLabel?: string | null }).variantLabel ?? null,
          variantPriceDelta: (line as { variantPriceDelta?: number }).variantPriceDelta ?? 0,
        },
        line.quantity,
      );
    });
    setDone(true);
    router.push("/cart");
  };

  return (
    <button type="button" onClick={handle} className={className} disabled={done}>
      {done ? "Added to cart" : label}
    </button>
  );
}
