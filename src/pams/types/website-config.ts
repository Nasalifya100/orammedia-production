/** ORAM OS Website Builder — configuration document shape */

export type HomepageSectionType =
  | "hero"
  | "featured"
  | "about"
  | "services"
  | "awards"
  | "bts"
  | "partners"
  | "journal"
  | "contact-cta"
  | "footer";

export interface HomepageSectionConfig {
  id: string;
  type: HomepageSectionType;
  enabled: boolean;
  order: number;
  label?: string;
  settings?: Record<string, unknown>;
}

export interface NavItem {
  label: string;
  href: string;
  enabled?: boolean;
  order?: number;
}

export interface FooterConfig {
  tagline?: string;
  copyright?: string;
  links?: NavItem[];
  showSocial?: boolean;
}

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface OpenGraphConfig {
  title?: string;
  description?: string;
  imagePath?: string;
  type?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  enabled?: boolean;
}

export interface BrandAssets {
  logoPath?: string;
  logoDarkPath?: string;
  faviconPath?: string;
}

export interface ThemeSettings {
  accentColor?: string;
  surfaceTone?: string;
}

export interface AnnouncementBanner {
  enabled: boolean;
  text: string;
  href?: string;
  dismissible?: boolean;
}

export interface HomepageCta {
  label: string;
  href: string;
}

/** Flagship production media selectors (resolved from PAMS entities) */
export interface FlagshipSelectors {
  productionSlug: string | null;
  heroPosterMediaId: string | null;
  heroVideoTrailerId: string | null;
  heroThumbnailMediaId: string | null;
  shareImageMediaId: string | null;
  featuredPosition: number;
}

/** Featured production slot on homepage */
export interface FeaturedProductionSlot {
  productionSlug: string;
  order: number;
  pinned: boolean;
  featured: boolean;
  hidden: boolean;
  archived: boolean;
  scheduleStart?: string | null;
  scheduleEnd?: string | null;
}

/** Resolved flagship media paths (computed at read/publish time) */
export interface ResolvedFlagshipMedia {
  productionSlug: string | null;
  productionTitle: string | null;
  heroPosterPath: string | null;
  heroVideoUrl: string | null;
  heroVideoMuxId: string | null;
  heroThumbnailPath: string | null;
  shareImagePath: string | null;
  missingHeroArtwork: boolean;
}

export interface WebsiteConfiguration {
  siteName: string;
  siteDescription: string;
  homepageLayout: string;
  homepageHeadline: string;
  homepageSubheadline: string;
  homepageEyebrow: string;
  homepageCtaPrimary: HomepageCta;
  homepageCtaSecondary: HomepageCta;
  flagship: FlagshipSelectors;
  resolvedFlagship?: ResolvedFlagshipMedia;
  featuredSlots: FeaturedProductionSlot[];
  sections: HomepageSectionConfig[];
  navigation: NavItem[];
  footer: FooterConfig;
  seo: SEOConfig;
  socialLinks: SocialLink[];
  openGraph: OpenGraphConfig;
  announcementBanner: AnnouncementBanner;
  maintenanceMode: boolean;
  theme: ThemeSettings;
  brandAssets: BrandAssets;
}

export type WebsiteConfigScope = "draft" | "published";

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  { id: "sec-hero", type: "hero", enabled: true, order: 0, label: "Hero" },
  { id: "sec-about", type: "about", enabled: true, order: 1, label: "About / Manifesto" },
  { id: "sec-featured", type: "featured", enabled: true, order: 2, label: "Featured Productions" },
  { id: "sec-services", type: "services", enabled: true, order: 3, label: "Services" },
  { id: "sec-partners", type: "partners", enabled: true, order: 4, label: "Partners" },
  { id: "sec-founder", type: "about", enabled: true, order: 5, label: "Founder", settings: { variant: "founder" } },
  { id: "sec-journal", type: "journal", enabled: true, order: 6, label: "Journal" },
  { id: "sec-contact", type: "contact-cta", enabled: true, order: 7, label: "Contact CTA" },
  { id: "sec-awards", type: "awards", enabled: false, order: 8, label: "Awards" },
  { id: "sec-bts", type: "bts", enabled: false, order: 9, label: "Behind the Scenes" },
  { id: "sec-footer", type: "footer", enabled: true, order: 10, label: "Footer" },
];

export const DEFAULT_FEATURED_ORDER = [
  "inkondo",
  "zuba",
  "graft",
  "look-in-the-mirror",
  "pa-maliketi",
  "hang",
  "girls-to-ladies",
  "secrets-untold",
  "the-wife",
];

export function createDefaultWebsiteConfiguration(): WebsiteConfiguration {
  return {
    siteName: "Oram Media Dynamics",
    siteDescription:
      "Film & television production from Lusaka, Zambia — drama series, features and branded films for Zambezi Magic, DStv, GOtv and Showmax.",
    homepageLayout: "editorial-cinematic",
    homepageHeadline: "Zambian stories, shot for the screen.",
    homepageSubheadline:
      "Oram Media Dynamics makes drama series, features and branded films from Lusaka — work that has aired on Zambezi Magic, DStv, GOtv and Showmax.",
    homepageEyebrow: "Film & television production · Lusaka, Zambia",
    homepageCtaPrimary: { label: "View Our Work", href: "/projects" },
    homepageCtaSecondary: { label: "Start a project", href: "/contact" },
    flagship: {
      productionSlug: "inkondo",
      heroPosterMediaId: null,
      heroVideoTrailerId: null,
      heroThumbnailMediaId: null,
      shareImageMediaId: null,
      featuredPosition: 1,
    },
    featuredSlots: DEFAULT_FEATURED_ORDER.map((slug, i) => ({
      productionSlug: slug,
      order: i,
      pinned: slug === "inkondo",
      featured: true,
      hidden: false,
      archived: false,
    })),
    sections: DEFAULT_HOMEPAGE_SECTIONS.map((s) => ({ ...s })),
    navigation: [
      { label: "Work", href: "/projects", enabled: true, order: 0 },
      { label: "About", href: "/about", enabled: true, order: 1 },
      { label: "Services", href: "/services", enabled: true, order: 2 },
      { label: "Journal", href: "/blog", enabled: true, order: 3 },
      { label: "Contact", href: "/contact", enabled: true, order: 4 },
    ],
    footer: {
      tagline: "Zambian stories, shot for the screen.",
      copyright: "© Oram Media Dynamics",
      showSocial: true,
    },
    seo: {
      title: "Oram Media Dynamics — Film & Television Production, Lusaka",
      description:
        "Oram Media Dynamics produces drama series, features and branded films from Lusaka, Zambia.",
      keywords: ["Zambian film", "television production", "Lusaka", "Zambezi Magic"],
    },
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/orammedia", enabled: true },
      { platform: "youtube", url: "https://youtube.com/@orammedia", enabled: true },
      { platform: "facebook", url: "https://facebook.com/orammedia", enabled: true },
    ],
    openGraph: {
      title: "Oram Media Dynamics",
      description: "Film & television production from Lusaka, Zambia.",
      imagePath: "/projects/inkondo-billboard.jpg",
      type: "website",
    },
    announcementBanner: { enabled: false, text: "", dismissible: true },
    maintenanceMode: false,
    theme: {},
    brandAssets: {
      logoPath: "/logo.svg",
      faviconPath: "/favicon.ico",
    },
  };
}
