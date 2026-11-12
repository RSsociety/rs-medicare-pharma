import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your RS Medicare Pharma order before guest checkout.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Your order"
        title="Review your cart"
        description="Adjust quantities, remove lines or continue browsing. Product value and GST are shown separately; freight is confirmed after delivery-location review."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />
      <section className="shell py-10 sm:py-14">
        <CartView />
      </section>
    </>
  );
}
