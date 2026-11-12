import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-provider";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "RS Medicare Pharma | Pharmaceutical & Medical Products Supplier (B2B)",
    template: "%s | RS Medicare Pharma",
  },
  description: site.description,
  keywords: [
    "pharmaceutical distributor",
    "pharma distributor India",
    "medical products supplier",
    "medical consumables supplier",
    "nitrile gloves supplier",
    "examination gloves supplier",
    "medical gloves distributor",
    "hospital medical supplies",
    "clinic medical supplies",
    "B2B medical products",
    "pharmaceutical wholesale supplier",
    "medical disposable products supplier",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: "RS Medicare Pharma | Pharmaceutical & Medical Products Supplier (B2B)",
    description: site.description,
    images: [{ url: "/images/hero-supply.jpg", width: 1200, height: 630, alt: "RS Medicare Pharma distribution operations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RS Medicare Pharma | B2B Pharma & Medical Products Supply",
    description: site.description,
    images: ["/images/hero-supply.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "business",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organisationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.pincode,
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phone,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en-IN">
      <body className="bg-white text-navy-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <a
          href="#main"
          className="no-print sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
