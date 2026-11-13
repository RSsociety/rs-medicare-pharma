import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Returns & Cancellation Policy",
  description: "Cancellation, return and replacement conditions for pharmaceutical and medical consumable orders supplied by RS Medicare Pharma.",
  alternates: { canonical: "/returns-policy" },
};

export default function ReturnsPolicyPage() {
  return (
    <LegalPage
      slug="RSM-POL-RET-01"
      eyebrow="Policies"
      title="Returns & Cancellation Policy"
      description="Cancellation windows, return eligibility and the process for reporting a supply issue."
      updated="1 January 2026"
      sections={[
        {
          heading: "Before dispatch",
          body: [
            "Orders can generally be cancelled before dispatch. Contact our support desk with the Order ID as early as possible. Freight already incurred for a consignment in transit may still be payable.",
            "Where an order is placed under freight review, cancellation before freight confirmation carries no freight charge.",
          ],
        },
        {
          heading: "After dispatch",
          body: [
            "Once dispatched, cancellation is not guaranteed and depends on the transporter stage and product category. We will advise the available options against your specific order.",
          ],
        },
        {
          heading: "Return eligibility",
          body: [
            "Returns are accepted for wrong item supply, damaged consignment, short quantity or a documented quality concern. Requests must be raised within 48 hours of delivery.",
            "To keep handling traceable, please retain the original packaging, batch label and delivery documentation until the request is resolved.",
          ],
          list: [
            "Photographs of the issue and the batch label are required.",
            "Sealed, unused product in original packing may be considered for return at management discretion.",
            "Opened, used or improperly stored products cannot be returned.",
            "Cold-chain, sterile or single-use products are accepted for return only where there is a documented supply defect.",
          ],
        },
        {
          heading: "Non-returnable situations",
          body: [
            "Returns are not accepted for products correctly supplied against the confirmed order, for packaging variations that do not affect product integrity, or for goods damaged after delivery due to storage or handling conditions.",
            "Special-order and clearance lines may be non-returnable; this is communicated before supply.",
          ],
        },
        {
          heading: "Replacement & credit",
          body: [
            "Where a return is approved, the resolution is a replacement, a credit note or a refund of the product value, at our discretion and in line with the applicable supply terms.",
            "Freight is generally not refundable unless the return arises from an error on our part. Refunds are processed to the original payment route where applicable.",
          ],
        },
        {
          heading: "How to raise a request",
          body: [
            "Use the contact page with your Order ID, product SKU, quantity affected and photographs. Our team will acknowledge the request and share the next steps.",
          ],
        },
      ]}
    />
  );
}
