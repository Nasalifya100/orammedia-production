import type { Project } from "@/types";
import type { ShowreelConfig } from "@/types";
import type {
  FeaturedProductionSlot,
  WebsiteConfiguration,
} from "@/pams/types/website-config";
import { SHOWREEL_POSTER } from "@/lib/data/mock-data";

function isSlotVisible(slot: FeaturedProductionSlot, now = new Date()): boolean {
  if (slot.hidden || slot.archived) return false;
  if (slot.scheduleStart && now < new Date(slot.scheduleStart)) return false;
  if (slot.scheduleEnd && now > new Date(slot.scheduleEnd)) return false;
  return slot.featured;
}

/** Client-side featured order — mirrors server applyFeaturedSlots */
export function resolveFeaturedProjects(
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

/** Client-side showreel — mirrors buildShowreelConfig flagship + fallbacks */
export function resolveShowreelFromConfig(
  config: WebsiteConfiguration,
  fallback?: ShowreelConfig,
): ShowreelConfig {
  const resolved = config.resolvedFlagship;
  return {
    muxPlaybackId:
      resolved?.heroVideoMuxId || fallback?.muxPlaybackId || undefined,
    posterUrl:
      resolved?.heroPosterPath ?? fallback?.posterUrl ?? SHOWREEL_POSTER ?? "/projects/inkondo-billboard.jpg",
    videoUrl: resolved?.heroVideoUrl || fallback?.videoUrl || "",
  };
}

export function sectionDiff(
  draft: WebsiteConfiguration,
  published: WebsiteConfiguration,
): string[] {
  const changed: string[] = [];
  if (draft.homepageHeadline !== published.homepageHeadline) changed.push("Headline");
  if (draft.homepageSubheadline !== published.homepageSubheadline) changed.push("Subheadline");
  if (draft.homepageEyebrow !== published.homepageEyebrow) changed.push("Eyebrow");
  if (draft.flagship.productionSlug !== published.flagship.productionSlug) {
    changed.push("Flagship");
  }
  if (JSON.stringify(draft.sections) !== JSON.stringify(published.sections)) {
    changed.push("Sections");
  }
  if (JSON.stringify(draft.featuredSlots) !== JSON.stringify(published.featuredSlots)) {
    changed.push("Featured");
  }
  return changed;
}
