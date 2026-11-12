import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/site";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <SiteHeader
        announcement={settings.announcement}
        phone={settings.companyPhone}
        whatsappLink={whatsappLink()}
      />
      <main id="main">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
