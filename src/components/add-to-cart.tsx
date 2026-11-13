"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { gstSlabLabel, inr, lineKey, round2 } from "@/lib/pricing";
import type { ProductWithMeta } from "@/lib/queries";

export type VariantOption = {
  id: number;
  optionType: string;
  label: string;
  skuSuffix: string | null;
  priceDelta: number;
  swatch: string | null;
  stockQuantity: number;
  isActive: boolean;
};

export function AddToCartPanel({
  product,
  variants,
}: {
  product: ProductWithMeta;
  variants: VariantOption[];
}) {
  const cart = useCart();
  const router = useRouter();
  const active = useMemo(() => variants.filter((variant) => variant.isActive), [variants]);
  const sizes = active.filter((variant) => variant.optionType === "size");
  const colors = active.filter((variant) => variant.optionType === "color");

  const [sizeId, setSizeId] = useState<number | null>(sizes[0]?.id ?? null);
  const [colorId, setColorId] = useState<number | null>(colors[0]?.id ?? null);
  const [quantity, setQuantity] = useState(product.moq || 1);
  const [error, setError] = useState<string | null>(null);

  const selectedSize = sizes.find((variant) => variant.id === sizeId) ?? null;
  const selectedColor = colors.find((variant) => variant.id === colorId) ?? null;
  const selected = [selectedSize, selectedColor].filter(Boolean) as VariantOption[];

  const priceDelta = round2(selected.reduce((sum, variant) => sum + variant.priceDelta, 0));
  const unitPrice = round2(product.basePrice + priceDelta);
  const variantStock = selected.length > 0 ? Math.min(...selected.map((variant) => variant.stockQuantity)) : product.stockQuantity;
  const variantLabel = selected.map((variant) => variant.label).join(" · ") || null;
  const variantIds = selected.map((variant) => variant.id);
  const outOfStock = selected.length > 0 ? variantStock <= 0 : product.stockQuantity <= 0;

  const subtotal = round2(unitPrice * quantity);
  const tax = round2((subtotal * product.taxRate) / 100);
  const image = product.images?.[0] || "/images/glovx-nitrile.jpg";

  const linePayload = {
    productId: product.id,
    sku: product.sku + (selectedSize?.skuSuffix ?? ""),
    slug: product.slug,
    name: product.name,
    brand: product.brandName,
    image,
    packSize: product.packSize,
    unit: product.unit,
    basePrice: unitPrice,
    taxRate: product.taxRate,
    moq: product.moq,
    variantIds,
    variantLabel,
    variantPriceDelta: priceDelta,
  };

  const validate = () => {
    if (outOfStock) {
      setError(
        variantLabel
          ? `The ${variantLabel} option is currently out of stock. Please choose another combination or send a bulk enquiry.`
          : "This product is currently out of stock. Please send a bulk enquiry for the next availability.",
      );
      return false;
    }
    if (sizes.length > 0 && !sizeId) {
      setError("Please select a size.");
      return false;
    }
    if (colors.length > 0 && !colorId) {
      setError("Please select a colour.");
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

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-400">Base price</p>
          <p className="font-display text-3xl font-extrabold text-navy-900">
            {inr(unitPrice)}
            <span className="ml-1 text-xs font-semibold text-navy-400">/ {product.unit}</span>
          </p>
          {priceDelta !== 0 ? (
            <p className="mt-0.5 text-[11px] text-navy-500">
              {inr(product.basePrice)} base {priceDelta > 0 ? "+" : "−"} {inr(Math.abs(priceDelta))} for {variantLabel}
            </p>
          ) : null}
        </div>
        <div className="text-right text-[11px] leading-relaxed text-navy-500">
          <p>+ {gstSlabLabel(product.taxRate)}</p>
          <p className="font-semibold text-brand-700">Freight charged separately</p>
        </div>
      </div>

      {/* Size selector */}
      {sizes.length > 0 ? (
        <fieldset className="mt-4">
          <legend className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy-500">
            Choose size
            <span className="ml-1.5 font-medium normal-case tracking-normal text-navy-400">
              {selectedSize ? `· ${selectedSize.label}` : "· required"}
            </span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((variant) => {
              const selectedSizeId = variant.id === sizeId;
              const empty = variant.stockQuantity <= 0;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={empty}
                  onClick={() => {
                    setSizeId(variant.id);
                    setError(null);
                  }}
                  aria-pressed={selectedSizeId}
                  className={`min-w-[3.4rem] rounded-lg border px-3 py-2 text-[12px] font-semibold transition ${
                    selectedSizeId
                      ? "border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-300"
                      : empty
                        ? "cursor-not-allowed border-navy-100 bg-navy-50 text-navy-300 line-through"
                        : "border-navy-200 bg-white text-navy-700 hover:border-navy-400"
                  }`}
                >
                  {variant.label}
                  {variant.priceDelta !== 0 && !empty ? (
                    <span className="block text-[9px] font-medium text-navy-400">
                      {variant.priceDelta > 0 ? "+" : "−"}{inr(Math.abs(variant.priceDelta))}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Colour selector */}
      {colors.length > 0 ? (
        <fieldset className="mt-4">
          <legend className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy-500">
            Choose colour
            <span className="ml-1.5 font-medium normal-case tracking-normal text-navy-400">
              {selectedColor ? `· ${selectedColor.label}` : "· required"}
            </span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((variant) => {
              const selectedColorId = variant.id === colorId;
              const empty = variant.stockQuantity <= 0;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={empty}
                  onClick={() => {
                    setColorId(variant.id);
                    setError(null);
                  }}
                  aria-pressed={selectedColorId}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-semibold transition ${
                    selectedColorId
                      ? "border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-300"
                      : empty
                        ? "cursor-not-allowed border-navy-100 bg-navy-50 text-navy-300 opacity-60"
                        : "border-navy-200 bg-white text-navy-700 hover:border-navy-400"
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/15"
                    style={{ backgroundColor: variant.swatch || "#94a3b8" }}
                    aria-hidden
                  />
                  {variant.label}
                  {variant.priceDelta !== 0 && !empty ? (
                    <span className="text-[9px] font-medium text-navy-400">
                      {variant.priceDelta > 0 ? "+" : "−"}{inr(Math.abs(variant.priceDelta))}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

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
          <p className="mt-0.5 break-all font-semibold text-navy-800">
            {product.sku}
            {selectedSize?.skuSuffix ? <span className="text-brand-700">{selectedSize.skuSuffix}</span> : null}
          </p>
        </div>
        <div>
          <p className="text-navy-400">Availability</p>
          <p className={`mt-0.5 font-semibold ${outOfStock ? "text-rose-600" : "text-navy-800"}`}>
            {selected.length > 0
              ? outOfStock
                ? "Out of stock"
                : `${variantStock.toLocaleString("en-IN")} ${product.unit}s of this option`
              : product.stockQuantity > 0
                ? `${product.stockQuantity.toLocaleString("en-IN")} ${product.unit}s`
                : "Out of stock"}
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
          <dt>{gstSlabLabel(product.taxRate)}</dt>
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
        <button type="button" onClick={add} disabled={outOfStock} className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
          Add to Cart
        </button>
        <button type="button" onClick={buyNow} disabled={outOfStock} className="btn btn-brand w-full disabled:cursor-not-allowed disabled:opacity-50">
          Buy Now
        </button>
        <a
          href={`https://wa.me/919810000000?text=${encodeURIComponent(
            `Hello RS Medicare Pharma,\n\nI would like to enquire about:\nProduct: ${product.name}\nSKU: ${product.sku}${selectedSize?.skuSuffix ?? ""}\n${variantLabel ? `Options: ${variantLabel}\n` : ""}Quantity: ${quantity} ${product.unit}(s)\n\nPlease share availability and bulk pricing.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost w-full !text-[12.5px]"
        >
          Enquire on WhatsApp
        </a>
      </div>

      {variantIds.length > 0 ? (
        <p className="mt-2 text-center text-[10px] text-navy-400">
          Selected options are saved with your cart line — same product, different options are added separately.
        </p>
      ) : null}
    </div>
  );
}
