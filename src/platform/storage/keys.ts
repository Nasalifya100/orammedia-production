import "server-only";
import path from "node:path";
import { safeFilename } from "@/platform/storage/crypto";

export function buildObjectKey(input: {
  productionSlug?: string | null;
  year?: number | null;
  assetId: string;
  variant: "original" | "thumbnail" | "640" | "1280" | "1920" | string;
  filename: string;
}): string {
  const year = input.year ?? new Date().getFullYear();
  const slug = input.productionSlug?.trim() || "unassigned";
  const ext = path.extname(input.filename) || ".bin";
  const base = `productions/${slug}/${year}/${input.assetId}`;

  switch (input.variant) {
    case "original":
      return `${base}/original${ext}`;
    case "thumbnail":
      return `${base}/thumbnail.webp`;
    case "640":
      return `${base}/640.webp`;
    case "1280":
      return `${base}/1280.webp`;
    case "1920":
      return `${base}/1920.webp`;
    default:
      return `${base}/${input.variant}${ext}`;
  }
}

export function buildLocalPublicPath(input: {
  productionSlug?: string | null;
  year?: number | null;
  filename: string;
}): { diskPath: string; publicPath: string } {
  const year = input.year ?? new Date().getFullYear();
  const slug = input.productionSlug?.trim() || "unassigned";
  const dir = path.join("assets", "dam", String(year), slug);
  const publicRoot = path.join(/* turbopackIgnore: true */ process.cwd(), "public");
  const diskPath = path.join(publicRoot, dir, input.filename);
  const publicPath = `/${dir.replace(/\\/g, "/")}/${input.filename}`;
  return { diskPath, publicPath };
}

export function variantSuffixPath(
  publicPath: string,
  suffix: string,
  ext: string,
): string {
  const dir = publicPath.substring(0, publicPath.lastIndexOf("/"));
  const base = path.basename(publicPath, path.extname(publicPath));
  return `${dir}/${base}${suffix}${ext}`;
}

export function storedNameFromOriginal(originalName: string): string {
  const safe = safeFilename(originalName);
  const ext = safe.includes(".") ? safe.split(".").pop() : "bin";
  return `${Date.now()}-${safe.replace(/\.[^.]+$/, "")}.${ext}`;
}
