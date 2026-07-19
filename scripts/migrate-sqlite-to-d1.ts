/**
 * Export local SQLite data for D1 import.
 * Usage: npm run migrate:sqlite-to-d1 [-- --dry-run] [-- --output=./exports/pams.json]
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import Database from "better-sqlite3";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const outputArg = args.find((a) => a.startsWith("--output="));
const outputPath =
  outputArg?.split("=")[1] ??
  path.join(process.cwd(), "exports", "pams-sqlite-export.json");

const dbPath = path.join(process.cwd(), "prisma", "pams.db");

const TABLES = [
  "User",
  "Role",
  "Permission",
  "RolePermission",
  "Production",
  "Person",
  "MediaAsset",
  "Trailer",
  "WebsiteConfig",
  "WebsiteSnapshot",
  "VerificationItem",
  "RightsRecord",
  "FilmographyEntry",
  "SiteSetting",
  "AuditLog",
  "Revision",
  "UploadSession",
] as const;

interface MigrationReport {
  exportedAt: string;
  source: string;
  dryRun: boolean;
  tables: Record<string, { count: number; sampleIds: string[] }>;
  warnings: string[];
}

async function main() {
  if (!dryRun) {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
  }

  const db = new Database(dbPath, { readonly: true });
  const report: MigrationReport = {
    exportedAt: new Date().toISOString(),
    source: dbPath,
    dryRun,
    tables: {},
    warnings: [],
  };

  const payload: Record<string, unknown[]> = {};

  for (const table of TABLES) {
    try {
      const rows = db.prepare(`SELECT * FROM ${table}`).all() as Record<
        string,
        unknown
      >[];
      payload[table] = rows.map((row) => {
        const copy = { ...row };
        if (table === "User" && "passwordHash" in copy) {
          copy.passwordHash = "[REDACTED]";
          report.warnings.push(
            "User password hashes redacted in export — re-seed staging admin separately.",
          );
        }
        return copy;
      });
      report.tables[table] = {
        count: rows.length,
        sampleIds: rows.slice(0, 3).map((r) => String(r.id ?? "")),
      };
    } catch {
      report.tables[table] = { count: 0, sampleIds: [] };
    }
  }

  db.close();

  if (!dryRun) {
    await fs.writeFile(outputPath, JSON.stringify({ payload, report }, null, 2));
    const reportPath = outputPath.replace(/\.json$/, "-report.json");
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`Exported to ${outputPath}`);
    console.log(`Report: ${reportPath}`);
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
