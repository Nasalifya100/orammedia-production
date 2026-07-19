import "server-only";
import type { WebsiteConfiguration } from "@/pams/types/website-config";
import { getProjects } from "@/lib/data/index";
import { getDb } from "@/pams/db";

export interface PublishValidationResult {
  errors: string[];
  warnings: string[];
}

function pathExists(path: string | null | undefined): boolean {
  if (!path?.trim()) return false;
  return path.startsWith("/") || path.startsWith("http");
}

export async function validateWebsiteForPublish(
  config: WebsiteConfiguration,
): Promise<PublishValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const heroEnabled = config.sections.some(
    (s) => s.type === "hero" && s.enabled,
  );
  if (!heroEnabled) {
    errors.push("Hero section must be enabled.");
  }

  if (!config.homepageHeadline?.trim()) {
    errors.push("Homepage headline is required.");
  }

  const resolved = config.resolvedFlagship;
  if (!resolved?.heroPosterPath || !pathExists(resolved.heroPosterPath)) {
    errors.push("Hero image is missing or invalid.");
  }

  if (resolved?.missingHeroArtwork) {
    warnings.push(
      "Flagship production has no official hero key art — using fallback poster.",
    );
  }

  const heroHasVideo = Boolean(resolved?.heroVideoMuxId || resolved?.heroVideoUrl);
  if (heroEnabled && !heroHasVideo) {
    warnings.push("No hero video configured — homepage will show poster still.");
  }

  const visibleFeatured = config.featuredSlots.filter(
    (s) => s.featured && !s.hidden && !s.archived,
  );
  if (visibleFeatured.length === 0) {
    errors.push("At least one featured production is required.");
  }

  const projects = await getProjects();
  const slugs = new Set(projects.map((p) => p.slug));
  for (const slot of visibleFeatured) {
    if (!slugs.has(slot.productionSlug)) {
      errors.push(`Featured production not found: ${slot.productionSlug}`);
    }
  }

  if (!config.seo.title?.trim()) {
    warnings.push("SEO title is empty.");
  }
  if (!config.seo.description?.trim()) {
    warnings.push("SEO description is empty.");
  }

  const ogImage =
    config.openGraph.imagePath || resolved?.shareImagePath || null;
  if (!pathExists(ogImage)) {
    errors.push("Open Graph image is missing.");
  }

  for (const item of config.navigation.filter((n) => n.enabled !== false)) {
    if (!item.href?.startsWith("/")) {
      warnings.push(`Navigation link "${item.label}" may be invalid.`);
    }
  }

  const mediaIds = [
    config.flagship.heroPosterMediaId,
    config.flagship.shareImageMediaId,
    config.flagship.heroThumbnailMediaId,
  ].filter(Boolean) as string[];

  if (mediaIds.length > 0) {
    const db = await getDb();
    const rows = await db.mediaAsset.findMany({
      where: { id: { in: mediaIds } },
      select: { id: true, path: true, approvalStatus: true },
    });
    const found = new Set(rows.map((r) => r.id));
    for (const id of mediaIds) {
      if (!found.has(id)) {
        errors.push(`Broken media reference: ${id}`);
      }
    }
    for (const row of rows) {
      if (!pathExists(row.path)) {
        errors.push(`Media asset has invalid path: ${row.id}`);
      }
    }
  }

  return { errors, warnings };
}
