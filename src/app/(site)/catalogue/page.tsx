import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { PrintButton } from "@/components/print-button";
import { PageHero } from "@/components/ui";
import { inr } from "@/lib/pricing";
import { getCategories, getProducts } from "@/lib/queries";
import { site, whatsappLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product Catalogue — Download & Share",
  description:
    "Download or print the RS Medicare Pharma product catalogue with Glov-X specifications, categories and contact details, including a QR code to the online catalogue.",
  alternates: { canonical: "/catalogue" },
};

export default async function CataloguePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const groups = ["glovx", "consumables", "pharma"] as const;
  const groupTitles: Record<string, string> = {
    glovx: "Glov-X — Examination Gloves",
    consumables: "Medical Consumables",
    pharma: "Pharmaceuticals",
  };
  const qrCatalogue = await QRCode.toDataURL(`${site.url}/products`, { margin: 1, width: 220 });
  const qrWhatsapp = await QRCode.toDataURL(whatsappLink("Hello RS Medicare Pharma, please share your latest availability and pricing."), { margin: 1, width: 220 });

  return (
    <>
      <div className="no-print">
        <PageHero
          eyebrow="Catalogue"
          title="Product catalogue for procurement teams"
          description="Print this page or save it as a PDF from your browser. The catalogue includes range summaries, pricing structure and contact details with QR codes to the live catalogue and WhatsApp desk."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Catalogue" }]}
        >
          <PrintButton label="Print / Save as PDF" />
          <Link href="/products" className="btn btn-outline-light">Browse Live Catalogue</Link>
        </PageHero>
      </div>

      <section className="shell py-10 sm:py-14">
        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-navy-100 pb-6">
            <div>
              <p className="font-display text-2xl font-extrabold tracking-tight text-navy-900">RS MEDICARE PHARMA</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-700">Pharmaceutical & Medical Products Supply</p>
              <p className="mt-3 max-w-md text-[11.5px] leading-relaxed text-navy-500">
                B2B distribution of pharmaceutical products and medical consumables, including the Glov-X
                examination glove range. Base prices are centralised; GST and freight are shown separately.
              </p>
              <div className="mt-3 space-y-0.5 text-[11px] text-navy-600">
                <p>{site.address.line1}, {site.address.city}, {site.address.state} {site.address.pincode}</p>
                <p>{site.phone} · {site.email}</p>
                <p>{site.hours}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCatalogue} alt="QR code to online catalogue" className="h-24 w-24 rounded-lg border border-navy-100" />
                <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-navy-400">Catalogue</p>
              </div>
              <div className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrWhatsapp} alt="QR code to WhatsApp sales desk" className="h-24 w-24 rounded-lg border border-navy-100" />
                <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-navy-400">WhatsApp</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Product base price", value: "Centralised per unit" },
              { label: "Applicable GST", value: "Calculated at checkout" },
              { label: "Freight", value: "Confirmed per delivery location" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-navy-100 bg-navy-50/50 px-3 py-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-navy-400">{item.label}</p>
                <p className="mt-0.5 text-[11.5px] font-semibold text-navy-800">{item.value}</p>
              </div>
            ))}
          </div>

          {groups.map((group) => {
            const items = products.filter((product) => product.categoryGroup === group);
            if (items.length === 0) return null;
            return (
              <div key={group} className="mt-7">
                <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-brand-700">{groupTitles[group]}</h2>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-[11px]">
                    <thead className="border-b border-navy-200 text-[9px] uppercase tracking-[0.1em] text-navy-400">
                      <tr>
                        <th className="py-2 pr-3 font-semibold">Product</th>
                        <th className="py-2 pr-3 font-semibold">SKU</th>
                        <th className="py-2 pr-3 font-semibold">Pack</th>
                        <th className="py-2 pr-3 font-semibold">MOQ</th>
                        <th className="py-2 pr-3 font-semibold">GST</th>
                        <th className="py-2 text-right font-semibold">Base price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100">
                      {items.map((product) => (
                        <tr key={product.id}>
                          <td className="py-2 pr-3 font-medium text-navy-900">{product.name}</td>
                          <td className="py-2 pr-3 text-navy-500">{product.sku}</td>
                          <td className="py-2 pr-3 text-navy-500">{product.packSize}</td>
                          <td className="py-2 pr-3 text-navy-500">{product.moq} {product.unit}</td>
                          <td className="py-2 pr-3 text-navy-500">{product.taxRate}%</td>
                          <td className="py-2 text-right font-semibold text-navy-900">{inr(product.basePrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          <div className="mt-7 grid gap-3 border-t border-navy-100 pt-5 sm:grid-cols-2">
            <div>
              <h3 className="text-[11.5px] font-bold text-navy-900">Category index</h3>
              <p className="mt-1 text-[10.5px] leading-relaxed text-navy-500">
                {categories.filter((category) => !category.parentId).map((category) => category.name).join(" · ")}
              </p>
            </div>
            <div className="sm:text-right">
              <h3 className="text-[11.5px] font-bold text-navy-900">How to order</h3>
              <p className="mt-1 text-[10.5px] leading-relaxed text-navy-500">
                Online at {site.url}/products · Guest checkout · Bulk quotes via {site.email}
              </p>
            </div>
          </div>
          <p className="mt-5 text-[9px] leading-relaxed text-navy-400">
            Catalogue generated from the live product database. Prices and availability may change; confirm at the time of order.
            Images and specifications are indicative. No certification or regulatory approval claim is made in this catalogue.
          </p>
        </div>
      </section>
    </>
  );
}
