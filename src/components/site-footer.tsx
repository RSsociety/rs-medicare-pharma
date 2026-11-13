import Link from "next/link";
import { Logo } from "@/components/ui";
import type { FooterConfig } from "@/lib/settings";
import { site, whatsappLink } from "@/lib/site";

const socialIcons: Record<keyof FooterConfig["socials"], string> = {
  facebook: "M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.5-1.5h1.7V4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.5v8h3.5Z",
  instagram: "M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 8.2c0-1.4-.4-2.6-1.4-3.6s-2.2-1.4-3.6-1.4H8.9C7.6 3.1 6.3 3.5 5.4 4.4S4 6.8 4 8.2v6.9c0 1.4.4 2.6 1.4 3.6s2.2 1.4 3.6 1.4h7.2c1.4 0 2.6-.4 3.6-1.4s1.4-2.2 1.4-3.6V8.2Zm-1.8 7c0 .8-.2 1.4-.8 2s-1.2.8-2 .8H8.6c-.8 0-1.4-.2-2-.8s-.8-1.2-.8-2V8.4c0-.8.2-1.4.8-2s1.2-.8 2-.8h7.8c.8 0 1.4.2 2 .8s.8 1.2.8 2v6.8Z",
  linkedin: "M6.9 20H3.6V9.6h3.3V20ZM5.2 8.2a1.9 1.9 0 1 1 0-3.9 1.9 1.9 0 0 1 0 3.9ZM20.4 20h-3.3v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.4-2 2.7V20h-3.3V9.6h3.2v1.4h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5V20Z",
  youtube: "M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15.5v-7l5.2 3.5-5.2 3.5Z",
};

type SiteFooterProps = {
  config: FooterConfig;
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    address: string;
    hours: string;
    gstin: string;
  };
};

export function SiteFooter({ config, contact }: SiteFooterProps) {
  const socialEntries = (
    Object.entries(config.socials) as [keyof FooterConfig["socials"], string][]
  ).filter(([, href]) => href);

  return (
    <footer className="bg-navy-950 text-white">
      <div className="shell grid gap-10 py-14 lg:grid-cols-[1.35fr_2.6fr]">
        <div>
          <Logo variant="light" />
          <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-white/60">{config.description}</p>

          <div className="mt-6 space-y-2.5 text-[13px] text-white/70">
            <p className="flex gap-2.5">
              <span className="mt-0.5 text-brand-400" aria-hidden>◈</span>
              <span>{contact.address}</span>
            </p>
            <p className="flex gap-2.5">
              <span className="text-brand-400" aria-hidden>◈</span>
              <a href={`tel:${contact.phoneHref}`} className="hover:text-white">{contact.phone}</a>
            </p>
            <p className="flex gap-2.5">
              <span className="text-brand-400" aria-hidden>◈</span>
              <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
            </p>
            <p className="flex gap-2.5">
              <span className="text-brand-400" aria-hidden>◈</span>
              <span>{contact.hours}</span>
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={whatsappLink("Hello RS Medicare Pharma, I would like to enquire about your products.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light !py-2 !text-[12px]"
            >
              WhatsApp Enquiry
            </a>
            <Link href="/bulk-orders" className="btn btn-brand !py-2 !text-[12px]">Request Bulk Quote</Link>
          </div>

          {socialEntries.length > 0 ? (
            <div className="mt-5 flex gap-2">
              {socialEntries.map(([network, href]) => (
                <a
                  key={network}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={network}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/70 transition hover:border-brand-400 hover:bg-white/10 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d={socialIcons[network]} />
                  </svg>
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {config.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link, index) => (
                  <li key={`${link.href}-${index}`}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-white/70 transition hover:text-brand-300"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-[13px] text-white/70 transition hover:text-brand-300">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-5 text-[11.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {config.copyright ||
              `© ${new Date().getFullYear()} ${site.name}. All rights reserved. ${contact.gstin}.`}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white/80">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/80">Terms &amp; Conditions</Link>
            <Link href="/returns-policy" className="hover:text-white/80">Refund / Cancellation</Link>
          </div>
        </div>
        {config.disclaimer ? (
          <div className="shell pb-6">
            <p className="max-w-4xl text-[10.5px] leading-relaxed text-white/30">{config.disclaimer}</p>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
