/**
 * Seed staging D1 after schema migration.
 * Run locally against remote D1 via wrangler, or use exported JSON from migrate:sqlite-to-d1.
 */
import "dotenv/config";
import { execSync } from "node:child_process";

console.log(`
Staging D1 seed workflow:

1. Create database:
   wrangler d1 create orammedia-staging

2. Update wrangler.jsonc database_id with the returned ID.

3. Generate migration SQL from Prisma schema:
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migrations/0001_init.sql

4. Apply to remote staging:
   npm run d1:migrate:staging

5. Seed baseline data (uses prisma seed against local SQLite, then import):
   npm run pams:seed
   npm run migrate:sqlite-to-d1
   # Import JSON rows with wrangler d1 execute or custom importer

6. Migrate DAM assets:
   npm run migrate:dam-to-r2 -- --dry-run
   npm run migrate:dam-to-r2

Set staging secrets (never commit):
   wrangler secret put PAMS_SESSION_SECRET --env staging
   wrangler secret put R2_ACCESS_KEY_ID --env staging
   wrangler secret put R2_SECRET_ACCESS_KEY --env staging
`);

try {
  execSync("npx prisma db push", { stdio: "inherit" });
  execSync("npm run pams:seed", { stdio: "inherit" });
} catch {
  process.exit(1);
}
