import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/data/mock-data";
import "./globals.css";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/oram-media-logo.png`,
  description: siteConfig.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressCountry: siteConfig.address.country,
  },
  telephone: siteConfig.phone,
  email: siteConfig.email,
  sameAs: Object.values(siteConfig.social as Record<string, string>).filter(
    (v) => typeof v === "string" && v.startsWith("http"),
  ),
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  robots:
    process.env.CF_ENV === "staging"
      ? { index: false, follow: false }
      : { index: true, follow: true },
  icons: {
    icon: "/brand/oram-media-logo.png",
    apple: "/brand/oram-media-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: "/projects/inkondo-billboard.jpg",
        width: 2048,
        height: 682,
        alt: "Inkondo — Oram Media Dynamics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/projects/inkondo-billboard.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="grain min-h-full flex flex-col bg-background font-sans text-foreground">
        <JsonLd data={organizationSchema} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
