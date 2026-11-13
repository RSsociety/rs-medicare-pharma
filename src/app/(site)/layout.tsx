import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getFooterConfig, getSettings } from "@/lib/settings";
import { site, whatsappLink } from "@/lib/site";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  const footer = await getFooterConfig();

  return (
    <>
      <SiteHeader
        announcement={settings.announcement}
        phone={settings.companyPhone}
        whatsappLink={whatsappLink()}
      />
      <main id="main">{children}</main>
      <SiteFooter
        config={footer}
        contact={{
          phone: settings.companyPhone,
          phoneHref: (settings.companyPhone || site.phone).replace(/\s/g, ""),
          email: settings.salesEmail,
          address: settings.officeAddress,
          hours: settings.businessHours,
          gstin: site.gstin,
        }}
      />
      <WhatsAppFloat />
    </>
  );
}
