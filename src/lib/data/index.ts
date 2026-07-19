/**
 * Public data layer — PAMS (database) is the source of truth.
 * Mock remains emergency fallback when the archive DB is empty.
 * Server-only: never import this module from Client Components.
 */
import "server-only";
import { productionService } from "@/pams/services/production.service";
import { getCachedPublishedProjects } from "@/lib/data/production-cache";
import { siteSettingsService } from "@/pams/services/site-settings.service";
import { getDb } from "@/pams/db";
import {
  projects as mockProjects,
  services as mockServices,
  testimonials as mockTestimonials,
  teamMembers as mockTeam,
  awards as mockAwards,
  clientLogos as mockClientLogos,
  getFeaturedProjects as getMockFeatured,
  getProjectBySlug as getMockProjectBySlug,
  getServiceBySlug as getMockServiceBySlug,
  getTestimonialsByService as getMockTestimonialsByService,
} from "@/lib/data/mock-data";
import { getOramFacebookData } from "@/lib/facebook/client";
import type {
  Award,
  ClientLogo,
  Project,
  Service,
  ShowreelConfig,
  TeamMember,
  Testimonial,
} from "@/types";

export { siteConfig } from "@/lib/data/mock-data";

async function pamsReady(): Promise<boolean> {
  try {
    return await productionService.isReady();
  } catch (error) {
    console.error("[pams] unavailable, falling back:", error);
    return false;
  }
}

export async function getProjects(): Promise<Project[]> {
  if (await pamsReady()) {
    return getCachedPublishedProjects();
  }
  return mockProjects.filter((p) => p.published !== false);
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  if (await pamsReady()) {
    return productionService.getPublishedBySlug(slug);
  }
  return getMockProjectBySlug(slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (await pamsReady()) {
    return productionService.listFeaturedProjects();
  }
  return getMockFeatured();
}

export async function getProjectsByCategory(
  category: string,
): Promise<Project[]> {
  const all = await getProjects();
  if (category === "all") {
    return [...all].sort((a, b) => a.order - b.order);
  }
  return all
    .filter((p) => p.category === category)
    .sort((a, b) => a.order - b.order);
}

export async function getProjectSlugs(): Promise<string[]> {
  if (await pamsReady()) {
    return productionService.getPublishedSlugs();
  }
  return mockProjects
    .filter((p) => p.published !== false)
    .map((p) => p.slug);
}

export async function getServices(): Promise<Service[]> {
  // Service offerings still enriched from mock until PAMS stores full feature arrays
  return mockServices;
}

export async function getServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  return getMockServiceBySlug(slug);
}

export async function getServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  return services.map((s) => s.slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const db = await getDb();
    const rows = await db.testimonial.findMany({ orderBy: { order: "asc" } });
    if (rows.length === 0) return mockTestimonials;
    return rows.map((t) => ({
      id: t.id,
      quote: t.quote,
      clientName: t.author,
      company: t.company || "",
      photo: "",
      relatedService: undefined,
    }));
  } catch {
    return mockTestimonials;
  }
}

export async function getTestimonialsByService(
  slug: string,
): Promise<Testimonial[]> {
  const all = await getTestimonials();
  const filtered = all.filter(
    (t) => "relatedService" in t && (t as { relatedService?: string }).relatedService === slug,
  );
  return filtered.length > 0
    ? filtered
    : getMockTestimonialsByService(slug);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return mockTeam;
}

export async function getAwards(): Promise<Award[]> {
  try {
    const db = await getDb();
    const rows = await db.award.findMany();
    if (rows.length === 0) return mockAwards;
    return rows.map((a) => ({
      id: a.id,
      name: a.name,
      organization: a.organization || "",
      year: a.year || 0,
    }));
  } catch {
    return mockAwards;
  }
}

export async function getClientLogos(): Promise<ClientLogo[]> {
  try {
    const db = await getDb();
    const rows = await db.partner.findMany({ orderBy: { order: "asc" } });
    if (rows.length === 0) return mockClientLogos;
    const mapped = rows
      .map((p) => ({
        id: p.id,
        name: p.name,
        logo: p.name,
        logoSrc: p.logoUrl || "",
        url: p.website || undefined,
      }))
      .filter(
        (p) =>
          p.logoSrc.startsWith("/") || p.logoSrc.startsWith("http"),
      );
    return mapped.length > 0 ? mapped : mockClientLogos;
  } catch {
    return mockClientLogos;
  }
}

/** Hero showreel — unified with preview via buildShowreelConfig */
export async function getShowreelConfig(): Promise<ShowreelConfig> {
  const { buildShowreelConfig } = await import("@/lib/data/homepage-loader");
  return buildShowreelConfig("published");
}

export async function getHomepageHeroPath(): Promise<string> {
  try {
    return await siteSettingsService.getHomepageHero();
  } catch {
    return "/projects/inkondo-billboard.jpg";
  }
}

export type { NewsPost } from "@/types";
import type { NewsPost } from "@/types";

export async function getNewsPosts(): Promise<NewsPost[]> {
  const fbData = await getOramFacebookData();
  return fbData.posts.map((post, i) => ({
    id: post.id,
    title:
      post.message?.split(/[.!?\n]/)[0]?.slice(0, 100) ??
      `Oram Media Update ${i + 1}`,
    excerpt: post.message ?? "",
    date: post.createdTime,
    url: post.permalinkUrl,
    image: post.fullPicture,
  }));
}

export async function getFacebookPageInfo() {
  const fbData = await getOramFacebookData();
  return {
    ...fbData.page,
    source: fbData.source,
    syncedAt: fbData.syncedAt,
    postCount: fbData.posts.length,
  };
}

export async function getRelatedProjects(
  slugs: string[],
): Promise<Project[]> {
  const all = await getProjects();
  return slugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));
}

export function isSanityLive(): boolean {
  return false;
}

export function isPamsLive(): boolean {
  return true;
}
