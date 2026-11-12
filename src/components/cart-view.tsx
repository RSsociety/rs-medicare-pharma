"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { inr, round2 } from "@/lib/pricing";

export function CartView() {
  const cart = useCart();
  const freightOpen = cart.subtotal;

  if (!cart.ready) {
    return <div className="card p-10 text-center text-[13px] text-navy-400">Loading your cart…</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="card p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy-50 text-navy-400">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" />
          </svg>
        </span>
        <h2 className="mt-4 text-lg font-bold text-navy-900">Your cart is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-navy-500">
          Browse the catalogue to add pharmaceutical lines, medical consumables or Glov-X examination gloves.
          No account is required.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href="/products" className="btn btn-primary">Explore Products</Link>
          <Link href="/glov-x/products" className="btn btn-ghost">Shop Glov-X</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="space-y-3">
        {cart.items.map((line) => (
          <div key={line.productId} className="rounded-2xl border border-navy-100 bg-white p-3.5 shadow-card sm:p-4">
            <div className="flex gap-3.5">
              <Link href={`/products/${line.slug}`} className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={line.image || "/images/glovx-nitrile.jpg"} alt={line.name} className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700">{line.brand}</p>
                    <Link href={`/products/${line.slug}`} className="mt-0.5 block text-[13.5px] font-semibold leading-snug text-navy-900 hover:text-brand-700">
                      {line.name}
                    </Link>
                    <p className="mt-1 text-[11px] text-navy-400">{line.packSize} · SKU {line.sku}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => cart.removeItem(line.productId)}
                    className="rounded-md p-1 text-navy-300 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remove ${line.name}`}
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden><path d="M7 2h6l1 1h3v2H3V3h3l1-1Zm-3 5h12l-1 10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L4 7Z" /></svg>
                  </button>
                </div>

                <div className="mt-2.5 flex flex-wrap items-end justify-between gap-3">
                  <div className="flex items-center rounded-lg border border-navy-200">
                    <button type="button" className="h-8 w-8 text-navy-600 transition hover:bg-navy-50" onClick={() => cart.setQuantity(line.productId, line.quantity - 1)} aria-label="Decrease quantity">−</button>
                    <input
                      type="number"
                      value={line.quantity}
                      min={line.moq}
                      onChange={(event) => cart.setQuantity(line.productId, Number(event.target.value) || line.moq)}
                      className="h-8 w-16 border-x border-navy-200 text-center text-[12px] font-semibold outline-none"
                      aria-label={`Quantity for ${line.name}`}
                    />
                    <button type="button" className="h-8 w-8 text-navy-600 transition hover:bg-navy-50" onClick={() => cart.setQuantity(line.productId, line.quantity + 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <div className="text-right">
                    <p className="text-[13.5px] font-bold text-navy-900">{inr(round2(line.basePrice * line.quantity))}</p>
                    <p className="text-[10.5px] text-navy-400">{inr(line.basePrice)} / {line.unit} · +{line.taxRate}% GST</p>
                  </div>
                </div>
                <p className="mt-1.5 text-[10px] text-navy-400">Minimum order quantity: {line.moq} {line.unit}(s)</p>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <Link href="/products" className="btn btn-ghost !py-2 !text-[12px]">← Continue shopping</Link>
          <button type="button" onClick={cart.clear} className="text-[11.5px] font-semibold text-navy-400 transition hover:text-rose-600">
            Clear cart
          </button>
        </div>
      </div>

      <div className="lg:sticky lg:top-28">
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
          <h2 className="text-[15px] font-bold text-navy-900">Order summary</h2>
          <dl className="mt-4 space-y-2.5 text-[12.5px]">
            <div className="flex justify-between text-navy-500">
              <dt>Base product value</dt>
              <dd className="font-semibold text-navy-800">{inr(cart.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-navy-500">
              <dt>Applicable GST</dt>
              <dd className="font-semibold text-navy-800">{inr(cart.taxTotal)}</dd>
            </div>
            <div className="flex justify-between text-navy-500">
              <dt>Estimated freight</dt>
              <dd className="text-right font-semibold text-brand-700">Confirmed after review</dd>
            </div>
            <div className="flex justify-between border-t border-navy-100 pt-2.5 text-navy-900">
              <dt className="font-semibold">Estimated total</dt>
              <dd className="font-display text-base font-bold">{inr(round2(cart.subtotal + cart.taxTotal))}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[10.5px] leading-relaxed text-navy-400">
            Final payable = product value + applicable GST + confirmed freight. Product base prices are centralised and do not include freight.
          </p>
          <Link href="/checkout" className="btn btn-brand mt-4 w-full">Proceed to Checkout</Link>
          <Link href="/bulk-orders" className="btn btn-ghost mt-2 w-full !py-2 !text-[12px]">Convert to bulk enquiry</Link>
          <div className="mt-4 space-y-1.5 border-t border-navy-100 pt-3 text-[10.5px] text-navy-400">
            <p>✓ Guest checkout — no account required</p>
            <p>✓ GSTIN accepted for B2B invoicing</p>
            <p>✓ Freight reviewed against delivery pincode</p>
          </div>
        </div>
        {freightOpen > 0 ? (
          <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50/70 p-3.5 text-[11px] leading-relaxed text-brand-900">
            <p className="font-semibold">Freight note</p>
            <p className="mt-1 text-brand-800/80">
              Freight is charged separately and depends on delivery location, order quantity, shipment mode and transporter charges. We confirm the amount on your order before payment.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
