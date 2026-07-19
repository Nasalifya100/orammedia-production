# Final Release Candidate Report

**Project:** ORAM Media Dynamics / ORAM OS  
**Sprint:** 5 — Final Release Candidate QA  
**Date:** 2026-07-17  
**QA engineer role:** Release Manager · QA Lead · Accessibility · SEO · Production Readiness  
**Verdict:** **CONDITIONAL GO**

---

## 1. Executive verdict

**CONDITIONAL GO** — The application is a credible local release candidate: lint, TypeScript, and production build pass; core public pages render; admin workflows are implemented; Sprint 4 security fixes are present in code and partially verified via HTTP smoke tests. **Production launch is not approved.**

**Blocking context (unchanged from Sprints 3–4):**

- Cloudflare staging deployment has **not** been executed.
- `npm run cf:build` **cannot be verified on Windows** (OpenNext symlink `EPERM`).
- D1 migrations, R2 uploads, KV rate limits, edge headers, Lighthouse, contact email delivery, and penetration testing remain **staging-only**.

**Highest local findings requiring resolution before production:**

| ID | Severity | Summary |
|----|----------|---------|
| RC-001 | P1 | Staging deployment and Cloudflare smoke test not completed |
| RC-002 | P1 | `npm run cf:build` not verified (Windows symlink failure) |
| RC-003 | P1 | Pending local migration `20250717_website_builder` (Website Builder tables) |
| RC-004 | P1 | Unknown `/projects/[slug]` returns **HTTP 200** with 404 body (SEO/crawler impact) |
| RC-005 | P1 | No automated test suite configured |
| RC-006 | P2 | Page-level admin RBAC gaps (session-only on most admin pages) |
| RC-007 | P2 | `settings.read` permission referenced but not seeded (Facebook sync admin path) |
| RC-008 | P2 | Website Builder default nav links to `/journal` but route is `/blog` |
| RC-009 | P2 | Magic-byte validation is allowlist-only (no content sniffing) |
| RC-010 | P2 | Contact form accepts submissions but email transport not wired |

A **GO** verdict is **not permitted** until all staging production gates in §22 are complete.

**No production domain connection was performed.** `orammedia.com` was not connected.

---

## 2. Tested commit and environment

| Field | Value |
|-------|-------|
| Git branch | `2026-07-17-mpx0` |
| Commit hash | `d83c046e5b6f42b66eef41df4a329288fc96c108` |
| Next.js | `16.2.9` |
| React | `19.2.4` |
| Node.js (QA machine) | `v24.18.0` |
| Prisma | `7.8.0` |
| OpenNext Cloudflare | `@opennextjs/cloudflare ^1.20.1` |
| Wrangler | `4.112.0` |
| Route count (`next build`) | **40** |
| Database provider (local QA) | SQLite (`DATABASE_PROVIDER=sqlite`, `file:./prisma/pams.db`) |
| Storage provider (local QA) | Local filesystem (`STORAGE_PROVIDER=local`) |
| QA date | 2026-07-17 |

**Local servers used for HTTP QA:**

- `npm run dev` → `http://localhost:3001` (port 3000 occupied by unrelated process redirecting to `/login`)
- `npm run start -p 3002` → production build smoke tests

**Note:** `next dev` logs D1 table errors (`website_config`, `Production`, etc.) because `initOpenNextCloudflareForDev()` binds an empty local D1 while SQLite holds production data. Production `next build` / `next start` uses SQLite correctly via platform abstraction.

---

## 3. Automated gate results

Commands run exactly as shown (from repository root `c:\Users\nasa\Documents\orammedia`):

| Command | Result | Notes |
|---------|--------|-------|
| `npm run lint` | **PASS** | ESLint 0 errors, 0 warnings |
| `npx tsc --noEmit` | **PASS** | No TypeScript errors |
| `npm run build` | **PASS** (after retry) | First attempt failed: Google Fonts fetch unreachable (network). Second attempt succeeded. 40 routes compiled. |
| `npm run cf:build` | **NOT VERIFIED — REQUIRES WSL OR LINUX CI** | Next.js phase passed; OpenNext bundle failed: `EPERM: operation not permitted, symlink` (`@prisma/client` → `.open-next/...`) on Windows |
| `npx prisma validate` | **PASS** | Schema valid |
| `npx prisma migrate status` | **FAIL (pending migration)** | 3 migrations found; **`20250717_website_builder` not applied** |
| Unit tests | **NOT CONFIGURED** | No `*.test.*` / `*.spec.*` files; no test script in `package.json` |
| Integration tests | **NOT CONFIGURED** | — |
| Dead-link checker | **NOT CONFIGURED** | Manual review only |
| Unused-export checker | **NOT CONFIGURED** | — |

---

## 4. Route inventory

**Legend:** Auth = authentication; Perm = permission key; Mode = Next rendering; Index = search indexing intent.

### Public pages

| Route | Class | Auth | Perm | Mode | Data source | Storage | Index | Sitemap |
|-------|-------|------|------|------|-------------|---------|-------|---------|
| `/` | Public | None | — | SSG/ISR | PAMS + Website config (fallback defaults) | Local/R2 media URLs | Yes | Yes |
| `/about` | Public | None | — | Static | Mock + PAMS where available | — | Yes | Yes |
| `/projects` | Public | None | — | ISR | PAMS published productions | Media paths | Yes | Yes |
| `/projects/[slug]` | Public | None | — | SSG + dynamic | PAMS published by slug | Media paths | Yes (published only) | Yes (published only) |
| `/services` | Public | None | — | ISR | Mock services | — | Yes | Yes |
| `/services/[slug]` | Public | None | — | SSG | Mock services | — | Yes | Yes |
| `/contact` | Public | None | — | Static | Static page + `/api/contact` | — | Yes | Yes |
| `/careers` | Public | None | — | Static | Static | — | Yes | Yes |
| `/blog` | Public (Journal) | None | — | ISR | Facebook-derived posts | Remote images | Yes | Yes |
| `/robots.txt` | Public meta | None | — | Static | `src/app/robots.ts` | — | N/A | N/A |
| `/sitemap.xml` | Public meta | None | — | Static | PAMS + mock | — | N/A | N/A |

**Flags:**

- **Broken nav target:** Website Builder default config uses `/journal`; actual route is `/blog` (`src/pams/types/website-config.ts` vs `Header.tsx` / `sitemap.ts`).
- **Missing routes:** `/privacy`, `/terms` — not present.
- **404 status bug:** Unknown project slugs render not-found UI but return **HTTP 200** (verified on `next start`).

### Authentication

| Route | Class | Auth | Perm | Mode | Notes |
|-------|-------|------|------|------|-------|
| `/admin/login` | Authentication | None | — | Dynamic | Server action login; rate limited |

### Admin (ORAM OS / PAMS)

| Route | Class | Auth | Server-side perm on actions | Page-level perm | Index |
|-------|-------|------|----------------------------|-----------------|-------|
| `/admin` | Admin | Session (middleware) | Partial | **None** (session only) | noindex (header) |
| `/admin/website` | Admin | Session | `settings.write` on mutations | Session only | noindex |
| `/admin/website/snapshots` | Admin | Session | `settings.write` | Session only | noindex |
| `/admin/productions` | Admin | Session | Mixed on actions | Session only | noindex |
| `/admin/productions/wizard` | Admin | Session | `productions.write` | Session only | noindex |
| `/admin/productions/[id]` | Admin | Session | `productions.write` on updates | Session only | noindex |
| `/admin/productions/[id]/wizard` | Admin | Session | Wizard actions gated | Session only | noindex |
| `/admin/productions/[id]/media` | Admin | Session | `media.write` | Session only | noindex |
| `/admin/media` | Admin | Session | `media.read/write` | Session only | noindex |
| `/admin/media/[id]` | Admin | Session | `media.write/approve` | Session only | noindex |
| `/admin/filmography` | Admin | Session | `filmography.write` on writes | Session only | noindex |
| `/admin/people` | Admin | Session | `people.read/write` | Session only | noindex |
| `/admin/trailers` | Admin | Session | Partial | Session only | noindex |
| `/admin/verification` | Admin | Session | None on page | Session only | noindex |
| `/admin/reports` | Admin | Session | `reports.read` on data | Session only | noindex |
| `/admin/settings` | Admin | Session | `settings.write` | Session only | noindex |

**Flags:**

- **Unprotected admin UI (page-level):** All admin pages except action handlers use `readSession()` only. Middleware blocks unauthenticated access; **any authenticated role sees all admin navigation and page shells.**
- **Not orphaned:** All admin nav targets resolve.

### Preview

| Route | Class | Auth | Perm | Mode | Index |
|-------|-------|------|------|------|-------|
| `/preview/[[...path]]` | Preview | Session (middleware) | `productions.read` (layout) | Dynamic | noindex |
| `/preview/projects/[slug]` | Preview | Session | `productions.read` | Dynamic | noindex |

**Flags:** Preview correctly requires session at middleware and `productions.read` at layout. Cannot be accessed without login (HTTP 307 → login verified).

### API

| Route | Class | Auth | Perm | Mode | Index |
|-------|-------|------|------|------|-------|
| `POST /api/contact` | API | None | — | Dynamic | Disallow in robots |
| `GET/POST /api/dam/asset` | API | Vault: `media.read` | DB-backed key validation | Dynamic | Disallow |
| `POST /api/dam/upload` | API | Session | `media.write` | Dynamic | Disallow |
| `POST /api/dam/upload/authorize` | API | Session | `media.write` + rate limit | Dynamic | Disallow |
| `POST /api/dam/upload/complete` | API | Session | `media.write` | Dynamic | Disallow |
| `POST /api/revalidate` | API | Secret header | Fail-closed | Dynamic | Disallow |
| `GET /api/sync/facebook` | API | Admin or sync secret | `settings.read` (see RC-007) | Dynamic | Disallow |

### Development / legacy

| Item | Classification | Notes |
|------|----------------|-------|
| Sanity studio script (`npm run sanity`) | Development-only | Not part of public route tree |
| Mock-data fallbacks | Legacy fallback | Used when PAMS DB empty/unavailable |
| `/journal` | Legacy/orphan nav href | No route; should redirect to `/blog` or fix config |

---

## 5. Public website results

**Method:** Production build (`npm run build`), `next start` on `:3002`, dev server on `:3001`, code review, SQLite data audit.

| Area | Result | Evidence |
|------|--------|----------|
| Homepage | **PASS** (with fallback) | Renders; Inkondo poster/showreel fallbacks active when `website_config` table absent |
| Projects index | **PASS** | 9 published slugs in DB; mock fallback if DB unavailable |
| Published project pages | **PASS** | `/projects/inkondo` HTTP 200; SSG paths match DB |
| About / Services / Contact / Careers / Blog | **PASS** | HTTP 200 |
| 404 page | **PARTIAL** | UI renders "Page not found"; **HTTP status 200** for unknown slugs (RC-004) |
| Navigation / footer | **PASS** | Header/footer use `/blog` for Journal |
| Mobile menu | **NOT MANUALLY TESTED** | Component present (`Header.tsx`) |
| Unpublished content leakage | **PASS** | Repository filters `published: true` AND `workflowStatus: "published"`; 1 draft in DB not in sitemap |
| Inkondo flagship | **PASS** | Default website config sets `flagship.productionSlug: "inkondo"`; OG image uses Inkondo billboard |

**Inkondo flagship presentation preserved** via `createDefaultWebsiteConfiguration()` and layout Open Graph defaults.

---

## 6. Authentication results

| Test | Result | Notes |
|------|--------|-------|
| Valid login | **NOT EXECUTED** (no credential use in automated run) | `loginAction` implements bcrypt verify + audit log |
| Invalid login | **CODE REVIEW PASS** | Generic "Invalid credentials." |
| Empty credentials | **CODE REVIEW PASS** | Validation message |
| Expired session | **NOT EXECUTED** | JWT 7d TTL |
| Tampered cookie | **CODE REVIEW PASS** | `jwtVerify` failure → null session |
| Logout | **CODE REVIEW PASS** | `clearSessionCookie` |
| Rate limiting | **CODE REVIEW PASS** | Per-IP and per-email on login |
| Inactive user | **CODE REVIEW PASS** | `loadUserSession` returns null if `!active` |
| Direct admin navigation | **PASS** | `/admin` → 307 without cookie |
| Direct preview navigation | **PASS** | `/preview` → 307 without cookie |
| Password in logs | **PASS** | Not logged |
| Session token in client JS | **PASS** | HttpOnly cookie `pams_session`; JWT stores `sub` only |
| Secure cookie in production | **PASS** (code) | `secure: true` when `NODE_ENV=production` or `CF_ENV` staging/production |
| Deployed secret fail-closed | **PASS** (code) | `resolveSessionSecret()` throws if weak/missing in deployed envs |
| DB-refreshed permissions | **PASS** (code) | `readSession()` → `loadUserSession()` each request |

---

## 7. RBAC matrix

### Seeded roles (actual)

Only **two** roles exist in `prisma/seed.ts`:

| Permission | superadmin | editor |
|------------|:----------:|:------:|
| productions.read | ✓ | ✓ |
| productions.write | ✓ | ✓ |
| productions.publish | ✓ | ✓ |
| people.read | ✓ | ✓ |
| people.write | ✓ | ✓ |
| media.read | ✓ | ✓ |
| media.write | ✓ | ✓ |
| media.approve | ✓ | ✓ |
| filmography.write | ✓ | ✓ |
| users.manage | ✓ | ✗ |
| reports.read | ✓ | ✓ |
| settings.write | ✓ | ✓ |

**Not implemented:** Administrator, Producer, Archivist, Viewer as distinct roles (requested in QA spec). Operational equivalent: `superadmin` ≈ Administrator; `editor` ≈ Editor without user admin.

### Server-side enforcement (representative)

| Capability | Server enforcement | UI enforcement |
|------------|-------------------|----------------|
| Production create/edit | `productions.write` on wizard actions | Wizard nav visible to all authenticated |
| Production publish | `productions.publish` on `publishWizardAction` + field gate in `updateProductionAction` | Publish button not perm-gated at page level |
| Media upload | `media.write` on upload APIs | DAM UI visible to all authenticated |
| Media approve | `media.approve` on approve action + metadata gate | Dropdown may show without perm check on page |
| Website draft save | `settings.write` | Page visible to all authenticated |
| Website publish | `settings.write` (no separate publish perm) | Same |
| Snapshot restore | `settings.write` + audit log | Page visible to all authenticated |
| User administration | `users.manage` (if implemented in actions) | Settings visible to all authenticated |
| Verification queue | **None** | Page visible to all authenticated |
| Preview | `productions.read` in preview layout | N/A |

**Documented page-level RBAC gap (Sprint 4 M1, still open):** Middleware + session ≠ permission-aware UI. Low-privilege roles are not seeded for testing, but any future restricted role would see admin shells for forbidden areas until page guards are added.

---

## 8. Production Wizard results

| Area | Result | Notes |
|------|--------|-------|
| Create draft | **CODE PASS** | `startWizardAction` → `productions.write` |
| Step saves | **CODE PASS** | Overview, media, credits, awards, SEO, rights actions gated |
| Autosave / debounce | **NOT MANUALLY TESTED** | Form-based server actions (not live-tested this sprint) |
| Resume after refresh | **CODE PASS** | Wizard state in DB (`wizardStep`, `wizardCompletedJson`) |
| Progress calculation | **CODE PASS** | `wizardService.progressPercent()` |
| Required fields for publish | **CODE PASS** | Title, slug, poster/hero, rights checklist keys |
| Publish gate | **CODE PASS** | `publishWizardAction` requires `productions.publish`; validation errors throw |
| Rights / verification warnings | **PARTIAL** | `approvalStatus !== "approved"` is warning only, not blocking |
| Credit delete scope | **PASS** (Sprint 4 fix) | `removeCredit(creditId, productionId)` |
| Concurrent edit | **NOT TESTED** | — |
| Failed-save recovery | **NOT TESTED** | — |

**Note:** 9 published productions exist in local DB; some were likely seeded before full rights validation strictness — content integrity review applies (§5 / §12).

---

## 9. Website Builder results

| Area | Result | Notes |
|------|--------|-------|
| Draft editing / autosave | **BLOCKED LOCALLY** | Migration `20250717_website_builder` not applied; `website_config` table missing in SQLite |
| Default config fallback | **PASS** | `createDefaultWebsiteConfiguration()` used; Inkondo flagship |
| Publish / snapshots | **NOT TESTED** | Tables absent locally |
| Draft vs published isolation | **CODE PASS** | Separate scopes in `websiteConfigService` |
| Preview integration | **PASS** (code) | `revalidatePreviewPaths()` on save |
| `/journal` nav href | **FAIL** | Default config points to non-existent route (RC-008) |

**Dev-mode regression:** OpenNext Cloudflare dev binding surfaces D1 errors for website tables even when SQLite has data — staging D1 migration required.

---

## 10. DAM results

| Area | Result | Notes |
|------|--------|-------|
| Single/multiple upload (local) | **NOT MANUALLY TESTED** | Buffered upload route + local storage provider present |
| MIME allowlist | **PASS** (code) | `assertAllowedUploadMime()` |
| Magic-byte sniffing | **NOT IMPLEMENTED** | Hook returns true after allowlist check (RC-009) |
| Path traversal | **PASS** | Invalid keys → HTTP 400 |
| Vault asset auth | **PASS** (code) | DB lookup + `requireAdminSession("media.read")` for private archive |
| Upload authorize rate limit | **PASS** (code) | In-process limiter |
| Upload size at complete | **PASS** (code) | `head.size <= session.maxBytes` |
| Cross-production role assignment | **PASS** (Sprint 4 fix) | Production scope check in media service |
| R2 direct upload | **NOT TESTABLE UNTIL STAGING** | Presigned flow implemented |
| Stuck upload sessions | **PASS** | 0 pending in local DB |

**Residual risk:** Executable renamed to `.jpg` with allowed MIME could pass allowlist without magic-byte verification.

---

## 11. Publishing and cache results

| Area | Result | Notes |
|------|--------|-------|
| Production publish revalidation | **CODE PASS** | Wizard publish revalidates `/`, `/projects`, slug, tags |
| Website publish revalidation | **CODE PASS** | `revalidatePreviewPaths()` |
| On-demand revalidate API | **PASS** | Missing secret → HTTP **503** (verified) |
| Draft preview freshness | **NOT TESTED** | Website tables missing locally |
| Public cache of admin data | **PASS** (code) | Admin/preview `X-Robots-Tag: noindex` |
| ISR timings | **DOCUMENTED** | Project pages `revalidate = 3600` |

---

## 12. Database integrity results

**Local SQLite (`prisma/pams.db`):**

| Check | Result |
|-------|--------|
| Production count | 10 total (9 published, 1 draft) |
| Duplicate slugs | **None** |
| Media without storage reference | **0** (empty path + null objectKey query) |
| Stuck upload sessions | **0** |
| Pending migrations | **1** — `20250717_website_builder` |
| Website config rows | **0** (table may not exist until migration applied) |
| Foreign keys / constraints | **PASS** (schema + applied migrations) |
| Published without required wizard data | **REVIEW** | Published records exist; rights approval often warning-only at publish time |

**Draft not public:** 1 unpublished production; not listed in build static params or sitemap.

---

## 13. Accessibility findings

**Target:** WCAG 2.2 AA (reasonable effort) — **review completed, full compliance not claimed.**

| Area | Status | Notes |
|------|--------|-------|
| Skip link | **MISSING** | No "skip to content" link |
| Keyboard nav / focus | **PARTIAL** | Focus styles on admin inputs; public site relies on native controls + some `aria-label`s |
| Landmarks | **PARTIAL** | `<nav aria-label="Primary">`; no main skip target |
| Heading order | **NOT AUDITED** | Manual pass recommended |
| Form labels | **PASS** (contact, login) | Explicit `<label>` elements |
| Dialog focus trap | **NOT VERIFIED** | Video modal has close `aria-label` |
| Reduced motion | **PASS** | `@media (prefers-reduced-motion: reduce)` in `globals.css`; Lenis respects preference |
| Alt text | **PARTIAL** | Project imagery uses titles; decorative images use `aria-hidden` |
| Color contrast | **NOT MEASURED** | Dark cinematic palette — verify on staging |
| Touch targets | **NOT MEASURED** | — |
| Screen reader save/upload announcements | **MISSING** | Admin mutations lack live regions |

**Automated a11y tools:** Not run (no axe/lighthouse in local gate).

---

## 14. Responsive findings

**NOT MANUALLY TESTED** at specified breakpoints (320–1440px) in this sprint.

**Code indicators:** Tailwind responsive classes throughout; admin sidebar hidden below `md`. Full device matrix deferred to staging manual QA.

---

## 15. SEO findings

| Check | Result | Notes |
|-------|--------|-------|
| Canonical base URL | **PASS** (config) | `siteConfig.url` defaults to `https://orammedia.com`; overridable via `NEXT_PUBLIC_SITE_URL` for staging |
| Metadata / OG / Twitter | **PASS** | Root layout + per-project metadata |
| JSON-LD Organization | **PASS** | `layout.tsx` |
| robots.txt | **PARTIAL** | Allows `/`; disallows `/api/` only — admin/preview rely on `X-Robots-Tag` headers |
| Sitemap | **PASS** | Includes static pages + published projects + services |
| Admin/preview noindex | **PASS** | `next.config.ts` headers |
| Unknown slug HTTP status | **FAIL** | Returns 200 with 404 content (RC-004) |
| `/journal` broken link | **FAIL** | In Website Builder default nav (RC-008) |
| Privacy / Terms pages | **MISSING** | Not in route tree |

**Staging override:** Set `NEXT_PUBLIC_SITE_URL` to staging hostname before indexing tests to avoid false canonicalization to production.

---

## 16. Contact form findings

| Test | Result |
|------|--------|
| Valid submission (API) | **PASS** — HTTP 200 `{"success":true}` with schema-valid JSON |
| Invalid email / missing fields | **PASS** (code) | Zod validation → 400 |
| Malicious HTML in fields | **PASS** (code) | Stored as strings; no HTML rendering in API response |
| Rate limiting | **PASS** (code) | In-memory per IP |
| Email delivery | **NOT CONFIGURED** | Resend integration commented out; logs metadata only (no email address logged — Sprint 4 fix) |
| Provider failure handling | **PASS** (code) | Generic 500 catch |

**Schema fields:** `fullName`, `email`, `phone`, `companyName`, `projectType`, `budgetRange`, `timeline`, `description` (not `name`/`message`).

---

## 17. Error-handling findings

| Scenario | Result | Notes |
|----------|--------|-------|
| DB unavailable (public) | **PASS** (degraded) | Falls back to mock data with console error |
| Storage unavailable | **NOT TESTED** | — |
| Revalidate without secret | **PASS** | HTTP 503 |
| Unauthorized API | **PASS** | Facebook sync → 401; DAM invalid key → 400 |
| Upload forbidden | **PASS** (code) | 403 without session |
| Production slug not found | **PARTIAL** | User sees 404 UI; **wrong HTTP status** |
| OpenNext dev + empty D1 | **DEGRADED** | Dev server errors on website/partner tables; fallback paths partially recover |

No raw stack traces observed in API JSON responses during smoke tests.

---

## 18. Security regression results (Sprint 4)

| Fix | Result | Method |
|-----|--------|--------|
| Asset route authentication | **PASS** | Code + HTTP 400 on invalid keys |
| Vault permission enforcement | **PASS** (code) | `authorizeAssetRead()` |
| Path traversal blocking | **PASS** | HTTP 400 on `../` keys |
| Upload MIME allowlist | **PASS** (code) | `assertAllowedUploadMime()` |
| Publish permission enforcement | **PASS** (code) | Wizard + update action gates |
| Revalidate secret fail-closed | **PASS** | HTTP 503 without secret |
| Timing-safe secret comparison | **PASS** (code) | `timingSafeEqual` |
| DB-refreshed session permissions | **PASS** (code) | JWT `sub` only |
| Media approval permission | **PASS** (code) | `hasPermission(user, "media.approve")` |
| Wizard credit deletion scope | **PASS** (code) | productionId required |
| Media role assignment scope | **PASS** (code) | Sprint 4 IDOR fix |
| Facebook sync authorization | **PASS** | HTTP 401 unauthenticated; **admin path uses unset `settings.read`** (RC-007) |
| Admin middleware | **PASS** | HTTP 307 to login |
| Preview middleware | **PASS** | HTTP 307 to login |
| Preview permission | **PASS** (code) | `productions.read` in layout |
| Upload size enforcement | **PASS** (code) | Not tested end-to-end on R2 |
| Login rate-limit hook | **PASS** (code) | **NOT TESTABLE durable limits until KV/staging** |
| Upload authorize rate-limit | **PASS** (code) | **NOT TESTABLE durable limits until KV/staging** |

---

## 19. Staging-only test plan

| # | Test | Expected result | Evidence | Severity | Owner |
|---|------|-----------------|----------|----------|-------|
| S1 | `npm run cf:build` on Linux/WSL CI | Exit 0; `.open-next/` bundle created | CI log artifact | **P1** | DevOps |
| S2 | `wrangler deploy --env staging` | Worker live at staging URL | Deployment URL + wrangler output | **P1** | DevOps |
| S3 | D1 migrations apply (remote) | All migrations including `20250717_website_builder` | `wrangler d1 migrations list` | **P1** | DevOps |
| S4 | SQLite → D1 data import | Production/media/users readable | Row counts match archive | **P1** | Archivist/DevOps |
| S5 | R2 bucket + DAM migration | Assets reachable via public URL / asset API | Sample HEAD/GET 200 | **P1** | DevOps |
| S6 | R2 multipart / direct upload | Authorize → PUT → complete creates MediaAsset | Upload session completed | **P1** | QA |
| S7 | KV rate limits (login/contact/upload) | 429 after threshold across isolates | Cloudflare dashboard metrics | **P1** (or risk-accept) | DevOps |
| S8 | Edge HSTS + security headers | HSTS, CSP, X-Frame-Options on staging | curl -I staging URL | **P1** | DevOps |
| S9 | Workers caching behavior | ISR/revalidation matches policy | Publish change → visible within TTL | **P1** | QA |
| S10 | Signed upload expiry | Expired PUT rejected | 403/400 from R2 | **P2** | QA |
| S11 | Private R2 asset access | Vault assets 403 without session | curl without cookie | **P1** | QA |
| S12 | Lighthouse (mobile + desktop) | LCP/CLS/INP measured | Lighthouse JSON (staging URL) | **P1** | QA |
| S13 | Real mobile device smoke | Navigation, contact, video, admin | Screen recording | **P1** | QA |
| S14 | Contact email delivery | Message reaches inbox | Email headers screenshot | **P1** | DevOps |
| S15 | CSP in deployed environment | No console violations on critical paths | Browser console log | **P2** | QA |
| S16 | Worker logs / CPU / bundle size | Within Workers limits | Wrangler observability | **P2** | DevOps |
| S17 | Manual penetration test | No critical findings or signed risk acceptance | Pen test report | **P1** | Security |
| S18 | Staging `NEXT_PUBLIC_SITE_URL` | Canonical/sitemap use staging host | View-source + sitemap.xml | **P1** | QA |
| S19 | HTTP 404 on bad project slug | Status 404 (retest on staging) | curl -I | **P1** | QA/Dev |
| S20 | Website Builder E2E on D1 | Draft save, preview, publish, snapshot restore | QA checklist sign-off | **P1** | QA |

---

## 20. Issue register (P0–P3)

### P0 — blocks any deployment

| ID | Issue | Status |
|----|-------|--------|
| — | None identified in application code that block staging deployment attempts | — |

### P1 — blocks production launch

| ID | Issue | Action |
|----|-------|--------|
| RC-001 | Staging deployment not completed | Execute Sprint 3 staging runbook |
| RC-002 | Cloudflare build not verified on Windows | Run `cf:build` in WSL/Linux CI |
| RC-003 | D1/R2 not verified in production-like environment | Complete S2–S6 |
| RC-004 | Unknown project URLs return HTTP 200 | Fix `notFound()` status propagation; retest |
| RC-005 | No automated test suite | Add minimal smoke tests OR formal QA sign-off waiver |
| RC-011 | Real production-like smoke test incomplete | Execute §19 staging plan |
| RC-012 | Lighthouse not measured on staging | S12 |
| RC-013 | Penetration test not completed or risk-accepted | S17 |
| RC-014 | KV/durable rate limits not implemented | Implement or document risk acceptance |
| RC-015 | Contact email transport not configured | Wire Resend/Email Routing on staging |
| RC-016 | Website Builder untested on real D1 schema | Apply migration + S20 |
| RC-017 | Edge HSTS not verified on deployed Worker | S8 (Next headers exist; edge confirmation needed) |

### P2 — fix soon after launch

| ID | Issue |
|----|-------|
| RC-006 | Page-level admin RBAC gaps |
| RC-007 | Missing `settings.read` permission vs Facebook sync route |
| RC-008 | `/journal` vs `/blog` navigation mismatch |
| RC-009 | Magic-byte validation placeholder |
| RC-010 | In-memory rate limits (contact/login/upload) |
| RC-018 | No privacy/terms pages |
| RC-019 | No skip link; limited SR announcements in admin |
| RC-020 | `settings.publish` not separated from `settings.write` |
| RC-021 | CSRF tokens not implemented (SameSite=Lax only) |
| RC-022 | Google Fonts network dependency can break CI builds |
| RC-023 | Login form pre-filled admin email (info leak) |
| RC-024 | Responsive matrix not executed |

### P3 — optional improvement

| ID | Issue |
|----|-------|
| RC-025 | Expand roles beyond superadmin/editor |
| RC-026 | Virus scanning hook |
| RC-027 | Repository typed DTOs (mass-assignment hardening) |
| RC-028 | robots.txt explicit disallow for `/admin` and `/preview` |
| RC-029 | Middleware migration to Next.js 16 "proxy" convention |

---

## 21. Content integrity (PAMS classification)

**Method:** SQLite published production audit (2026-07-17).

| Slug | archivalCategory | Classification note |
|------|------------------|---------------------|
| inkondo | directed-by-owas | ORAM company credit marked REQUIRES VERIFICATION in `oramRole` text |
| zuba | directed-by-owas | Same — directing verified; ORAM production claim not verified |
| graft | oram-co-production | Co-production billing documented |
| look-in-the-mirror | oram-co-production | Poster association documented; Kinorium conflict noted |
| pa-maliketi | directed-by-owas | Director credit only until verification |
| hang | oram-co-production | Executive producer ORAM entity on poster |
| girls-to-ladies | personal-filmography | **Published publicly** — no ORAM company credit; personal/Owas Films |
| secrets-untold | oram-co-production | Executive producer ORAM on poster |
| the-wife | personal-filmography | **Published publicly** — explicitly not ORAM production in `oramRole` |

**Findings:**

- **PASS:** Uncertain records retain verification language in admin metadata; not silently upgraded to "ORAM Production."
- **REVIEW:** `girls-to-ladies` and `the-wife` are published on the public site — ensure public copy does not overstate ORAM corporate involvement (ProjectDetailView shows `oramRole` when present).
- **PASS:** Inkondo remains flagship in default website configuration.

No new internet research was performed (per sprint scope).

---

## 22. Exact launch checklist

### Local release candidate gates

| Gate | Required | Actual |
|------|----------|--------|
| `npm run lint` | PASS | **PASS** |
| `npm run build` | PASS | **PASS** |
| Automated tests | PASS or documented absence | **DOCUMENTED ABSENCE** |
| Public routes | PASS | **PASS** (with RC-004 caveat) |
| Admin core workflows | PASS | **CONDITIONAL** (Website Builder blocked locally) |
| Authentication | PASS | **PASS** (code + middleware) |
| Server-side RBAC on mutations | PASS | **PASS** |
| Production Wizard | PASS | **PASS** (code; manual E2E partial) |
| Website Builder | PASS | **BLOCKED** until migration on D1 |
| DAM local workflow | PASS | **NOT MANUALLY EXECUTED** |
| Publishing | PASS | **PASS** (code) |
| Accessibility review | Completed | **COMPLETED** (findings documented) |
| Responsive review | Completed | **DEFERRED** (staging devices) |
| SEO review | Completed | **COMPLETED** (RC-004, RC-008) |
| Security regression | Completed | **COMPLETED** |

### Staging production gates (all required for GO)

| Gate | Status |
|------|--------|
| Cloudflare build | **NOT VERIFIED** |
| Workers deployment | **NOT DONE** |
| D1 | **NOT VERIFIED** |
| R2 | **NOT VERIFIED** |
| Cloudflare smoke test | **NOT DONE** |
| Staging Lighthouse | **NOT MEASURED** |
| Staging penetration test | **NOT DONE** |
| No P0 blockers | **PASS** |
| No unaccepted P1 blockers | **FAIL** |

---

## 23. Final verdict

| Verdict | **CONDITIONAL GO** |
|---------|---------------------|
| Meaning | Proceed to **staging deployment and staging-only QA** (§19). Do **not** connect `orammedia.com` or launch production until P1 items are closed or formally risk-accepted. |
| GO criteria | All staging production gates pass + no unaccepted P1 issues |
| HOLD criteria | Would apply if lint/build failed or critical security regressions found — **not triggered** |

---

## 24. Approval gate

**Stop.** Awaiting operator approval before:

1. Staging deployment execution  
2. Production domain connection  
3. Post-launch feature work  

---

*Report generated as part of Sprint 5 Final Release Candidate QA. Prior sprint reports: `RELEASE_QUALITY_REPORT.md`, `PERFORMANCE_SPRINT_REPORT.md`, `CLOUDFLARE_DEPLOYMENT_READINESS_REPORT.md`, `SECURITY_HARDENING_REPORT.md`.*
