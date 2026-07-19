/** Pure file signature detection — safe to import from tests (no server-only). */

export type DetectedFormat =
  | "jpeg"
  | "png"
  | "webp"
  | "avif"
  | "gif"
  | "pdf"
  | "mp4"
  | "webm"
  | "zip"
  | "unknown";

const SIGNATURES: { format: DetectedFormat; mime: string; match: (b: Uint8Array) => boolean }[] = [
  {
    format: "jpeg",
    mime: "image/jpeg",
    match: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    format: "png",
    mime: "image/png",
    match: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    format: "gif",
    mime: "image/gif",
    match: (b) =>
      b.length >= 6 &&
      b[0] === 0x47 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x38 &&
      (b[4] === 0x37 || b[4] === 0x39) &&
      b[5] === 0x61,
  },
  {
    format: "webp",
    mime: "image/webp",
    match: (b) =>
      b.length >= 12 &&
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
  {
    format: "avif",
    mime: "image/avif",
    match: (b) => {
      if (b.length < 12) return false;
      const box =
        String.fromCharCode(b[4], b[5], b[6], b[7]) === "ftyp" &&
        (includesAscii(b, 8, "avif") || includesAscii(b, 8, "avis"));
      return (
        b[0] === 0x00 &&
        b[1] === 0x00 &&
        b[2] === 0x00 &&
        box
      );
    },
  },
  {
    format: "pdf",
    mime: "application/pdf",
    match: (b) => b.length >= 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d,
  },
  {
    format: "zip",
    mime: "application/zip",
    match: (b) =>
      b.length >= 4 &&
      b[0] === 0x50 &&
      b[1] === 0x4b &&
      (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07) &&
      (b[3] === 0x04 || b[3] === 0x06 || b[3] === 0x08),
  },
  {
    format: "mp4",
    mime: "video/mp4",
    match: (b) => {
      if (b.length < 12) return false;
      const ftyp =
        b[4] === 0x66 &&
        b[5] === 0x74 &&
        b[6] === 0x79 &&
        b[7] === 0x70;
      return ftyp && (includesAscii(b, 8, "isom") || includesAscii(b, 8, "mp41") || includesAscii(b, 8, "avc1") || includesAscii(b, 8, "iso2"));
    },
  },
  {
    format: "webm",
    mime: "video/webm",
    match: (b) =>
      b.length >= 4 &&
      b[0] === 0x1a &&
      b[1] === 0x45 &&
      b[2] === 0xdf &&
      b[3] === 0xa3,
  },
];

function includesAscii(buf: Uint8Array, offset: number, text: string): boolean {
  if (buf.length < offset + text.length) return false;
  for (let i = 0; i < text.length; i++) {
    if (buf[offset + i] !== text.charCodeAt(i)) return false;
  }
  return true;
}

export function detectFileFormat(buffer: ArrayBuffer | Uint8Array | Buffer): DetectedFormat {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  for (const sig of SIGNATURES) {
    if (sig.match(bytes)) return sig.format;
  }
  return "unknown";
}

export function mimeForFormat(format: DetectedFormat): string | null {
  return SIGNATURES.find((s) => s.format === format)?.mime ?? null;
}

/** Returns true when declared MIME matches detected signature (or quicktime MP4 alias). */
export function declaredMimeMatchesBuffer(
  buffer: ArrayBuffer | Uint8Array | Buffer,
  declaredMime: string,
): boolean {
  const normalized = declaredMime.toLowerCase().split(";")[0]?.trim() ?? "";
  const detected = detectFileFormat(buffer);
  if (detected === "unknown") return false;

  const expected = mimeForFormat(detected);
  if (!expected) return false;
  if (normalized === expected) return true;

  // Allow video/quicktime uploads that are ftyp MP4 containers.
  if (normalized === "video/quicktime" && detected === "mp4") return true;

  return false;
}
