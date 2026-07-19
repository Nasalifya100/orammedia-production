/**
 * Canonical public site origin.
 *
 * `NEXT_PUBLIC_SITE_URL` is inlined at **build** time by Next.js.
 * Always set it explicitly when running OpenNext / Cloudflare builds:
 *
 * - Staging:  `npm run cf:build:staging`
 * - Production: `npm run cf:build:production` (do not deploy until approved)
 *
 * Wrangler `vars.NEXT_PUBLIC_SITE_URL` alone does **not** rewrite an already-built bundle.
 */

export const STAGING_SITE_URL =
  "https://orammedia-staging.nasalifya007.workers.dev";

export const PRODUCTION_SITE_URL = "https://orammedia.com";

/** Returns origin with no trailing slash. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (process.env.CF_ENV === "staging") return STAGING_SITE_URL;
  if (process.env.CF_ENV === "production") return PRODUCTION_SITE_URL;

  return "http://localhost:3000";
}
