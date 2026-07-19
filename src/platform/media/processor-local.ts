import "server-only";
import sharp from "sharp";
import type { MediaVariants } from "@/pams/types/media";
import { variantSuffixPath } from "@/platform/storage/keys";

const RESPONSIVE_WIDTHS = [640, 1280, 1920];

export async function processImageVariantsLocal(
  buffer: Buffer,
  publicPath: string,
  writeVariant: (path: string, data: Buffer) => Promise<void>,
): Promise<{ variants: MediaVariants; width: number; height: number }> {
  const meta = await sharp(buffer).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const variants: MediaVariants = { sizes: [] };

  const thumbPublic = variantSuffixPath(publicPath, "-thumb", ".webp");
  await writeVariant(
    thumbPublic,
    await sharp(buffer)
      .resize(480, 480, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer(),
  );
  variants.thumbnail = thumbPublic;

  const webpPublic = variantSuffixPath(publicPath, "", ".webp");
  await writeVariant(
    webpPublic,
    await sharp(buffer).webp({ quality: 88 }).toBuffer(),
  );
  variants.webp = webpPublic;

  try {
    const avifPublic = variantSuffixPath(publicPath, "", ".avif");
    await writeVariant(
      avifPublic,
      await sharp(buffer).avif({ quality: 65 }).toBuffer(),
    );
    variants.avif = avifPublic;
  } catch {
    /* avif may be unavailable */
  }

  for (const w of RESPONSIVE_WIDTHS) {
    if (width <= w) continue;
    const sizedPublic = variantSuffixPath(publicPath, `-${w}w`, ".webp");
    const sizedBuf = await sharp(buffer)
      .resize(w, undefined, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    const sizedMeta = await sharp(sizedBuf).metadata();
    await writeVariant(sizedPublic, sizedBuf);
    variants.sizes!.push({
      width: sizedMeta.width ?? w,
      height: sizedMeta.height ?? 0,
      path: sizedPublic,
    });
  }

  return { variants, width, height };
}

export async function rotateImageBuffer(
  buffer: Buffer,
  degrees: 90 | 180 | 270,
): Promise<Buffer> {
  return sharp(buffer).rotate(degrees).toBuffer();
}

export async function flipImageBuffer(
  buffer: Buffer,
  axis: "horizontal" | "vertical",
): Promise<Buffer> {
  let pipeline = sharp(buffer);
  pipeline = axis === "horizontal" ? pipeline.flop() : pipeline.flip();
  return pipeline.toBuffer();
}

export function publicPathToKey(publicPath: string): string {
  return publicPath.replace(/^\//, "");
}
