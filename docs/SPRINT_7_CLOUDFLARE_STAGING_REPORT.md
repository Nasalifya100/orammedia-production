# Sprint 7 — Cloudflare Staging Report

**Project:** ORAM Media Dynamics / ORAM OS  
**Sprint:** 7 — Cloudflare Staging (live verification + 404 fix)  
**Date:** 2026-07-17  
**Baseline commit:** `d83c046` (plus uncommitted Sprint 6–7 changes)  
**Staging URL:** https://orammedia-staging.nasalifya007.workers.dev  
**Final Worker version:** `dddeb655-af13-4ad6-b1d3-e72c007a9baa`  
**Compressed Worker size:** 3,983.07 KiB gzip (upload 15,675.77 KiB)  
**Verdict:** **CONDITIONAL GO**

---

## 1. Executive verdict

**CONDITIONAL GO** — Staging is live on Workers Paid. Published project pages resolve from D1. Unknown and draft slugs now return **true HTTP 404**. Core public smoke tests pass. Website Builder configs are seeded in D1. Rate limiting and contact (dev mode) work.

Production launch remains **prohibited**. `orammedia.com` remains **disconnected**.

| Gate | Status |
|------|--------|
| Worker deploy | **PASS** |
| Published project pages (9/9) | **PASS** (200) |
| Unknown / draft HTTP 404 | **PASS** (404) |
| Canonical / OG / noindex | **PASS** (workers.dev; staging noindex) |
| Website Builder D1 seed | **PASS** (draft + published; Inkondo flagship; `/blog` nav) |
| KV rate limits | **PASS** (429 observed) |
| Contact (dev mode) | **PASS** |
| Contact (Resend delivery) | **BLOCKED (P1)** |
| R2 authenticated upload | **PARTIAL** — unauth **403**; full upload path not exercised with session |
| Snapshots | **EMPTY** (0 rows — none created via UI) |
| Lighthouse | **MEASURED** |
| Internal security assessment | **PARTIAL** (see §15) |
| Intermittent ~21s timeouts | **P2** — not reproduced in focused timing run |

---

## 2. Tested commit / Worker versions

| Item | Value |
|------|-------|
| Branch | `2026-07-17-mpx0` |
| Baseline commit | `d83c046` |
| Working tree | Uncommitted Sprint 6–7 changes |
| Staging URL | `https://orammedia-staging.nasalifya007.workers.dev` |
| Prior version (404 UI-only) | `40648fd6-e824-46fd-b347-fd4fded04e63` |
| Version after true-404 fix | `02e4de97-7b5a-414c-80ac-21864417ebab` |
| Final version (DAM auth import fix) | `dddeb655-af13-4ad6-b1d3-e72c007a9baa` |

---

## 3. HTTP 404 investigation

### Environment comparison

| Environment | `/projects/non-existent-title` | `/projects/strictly-by-invitation` (draft) | `/projects/inkondo` |
|-------------|--------------------------------|--------------------------------------------|---------------------|
| Local `next start` (before fix) | **200** + not-found UI | **200** | 200 |
| Cloudflare staging (before fix) | **200** + not-found UI | **200** | 200 |
| Local `next start` (after fix) | **404** | **404** | 200 |
| Cloudflare staging (after fix) | **404** | **404** | 200 |

**Conclusion:** Not OpenNext-only. Same 200 behavior on Node `next start`. Root cause is **Next.js App Router streaming**.

### Confirmed root cause

1. `src/app/projects/loading.tsx` wrapped the `/projects` segment (including `[slug]`) in Suspense streaming.
2. Streaming commits **HTTP 200** before `notFound()` can set 404.
3. Separating metadata/page queries was secondary; streaming boundary was decisive.

Official Next.js docs: streamed `notFound()` responses return **200**; non-streamed return **404**.

---

## 4. Selected 404 solution

### Changes

| File | Change |
|------|--------|
| `src/app/projects/loading.tsx` | **Deleted** (removed streaming boundary over `[slug]`) |
| `src/lib/data/project-detail.ts` | **Added** — `resolvePublicProject` via React `cache()` |
| `src/app/projects/[slug]/page.tsx` | Shared resolver; `notFound()` in `generateMetadata` + page; no `dynamicParams=false` |
| `src/app/api/dam/upload/authorize/route.ts` | Lazy-import `mediaService` after auth |
| `src/app/api/dam/upload/complete/route.ts` | Lazy-import `mediaService` after auth |
| `src/app/api/dam/upload/route.ts` | Lazy-import `mediaService` after auth |
| `tests/project-routing.test.ts` | Regression coverage (33 tests total) |

### Strategy

- Runtime D1 slug resolution (no build-time allowlist).
- Call `notFound()` before streaming begins.
- Shared cached lookup so metadata and page agree.
- Do not restore `dynamicParams = false`.

### 404 preservation evidence (staging)

| Slug | D1 state | HTTP | Private metadata |
|------|----------|------|------------------|
| `inkondo` | published | **200** | Public title/OG OK |
| `non-existent-title` | — | **404** | `noindex`; not-found UI; no draft fields |
| `strictly-by-invitation` | unpublished | **404** | No draft title/synopsis leak |

Sitemap includes `inkondo`; does **not** list the draft slug.

---

## 5. Timeout investigation (Phase 4)

Focused script: `scripts/staging-timing.ps1` — 5 samples × 6 routes, curl timing fields, `--max-time 120`.

**Timestamp (UTC):** 2026-07-17T18:02:26Z

| Route | Samples | HTTP | Total time range | TTFB notes |
|-------|---------|------|------------------|------------|
| `/` | 5 | all 200 | 0.54–4.71 s | First sample slower DNS/connect (cold network) |
| `/projects` | 5 | all 200 | 0.37–2.04 s | Warm &lt; 0.6 s |
| `/projects/inkondo` | 5 | all 200 | 0.47–1.74 s | No 21 s failure |
| `/services` | 5 | all 200 | 0.26–0.51 s | — |
| `/contact` | 5 | all 200 | 0.25–0.85 s | — |
| `/admin/login` | 5 | all 200 | 0.26–0.37 s | — |

### Classification

| Hypothesis | Result |
|------------|--------|
| Smoke-script timeout too low | **Contributing** to earlier `000` results |
| Expected cold start only | **Insufficient** — warm failures previously at ~21 s |
| Slow D1 | **Unlikely** — TTFB usually &lt; 1 s when successful |
| Intermittent edge/network | **Likely P2** — not reproduced in this focused run |

**Severity: P2** — monitor; not currently blocking staging verification.

---

## 6. Website Builder results

| Metric | Before | After seed |
|--------|--------|------------|
| `website_config` rows | 0 | **2** (`draft`, `published`) |
| `website_snapshot` rows | 0 | **0** |
| Flagship | — | **inkondo** |
| Nav journal slot | — | **`/blog`** (not `/journal`) |

Seed method: `scripts/seed-website-config-staging.ts` → `exports/website-config-seed.sql` → remote D1 execute (application-default configuration; no fabricated historical snapshots).

Homepage after seed shows Inkondo featured and “Zambian stories…” headline from published config.

**Not completed interactively (requires admin session UI):** snapshot create/restore, section reorder via Website Builder UI, preview publish button click. Admin routes correctly redirect unauthenticated users to login (**307**).

---

## 7. R2 results

| Check | Result |
|-------|--------|
| Bucket | `orammedia-dam-staging` (private) |
| Binding | `DAM_BUCKET` |
| Unauthenticated `/api/dam/upload/authorize` | **403 Forbidden** (after lazy-import fix) |
| Unauthenticated `/api/dam/upload/complete` | **403 Forbidden** |
| Unsafe asset key | **400** `Invalid key` |
| Authenticated JPEG/PNG upload + object create | **NOT RUN** — needs live admin session |
| Magic-byte / MIME / oversized with session | **NOT RUN** |

**Prior bug:** static import of `mediaService` pulled Sharp (`processor-local`) into the Worker route module → unauthenticated authorize crashed with **500**. Fixed by dynamic import after auth.

---

## 8. KV rate-limit results

| Endpoint | Behavior |
|----------|----------|
| `/api/revalidate` (bad secret) | 401 × many, then **429** after threshold (~30) |
| `/api/contact` | Counts toward limit; **429** after threshold |
| `/api/sync/facebook` (no auth) | **401** |
| Login | Rate-limit code present; interactive login not flooded |

KV key list via Wrangler for prefixes `revalidate:` / `contact:` returned `[]` (list lag / TTL / prefix visibility). Edge **429** behavior confirms distributed limiting is active on staging (not memory-only for these paths).

**Eventual consistency:** KV counters may briefly under-count under concurrent load; documented in `rate-limit.ts`.

Keys use hashed/IP-style prefixes (`contact:ip:…`, `revalidate:ip:…`) — no raw email/message bodies observed in API error responses.

---

## 9. Contact email results

| Mode | Result |
|------|--------|
| `CONTACT_EMAIL_MODE=dev` | Valid submission → **200** `{ success: true }` (dev-log transport) |
| Invalid payload | **400** with field errors |
| Rate limited | **429** |
| Resend API / inbox delivery | **NOT CONFIGURED** — keep **P1 production blocker** |

Do not mark real email delivery PASS.

---

## 10. Full route smoke-test matrix

Base: `https://orammedia-staging.nasalifya007.workers.dev`  
Individual requests, `--max-time 120`.

### Public

| Route | Expected | Actual | Time | Pass |
|-------|----------|--------|------|------|
| `/` | 200 | 200 | 456 ms | ✅ |
| `/projects` | 200 | 200 | 398 ms | ✅ |
| `/projects/inkondo` | 200 | 200 | 544 ms | ✅ |
| `/projects/zuba` | 200 | 200 | 446 ms | ✅ |
| `/projects/graft` | 200 | 200 | 390 ms | ✅ |
| `/projects/look-in-the-mirror` | 200 | 200 | 398 ms | ✅ |
| `/projects/pa-maliketi` | 200 | 200 | 362 ms | ✅ |
| `/projects/hang` | 200 | 200 | 534 ms | ✅ |
| `/projects/girls-to-ladies` | 200 | 200 | 355 ms | ✅ |
| `/projects/secrets-untold` | 200 | 200 | 462 ms | ✅ |
| `/projects/the-wife` | 200 | 200 | 400 ms | ✅ |
| `/projects/non-existent-title` | 404 | **404** | 328 ms | ✅ |
| `/projects/strictly-by-invitation` | 404 | **404** | 230 ms | ✅ |
| `/about` | 200 | 200 | 506 ms | ✅ |
| `/services` | 200 | 200 | 1214 ms | ✅ |
| `/blog` | 200 | 200 | 325 ms | ✅ |
| `/journal` | 308→/blog | **308** | 459 ms | ✅ |
| `/contact` | 200 | 200 | 876 ms | ✅ |
| `/robots.txt` | 200 | 200 | 996 ms | ✅ |
| `/sitemap.xml` | 200 | 200 | 6438 ms | ✅ |

### Admin (unauthenticated)

| Route | Expected | Actual | Pass |
|-------|----------|--------|------|
| `/admin/login` | 200 | 200 | ✅ |
| `/admin` | 307→login | 307 | ✅ |
| `/admin/website` | 307 | 307 | ✅ |
| `/admin/media` | 307 | 307 | ✅ |
| `/admin/filmography` | 307 | 307 | ✅ |
| `/admin/verification` | 307 | 307 | ✅ |
| `/admin/productions/wizard` | 307 | 307 | ✅ |
| `/preview/projects/inkondo` | 307 | 307 | ✅ |

Authenticated admin flows (login success, DAM upload, snapshot UI) were **not** fully automated in this pass.

---

## 11. Lighthouse results (measured)

Tool: `npx lighthouse` + Chrome headless. Output under `exports/lighthouse/`.

| Page | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT | Bytes | Reqs |
|------|------|------|----------------|-----|-----|-----|-----|-------|------|
| homepage mobile | **71** | **100** | **96** | **58** | 6111 ms | 0 | 118 ms | 1448 KB | 42 |
| projects mobile | **70** | **99** | **96** | **66** | 6288 ms | 0 | 158 ms | 2040 KB | 39 |
| Inkondo mobile | **72** | **94** | **96** | **69** | 5404 ms | 0 | 249 ms | 810 KB | 33 |
| contact mobile | **69** | **95** | **92** | **66** | 6680 ms | 0 | 232 ms | 1047 KB | 37 |
| admin login desktop | **100** | **95** | **100** | **63** | 749 ms | 0 | 0 ms | 488 KB | 22 |

**Notes:** Staging global `noindex` depresses SEO category scores (expected). LCP on public mobile pages is a **P2** performance finding (~5–7 s laboratory).

---

## 12. Internal security assessment

**Label:** Internal staging assessment — **not** an independent penetration test.

| Test | Result |
|------|--------|
| Unauthenticated `/admin/*` | **307** → login |
| Unauthenticated `/preview/*` | **307** → login |
| Revalidation bad secret | **401** |
| Facebook sync unauth | **401** |
| Upload authorize unauth | **403** (after fix) |
| Upload complete unauth | **403** |
| Path traversal project URL | **404** |
| DAM asset unsafe key | **400** Invalid key |
| Draft production public | **404** |
| Contact validation | **400** on invalid |
| Contact rate limit | **429** |
| Staging noindex | Present on homepage + 404 |

**Not fully exercised:** session tampering, IDOR with valid session, authenticated MIME spoofing, CSRF token matrix, XSS payload suite, publish/approval permission bypass with secondary role.

---

## 13. Quality-gate results

| Gate | Result |
|------|--------|
| `npm run lint` | **PASS** |
| `npx tsc --noEmit` | **PASS** |
| `npm test` | **PASS** — **33/33** |
| `npm run build` | **PASS** locally (`/projects/[slug]` = ƒ Dynamic); local build may log D1 table-missing if `DATABASE_PROVIDER=d1` leaks into shell — falls back to mock |
| WSL `npm run cf:build` | **PASS** |
| Staging deploy | **PASS** |

---

## 14. Remaining P0–P3 findings

### P0
None.

### P1

| ID | Issue |
|----|-------|
| S7-005 | Resend not configured — real contact delivery unverified |
| S7-017 | Authenticated R2/DAM upload path not end-to-end verified on staging |
| S7-018 | Website Builder UI workflows (save/preview/snapshot/restore) not interactively completed |

### P2

| ID | Issue |
|----|-------|
| S7-015 | Intermittent ~21 s request failures (not reproduced in focused timing) |
| S7-019 | Mobile LCP ~5–7 s on homepage/projects/Inkondo/contact (lab) |
| S7-020 | Snapshots table empty — create first snapshot via admin UI |
| S7-021 | Sharp/mediaService static imports unsafe on Workers route modules — mitigated for DAM API; review other imports |

### P3

| ID | Issue |
|----|-------|
| S7-011 | CI for WSL `cf:build` + deploy |
| S7-022 | Staging SEO Lighthouse scores low due to intentional noindex |

---

## 15. Production-launch prerequisites

1. Explicit production-launch approval  
2. Authenticated DAM/R2 E2E verified on staging  
3. Resend configured + inbox delivery verified (or formal risk acceptance)  
4. Website Builder UI snapshot/publish smoke completed  
5. Mobile LCP improvement or accepted risk  
6. Production `NEXT_PUBLIC_SITE_URL` set only at launch  
7. **Do not connect `orammedia.com` until the above are complete**

---

## 16. Rollback readiness

| Item | State |
|------|-------|
| Worker | Version `dddeb655…` live; prior versions retained |
| D1 | Seeded productions + website_config; retain |
| R2 | Staging bucket; private |
| KV | Staging namespace retained |
| Rollback | Redeploy prior Worker version via Wrangler |

---

## 17. Verdict

| Verdict | **CONDITIONAL GO** |
|---------|---------------------|
| Meaning | Staging is operational for public content, correct 404s, auth gates, rate limits, and seeded Website Builder data. **Do not launch production.** Close P1 items (Resend, authenticated DAM, interactive Website Builder) before production approval. |

---

**Stop.** Awaiting explicit production-launch approval. `orammedia.com` must remain disconnected.
