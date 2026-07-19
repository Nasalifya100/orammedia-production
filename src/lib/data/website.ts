import "server-only";
import { cache } from "react";
import type { Project } from "@/types";
import type {
  FeaturedProductionSlot,
  WebsiteConfiguration,
} from "@/pams/types/website-config";
import { websiteConfigService } from "@/pams/services/website-config.service";
import { createDefaultWebsiteConfiguration } from "@/pams/types/website-config";

function isSlotVisible(slot: FeaturedProductionSlot, now = new Date()): boolean {
  if (slot.hidden || slot.archived) return false;
  if (slot.scheduleStart) {
    const start = new Date(slot.scheduleStart);
    if (now < start) return false;
  }
  if (slot.scheduleEnd) {
    const end = new Date(slot.scheduleEnd);
    if (now > end) return false;
  }
  return slot.featured;
}

export const getWebsiteConfiguration = cache(async function getWebsiteConfiguration(
  scope: "draft" | "published" = "published",
): Promise<WebsiteConfiguration> {
  try {
    return scope === "draft"
      ? await websiteConfigService.getDraft()
      : await websiteConfigService.getPublished();
  } catch {
    return createDefaultWebsiteConfiguration();
  }
});

export function applyFeaturedSlots(
  projects: Project[],
  slots: FeaturedProductionSlot[],
): Project[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const ordered = [...slots]
    .filter((s) => isSlotVisible(s))
    .sort((a, b) => a.order - b.order)
    .map((s) => bySlug.get(s.productionSlug))
    .filter((p): p is Project => Boolean(p))
    .map((p, i) => ({ ...p, featured: true, order: i }));

  if (ordered.length > 0) return ordered;

  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

export async function getHomepageFeaturedProjects(
  scope: "draft" | "published" = "published",
): Promise<Project[]> {
  const { getProjects } = await import("@/lib/data/index");
  const [config, projects] = await Promise.all([
    getWebsiteConfiguration(scope),
    getProjects(),
  ]);
  return applyFeaturedSlots(projects, config.featuredSlots);
}
