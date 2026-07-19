import "server-only";
import { createHash } from "node:crypto";

export function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export function safeFilename(name: string): string {
  const base = name.replace(/^.*[\\/]/, "").replace(/[^a-zA-Z0-9._-]/g, "-");
  return base.replace(/-+/g, "-").slice(0, 180) || "asset";
}
