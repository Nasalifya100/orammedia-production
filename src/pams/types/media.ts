/** ORAM DAM — media asset types and role definitions */

export type MediaKind = "image" | "video" | "pdf" | "zip" | "other";

export type MediaRole =
  | "hero"
  | "thumbnail"
  | "poster"
  | "still"
  | "bts"
  | "gallery"
  | "og"
  | "social"
  | "document"
  | "press"
  | "download"
  | "other";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "archived";

export type VerificationStatus = "unverified" | "verified" | "disputed";

export type ArchiveStatus = "active" | "vault" | "do-not-use";

export interface MediaVariants {
  thumbnail?: string;
  webp?: string;
  avif?: string;
  sizes?: { width: number; height: number; path: string }[];
}

export const MEDIA_ROLES: { value: MediaRole; label: string }[] = [
  { value: "hero", label: "Hero" },
  { value: "poster", label: "Poster" },
  { value: "thumbnail", label: "Thumbnail" },
  { value: "og", label: "Open Graph" },
  { value: "social", label: "Social Share" },
  { value: "gallery", label: "Gallery" },
  { value: "bts", label: "Behind the Scenes" },
  { value: "still", label: "Production Still" },
  { value: "press", label: "Press Kit" },
  { value: "document", label: "Document" },
  { value: "download", label: "Download" },
  { value: "other", label: "Other" },
];

/** Production Media Manager — one-screen slot layout */
export const PRODUCTION_MEDIA_SLOTS: {
  role: MediaRole;
  label: string;
  description: string;
  single?: boolean;
}[] = [
  { role: "hero", label: "Hero Image", description: "Homepage / case study hero", single: true },
  { role: "poster", label: "Poster", description: "Primary key art / portrait or landscape", single: true },
  { role: "thumbnail", label: "Thumbnail", description: "Grid and card thumbnail", single: true },
  { role: "og", label: "Open Graph", description: "Social link preview image", single: true },
  { role: "social", label: "Social Images", description: "Instagram, Facebook, campaign assets" },
  { role: "gallery", label: "Gallery", description: "Case study gallery stills" },
  { role: "bts", label: "Behind the Scenes", description: "On-set and production photography" },
  { role: "press", label: "Press Kit", description: "Press-ready downloads" },
  { role: "document", label: "Documents", description: "PDFs, press notes, treatments" },
];

export const ACCEPTED_MIME: Record<string, MediaKind> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/avif": "image",
  "image/gif": "image",
  "video/mp4": "video",
  "video/quicktime": "video",
  "video/webm": "video",
  "application/pdf": "pdf",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
};

export const MAX_UPLOAD_BYTES = 512 * 1024 * 1024; // 512 MB

export function kindFromMime(mime: string): MediaKind {
  return ACCEPTED_MIME[mime] ?? "other";
}

export function parseVariants(json: string | null | undefined): MediaVariants {
  if (!json) return {};
  try {
    return JSON.parse(json) as MediaVariants;
  } catch {
    return {};
  }
}
