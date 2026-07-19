# P0 Launch Fixes

**Date:** 2026-07-18  
**Scope:** Production Readiness Audit P0 blockers only  
**Not done:** Production deploy, `orammedia.com` DNS, P1/P2 items, staging redeploy  

---

## 1. Executive result

| P0 | Item | Status |
|----|------|--------|
| P0-01 | Production Wrangler bindings | **Configured in repo** (resource IDs still pending create) |
| P0-02 | Public verification placeholders | **Removed from public source + seed** (live staging D1 not updated) |
| P0-03 | Build-time site URL | **Fixed in code + npm scripts** (live Worker still needs rebuild) |

**Production launch remains HOLD** until remaining blockers below are closed.

---

## 2. Files changed

| File | Change |
|------|--------|
| `wrangler.jsonc` | Expanded `env.production` with D1, R2, KV, assets, services, WASM rules, compatibility flags, and production vars. Staging block left unchanged. |
| `package.json` | Added `cf:build:staging` / `cf:build:production`; default `cf:build` and `cf:deploy:staging` use staging URL at build time. |
| `src/lib/site-url.ts` | **New** — `getSiteUrl()` with staging/production/localhost resolution. |
| `src/lib/facebook/oram-media-curated.ts` | `siteConfig.url` now uses `getSiteUrl()` (no hard default to `orammedia.com`). |
| `src/platform/env.ts` | `appUrl` uses `getSiteUrl()`. |
| `src/components/wizard/steps/WizardSeoStep.tsx` | Admin SEO preview base URL uses `getSiteUrl()`. |
| `src/lib/data/mock-data.ts` | Removed public `NEEDS VERIFICATION` / `REQUIRES VERIFICATION` copy. |
| `src/lib/data/archival-classification.ts` | Removed public-facing verification phrases (surfaced via archive record). |
| `exports/staging-seed.sql` | Same public verification phrases removed from seed payloads. |
| `docs/P0_LAUNCH_FIXES.md` | This report. |

**Intentionally untouched (internal notes):**  
`projects-research.ts`, `filmography-catalogue.ts`, `archive-master-register.ts`, `media-rights-register.ts`, admin `verificationNotes` fields, and `production-archive.ts` detection helpers.

---

## 3. Fixes made

### 3.1 Production Wrangler configuration (P0-01)

`env.production` now includes:

- Worker name: `orammedia-production`
- D1 binding `DB` → database name `orammedia-production`
- R2 binding `DAM_BUCKET` → `orammedia-dam-production`
- KV binding `RATE_LIMIT_KV` (placeholder id)
- Assets → `.open-next/assets` / `ASSETS`
- Service binding `WORKER_SELF_REFERENCE` → `orammedia-production`
- Compatibility flags + CompiledWasm rules (parity with staging)
- Vars: `DATABASE_PROVIDER=d1`, `STORAGE_PROVIDER=r2`, `CF_ENV=production`, `CONTACT_EMAIL_MODE=auto`, `NEXTJS_ENV=production`, `NEXT_PUBLIC_SITE_URL=https://orammedia.com`

Staging `env.staging` bindings, IDs, and vars were **not** changed.

Placeholder IDs (must be replaced after create):

- D1: `00000000-0000-4000-8000-000000000001`
- KV: `00000000-0000-4000-8000-000000000002`

### 3.2 Public verification placeholders (P0-02)

Searched for `NEEDS VERIFICATION`, `Needs Verification`, `REQUIRES VERIFICATION`, `TODO`, `PLACEHOLDER`, `VERIFY`.

Public surfaces cleaned:

- Mock project copy (`fullDescription`, `productionProcess`, `oramRole`, interesting facts)
- Archival classification strings that appear in the public “Archive record” block
- Staging seed SQL rows that populate public production/filmography fields

Internal research/catalogue/rights registers left as editor notes.

### 3.3 Build-time site URL (P0-03)

**Root cause:** Next.js inlines `NEXT_PUBLIC_*` at build time. Wrangler runtime `vars.NEXT_PUBLIC_SITE_URL` cannot rewrite sitemap/robots/canonical/OG already baked into `.open-next`.

**Code path:** All public site origin reads go through `getSiteUrl()`:

1. `NEXT_PUBLIC_SITE_URL` (preferred, set at build)
2. else `CF_ENV=staging` → staging workers.dev URL
3. else `CF_ENV=production` → `https://orammedia.com`
4. else `http://localhost:3000`

Consumers: `siteConfig.url` → `layout` metadataBase/OG/JSON-LD, `robots.ts`, `sitemap.ts`, project canonicals/OG.

**Final build strategy**

| Target | Command | Baked `NEXT_PUBLIC_SITE_URL` | Deploy (when approved) |
|--------|---------|------------------------------|------------------------|
| Staging | `npm run cf:build:staging` | `https://orammedia-staging.nasalifya007.workers.dev` | `npx wrangler deploy --env staging` (WSL; existing process) |
| Production | `npm run cf:build:production` | `https://orammedia.com` | **Do not run until launch approval** |
| Default `cf:build` | Alias of staging build | Staging URL | Safer default |

Verify after a staging rebuild (not performed in this task):

- `/robots.txt` Sitemap host = staging
- `/sitemap.xml` `<loc>` hosts = staging
- Project canonical + `og:url` / `og:image` absolute URLs = staging
- Organization JSON-LD `url` / `logo` = staging

---

## 4. Remaining blockers

| ID | Severity | Blocker | Owner action |
|----|----------|---------|--------------|
| R-01 | **P0** | Production D1 / R2 / KV Cloudflare resources not created; sentinel IDs in `wrangler.jsonc` | Create resources; paste real `database_id` and KV `id` |
| R-02 | **P0** | Live staging D1 still contains old verification copy until DB is updated | Apply sanitized content via admin edit or controlled re-seed (**not done here**) |
| R-03 | **P0** | Live staging Worker still serves build baked with `orammedia.com` SEO URLs | Rebuild with `cf:build:staging` and redeploy staging from WSL when ready |
| R-04 | Ops | Production secrets not provisioned (`PAMS_SESSION_SECRET`, Resend trio, etc.) | `wrangler secret put … --env production` before any prod deploy |
| — | P1+ | Privacy page, robots disallow admin, page RBAC, ISR, etc. | Out of scope for this P0 pass |

---

## 5. Explicit non-actions

- No production deploy  
- No `orammedia.com` connection  
- No staging Worker redeploy in this pass  
- No P1/P2 code work  

---

*End of P0 launch fixes report.*
