import "server-only";
import path from "node:path";

const ALLOWED_PREFIXES = ["productions/", "assets/dam/"] as const;

/** Reject path traversal and keys outside DAM prefixes. */
export function isValidStorageKey(key: string): boolean {
  if (!key || key.length > 512) return false;
  if (key.includes("..") || key.includes("\\") || key.startsWith("/")) return false;
  if (!ALLOWED_PREFIXES.some((p) => key.startsWith(p))) return false;
  return /^[a-zA-Z0-9._\-/]+$/.test(key);
}

export function assertValidStorageKey(key: string): string {
  if (!isValidStorageKey(key)) {
    throw new Error("Invalid storage key");
  }
  return key;
}

/** Resolve a local public-root path safely (blocks traversal). */
export function resolveLocalPublicPath(
  publicRoot: string,
  key: string,
): string {
  const safeKey = assertValidStorageKey(key.replace(/^\//, ""));
  const normalized = path.normalize(safeKey);
  const diskPath = path.resolve(publicRoot, normalized);
  const root = path.resolve(publicRoot);
  if (!diskPath.startsWith(root + path.sep) && diskPath !== root) {
    throw new Error("Path traversal blocked");
  }
  return diskPath;
}
