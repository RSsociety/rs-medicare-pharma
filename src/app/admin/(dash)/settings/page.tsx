import type { Metadata } from "next";
import { FooterEditor } from "@/components/admin/footer-editor";
import { SettingsForm } from "@/components/admin/settings-form";
import { getFooterConfig, getSettings } from "@/lib/settings";
import { defaultSettings } from "@/db/seed-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Settings", robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const footer = await getFooterConfig();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Website & commerce settings</h1>
        <p className="mt-1 text-[12px] text-slate-500">
          Control contact details, tax and freight behaviour, payment methods and risk thresholds. Values are stored in the database and applied across the storefront.
        </p>
      </div>
      <SettingsForm initial={{ ...defaultSettings, ...settings }} />

      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-900">Website footer</h2>
        <p className="mt-1 text-[12px] text-slate-500">
          Control the description, link columns, social media links, copyright line and legal disclaimer shown in the footer of every page.
          Phone, email and address are edited in the settings form above.
        </p>
        <div className="mt-4">
          <FooterEditor initial={footer} />
        </div>
      </div>
    </div>
  );
}
