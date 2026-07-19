import type { WebsiteDataScope } from "@/lib/data/homepage-loader";

export function parsePreviewScope(
  value: string | string[] | undefined,
): WebsiteDataScope {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "published" ? "published" : "draft";
}

export function previewPathFromSegments(segments: string[] | undefined): string {
  if (!segments?.length) return "";
  if (segments.length === 1 && segments[0] === "homepage") return "";
  return segments.join("/");
}
