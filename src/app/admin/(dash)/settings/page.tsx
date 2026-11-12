import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/settings";
import { defaultSettings } from "@/db/seed-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Settings", robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Website & commerce settings</h1>
        <p className="mt-1 text-[12px] text-slate-500">
          Control contact details, tax and freight behaviour, payment methods and risk thresholds. Values are stored in the database and applied across the storefront.
        </p>
      </div>
      <SettingsForm initial={{ ...defaultSettings, ...settings }} />
    </div>
  );
}
