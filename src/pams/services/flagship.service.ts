import "server-only";
import { getDb } from "@/pams/db";
import type {
  FlagshipSelectors,
  ResolvedFlagshipMedia,
  WebsiteConfiguration,
} from "@/pams/types/website-config";

const FALLBACK_POSTER = "/projects/inkondo-billboard.jpg";

async function mediaPath(id: string | null): Promise<string | null> {
  if (!id) return null;
  const db = await getDb();
  const row = await db.mediaAsset.findUnique({ where: { id } });
  return row?.path ?? null;
}

async function trailerById(id: string | null) {
  if (!id) return null;
  const db = await getDb();
  return db.trailer.findUnique({
    where: { id },
    include: { posterMedia: true },
  });
}

function pickProductionPoster(
  media: { path: string; role: string }[],
): string | null {
  const priority = ["hero", "poster", "og", "thumbnail", "still"];
  for (const role of priority) {
    const hit = media.find((m) => m.role === role);
    if (hit) return hit.path;
  }
  return media[0]?.path ?? null;
}

export async function resolveFlagshipMedia(
  flagship: FlagshipSelectors,
): Promise<ResolvedFlagshipMedia> {
  const slug = flagship.productionSlug;
  if (!slug) {
    return {
      productionSlug: null,
      productionTitle: null,
      heroPosterPath: null,
      heroVideoUrl: null,
      heroVideoMuxId: null,
      heroThumbnailPath: null,
      shareImagePath: null,
      missingHeroArtwork: true,
    };
  }

  const db = await getDb();
  const production = await db.production.findUnique({
    where: { slug },
    include: {
      media: { where: { approvalStatus: { not: "archived" } } },
      trailers: { include: { posterMedia: true } },
    },
  });

  if (!production) {
    return {
      productionSlug: slug,
      productionTitle: null,
      heroPosterPath: FALLBACK_POSTER,
      heroVideoUrl: null,
      heroVideoMuxId: null,
      heroThumbnailPath: FALLBACK_POSTER,
      shareImagePath: FALLBACK_POSTER,
      missingHeroArtwork: true,
    };
  }

  const [
    heroPosterFromId,
    heroThumbFromId,
    shareFromId,
    trailerFromId,
  ] = await Promise.all([
    mediaPath(flagship.heroPosterMediaId),
    mediaPath(flagship.heroThumbnailMediaId),
    mediaPath(flagship.shareImageMediaId),
    trailerById(flagship.heroVideoTrailerId),
  ]);

  const autoPoster = pickProductionPoster(production.media);
  const autoOg =
    production.media.find((m) => m.ogEligible || m.role === "og")?.path ??
    autoPoster;
  const autoThumb =
    production.media.find((m) => m.role === "thumbnail")?.path ??
    autoPoster;

  const preferredTrailer =
    trailerFromId ??
    production.trailers.find((t) => t.preferred && t.officialStatus === "official") ??
    production.trailers.find((t) => t.preferred) ??
    production.trailers[0] ??
    null;

  const heroPosterPath =
    heroPosterFromId ?? autoPoster ?? FALLBACK_POSTER;
  const heroThumbnailPath = heroThumbFromId ?? autoThumb ?? heroPosterPath;
  const shareImagePath = shareFromId ?? autoOg ?? heroPosterPath;

  const missingHeroArtwork = !heroPosterFromId && !autoPoster;

  return {
    productionSlug: slug,
    productionTitle: production.title,
    heroPosterPath,
    heroVideoUrl: preferredTrailer?.url ?? null,
    heroVideoMuxId: preferredTrailer?.muxPlaybackId ?? null,
    heroThumbnailPath,
    shareImagePath,
    missingHeroArtwork,
  };
}

/** Sync SEO, OG and featured slot #1 when flagship changes */
export async function applyFlagshipCascade(
  config: WebsiteConfiguration,
): Promise<WebsiteConfiguration> {
  const resolved = await resolveFlagshipMedia(config.flagship);
  const next = { ...config, resolvedFlagship: resolved };

  if (resolved.productionTitle) {
    next.seo = {
      ...next.seo,
      title: `${resolved.productionTitle} — ${config.siteName}`,
      description:
        next.seo.description ||
        `${resolved.productionTitle} — flagship production from ${config.siteName}.`,
    };
    next.openGraph = {
      ...next.openGraph,
      title: resolved.productionTitle,
      imagePath: resolved.shareImagePath ?? next.openGraph.imagePath,
    };
  }

  if (resolved.shareImagePath) {
    next.openGraph = {
      ...next.openGraph,
      imagePath: resolved.shareImagePath,
    };
  }

  if (resolved.productionSlug) {
    const pos = Math.max(0, (config.flagship.featuredPosition ?? 1) - 1);
    const slots = [...next.featuredSlots];
    const existingIdx = slots.findIndex(
      (s) => s.productionSlug === resolved.productionSlug,
    );

    let flagshipSlot =
      existingIdx >= 0
        ? { ...slots[existingIdx] }
        : {
            productionSlug: resolved.productionSlug,
            order: pos,
            pinned: true,
            featured: true,
            hidden: false,
            archived: false,
          };

    flagshipSlot = {
      ...flagshipSlot,
      pinned: true,
      featured: true,
      hidden: false,
      archived: false,
    };

    if (existingIdx >= 0) slots.splice(existingIdx, 1);
    slots.splice(pos, 0, flagshipSlot);
    next.featuredSlots = slots.map((s, i) => ({ ...s, order: i }));
  }

  return next;
}
