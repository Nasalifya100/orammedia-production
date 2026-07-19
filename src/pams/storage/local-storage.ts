import "server-only";
import { createHash } from "node:crypto";
import { mkdir, writeFile, unlink, readFile } from "node:fs/promises";
import path from "node:path";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

export function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export function safeFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "-");
  return base.replace(/-+/g, "-").slice(0, 180) || "asset";
}

export function buildStoragePath(input: {
  productionSlug?: string | null;
  year?: number | null;
  filename: string;
}): { diskPath: string; publicPath: string } {
  const year = input.year ?? new Date().getFullYear();
  const slug = input.productionSlug?.trim() || "unassigned";
  const dir = path.join("assets", "dam", String(year), slug);
  const diskPath = path.join(PUBLIC_ROOT, dir, input.filename);
  const publicPath = `/${dir.replace(/\\/g, "/")}/${input.filename}`;
  return { diskPath, publicPath };
}

export async function writePublicFile(
  diskPath: string,
  data: Buffer,
): Promise<void> {
  await mkdir(path.dirname(diskPath), { recursive: true });
  await writeFile(diskPath, data);
}

export async function deletePublicFile(publicPath: string): Promise<void> {
  if (!publicPath.startsWith("/")) return;
  const diskPath = path.join(PUBLIC_ROOT, publicPath.replace(/^\//, ""));
  try {
    await unlink(diskPath);
  } catch {
    /* file may not exist */
  }
}

export async function readPublicFile(publicPath: string): Promise<Buffer | null> {
  if (!publicPath.startsWith("/")) return null;
  const diskPath = path.join(PUBLIC_ROOT, publicPath.replace(/^\//, ""));
  try {
    return await readFile(diskPath);
  } catch {
    return null;
  }
}

export function variantPath(publicPath: string, suffix: string): string {
  const ext = path.extname(publicPath);
  const base = publicPath.slice(0, -ext.length);
  return `${base}${suffix}${ext === ".jpg" || ext === ".jpeg" ? ".webp" : ext}`;
}
