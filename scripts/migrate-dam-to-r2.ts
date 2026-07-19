/**
 * Migrate local DAM files (public/assets/dam) to R2 via Wrangler CLI.
 * Requires: wrangler authenticated, R2 bucket created, local SQLite with assets.
 *
 * Usage:
 *   npm run migrate:dam-to-r2 -- --dry-run
 *   npm run migrate:dam-to-r2 -- --limit=10
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { getLocalDb } from "@/platform/db/client";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

function sha256File(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

async function main() {
  const bucket = process.env.R2_BUCKET_NAME ?? "orammedia-dam-staging";
  const publicBase = process.env.R2_PUBLIC_BASE_URL ?? "";
  const db = await getLocalDb();
  const assets = await db.mediaAsset.findMany({
    where: { storageProvider: "local" },
    take: limit,
    include: { production: { select: { slug: true, year: true } } },
  });

  const report = {
    dryRun,
    total: assets.length,
    uploaded: 0,
    skipped: 0,
    errors: [] as string[],
    verified: [] as string[],
  };

  const publicRoot = path.join(process.cwd(), "public");

  for (const asset of assets) {
    const localPath = path.join(publicRoot, asset.path.replace(/^\//, ""));
    try {
      await fs.access(localPath);
      const buf = await fs.readFile(localPath);
      const checksum = sha256File(buf);
      const objectKey =
        asset.objectKey ??
        `productions/${asset.production?.slug ?? "unassigned"}/${asset.production?.year ?? new Date().getFullYear()}/${asset.id}/original${path.extname(asset.filename)}`;

      if (!dryRun) {
        execSync(
          `npx wrangler r2 object put "${bucket}/${objectKey}" --file="${localPath}" --content-type="${asset.mimeType}"`,
          { stdio: "pipe" },
        );
        await db.mediaAsset.update({
          where: { id: asset.id },
          data: {
            storageProvider: "r2",
            objectKey,
            path: publicBase
              ? `${publicBase.replace(/\/$/, "")}/${objectKey}`
              : asset.path,
            checksum,
          },
        });
      }

      report.uploaded++;
      report.verified.push(asset.id);
    } catch (e) {
      report.errors.push(`${asset.id}: ${e instanceof Error ? e.message : String(e)}`);
      report.skipped++;
    }
  }

  const outPath = path.join(process.cwd(), "exports", "dam-r2-migration-report.json");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
