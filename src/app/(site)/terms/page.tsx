import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms governing the use of the RS Medicare Pharma website and the placement of B2B product orders.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      slug="RSM-POL-TERM-01"
      eyebrow="Legal"
      title="Terms & Conditions"
      description="Website use, order acceptance, pricing structure and supply conditions."
      updated="1 January 2026"
      sections={[
        {
          heading: "Business use",
          body: [
            "This website is intended for trade and institutional buyers — retailers, chemists, clinics, hospitals, diagnostic centres, distributors and healthcare businesses. Products and information are not directed at individual consumers seeking personal medical advice.",
            "By placing an order you confirm that you are authorised to purchase on behalf of your business or institution.",
          ],
        },
        {
          heading: "Product information",
          body: [
            "Product descriptions, images, specifications and packing details are indicative and are provided to support procurement decisions. Batch details, labelling and packaging may vary between consignments.",
            "No claim of certification, regulatory approval, sterility or protection level is made unless explicitly stated in the supply documentation for the relevant batch. Buyers must validate suitability for their own use.",
          ],
        },
        {
          heading: "Order acceptance",
          body: [
            "An order acknowledgement is not acceptance. Orders are reviewed for stock availability, delivery feasibility and freight; we may revise quantities, decline a line, or cancel an order where the requirement cannot be fulfilled.",
            "Orders may be flagged for review where values, quantities or delivery details appear unusual. We may request additional verification before processing.",
          ],
        },
        {
          heading: "Pricing, tax and freight",
          body: [
            "Catalogue prices are centralised base prices per unit. Applicable GST is calculated at checkout based on the product tax rate. Freight is charged separately and confirmed after delivery-location review unless automated freight is enabled.",
            "We may correct pricing or tax errors before dispatch. If a correction affects your order materially, we will contact you before proceeding.",
          ],
        },
        {
          heading: "Payment",
          body: [
            "Enabled payment methods are shown at checkout and can be changed by our admin team. Orders are processed after payment confirmation, or against agreed terms for approved accounts.",
            "Where manual payment verification is used, proof of payment must reference the Order ID.",
          ],
        },
        {
          heading: "Cancellation & returns",
          body: [
            "Cancellation and return requests are governed by our Returns & Cancellation Policy, including the reporting window and documentation requirements.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "Our liability for any order is limited to the invoiced value of the affected goods, except where liability cannot be limited by law. We are not liable for indirect or consequential losses arising from a supply delay.",
            "Buyers are responsible for regulatory, licensing and storage compliance applicable to their own facility.",
          ],
        },
        {
          heading: "Governing law",
          body: [
            "These terms are governed by the laws of India, with jurisdiction of courts at the location of our registered distribution office.",
          ],
        },
      ]}
    />
  );
}
