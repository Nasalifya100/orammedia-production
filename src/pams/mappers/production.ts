import type { Project } from "@/types";
type MediaAsset = {
  path: string;
  role: string;
  archiveStatus: string;
  approvalStatus: string;
  sortOrder: number;
};

type ProductionWithRelations = {
  id: string;
  title: string;
  slug: string;
  kind: string;
  synopsis: string | null;
  story: string | null;
  challenge: string | null;
  creativeDirection: string | null;
  productionProcess: string | null;
  behindTheScenes: string | null;
  resultsJson: string | null;
  interestingFactsJson: string | null;
  alternativeTitles: string | null;
  oramRole: string | null;
  archivalCategory: string;
  clientNameText: string | null;
  year: number | null;
  runtime: string | null;
  productionCompanyText: string | null;
  broadcaster: string | null;
  streamingPlatform: string | null;
  published: boolean;
  workflowStatus: string;
  portraitPoster: boolean;
  featured: boolean;
  sortOrder: number;
  credits?: { role: string; personName: string; billingOrder: number }[];
  media?: MediaAsset[];
  trailers?: {
    preferred: boolean;
    url: string | null;
    youtubeId: string | null;
    muxPlaybackId: string | null;
  }[];
  genres?: { genre: { name: string } }[];
  relatedFrom?: { toProduction: { slug: string } }[];
};

function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as T[];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function categoryFromKind(kind: string): Project["category"] {
  if (kind === "branded" || kind === "event") return "branded";
  if (kind === "documentary") return "commercial";
  return "narrative";
}

function pickMedia(
  media: MediaAsset[] | undefined,
  role: string,
): MediaAsset | undefined {
  return media
    ?.filter((m) => m.archiveStatus !== "do-not-use" && m.approvalStatus !== "rejected")
    .find((m) => m.role === role);
}

/** Map a PAMS Production (+ relations) to the public Project shape */
export function toPublicProject(p: ProductionWithRelations): Project {
  const media = p.media ?? [];
  const poster =
    pickMedia(media, "poster") ||
    pickMedia(media, "thumbnail") ||
    pickMedia(media, "hero");
  const hero =
    pickMedia(media, "hero") ||
    pickMedia(media, "thumbnail") ||
    poster;
  const gallery = media
    .filter(
      (m) =>
        ["gallery", "still", "bts", "poster", "hero", "thumbnail"].includes(
          m.role,
        ) && m.archiveStatus === "active",
    )
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => m.path);

  const preferredTrailer =
    p.trailers?.find((t) => t.preferred) || p.trailers?.[0];

  const genreName = p.genres?.[0]?.genre.name;

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: categoryFromKind(p.kind),
    description: p.synopsis || "",
    fullDescription: p.story || p.synopsis || "",
    clientName: p.clientNameText || "",
    year: p.year ?? 0,
    duration: p.runtime || p.kind,
    genre: genreName,
    productionCompany: p.productionCompanyText || undefined,
    broadcaster: p.broadcaster || undefined,
    streamingPlatform: p.streamingPlatform || undefined,
    thumbnail: hero?.path || poster?.path || "",
    gallery: gallery.length ? gallery : poster ? [poster.path] : [],
    videoUrl: preferredTrailer?.url || "",
    posterUrl: poster?.path || hero?.path || "",
    muxPlaybackId: preferredTrailer?.muxPlaybackId || undefined,
    youtubeId: preferredTrailer?.youtubeId || undefined,
    behindTheScenes: p.behindTheScenes || undefined,
    challenge: p.challenge || undefined,
    approach: p.creativeDirection || undefined,
    productionProcess: p.productionProcess || undefined,
    results: parseJsonArray<{ value: string; label: string }>(p.resultsJson),
    credits: (p.credits ?? [])
      .sort((a, b) => a.billingOrder - b.billingOrder)
      .map((c) => ({ role: c.role, name: c.personName })),
    relatedProjectSlugs: (p.relatedFrom ?? []).map((r) => r.toProduction.slug),
    interestingFacts: parseJsonArray<string>(p.interestingFactsJson),
    alternativeTitles: parseJsonArray<string>(p.alternativeTitles),
    oramRole: p.oramRole || undefined,
    archivalCategory: p.archivalCategory as Project["archivalCategory"],
    published: p.published && p.workflowStatus === "published",
    portraitPoster: p.portraitPoster,
    featured: p.featured,
    order: p.sortOrder,
  };
}
