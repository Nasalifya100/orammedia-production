/**
 * Export local SQLite rows as D1-compatible INSERT SQL for staging import.
 * Password hashes are replaced with a staging-only bcrypt hash.
 * Usage: npx tsx scripts/export-d1-seed-sql.ts > exports/staging-seed.sql
 */
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { hashSync } from "bcryptjs";

const dbPath = path.join(process.cwd(), "prisma/pams.db");
const db = new Database(dbPath, { readonly: true });

const STAGING_PASSWORD = process.env.PAMS_STAGING_PASSWORD || "oram-staging-change-me-2026";
const stagingHash = hashSync(STAGING_PASSWORD, 12);

const TABLE_ORDER = [
  "Role",
  "Permission",
  "RolePermission",
  "User",
  "Person",
  "Production",
  "MediaAsset",
  "Trailer",
  "WebsiteConfig",
  "WebsiteSnapshot",
  "VerificationItem",
  "RightsRecord",
  "FilmographyEntry",
  "SiteSetting",
  "UploadSession",
  "AuditLog",
  "Revision",
] as const;

function sqlValue(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "1" : "0";
  return `'${String(v).replace(/'/g, "''")}'`;
}

const lines: string[] = ["PRAGMA foreign_keys = OFF;"];

for (const table of TABLE_ORDER) {
  try {
    const rows = db.prepare(`SELECT * FROM ${table}`).all() as Record<string, unknown>[];
    if (rows.length === 0) continue;
    for (const row of rows) {
      const copy = { ...row };
      if (table === "User") {
        copy.passwordHash = stagingHash;
        copy.email = String(copy.email).includes("@")
          ? String(copy.email).replace("@", "+staging@")
          : "staging-admin@orammedia.local";
      }
      const cols = Object.keys(copy);
      const vals = cols.map((c) => sqlValue(copy[c]));
      lines.push(
        `INSERT OR REPLACE INTO "${table}" (${cols.map((c) => `"${c}"`).join(", ")}) VALUES (${vals.join(", ")});`,
      );
    }
  } catch {
    // table may not exist in older DBs
  }
}

lines.push("PRAGMA foreign_keys = ON;");

const outDir = path.join(process.cwd(), "exports");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "staging-seed.sql");
fs.writeFileSync(outPath, lines.join("\n"));
console.error(`Wrote ${outPath} (${lines.length} statements)`);
console.error(`Staging admin password: ${STAGING_PASSWORD}`);
console.error(`Apply with: npx wrangler d1 execute orammedia-staging --remote --file=exports/staging-seed.sql`);

db.close();
