/**
 * Seed staging Website Builder draft + published configs into D1.
 * Usage: npx tsx scripts/seed-website-config-staging.ts
 * Then: npx wrangler d1 execute orammedia-staging --remote --file=exports/website-config-seed.sql
 */
import fs from "node:fs";
import path from "node:path";
import { createDefaultWebsiteConfiguration } from "../src/pams/types/website-config";

const config = createDefaultWebsiteConfiguration();
// Ensure Inkondo flagship + /blog nav (already in defaults)
if (config.flagship.productionSlug !== "inkondo") {
  throw new Error("Default flagship must be inkondo");
}
if (!config.navigation.some((n) => n.href === "/blog")) {
  throw new Error("Default navigation must include /blog");
}
if (config.navigation.some((n) => n.href === "/journal")) {
  throw new Error("Default navigation must not include /journal");
}

const json = JSON.stringify(config).replace(/'/g, "''");
const now = new Date().toISOString();

const sql = `-- Website Builder staging seed (generated ${now})
INSERT OR REPLACE INTO "website_config" ("id", "configJson", "updatedByUserId", "updatedAt")
VALUES ('draft', '${json}', NULL, '${now}');
INSERT OR REPLACE INTO "website_config" ("id", "configJson", "updatedByUserId", "updatedAt")
VALUES ('published', '${json}', NULL, '${now}');
`;

const out = path.join(process.cwd(), "exports", "website-config-seed.sql");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, sql, "utf8");
console.log(`Wrote ${out}`);
console.log(`flagship=${config.flagship.productionSlug}`);
console.log(`nav=${config.navigation.map((n) => n.href).join(",")}`);
