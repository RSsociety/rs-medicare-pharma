"use client";

import { useState } from "react";
import { inr } from "@/lib/pricing";
import type { ProductWithMeta } from "@/lib/queries";

const TABS = ["Overview", "Specifications", "Applications", "Packaging", "Shipping", "FAQ"] as const;

export function ProductTabs({ product }: { product: ProductWithMeta }) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Overview");
  const specs = Object.entries(product.specifications ?? {});

  return (
    <div className="rounded-2xl border border-navy-100 bg-white shadow-card">
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-navy-100 px-3 pt-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`shrink-0 rounded-t-lg px-3.5 py-2.5 text-[12.5px] font-semibold transition ${
              active === tab
                ? "border-b-2 border-brand-500 text-navy-900"
                : "border-b-2 border-transparent text-navy-400 hover:text-navy-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6">
        {active === "Overview" ? (
          <div className="prose-premium max-w-3xl">
            <h3 className="!mt-0 text-[15px] font-bold text-navy-900">Product overview</h3>
            <p>{product.description || product.shortDescription}</p>
            <div className="mt-4 grid gap-3 rounded-xl bg-navy-50/60 p-4 text-[12px] sm:grid-cols-2">
              <p className="!mb-0"><span className="font-semibold text-navy-800">Brand:</span> {product.brandName}</p>
              <p className="!mb-0"><span className="font-semibold text-navy-800">Category:</span> {product.categoryName}</p>
              <p className="!mb-0"><span className="font-semibold text-navy-800">Subcategory:</span> {product.subcategory}</p>
              <p className="!mb-0"><span className="font-semibold text-navy-800">Product code:</span> {product.sku}</p>
            </div>
          </div>
        ) : null}

        {active === "Specifications" ? (
          <div>
            <h3 className="text-[15px] font-bold text-navy-900">Declared specifications</h3>
            <p className="mt-1 text-[11.5px] text-navy-400">
              Indicative specifications for procurement comparison. Confirm critical parameters with the sales desk before ordering.
            </p>
            <dl className="mt-4 overflow-hidden rounded-xl border border-navy-100">
              {specs.map(([key, value], index) => (
                <div key={key} className={`grid grid-cols-[1fr_1.2fr] gap-3 px-4 py-2.5 text-[12.5px] ${index % 2 === 0 ? "bg-navy-50/40" : "bg-white"}`}>
                  <dt className="font-medium text-navy-500">{key}</dt>
                  <dd className="font-semibold text-navy-800">{value}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_1.2fr] gap-3 bg-navy-50/40 px-4 py-2.5 text-[12.5px]">
                <dt className="font-medium text-navy-500">Base price</dt>
                <dd className="font-semibold text-navy-800">{inr(product.basePrice)} / {product.unit}</dd>
              </div>
              <div className="grid grid-cols-[1fr_1.2fr] gap-3 px-4 py-2.5 text-[12.5px]">
                <dt className="font-medium text-navy-500">Tax</dt>
                <dd className="font-semibold text-navy-800">{product.taxRate}% GST (applied at checkout)</dd>
              </div>
            </dl>
          </div>
        ) : null}

        {active === "Applications" ? (
          <div>
            <h3 className="text-[15px] font-bold text-navy-900">Intended use environments</h3>
            <p className="mt-1 text-[11.5px] text-navy-400">
              Selection guidance only. Suitability for a specific clinical protocol must be assessed by the purchasing facility.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(product.applications ?? []).map((application) => (
                <span key={application} className="chip bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-100">{application}</span>
              ))}
            </div>
            <ul className="prose-premium mt-4">
              <li>Designed for trade and institutional procurement, not individual consumer use.</li>
              <li>Storage and handling instructions follow the product label and batch documentation.</li>
              <li>Bulk requirements can be quoted through the institutional enquiry desk.</li>
            </ul>
          </div>
        ) : null}

        {active === "Packaging" ? (
          <div>
            <h3 className="text-[15px] font-bold text-navy-900">Packaging & order quantities</h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Pack size", value: product.packSize ?? "—" },
                { label: "Ordering unit", value: product.unit },
                { label: "Minimum order quantity", value: `${product.moq} ${product.unit}(s)` },
                { label: "Internal product code", value: product.sku },
                { label: "Shipping weight basis", value: product.weight ?? "Confirmed at freight review" },
                { label: "Stock status", value: product.stockQuantity > 0 ? "Available" : "Out of stock" },
              ].map((row) => (
                <div key={row.label} className="rounded-xl border border-navy-100 bg-navy-50/40 px-4 py-3">
                  <dt className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-navy-400">{row.label}</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-navy-800">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {active === "Shipping" ? (
          <div className="prose-premium max-w-3xl">
            <h3 className="!mt-0 text-[15px] font-bold text-navy-900">Shipping & freight</h3>
            <p>
              Product prices are centralised and do not include freight. After your order is received,
              our team reviews the delivery pincode, order volume, shipment weight and mode, then
              confirms the freight amount on your order. You can follow the update using your Order ID.
            </p>
            <ul>
              <li>Freight is billed as a separate line item on the invoice.</li>
              <li>Dispatch timelines are confirmed after stock and freight review.</li>
              <li>Tracking details are added to the order when the consignment is handed to the transporter.</li>
              <li>For scheduled institutional supply, ask about recurring dispatch arrangements.</li>
            </ul>
          </div>
        ) : null}

        {active === "FAQ" ? (
          <div className="space-y-3">
            {[
              {
                q: "Can I order this product without creating an account?",
                a: "Yes. Add the product to your cart and complete guest checkout with your business and delivery details.",
              },
              {
                q: "Is the price inclusive of GST and freight?",
                a: "No. The base price is shown per unit. Applicable GST is added at checkout, and freight is confirmed separately after delivery-location review.",
              },
              {
                q: "Can I request a different pack configuration?",
                a: "Pack configurations depend on availability. Send a bulk enquiry with your required quantity and we will confirm the closest available configuration.",
              },
              {
                q: "Are technical documents available?",
                a: "Product documentation available with the consignment or on request is shared through the sales desk. No certification or approval claim is made on this page unless specifically stated.",
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-navy-100 bg-navy-50/30 px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-semibold text-navy-900">
                  {item.q}
                  <span className="text-navy-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-[12.5px] leading-relaxed text-navy-500">{item.a}</p>
              </details>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
