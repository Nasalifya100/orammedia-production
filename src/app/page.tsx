import type { Metadata } from "next";
import { HomePageView } from "@/components/pages/HomePageView";
import {
  getWebsiteConfiguration,
} from "@/lib/data/website";
import { siteConfig } from "@/lib/data/mock-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getWebsiteConfiguration("published");
  const ogImage = config.openGraph.imagePath ?? "/projects/inkondo-billboard.jpg";

  return {
    title: config.seo.title ?? `${config.siteName} — ${siteConfig.tagline}`,
    description: config.seo.description ?? config.siteDescription,
    openGraph: {
      title: config.openGraph.title ?? config.siteName,
      description: config.openGraph.description ?? config.siteDescription,
      images: [{ url: ogImage, alt: config.openGraph.title ?? config.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: config.openGraph.title ?? config.siteName,
      description: config.openGraph.description ?? config.siteDescription,
      images: [ogImage],
    },
  };
}

export default function HomePage() {
  return <HomePageView scope="published" />;
}
