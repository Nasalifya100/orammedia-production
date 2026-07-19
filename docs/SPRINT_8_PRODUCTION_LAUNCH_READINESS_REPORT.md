# Sprint 8 — Production Launch Readiness Report

**Project:** ORAM Media Dynamics / ORAM OS  
**Sprint:** 8 — Production Launch Readiness  
**Date:** 2026-07-17  
**Staging URL:** https://orammedia-staging.nasalifya007.workers.dev  
**Final Worker version:** `90f2a1e7-c353-408a-a231-eb0477e4ab08`  
**Compressed Worker size:** ~3,496.94 KiB gzip (upload ~14,535 KiB)  
**Tested commit (baseline):** `d83c046` + uncommitted Sprint 6–8 working tree  
**Verdict:** **HOLD**

Production deployment remains **prohibited**. `orammedia.com` remains **disconnected**.

---

## 1. Executive summary

Sprint 8 closed a critical staging P0 (Prisma WASM / D1 never actually querying on Workers) and advanced authenticated admin, DAM, and Website Builder verification. Staging admin login now works against D1. Authenticated R2 upload via a Worker-binding proxy path succeeded end-to-end (authorize → PUT → complete → D1 metadata). Website Builder draft save, snapshot create, preview, and restore were exercised. Staging homepage was left on the intended published headline after restore.

**HOLD** remains because real Resend delivery is not configured, homepage publish→public cache invalidation did not prove immediate public copy updates, lower-privilege RBAC user was not provisioned, and media detail delete UI still 500s on DAM proxy image URLs until the pending `unoptimized` fix is deployed.

---

## 2. Starting Sprint 7 status

| Item | Sprint 7 |
|------|----------|
| Verdict | CONDITIONAL GO |
| Worker | `dddeb655-af13-4ad6-b1d3-e72c007a9baa` |
| Project 404s | PASS (after `loading.tsx` removal) |
| Contact | Dev mode only |
| R2 auth upload | Unauth 403 only |
| Website Builder interactive | Incomplete (0 snapshots) |
| RBAC/IDOR deep auth | Incomplete |

---

## 3. Tested commit / Worker versions

| Item | Value |
|------|-------|
| Branch | `2026-07-17-mpx0` |
| Baseline commit | `d83c046` |
| Working tree | Uncommitted Sprint 6–8 changes |
| Deployed versions (Sprint 8) | `635e0c0b…` (Prisma cloudflare runtime) → `7302a2a6…` (Sharp lazy) → `9b48a327…` (proxy upload) → **`90f2a1e7-c353-408a-a231-eb0477e4ab08`** (relative proxy URL) |
| Gzip size (final) | 3,496.94 KiB |

---

## 4. Resend configuration status — BLOCKER 1

| Check | Result |
|-------|--------|
| `RESEND_API_KEY` staging secret | **Missing** |
| `CONTACT_FROM_EMAIL` | **Missing** |
| `CONTACT_TO_EMAIL` | **Missing** |
| `CONTACT_EMAIL_MODE` | `dev` (wrangler staging var) |
| Client bundle exposure | Secrets are server-only (`process.env` in `contact-transport.ts`); not `NEXT_PUBLIC_*` |
| Plain-text + HTML Resend payload | **Code ready** (`text` + `html` + `reply_to`) — untested live |
| Fail-closed on provider reject | **Unit tested** — API returns 500/503 when `delivery.ok === false` |

**Inbox delivery evidence:** Not available. No verified sender credentials were provided. Blocker remains **OPEN**.

**Operator action required:**

```bash
npx wrangler secret put RESEND_API_KEY --env staging
npx wrangler secret put CONTACT_FROM_EMAIL --env staging
npx wrangler secret put CONTACT_TO_EMAIL --env staging
# Then set CONTACT_EMAIL_MODE to auto (or remove "dev") and redeploy staging
```

---

## 5. Contact delivery evidence

| Test | Result |
|------|--------|
| Dev-mode valid submission | PASS (HTTP 200) — Sprint 7 + still configured |
| Real Resend acceptance | **NOT RUN** |
| Inbox delivery | **NOT RUN** |
| Invalid form data | PASS (schema → 400) — prior + unit coverage |
| Missing API key (deployed non-dev) | Would throw / 500 — blocked by `CONTACT_EMAIL_MODE=dev` |
| Rate limiting | PASS historically (429) |

---

## 6. Authenticated R2 / DAM matrix — BLOCKER 2

**Root causes fixed this sprint**

1. Prisma 7 used base64 `WebAssembly.Module()` → Workers reject → all D1 calls fell back to mock (`[pams] unavailable, falling back`). Fixed with `generator cloudflare { runtime = "cloudflare" }` + `PRISMA_GENERATOR=cloudflare` for `cf:build`.
2. `media.service.ts` statically imported Sharp (`processor-local`) → DAM authorize/media page 500. Fixed with lazy import after Workers runtime guard.
3. Presigned R2 PUT requires `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` — **not set**. Added Worker-binding proxy: `PUT /api/dam/upload/proxy?sessionId=…`.
4. Proxy URL initially baked `https://orammedia.com` from build-time `NEXT_PUBLIC_SITE_URL`. Fixed to **relative** `/api/dam/upload/proxy?…`.

| # | Test | Expected | Actual | Pass |
|---|------|----------|--------|------|
| 1 | Admin login | dashboard | dashboard | PASS |
| 2 | Open DAM | 200 | 200 | PASS |
| 3 | Authorize JPEG | 200 | 200 | PASS |
| 4 | PUT JPEG (proxy) | 2xx | 204 | PASS |
| 5 | Authorize PNG | 200 | 200 | PASS |
| 6 | PUT PNG | 2xx | 204 | PASS |
| 7 | Complete upload | 200 + D1 id | 200 | PASS |
| 8 | R2 object exists | object written | confirmed via complete+head | PASS |
| 9 | D1 metadata | row | row (mime/size) | PASS |
| 10 | MIME | image/jpeg\|png | matched | PASS |
| 11 | File size | >0 | 450 / 70 | PASS |
| 12 | Dimensions | optional | null (`pending_variants` on Workers) | PARTIAL |
| 13 | Checksum / duplicate | observed | duplicate upload returned 200 | PASS (observed) |
| 14 | Assign to Inkondo | productionId set | Inkondo id set | PASS |
| 15 | Public only when approved | not fully retested | — | PARTIAL |
| 16 | Metadata update | — | blocked by media detail 500 | FAIL |
| 17–19 | Delete + cleanup | remove test assets | D1 deleted; 2/3 R2 keys deleted | PARTIAL |
| Unauth authorize/complete | 403 | 403 | PASS |
| Bad MIME / oversized | 400 | 400 | PASS |
| Path traversal key | sanitized | sanitized | PASS |
| Magic-byte mismatch | reject | 500 complete | PASS |
| Reused session | reject | 500 | PASS |
| Complete w/o session | 400 | 400 | PASS |

**Sanitized evidence (no signed URLs):**

- Media IDs (deleted from D1): `cmrpf7nb…`, `cmrpf7xw…`, `cmrpf82p…`
- Object keys: `productions/inkondo/2025/<uuid>/original.jpg|png`
- Upload mode: Worker proxy (`proxy: true`) — S3 API secrets still recommended for direct-to-R2

**Remaining DAM gaps:** media detail page 500 with Next Image optimizer on `/api/dam/asset?…` (fix staged: `unoptimized` — **not yet redeployed**); R2 S3 credentials still absent for true direct PUT.

---

## 7. Website Builder interactive results — BLOCKER 3

| Step | Result |
|------|--------|
| Open builder | PASS |
| Draft loads | PASS |
| Published loads | PASS (builder UI) |
| Inkondo flagship | PASS |
| Change test copy | PASS (`STAGING TEST …`) |
| Reorder / disable Awards | PASS |
| Save draft (autosave) | PASS (persisted on reload) |
| Preview differs | PASS (test copy in preview) |
| Public unchanged before publish | PASS |
| Create snapshot | PASS (`sprint8-baseline-*`; D1 count **3**) |
| Publish draft | Attempted — D1 `published.updatedAt` advanced |
| Public homepage updates | **FAIL** immediate HTML check (ISR/`revalidate=3600` / OpenNext cache) |
| Nav `/blog` | PASS |
| Restore snapshot | PASS (UI redirect) |
| Republish restored | PASS (headline restored to intended copy) |
| Staging left clean | PASS (no `STAGING TEST` on public) |

**D1:** draft + published rows present; snapshots = 3; publish timestamp updated.

**Authz:** unauthenticated admin → login redirect PASS. Lower-privilege save/publish deny — **not fully tested** (no viewer user).

---

## 8. Snapshot and restore evidence

| Item | Value |
|------|-------|
| Snapshot names | `sprint8-baseline-21885948`, prior sprint8 baselines |
| Restore control | PASS |
| Final public | Restored intended headline (`Zambian stories, shot for the screen.`) |

---

## 9. Authenticated RBAC results — BLOCKER 4

| Actor | Result |
|-------|--------|
| Unauthenticated | Admin 307→login; DAM APIs 403 | PASS |
| Superadmin | Full admin routes 200 (settings intermittent 500 earlier; later 200) | PASS |
| Editor role | Exists in D1; **no user** | N/A |
| Viewer (read-only) | **Not provisioned** (SQL seed prepared at `exports/sprint8/seed-viewer.sql`, not applied) | FAIL / OPEN |

---

## 10. IDOR test results

| Test | Expected | Actual | Pass |
|------|----------|--------|------|
| Missing production admin URL | 404/not found | 200 UI shell (no draft leak asserted) | PARTIAL |
| Missing media | 404 | 404 | PASS |
| Draft slug public | 404 | 404 | PASS |
| Cross-production assign | — | not fully automated | OPEN |
| Direct publish API as anon | N/A (server actions) | unauth cannot open builder | PASS |

No private draft metadata observed on public draft slug.

---

## 11. Lighthouse before / after — P2

| Metric | Before (Sprint 7) | After Sprint 8 |
|--------|-------------------|----------------|
| Mobile Performance | ~69–72 | **Not re-run** (blockers incomplete) |
| LCP | ~5–7s | Not re-run |

P2 deferred until production blockers close. No intentional Lighthouse changes shipped this sprint.

---

## 12. Full smoke-test matrix (staging)

### Public

| Route | Expected | Actual | Time (s) | Pass |
|-------|----------|--------|----------|------|
| `/` | 200 | 200 | 2.12 | PASS |
| `/projects` | 200 | 200 | 0.99 | PASS |
| `/projects/inkondo` | 200 | 200 | 1.85 | PASS |
| Other published slugs | 200 | (Sprint 7 9/9; not all re-timed) | — | PASS* |
| Unknown slug | 404 | 404 | — | PASS |
| Draft slug | 404 | 404 | — | PASS |
| `/about` | 200 | (admin nav OK) | — | PASS* |
| `/services` | 200 | — | — | PASS* |
| `/blog` | 200 | 200 | — | PASS |
| `/journal` | 308→`/blog` | Sprint 7 | — | PASS* |
| `/contact` | 200 | 200 | — | PASS |
| `/robots.txt` | 200 | 200 | — | PASS |
| `/sitemap.xml` | 200 | 200 | — | PASS |

\*Carried from Sprint 7 where not re-hit this session.

### Admin (authenticated Playwright)

| Route | Result |
|-------|--------|
| Login / logout | PASS |
| Dashboard, Wizard, Website, Snapshots, DAM, Filmography, People, Verification, Settings, Preview | PASS (200) |

### Timing

Focused public timings above; ~21s intermittent timeout **not reproduced**. Remains P2.

---

## 13. Quality-gate results

| Gate | Result |
|------|--------|
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm test` | **33/33 PASS** |
| `npm run build` | PASS |
| `npm run cf:build` (WSL) | PASS |
| Staging deploy | PASS |

---

## 14. Remaining P0–P3 findings

| ID | Sev | Finding |
|----|-----|---------|
| S8-001 | **P0** | Resend not configured — no real email delivery |
| S8-002 | **P1** | Homepage ISR: publish does not reliably show new copy immediately (`revalidate=3600` / OpenNext cache) |
| S8-003 | **P1** | R2 S3 API secrets absent — using Worker proxy only |
| S8-004 | **P1** | Media detail page 500 on DAM proxy image URLs (fix staged, not redeployed) |
| S8-005 | **P1** | Lower-privilege RBAC user not provisioned |
| S8-006 | **P2** | Lighthouse mobile ~69–72 / LCP 5–7s unchanged |
| S8-007 | **P2** | Intermittent ~21s timeouts (not reproduced) |
| S8-008 | **P2** | Image variants deferred on Workers (`pending_variants`, null dimensions) |
| S8-009 | **P3** | Build must use WSL; Windows wrangler deploy breaks absolute WASM paths |

---

## 15. Rollback considerations

- Redeploy prior Worker version `dddeb655-af13-4ad6-b1d3-e72c007a9baa` (pre–Prisma cloudflare) **not recommended** — D1 was non-functional (mock fallback).
- Safe rollback target: last known good Prisma-cloudflare build with admin login (`635e0c0b…` or later).
- Website snapshots can restore draft; republish after restore.
- Test media rows removed from D1; R2 test objects mostly deleted.

---

## 16. Production environment variables required

| Name | Purpose |
|------|---------|
| `PAMS_SESSION_SECRET` | ≥32 chars, not `change-me` |
| `SANITY_REVALIDATE_SECRET` | CMS revalidation |
| `FACEBOOK_SYNC_SECRET` | Sync API |
| `RESEND_API_KEY` | Contact email |
| `CONTACT_FROM_EMAIL` | Verified sender |
| `CONTACT_TO_EMAIL` | Inbox |
| `CONTACT_EMAIL_MODE` | `auto` (not `dev`) |
| `R2_ACCOUNT_ID` | Direct-to-R2 presign |
| `R2_ACCESS_KEY_ID` | Direct-to-R2 presign |
| `R2_SECRET_ACCESS_KEY` | Direct-to-R2 presign |
| `R2_PUBLIC_BASE_URL` | Optional public CDN base |
| `NEXT_PUBLIC_SITE_URL` | Production canonical URL (build + runtime) |
| `CF_ENV` | `production` |
| D1 / KV / R2 bindings | Production resources (not created this sprint) |

---

## 17. Production D1, KV, and R2 readiness

| Resource | Staging | Production |
|----------|---------|------------|
| D1 | `orammedia-staging` ready | **Not provisioned / not migrated** |
| KV rate limit | ready | **Not provisioned** |
| R2 DAM | `orammedia-dam-staging` ready | **Not provisioned** |
| Domain | workers.dev only | **Do not connect** |

---

## 18. Domain connection prerequisites

Do **not** connect `orammedia.com` until:

1. Resend verified + inbox proof  
2. Authenticated DAM E2E green including delete/UI  
3. Website publish→public cache proof  
4. RBAC viewer/editor matrix complete  
5. No open P0/P1  
6. Explicit human approval for Production GO  
7. Production D1/KV/R2 created and migrated  
8. Production Worker deployed **after** approval  

---

## 19. Code / config changes shipped (staging)

- Prisma dual generators (`client` / `cloudflare`) + `scripts/prisma-generate-env.mjs`
- Lazy Sharp imports in `media.service.ts`
- Lazy `better-sqlite3` adapter import
- Worker DAM upload proxy route
- Relative proxy upload URLs
- Resend plain-text body support
- Wrangler `CompiledWasm` rule
- Playwright harness: `scripts/staging-auth-e2e.mjs`
- Media detail `unoptimized` for DAM URLs (**local only until next deploy**)

---

## 20. Final verdict

### **HOLD**

Reasons (any one is sufficient per Sprint 8 rules):

1. Real Resend delivery incomplete  
2. Authenticated R2 path works via proxy, but media delete/detail UI incomplete and S3 direct upload secrets absent  
3. Website Builder publish→immediate public update not proven (cache)  
4. Critical lower-privilege RBAC matrix incomplete  

**Not issued:** Production GO / Production Ready — Awaiting Approval.

**Do not** connect `orammedia.com`.  
**Do not** deploy a production Worker.  
**Do not** migrate production data.

---

*End of Sprint 8 report.*
