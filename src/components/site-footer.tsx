import Link from "next/link";
import { Logo } from "@/components/ui";
import { site, whatsappLink } from "@/lib/site";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "How to Order", href: "/how-to-order" },
      { label: "Distributor Network", href: "/distributor-network" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Glov-X Range", href: "/glov-x" },
      { label: "Glov-X Products", href: "/glov-x/products" },
      { label: "Categories", href: "/categories" },
      { label: "Product Catalogue", href: "/catalogue" },
      { label: "Offers", href: "/offers" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Bulk & Institutional", href: "/bulk-orders" },
      { label: "Become a Dealer", href: "/become-a-dealer" },
      { label: "Hospital & Clinic Supply", href: "/hospital-supply" },
      { label: "Retailer Enquiry", href: "/dealer-enquiry" },
      { label: "Business Enquiry", href: "/business-enquiry" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track Order", href: "/track" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping & Freight", href: "/shipping-policy" },
      { label: "Returns & Cancellation", href: "/returns-policy" },
      { label: "Cart", href: "/cart" },
      { label: "Admin Login", href: "/admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="shell grid gap-10 py-14 lg:grid-cols-[1.35fr_2.6fr]">
        <div>
          <Logo variant="light" />
          <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-white/60">
            A B2B pharmaceutical and medical-products distribution partner for retailers, clinics,
            hospitals, diagnostic centres and wholesalers. Centralised pricing, transparent
            GST, and freight confirmed per delivery location.
          </p>
          <div className="mt-6 space-y-2.5 text-[13px] text-white/70">
            <p className="flex gap-2.5">
              <span className="mt-0.5 text-brand-400" aria-hidden>◈</span>
              <span>
                {site.address.line1}
                <br />
                {site.address.city}, {site.address.state} {site.address.pincode}, {site.address.country}
              </span>
            </p>
            <p className="flex gap-2.5">
              <span className="text-brand-400" aria-hidden>◈</span>
              <a href={`tel:${site.phoneHref}`} className="hover:text-white">{site.phone}</a>
            </p>
            <p className="flex gap-2.5">
              <span className="text-brand-400" aria-hidden>◈</span>
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </p>
            <p className="flex gap-2.5">
              <span className="text-brand-400" aria-hidden>◈</span>
              <span>{site.hours}</span>
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={whatsappLink("Hello RS Medicare Pharma, I would like to enquire about your products.")} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light !py-2 !text-[12px]">
              WhatsApp Enquiry
            </a>
            <Link href="/bulk-orders" className="btn btn-brand !py-2 !text-[12px]">Request Bulk Quote</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[13px] text-white/70 transition hover:text-brand-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-5 text-[11.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved. {site.gstin}.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white/80">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/80">Terms & Conditions</Link>
            <Link href="/returns-policy" className="hover:text-white/80">Refund / Cancellation</Link>
          </div>
        </div>
        <div className="shell pb-6">
          <p className="max-w-4xl text-[10.5px] leading-relaxed text-white/30">
            Product images and specifications are indicative. Availability, packaging and batch
            details are confirmed at order review. Product information on this website is intended
            for trade and institutional buyers and is not medical advice. No certification,
            partnership, review or performance claim is made unless explicitly stated in supply
            documentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
