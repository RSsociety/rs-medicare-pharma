import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Shipping & Freight Policy",
  description: "How RS Medicare Pharma handles dispatch, freight calculation and delivery for B2B pharmaceutical and medical product orders.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      slug="RSM-POL-SHIP-01"
      eyebrow="Policies"
      title="Shipping & Freight Policy"
      description="How freight is calculated, confirmed and billed separately from centralised product prices."
      updated="1 January 2026"
      sections={[
        {
          heading: "Freight is separate from product price",
          body: [
            "Product prices in the catalogue are centralised base prices per unit and do not include freight. This keeps the same base price available across markets and allows freight to be calculated against the actual delivery requirement.",
            "The final payable amount is product value plus applicable GST plus confirmed freight, less any approved discount. Freight is itemised separately on the invoice.",
          ],
        },
        {
          heading: "Manual freight review (default)",
          body: [
            "By default, orders are placed with freight under review. Our dispatch team reviews the delivery pincode, order quantity, shipment weight, mode of transport and any applicable minimum freight charges.",
            "The confirmed freight amount is then added to the order and visible on the order tracking page. Payment instructions are updated at the same time.",
          ],
        },
        {
          heading: "Automated freight (optional)",
          body: [
            "Where automated freight is enabled by our admin team, the platform applies a configured freight rule or flat amount at checkout, with an optional order-value threshold for freight waiver.",
            "Automated freight is an estimate of the applicable charge; dispatch may still review exceptional consignments such as out-of-area delivery or special handling requirements.",
          ],
        },
        {
          heading: "Dispatch timelines",
          body: [
            "Dispatch is scheduled after stock confirmation and freight review. Timelines vary by product, quantity and delivery location, and are communicated against the specific order rather than as a blanket website promise.",
            "Where a product line is short, we inform the customer and offer an alternative configuration, a partial dispatch or a revised timeline.",
          ],
          list: [
            "Dispatch is subject to transporter availability and route schedules.",
            "Transporter name and tracking number are added to the order after handover.",
            "Delivery to institutional addresses may require a receiving contact and gate entry details.",
          ],
        },
        {
          heading: "Delivery, risk and inspection",
          body: [
            "Customers should inspect consignments at the time of delivery and record any visible damage or shortage on the delivery documentation.",
            "Title and risk in the goods pass in accordance with the supply terms agreed for the order. Please report transit damage within 48 hours of delivery with photographs and the order reference.",
          ],
        },
        {
          heading: "Address and contact accuracy",
          body: [
            "Freight and delivery depend on the address, pincode and contact number provided at checkout. Re-delivery or address-correction charges caused by incorrect details may be billed to the customer.",
            "If you require delivery to multiple locations, split the requirement into separate orders or discuss a consolidated dispatch plan with our team.",
          ],
        },
      ]}
    />
  );
}
