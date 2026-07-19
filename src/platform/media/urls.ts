import "server-only";
import type { MediaVariants } from "@/pams/types/media";
import { getPlatformConfig } from "@/platform/env";

export interface MediaUrlInput {
  path?: string;
  storageProvider?: string | null;
  objectKey?: string | null;
  variantsJson?: string | null;
  archiveStatus?: string | null;
}

export function parseVariants(json: string | null | undefined): MediaVariants {
  if (!json) return {};
  try {
    return JSON.parse(json) as MediaVariants;
  } catch {
    return {};
  }
}

/** Resolve a stable public URL for rendering (legacy local paths + R2). */
export function resolveMediaUrl(input: MediaUrlInput): string {
  const config = getPlatformConfig();

  if (input.storageProvider === "r2" && input.objectKey) {
    const base = config.r2PublicBaseUrl.replace(/\/$/, "");
    if (base) return `${base}/${input.objectKey}`;
    return `/api/dam/asset?key=${encodeURIComponent(input.objectKey)}`;
  }

  if (input.path?.startsWith("http://") || input.path?.startsWith("https://")) {
    return input.path;
  }

  if (!input.path) {
    if (input.storageProvider === "r2" && input.objectKey) {
      const base = config.r2PublicBaseUrl.replace(/\/$/, "");
      if (base) return `${base}/${input.objectKey}`;
      return `/api/dam/asset?key=${encodeURIComponent(input.objectKey)}`;
    }
    return "";
  }

  return input.path.startsWith("/") ? input.path : `/${input.path}`;
}

/** Pick best display variant; never prefer archive masters when smaller variants exist. */
export function resolveDisplayImageUrl(input: MediaUrlInput): string {
  const variants = parseVariants(input.variantsJson);
  const candidate =
    variants.webp ??
    variants.thumbnail ??
    variants.sizes?.find((s) => s.width >= 640)?.path ??
    variants.sizes?.[0]?.path ??
    input.path ??
    "";

  return resolveMediaUrl({
    ...input,
    path: candidate,
  });
}

export function isPrivateArchiveAsset(input: MediaUrlInput): boolean {
  return input.archiveStatus === "vault" || input.archiveStatus === "do-not-use";
}

export function resolveOgImageUrl(input: MediaUrlInput): string {
  const variants = parseVariants(input.variantsJson);
  const candidate = variants.webp ?? variants.sizes?.find((s) => s.width >= 1280)?.path ?? input.path ?? "";
  return resolveMediaUrl({ ...input, path: candidate });
}
