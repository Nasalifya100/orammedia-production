import "server-only";
import { ACCEPTED_MIME, kindFromMime, type MediaKind } from "@/pams/types/media";
import { declaredMimeMatchesBuffer } from "@/pams/security/file-signatures";

/** Whether the MIME type is on the upload allowlist (excludes generic octet-stream). */
export function isAllowedUploadMime(mime: string): boolean {
  const normalized = mime.toLowerCase().split(";")[0]?.trim() ?? "";
  return normalized in ACCEPTED_MIME;
}

export function assertAllowedUploadMime(mime: string): MediaKind {
  if (!isAllowedUploadMime(mime)) {
    throw new Error("Unsupported file type");
  }
  return kindFromMime(mime);
}

/**
 * Validate file content against declared MIME using magic-byte signatures.
 * Rejects renamed executables and MIME confusion attacks.
 */
export function validateMagicBytes(buffer: Buffer, declaredMime: string): boolean {
  if (!isAllowedUploadMime(declaredMime)) return false;
  if (!buffer?.length) return false;
  return declaredMimeMatchesBuffer(buffer, declaredMime);
}

/** Bounded header sniff for pre-authorization (first 64 KiB max). */
export function validateMagicBytesHeader(
  header: Buffer,
  declaredMime: string,
): boolean {
  if (!isAllowedUploadMime(declaredMime)) return false;
  if (!header?.length) return false;
  return declaredMimeMatchesBuffer(header, declaredMime);
}
