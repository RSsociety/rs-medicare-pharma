"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { inr, round2 } from "@/lib/pricing";
import type { ProductWithMeta } from "@/lib/queries";

export function AddToCartPanel({ product }: { product: ProductWithMeta }) {
  const cart = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(product.moq || 1);
  const [error, setError] = useState<string | null>(null);
  const image = product.images?.[0] || "/images/glovx-nitrile.jpg";

  const linePayload = {
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
  };

  const validate = () => {
    if (product.stockQuantity <= 0) {
      setError("This product is currently out of stock. Please send a bulk enquiry for the next availability.");
      return false;
    }
    if (quantity < product.moq) {
      setError(`Minimum order quantity is ${product.moq} ${product.unit}s.`);
      return false;
    }
    setError(null);
    return true;
  };

  const add = () => {
    if (!validate()) return;
    cart.addItem(linePayload, quantity);
  };

  const buyNow = () => {
    if (!validate()) return;
    cart.addItem(linePayload, quantity);
    router.push("/checkout");
  };

  const subtotal = round2(product.basePrice * quantity);
  const tax = round2((subtotal * product.taxRate) / 100);

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-400">Base price</p>
          <p className="font-display text-3xl font-extrabold text-navy-900">
            {inr(product.basePrice)}
            <span className="ml-1 text-xs font-semibold text-navy-400">/ {product.unit}</span>
          </p>
        </div>
        <div className="text-right text-[11px] leading-relaxed text-navy-500">
          <p>+ {product.taxRate}% GST</p>
          <p className="font-semibold text-brand-700">Freight charged separately</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-navy-50/70 p-3 text-[11.5px]">
        <div>
          <p className="text-navy-400">Pack size</p>
          <p className="mt-0.5 font-semibold text-navy-800">{product.packSize}</p>
        </div>
        <div>
          <p className="text-navy-400">Minimum order</p>
          <p className="mt-0.5 font-semibold text-navy-800">{product.moq} {product.unit}s</p>
        </div>
        <div>
          <p className="text-navy-400">Product code</p>
          <p className="mt-0.5 font-semibold text-navy-800">{product.sku}</p>
        </div>
        <div>
          <p className="text-navy-400">Availability</p>
          <p className="mt-0.5 font-semibold text-navy-800">
            {product.stockQuantity > 0 ? `${product.stockQuantity.toLocaleString("en-IN")} ${product.unit}s` : "Out of stock"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <label className="label" htmlFor="quantity">Quantity ({product.unit}s)</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-navy-200 text-navy-600 transition hover:bg-navy-50"
            onClick={() => setQuantity((value) => Math.max(product.moq, value - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="quantity"
            type="number"
            min={product.moq}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value) || product.moq)}
            className="field h-10 text-center font-semibold"
          />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-navy-200 text-navy-600 transition hover:bg-navy-50"
            onClick={() => setQuantity((value) => value + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <dl className="mt-4 space-y-1.5 border-t border-dashed border-navy-100 pt-3 text-[12.5px]">
        <div className="flex justify-between text-navy-500">
          <dt>Product value</dt>
          <dd className="font-semibold text-navy-800">{inr(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-navy-500">
          <dt>GST ({product.taxRate}%)</dt>
          <dd className="font-semibold text-navy-800">{inr(tax)}</dd>
        </div>
        <div className="flex justify-between text-navy-500">
          <dt>Freight</dt>
          <dd className="font-semibold text-brand-700">To be confirmed</dd>
        </div>
        <div className="flex justify-between border-t border-navy-100 pt-2 text-navy-900">
          <dt className="font-semibold">Estimated total</dt>
          <dd className="font-display font-bold">{inr(subtotal + tax)}</dd>
        </div>
      </dl>

      {error ? (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[11.5px] font-medium text-rose-700">{error}</p>
      ) : null}

      <div className="mt-4 grid gap-2">
        <button type="button" onClick={add} className="btn btn-primary w-full">Add to Cart</button>
        <button type="button" onClick={buyNow} className="btn btn-brand w-full">Buy Now</button>
        <a
          href={`https://wa.me/919810000000?text=${encodeURIComponent(
            `Hello RS Medicare Pharma,\n\nI would like to enquire about:\nProduct: ${product.name}\nSKU: ${product.sku}\nQuantity: ${quantity} ${product.unit}(s)\n\nPlease share availability and bulk pricing.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost w-full !text-[12.5px]"
        >
          Enquire on WhatsApp
        </a>
        <a
          href={`mailto:sales@rsmedicarepharma.com?subject=${encodeURIComponent(`Bulk enquiry — ${product.name} (${product.sku})`)}&body=${encodeURIComponent(
            `Product: ${product.name}\nSKU: ${product.sku}\nQuantity required: ${quantity} ${product.unit}(s)\nCompany:\nDelivery location:\nGSTIN (optional):\n`,
          )}`}
          className="text-center text-[11.5px] font-semibold text-navy-500 underline-offset-2 hover:text-navy-800 hover:underline"
        >
          Bulk enquiry by email
        </a>
      </div>
    </div>
  );
}
