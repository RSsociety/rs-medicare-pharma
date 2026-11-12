import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { PageHero } from "@/components/ui";
import { enabledPaymentMethods, getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout — Guest Order",
  description: "Complete your RS Medicare Pharma order as a guest. Business details, delivery address, GST and freight review.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const settings = await getSettings();
  const paymentOptions = enabledPaymentMethods(settings).map((method) => ({
    value: method.value,
    label: method.label,
  }));

  return (
    <>
      <PageHero
        eyebrow="Guest checkout"
        title="Place your order — no account required"
        description="Enter your business and delivery details. Applicable GST is calculated automatically and freight is reviewed against your location before dispatch."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <section className="shell py-10 sm:py-14">
        <CheckoutForm
          paymentOptions={paymentOptions.length > 0 ? paymentOptions : [{ value: "bank_transfer", label: "Bank Transfer / NEFT" }]}
          taxEnabled={settings.taxEnabled}
        />
      </section>
    </>
  );
}
