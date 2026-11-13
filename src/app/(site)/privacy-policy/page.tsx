import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How RS Medicare Pharma collects, uses and protects customer and enquiry information on this website.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      slug="RSM-POL-PRIV-01"
      eyebrow="Legal"
      title="Privacy Policy"
      description="What we collect when you browse, enquire or order — and how that information is used."
      updated="1 January 2026"
      sections={[
        {
          heading: "Information we collect",
          body: [
            "When you place an order or submit an enquiry, we collect the details you provide: name, business name, mobile number, email address, GSTIN, customer type, delivery address, ordered items and order notes.",
            "We also process limited technical information required to operate and secure the website, such as request metadata used for rate limiting and abuse prevention.",
          ],
        },
        {
          heading: "How the information is used",
          body: [
            "Order and enquiry details are used to respond to your requirement, confirm stock and freight, issue order documentation, provide support and maintain customer records.",
            "We do not sell personal information. Customer records are used for legitimate business communication connected to your enquiry or order.",
          ],
        },
        {
          heading: "Payment information",
          body: [
            "This website does not collect or store card numbers, CVV codes or banking credentials. Where a payment gateway is enabled, payment details are handled by the gateway provider on their secure infrastructure.",
            "Bank transfer or UPI references shared with our team are used only to reconcile the corresponding order payment.",
          ],
        },
        {
          heading: "Sharing with service partners",
          body: [
            "Limited information may be shared with transporters, logistics partners and service providers strictly as needed to fulfil an order, issue invoices or operate the website.",
          ],
        },
        {
          heading: "Data retention & security",
          body: [
            "Order and enquiry records are retained for business, accounting and compliance purposes for as long as necessary. Access is restricted to authorised staff through authenticated administration.",
            "We apply reasonable technical and organisational safeguards. No online system can be guaranteed as completely secure, so please share sensitive information only through appropriate channels.",
          ],
        },
        {
          heading: "Your choices",
          body: [
            "You can request access, correction or deletion of the customer information we hold, subject to legal and accounting retention requirements. Write to our sales email with your registered mobile number and order reference.",
            "You may also opt out of non-essential communication at any time.",
          ],
        },
      ]}
    />
  );
}
