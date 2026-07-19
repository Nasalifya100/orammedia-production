# Cloudflare Deployment Readiness Report

**Project:** ORAM Media Dynamics / ORAM OS  
**Sprint:** 3 — Cloudflare Deployment Readiness  
**Date:** 2026-07-17  
**Target:** Cloudflare Workers (Free plan) via `@opennextjs/cloudflare`  
**Verdict:** **CONDITIONAL GO**

---

## 1. Executive verdict

**CONDITIONAL GO** — The application is structurally prepared for Cloudflare Workers staging deployment. Platform abstractions (database, storage, uploads, media URLs), OpenNext configuration, migration tooling, and environment documentation are in place. Local quality gates pass (`npm run lint`, `npm run build`).

**Staging deployment is not complete.** The following require operator action on a Cloudflare account (not performed in this sprint):

- Create D1 database and R2 bucket; update `wrangler.jsonc` IDs
- Apply D1 schema migrations and seed/migrate archive data
- Configure Wrangler secrets (`PAMS_SESSION_SECRET`, R2 API tokens)
- Run `npm run cf:deploy:staging` from **WSL or Linux CI** (OpenNext warns Windows is unsupported; local `cf:build` failed with symlink `EPERM` on Windows)
- Execute staging smoke tests and Lighthouse on the deployed URL

**Production domain connection:** Not performed (per sprint scope).

No capability was intentionally removed. Image variant generation on Workers is **deferred** (originals stored; variants from migration or local Sharp pipeline).

---

## 2. Architecture before and after

### Before (Sprint 2 baseline)

```
Browser → Next.js (Node) → better-sqlite3 (local file)
                        → public/assets/dam/ (writable FS)
                        → Sharp (in-process image variants)
                        → Buffered multipart POST /api/dam/upload
```

### After (Sprint 3 target)

```
Browser → Cloudflare Worker (OpenNext) → D1 (SQLite via PrismaD1 adapter)
                                       → R2 (DAM binaries via StorageProvider)
                                       → Presigned PUT direct-to-R2 uploads
                                       → Metadata + URLs in D1 (MediaAsset)

Local dev (unchanged path):
Browser → next dev (Node) → better-sqlite3 + local filesystem DAM + Sharp
```

**Central abstractions (no env checks in repositories):**

| Layer | Module |
|-------|--------|
| Runtime config | `src/platform/env.ts` |
| Database | `src/platform/db/client.ts` → `getDb()` |
| Storage | `src/platform/storage/*` → `getStorage()` |
| Media URLs | `src/platform/media/urls.ts` |
| Processing | `src/platform/media/processing.ts` (Sharp local only) |

---

## 3. Compatibility matrix

| Module / capability | Status | Notes |
|---------------------|--------|-------|
| Next.js 16.2.9 App Router | **COMPATIBLE** | OpenNext 1.20.1 builds; Next 16 support evolving |
| React 19.2.4 | **COMPATIBLE** | |
| Prisma 7.8.0 + SQLite schema | **REQUIRES ADAPTATION** | D1 via `@prisma/adapter-d1`; no real transactions |
| `better-sqlite3` | **LOCAL ONLY** | Not bundled for Workers path |
| JWT sessions (`jose`) | **COMPATIBLE** | |
| `bcryptjs` password hashing | **COMPATIBLE** | With `nodejs_compat` |
| Server Actions | **COMPATIBLE** | Avoid large payloads |
| Route handlers | **COMPATIBLE** | DAM upload route blocks buffered upload on Workers |
| `unstable_cache` / tags | **REQUIRES ADAPTATION** | OpenNext incremental cache; verify on staging |
| Sharp | **BLOCKED** on Workers | Local-only via `processor-local.ts` |
| Writable filesystem (`public/assets/dam`) | **BLOCKED** | Replaced by R2 + `StorageProvider` |
| Buffered `/api/dam/upload` | **BLOCKED** on CF | Direct authorize → PUT → complete flow |
| Contact form (JSON + in-memory rate limit) | **COMPATIBLE** | Rate limit resets per isolate; use KV/Durable Object for production scale |
| Mux / YouTube / Facebook | **COMPATIBLE** | External HTTP |
| Sanity CMS | **COMPATIBLE** | Optional; public site uses PAMS |
| `export const runtime = "nodejs"` | **REMOVED** from DAM upload | Was incompatible |
| Prisma `$transaction` | **REQUIRES ADAPTATION** | D1 ignores transactions — role assignment runs as separate queries |
| Inkondo poster / flagship | **COMPATIBLE** | Fallback paths preserved |
| Website Builder / Wizard | **COMPATIBLE** | Autosave unchanged |

---

## 4. Platform discovery (Phase 1)

| Item | Value |
|------|-------|
| Next.js | 16.2.9 |
| React | 19.2.4 |
| Prisma | 7.8.0 |
| Database provider (local) | SQLite via `@prisma/adapter-better-sqlite3` |
| Database provider (CF) | D1 via `@prisma/adapter-d1` |
| OpenNext adapter | `@opennextjs/cloudflare` 1.20.1 |
| Wrangler | 4.112.0 |

**Node APIs used (local / Sharp path):** `fs/promises`, `path`, `crypto`, `Buffer`, `sharp`, `better-sqlite3`

**Filesystem:** `public/assets/dam/` (legacy local DAM); abstracted behind `LocalStorageProvider`

**Authentication:** JWT cookie `pams_session` (`jose` HS256), `bcryptjs` passwords, RBAC via Role/Permission tables

**Middleware:** None (admin protection via server components + session checks)

**Caching:** `unstable_cache` with `productions` tag; `React.cache()` on website config; ISR on public routes

**Image strategy:** `next/image` with remote patterns; optional `NEXT_IMAGE_UNOPTIMIZED=true` on Workers; pre-generated WebP/AVIF variants preferred

**Video:** Mux player (deferred load), YouTube/Vimeo URLs in trailers

---

## 5. OpenNext configuration

**Files added:**

- `open-next.config.ts` — `defineCloudflareConfig({})`
- `wrangler.jsonc` — Worker entry, D1 `DB`, R2 `DAM_BUCKET`, staging/production env placeholders
- `cloudflare-env.d.ts` — Binding types
- `public/_headers` — Static asset cache headers

**Scripts:**

```json
"cf:build": "opennextjs-cloudflare build",
"cf:preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
"cf:deploy:staging": "opennextjs-cloudflare build && opennextjs-cloudflare deploy --env staging",
"cf:typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
```

**`next.config.ts`:** `initOpenNextCloudflareForDev()` gated to `NODE_ENV !== "production"` so local `next build` does not bind empty local D1.

**Build result:**

| Gate | Result |
|------|--------|
| `npm run lint` | **PASS** — 0 errors, 0 warnings (source) |
| `npm run build` | **PASS** — 43 routes (includes new DAM API routes) |
| `npm run cf:build` | **FAIL (local Windows)** — symlink `EPERM`; OpenNext recommends WSL/Linux CI |

---

## 6. D1 implementation

**Schema additions (`MediaAsset`):**

- `storageProvider` (`local` \| `r2`)
- `objectKey` (R2 key for original)
- `processingStatus` (`complete` \| `pending_variants` \| `failed`)

**New model:** `UploadSession` — tracks presigned upload authorization

**Client factory:** `getDb()` in `src/platform/db/client.ts`

- Local: `PrismaBetterSqlite3`
- Workers: `PrismaD1(env.DB)` via `getCloudflareContext({ async: true })`

**Wrangler binding:**

```json
"d1_databases": [{ "binding": "DB", "database_name": "orammedia-staging", "database_id": "REPLACE_AFTER_WRANGLER_D1_CREATE" }]
```

**D1 limitations documented:**

- No ACID transactions (Prisma `$transaction` best-effort only)
- Migrations via Wrangler + `prisma migrate diff` (see `scripts/seed-d1-staging.ts`)

---

## 7. Database migration procedure

### Fresh staging seed

1. `wrangler d1 create orammedia-staging` → update `database_id` in `wrangler.jsonc`
2. Generate SQL: `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migrations/0001_init.sql`
3. `npm run d1:migrate:staging`
4. `npm run pams:seed` (local) then import or run seed against D1

### Existing archive migration

```bash
npm run migrate:sqlite-to-d1              # exports JSON + report (password hashes redacted)
npm run migrate:sqlite-to-d1 -- --dry-run   # row counts only
```

Export includes: Productions, People, MediaAsset, Trailers, WebsiteConfig, WebsiteSnapshot, Users (hashes redacted), verification, rights, wizard state.

### Future incremental migrations

Use Prisma `migrate diff` against D1 baseline + `wrangler d1 migrations apply`.

---

## 8. R2 implementation

**Bucket:** `orammedia-dam-staging` (binding `DAM_BUCKET`)

**Object key layout:**

```
productions/{production-slug}/{year}/{asset-id}/original.ext
productions/{production-slug}/{year}/{asset-id}/thumbnail.webp
productions/{production-slug}/{year}/{asset-id}/640.webp
productions/{production-slug}/{year}/{asset-id}/1280.webp
productions/{production-slug}/{year}/{asset-id}/1920.webp
```

**Providers:** `LocalStorageProvider`, `R2StorageProvider` (`src/platform/storage/`)

**Secrets (server-only, Wrangler secrets):** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`

**Public delivery:** `R2_PUBLIC_BASE_URL` or proxied `/api/dam/asset?key=...`

---

## 9. DAM migration procedure

```bash
# Dry run — no writes
npm run migrate:dam-to-r2 -- --dry-run

# Migrate batch
npm run migrate:dam-to-r2 -- --limit=50

# Full migration (after R2 credentials configured)
npm run migrate:dam-to-r2
```

- Uploads originals via `wrangler r2 object put`
- Updates `MediaAsset.storageProvider`, `objectKey`, `path`
- **Does not delete** local files under `public/assets/dam/`
- Report: `exports/dam-r2-migration-report.json`

---

## 10. Media processing strategy

| Environment | Strategy |
|-------------|----------|
| **Local dev** | Sharp — thumbnail, WebP, AVIF, 640/1280/1920 variants (`processor-local.ts`) |
| **Cloudflare Workers** | **Deferred** — store original in R2; `processingStatus: pending_variants`; serve original or pre-migrated variants |
| **Archive migration** | Run Sharp locally before/during R2 upload; upload existing variant files |
| **Future (paid/optional)** | Cloudflare Images, dedicated processing Worker, or queue consumer |

**Guarantees:**

- Original always retained
- Failed variant generation does not delete original
- Admin can see `processingStatus` on assets
- Rotate/flip blocked on Workers until processing service exists

---

## 11. Direct upload flow (Phase 8)

```
1. POST /api/dam/upload/authorize  → session + presigned PUT URL
2. Browser PUT file → R2 (no Worker body buffering)
3. POST /api/dam/upload/complete   → verify object, create MediaAsset
```

**Local fallback:** authorize returns POST to `/api/dam/upload` (buffered, Sharp pipeline).

**UI:** `MediaUploadZone` supports both paths with progress, cancel, retry.

**Security:** No permanent R2 credentials in browser; MIME/size validated at authorize.

---

## 12. Authentication changes

- Production/staging: `assertProductionSecrets()` in `src/instrumentation.ts` fails startup if default `PAMS_SESSION_SECRET` or weak bootstrap password
- Secure cookies when `NODE_ENV=production` or `CF_ENV=staging|production`
- Sessions: HTTP-only, SameSite=Lax, 7-day TTL
- RBAC unchanged (`requireAdminSession`, permission keys)

---

## 13. Cache behavior

**Local Next.js:** `unstable_cache` + `revalidateTag('productions')` on publish/wizard/media actions.

**Cloudflare/OpenNext:** Incremental cache via OpenNext bundle; R2 incremental cache optional (not enabled — add `NEXT_INC_CACHE_R2_BUCKET` to enable).

**Expected differences to verify on staging:**

- Tag invalidation semantics may differ from Node `revalidateTag`
- Draft/preview routes remain `dynamic` / uncached
- Admin responses should carry private cache headers (verify)

**Headers added:** `X-Robots-Tag: noindex` on `/admin/*` and `/preview/*`

---

## 14. Environment variable register

See `.env.example`. Summary:

| Variable | Class |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | Public |
| `DATABASE_PROVIDER` | Server (`sqlite` local, `d1` CF) |
| `STORAGE_PROVIDER` | Server (`local` / `r2`) |
| `PAMS_SESSION_SECRET` | Server secret |
| `R2_*` | Server secret / binding |
| `DB`, `DAM_BUCKET` | Cloudflare bindings |
| `DATABASE_URL` | Local only |

**Staging checklist:** `.env.example` + `scripts/seed-d1-staging.ts` workflow comments.

**Secret rotation:** Rotate `PAMS_SESSION_SECRET` (invalidates sessions), R2 API tokens via Cloudflare dashboard, update Wrangler secrets.

---

## 15. Security findings

| Finding | Severity | Mitigation |
|---------|----------|------------|
| Default dev session secret | **BLOCKER in prod** | `assertProductionSecrets()` |
| In-memory contact rate limit | **IMPORTANT** | Per-isolate on Workers; upgrade to KV rate limiter |
| Vault assets public URL guessing | **IMPORTANT** | Use signed URLs for `archiveStatus=vault`; `/api/dam/asset` checks session |
| D1 no transactions | **IMPORTANT** | Document; avoid multi-step financial-style invariants |
| CSP not fully configured | **NON-BLOCKER** | Basic headers present; tighten CSP on staging |
| Preview routes | **MITIGATED** | `noindex` headers; session required for draft preview |

---

## 16. Staging URL and test results

| Test | Status |
|------|--------|
| Staging deployment | **NOT RUN** — requires Cloudflare account credentials |
| Public smoke tests | **NOT RUN** |
| Admin smoke tests | **NOT RUN** |
| R2 desktop/mobile upload | **NOT RUN** on staging |
| Local DAM upload (Node) | **Expected PASS** — existing route preserved |

**Staging URL:** _Pending — set after `npm run cf:deploy:staging`_

---

## 17. Lighthouse results

**NOT MEASURED** — no staging URL deployed. Do not invent scores.

Recommended first targets once staging is live:

- Homepage mobile
- `/projects` mobile
- One project page (e.g. Inkondo)
- `/contact` mobile

---

## 18. Bundle measurements

**NOT MEASURED** — `cf:build` did not complete on Windows (symlink permission).

**Action for CI/Linux:**

```bash
npm run cf:build
ls -la .open-next/worker.js
# Inspect OpenNext build output for Worker + middleware sizes
```

**Known bundle risks:**

- Prisma client + D1 adapter
- `better-sqlite3` / `sharp` must **not** appear in Worker bundle (dynamic imports gated to local path)
- Admin code co-located with public routes in OpenNext server bundle

---

## 19. Free-plan risk assessment

Based on architecture (not measured traffic):

| Resource | Risk | Notes |
|----------|------|-------|
| Worker requests | Medium | Admin + public SSR |
| CPU time | Medium | Prisma queries; no Sharp on Workers |
| Worker bundle size | **Important** | Must stay under plan limits; measure on Linux build |
| D1 reads/writes | Medium | Wizard autosave, DAM metadata |
| R2 storage | Medium | Full DAM archive |
| R2 Class A ops | Medium | Uploads, migrations |
| Video bandwidth | Medium | Mux/YouTube offload helps |
| Image transforms | Low on Workers | Pre-generated variants |
| Builds | Low | CI OpenNext builds |

**First upgrade candidates:** R2 storage growth, D1 write volume (autosave), Worker CPU on admin pages.

---

## 20. Backup procedure

### D1

```bash
wrangler d1 export orammedia-staging --remote --output=backup-YYYY-MM-DD.sql
```

Store off-repo; Git is not a database backup.

### R2

Use `wrangler r2 object list` + bulk copy to secondary bucket or export via S3 API.

### Website snapshots

Already in D1 (`WebsiteSnapshot`); include in D1 export.

### Recovery test (staging)

1. Restore D1 from export to new staging DB
2. Verify R2 object keys match `MediaAsset.objectKey`
3. Republish website config if needed

---

## 21. Rollback procedure

| Scenario | Rollback |
|----------|----------|
| Application code | Redeploy previous Worker version (`wrangler rollback` / dashboard) |
| Database schema | Restore D1 backup; run down migration if available |
| Website config | Restore `WebsiteSnapshot` via Website Builder |
| Published homepage | Re-publish from last good draft snapshot |
| Individual production | Wizard revision restore (`Revision` table) |
| Media replacement | Re-run DAM migration from local masters (local files retained) |
| Failed D1 migration | Re-import from `exports/pams-sqlite-export.json` |
| Failed R2 migration | Local `public/assets/dam/` unchanged; re-run dry-run |

---

## 22. Remaining blockers

1. **Cloudflare account provisioning** — D1 ID, R2 bucket, secrets, staging URL
2. **`cf:build` on Linux/WSL/CI** — Windows symlink EPERM
3. **D1 schema apply + data migration** — operator runbook in §7
4. **R2 public domain or signed URL policy** — configure `R2_PUBLIC_BASE_URL`
5. **Staging smoke tests** — all acceptance gates requiring deployed URL
6. **Lighthouse / bundle size** — measure post-deploy
7. **Image variant processing on Workers** — deferred; originals + migrated variants only
8. **Contact rate limiting** — KV-backed limiter for multi-isolate consistency (optional before prod)

---

## 23. Manual production launch checklist

- [ ] Create production D1 + R2 (separate from staging)
- [ ] Run full SQLite → D1 + DAM → R2 migration with validation reports
- [ ] Set strong `PAMS_SESSION_SECRET`; disable default bootstrap password
- [ ] Configure production domain on Worker (not done in this sprint)
- [ ] Enable R2 public access or CDN in front of media bucket
- [ ] Verify Inkondo homepage poster and flagship order
- [ ] Run full smoke test matrix (§ Sprint spec Phase 20)
- [ ] Run Lighthouse on production-like staging
- [ ] Document RTO/RPO from backup drills
- [ ] Enable analytics only if approved

---

## 24. Regression confirmation

| Requirement | Status |
|-------------|--------|
| Inkondo homepage poster | Preserved (fallback + DB paths) |
| Public design/content | Unchanged |
| Production Wizard autosave | Unchanged |
| Website Builder preview parity | Unchanged |
| DAM metadata model | Extended (storage fields), not removed |
| No unverified → published by migration | Seed/migration redacts passwords; no publish defaults changed |

---

## Acceptance gates summary

| Gate | Result |
|------|--------|
| `npm run lint` | **PASS** |
| `npm run build` | **PASS** |
| Cloudflare/OpenNext build | **FAIL (Windows)** — use WSL/CI |
| Cloudflare staging deployment | **PENDING** |
| D1 migrations | **PENDING** (tooling ready) |
| D1 seed/migration validation | **PENDING** |
| R2 upload desktop/mobile | **PENDING** (code ready) |
| Website Builder / Wizard / Auth | **PASS (local)** / **PENDING (staging)** |
| No local SQLite on CF | **PASS (design)** |
| No writable FS on CF | **PASS (design)** |
| No R2 creds in browser | **PASS** |

---

**Prepared by:** Sprint 3 Cloudflare Deployment Readiness  
**Next step:** Operator approval → provision Cloudflare staging → deploy from Linux CI → execute Phase 20 smoke tests → re-evaluate for **GO**.
