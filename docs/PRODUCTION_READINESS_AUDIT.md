# Production Readiness Audit — ORAM Media Dynamics / ORAM OS

**Date:** 2026-07-18  
**Auditor role:** Staging launch audit (read-only)  
**Staging URL:** https://orammedia-staging.nasalifya007.workers.dev  
**Scope:** Public site, contact, CMS/admin (code + HTTP), content, SEO/tech, Cloudflare, security  
**Out of scope (per operator):** Production deploy, connecting `orammedia.com`, broad code changes  

**Production launch decision: HOLD**

Staging is operational (pages, admin gates, Resend contact e2e per operator confirmation). Production cutover is **not** approved until P0 items below are closed and `orammedia.com` is intentionally connected under a separate approval.

---

## 1. Executive summary

Staging Worker is live and serving the marketing site and admin shell. Security headers, auth redirects, unknown-slug 404s, image delivery, and contact rate limiting were verified live. Operator confirms Resend contact delivery works end to end.

The audit still finds **production blockers**: incomplete `wrangler.jsonc` `env.production` bindings; SEO artifacts on staging baked to `https://orammedia.com` (build-time `NEXT_PUBLIC_SITE_URL`); public copy containing `NEEDS VERIFICATION`; missing `/privacy` linked from the cookie banner; Journal exposing a Facebook token setup hint; and unfinished production-ops items from Sprint 8 (homepage ISR proof, page-level RBAC for non-superadmin, production secrets matrix).

| Area | Result |
|------|--------|
| Public pages & navigation | **PASS WITH FINDINGS** |
| Contact form | **PASS WITH FINDINGS** (rate limit live; valid e2e per operator; validation blocked this session by 429) |
| CMS / admin | **CONDITIONAL PASS** (guards OK; page-level RBAC gap; interactive CRUD not re-run this audit) |
| Data & content | **FAIL** |
| Technical / SEO | **FAIL** (URL bake-in + robots) |
| Cloudflare staging config | **PASS** |
| Cloudflare production config | **FAIL** (incomplete) |
| Security | **PASS WITH FINDINGS** |

---

## 2. Checks performed

### Live HTTP (staging Worker)

| Check | Method |
|-------|--------|
| Route matrix (home, projects, about, contact, careers, blog, services, privacy/terms, admin, robots, sitemap, 404s, journal redirect, project slugs) | `GET` status / timing |
| Security headers on `/` | Response headers |
| Meta robots, OG, JSON-LD, favicon, viewport | HTML inspection |
| Project content flags (`NEEDS VERIFICATION`, Facebook token string) | HTML body |
| Image optimizer + static assets | `GET` `/_next/image` and `/projects/*.jpg` |
| YouTube embed presence (Inkondo) | HTML |
| Contact API valid / invalid / missing | `POST /api/contact` (hit **429** this session) |
| Unauthenticated DAM authorize | `POST /api/dam/upload/authorize` → **403** |
| Admin / preview unauthenticated | **307** → `/admin/login` |

### Code / config review

| Area | Primary files |
|------|----------------|
| Contact transport & Reply-To | `src/lib/email/contact-transport.ts`, `src/app/api/contact/route.ts` |
| Auth / session / middleware | `src/middleware.ts`, `src/pams/auth/session.ts`, `src/pams/auth/actions.ts` |
| RBAC / publish gates | `src/app/admin/actions.ts`, website/media actions, mappers |
| Robots / sitemap / metadata | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx` |
| Headers / CSP | `next.config.ts`, `public/_headers` |
| Wrangler bindings | `wrangler.jsonc` |
| Nav / legal | `Header.tsx`, `Footer.tsx`, `CookieConsent.tsx` |

### Not fully re-executed this session

| Check | Reason |
|-------|--------|
| Authenticated admin CRUD / Website Builder / snapshots | No interactive admin session in this audit |
| Browser console / Lighthouse / real device responsive QA | No Chrome DevTools MCP in environment |
| Secret **values** | Intentionally not inspected; staging Resend e2e accepted as operator-confirmed |
| Production Worker | Must not deploy |

Prior Sprint 8 authenticated evidence (DAM proxy upload, Website Builder draft/snapshot/preview, admin login) is cited where still relevant and not contradicted.

---

## 3. Area results

### 3.1 Public pages

| Route | Status | Notes |
|-------|--------|-------|
| `/` | **200** (~29s cold) | Homepage title currently “Inkondo…” (Website Builder published state) |
| `/projects` | **200** | Listing OK |
| `/projects/inkondo`, `/zuba`, `/graft` | **200** | Detail OK; YouTube embed present on Inkondo |
| `/about` | **200** | Studio page |
| `/contact` | **200** | Form present |
| `/careers` | **200** | In sitemap; **not** in header/footer |
| `/blog` | **200** | Journal |
| `/services` | **200** | OK |
| `/privacy`, `/terms` | **404** | Cookie banner links `/privacy` |
| `/journal` | **308** → `/blog` | Redirect OK |
| `/projects/this-slug-should-404-xyz` | **404** | OK |
| `/this-page-should-404-xyz` | **404** | OK |
| Unknown people/filmography public routes | **N/A** | Admin-only (`/admin/people`, `/admin/filmography`) |

**Navigation (header):** Work, Studio, Services, Journal, Contact — all resolve **200**.  
**Footer:** Explore + Connect + social — contact/email/tel present; **no** privacy/terms.  
**Careers:** orphan from primary nav (P2).

**Result: PASS WITH FINDINGS**

---

### 3.2 Contact form

| Check | Result | Evidence |
|-------|--------|----------|
| Endpoint reachable | **PASS** | `POST` (not `GET` 405) |
| Valid submission / Resend e2e | **PASS** (operator) | Confirmed working before this audit |
| Rate limiting | **PASS** | Live `429` `{"error":"Too many requests. Please try again later."}` + `Retry-After` |
| Invalid email / missing fields | **PASS (code)** / **BLOCKED (live)** | Zod schema + client RHF; live retest returned 429 after prior probes |
| Success UX | **PASS (code)** | “Thank you” / 24h message — `ContactForm.tsx` |
| Error UX | **PASS (code)** | Surfaces API `error` string only |
| Reply-To | **PASS (code)** | `reply_to: data.email` in Resend payload — `contact-transport.ts` |
| Secrets / stack in responses | **PASS** | 429 bodies leak-checked; no `re_`, Bearer, or stack traces |
| Mode on staging config | **PASS** | `CONTACT_EMAIL_MODE: "auto"`, `CF_ENV: "staging"` in `wrangler.jsonc` |

**Result: PASS WITH FINDINGS** (live validation matrix incomplete this session due to rate limit)

---

### 3.3 CMS and admin

| Check | Result | Route / file |
|-------|--------|----------------|
| Unauth `/admin` | **PASS** | **307** → `/admin/login?next=%2Fadmin` |
| Unauth `/preview` | **PASS** | **307** → login |
| Login page | **PASS** | **200**; `X-Robots-Tag: noindex, nofollow` |
| Unauth DAM authorize | **PASS** | **403** `{"error":"Forbidden"}` |
| Session cookie flags | **PASS (code)** | `httpOnly`, `sameSite=lax`, `secure` when deployed — `session.ts` |
| Logout | **PASS (code)** | Clears cookie — `auth/actions.ts` |
| Session TTL | **PASS (code)** | JWT `7d` / cookie `maxAge` 7d |
| Mutation RBAC | **PASS (code)** | Productions/media/website actions check permissions |
| Page-level RBAC | **FAIL** | Authenticated viewers can open admin pages; mutations blocked only |
| Publish vs draft (productions) | **PASS (code)** | Public requires `published` + `workflowStatus === "published"` |
| Website draft vs published | **PASS (code)** | Public scope published; preview auth-gated |
| Website Builder / snapshots / trailers / people CRUD | **NOT RE-RUN** | Sprint 8 exercised; treat as conditional |
| Homepage publish → immediate public HTML | **OPEN (Sprint 8)** | ISR/`revalidate=3600` cache lag |
| Login email prefill | **FINDING** | `admin@orammedia.com` default — `admin/login/page.tsx` |

**Result: CONDITIONAL PASS**

---

### 3.4 Data and content

| Check | Result | Detail |
|-------|--------|--------|
| `NEEDS VERIFICATION` on public pages | **FAIL** | Live on `/projects/zuba`, `/projects/look-in-the-mirror`; also in homepage HTML; source mock/seed synopsis |
| Facebook token hint on Journal | **FAIL** | Live `/blog` contains `FACEBOOK_PAGE_ACCESS_TOKEN` setup string — `blog/page.tsx` |
| Missing privacy/terms | **FAIL** | `/privacy` **404**; linked from `CookieConsent.tsx` |
| Broken images (sampled) | **PASS** | `/_next/image?url=/projects/inkondo-billboard.jpg&w=640&q=75` → **200**; static JPG **200** |
| Video embeds | **PASS** | Inkondo YouTube `SDtK15xguG8` embedded |
| Draft projects public | **PASS (code)** | Unpublished filtered from public list/detail |
| Public people/filmography | **N/A** | No public routes |
| Placeholder / internal copy | **FAIL** | Verification strings + token hint |
| Alt text | **PASS WITH FINDINGS** | Generally present; gallery alts generic (P2) |
| Inconsistent dates/names | **OPEN** | Premiere date conflicts called out inside `NEEDS VERIFICATION` copy |

**Result: FAIL**

---

### 3.5 Technical checks

| Check | Result | Detail |
|-------|--------|--------|
| Browser console | **NOT RUN** | No DevTools MCP |
| Failed network (sampled) | **PASS** | Public assets/images OK |
| 404 handling | **PASS** | Unknown pages/slugs **404** |
| 500 handling | **NOT STRESS-TESTED** | No intentional 500 induced |
| Mobile / tablet | **LIMITED** | `viewport=width=device-width, initial-scale=1` present; no device lab |
| Image optimization | **PASS** | Next image optimizer returns JPEG **200** |
| Cold homepage load | **FAIL (perf)** | ~28.8s first `GET /` from this network |
| Warm interior pages | **PASS** | Typically 0.7–5s |
| `robots.txt` | **FAIL** | `Allow: /`; Sitemap → **https://orammedia.com/sitemap.xml**; no `/admin` disallow |
| `sitemap.xml` | **FAIL (staging)** | All `<loc>` use **https://orammedia.com/...** (build-time URL) |
| Metadata robots (HTML) | **PASS (staging)** | `noindex, nofollow` when `CF_ENV=staging` |
| Canonical / OG | **FAIL (staging accuracy)** | Project canonical/OG host = `orammedia.com` while site served from workers.dev |
| Structured data | **PASS** | Organization JSON-LD present |
| Favicon / icons | **PASS** | `/favicon.ico` **200**; metadata icons configured |

**Root cause of URL bake-in:** `siteConfig.url` uses `process.env.NEXT_PUBLIC_SITE_URL ?? "https://orammedia.com"` (`oram-media-curated.ts`). Next inlines `NEXT_PUBLIC_*` at **build** time. Staging `wrangler.jsonc` runtime var does not rewrite the already-built bundle. Live proof: robots/sitemap/OG point at production domain.

**Result: FAIL**

---

### 3.6 Cloudflare configuration

#### Staging (`env.staging`) — PASS

| Item | Status |
|------|--------|
| Worker name | `orammedia-staging` |
| D1 | `DB` → `orammedia-staging` (`954a7084-…`) |
| R2 | `DAM_BUCKET` → `orammedia-dam-staging` |
| KV | `RATE_LIMIT_KV` → `02a389de…` |
| Vars | `CF_ENV=staging`, `CONTACT_EMAIL_MODE=auto`, `DATABASE_PROVIDER=d1`, `STORAGE_PROVIDER=r2`, `NEXT_PUBLIC_SITE_URL` (runtime; see bake-in note) |
| Compatibility | `nodejs_compat`, `global_fetch_strictly_public`; date `2025-01-15` |
| WASM rule | `CompiledWasm` for `**/*.wasm` |
| Assets | `.open-next/assets` |
| Service binding | `WORKER_SELF_REFERENCE` → `orammedia-staging` |
| Custom routes / `orammedia.com` | **None** (correct for now) |
| Cache | Homepage `Cache-Control: s-maxage=3600, stale-while-revalidate=…`; static `/_next/static/*` immutable via `public/_headers` |
| Rate limiting | KV-backed contact/login/upload (code + live 429) |

#### Production (`env.production`) — FAIL

| Item | Status |
|------|--------|
| Worker name | `orammedia-production` declared |
| D1 / R2 / KV / assets / services | **Missing** from `wrangler.jsonc` |
| `NEXT_PUBLIC_SITE_URL` / contact mode | **Not set** in production block |
| Secrets | Must be set out-of-band before any prod deploy (session, Resend, etc.) — **not verified** |

**Secret names expected (existence only; values never printed):**

- Staging (operator-confirmed for Resend path): `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, plus `PAMS_SESSION_SECRET` (required for admin)
- Production: same set + any R2 S3 keys if direct upload required

**Result: staging PASS / production FAIL**

---

### 3.7 Security

| Control | Result | Evidence |
|---------|--------|----------|
| Auth guards | **PASS** | Middleware + page `readSession` |
| Authorization on mutations | **PASS** | Permission checks on actions |
| Page-level authorization | **FAIL** | Disclosure risk for any logged-in role |
| Secure cookies | **PASS** | `secure` on staging/production via `CF_ENV`/`NODE_ENV` |
| CSP | **PASS WITH FINDINGS** | Present; allows `'unsafe-inline'` `'unsafe-eval'` `https:` scripts |
| HSTS | **PASS** | `max-age=31536000; includeSubDomains; preload` (ready; domain not connected) |
| `X-Content-Type-Options` | **PASS** | `nosniff` |
| `Referrer-Policy` | **PASS** | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | **PASS** | camera self; mic/geo none |
| `X-Frame-Options` | **PASS** | `DENY` |
| Input validation (contact) | **PASS** | Zod schema |
| File upload restrictions | **PASS (code)** | MIME allowlist, size cap, magic bytes, auth |
| Admin indexing | **PASS WITH FINDINGS** | `X-Robots-Tag` on `/admin/*`; `robots.txt` does not disallow `/admin` |
| Unauth DAM | **PASS** | **403** |

**Result: PASS WITH FINDINGS**

---

## 4. Findings register

| ID | Severity | Area | Finding | File / route | Recommended fix |
|----|----------|------|---------|--------------|-----------------|
| P0-01 | **P0** | Cloudflare prod | `env.production` lacks D1, R2, KV, assets, services, public URL | `wrangler.jsonc` L92–99 | Mirror staging bindings for production resources before any prod deploy |
| P0-02 | **P0** | Content | Public synopsis contains `NEEDS VERIFICATION` | `/projects/zuba`, `/projects/look-in-the-mirror`, mock/seed | Remove or rewrite unverified claims before launch |
| P0-03 | **P0** | SEO / build | Staging build baked `siteConfig.url` = `https://orammedia.com` | `oram-media-curated.ts` L99; live robots/sitemap/OG | Rebuild with correct `NEXT_PUBLIC_SITE_URL` per environment; never rely on runtime-only wrangler var for `NEXT_PUBLIC_*` |
| P1-01 | **P1** | Legal | Cookie banner → `/privacy` **404**; no terms page | `CookieConsent.tsx`; missing `app/privacy` | Add privacy (and terms if required) before launch |
| P1-02 | **P1** | Content | Journal shows `FACEBOOK_PAGE_ACCESS_TOKEN` hint | `blog/page.tsx`; `/blog` | Remove public env/setup copy |
| P1-03 | **P1** | SEO | `robots.txt` allows `/` and omits `/admin`, `/preview` | `robots.ts` | Staging: disallow all; prod: disallow admin/preview/api |
| P1-04 | **P1** | Admin RBAC | Page-level permission checks missing | Most `admin/*/page.tsx` | `requireAdminSession(perm)` per page; hide nav by role |
| P1-05 | **P1** | CMS | Homepage publish → public HTML not proven immediate | Website Builder + OpenNext cache | Document purge/revalidate procedure or shorten ISR for homepage |
| P1-06 | **P1** | Cloudflare prod | Production KV/R2/secrets not provisioned | `wrangler.jsonc` + secrets | Provision before cutover |
| P1-07 | **P1** | Perf | Homepage cold ~29s | `/` | Profile Worker cold start / TTFB; optimize bundle |
| P1-08 | **P1** | Website publish privilege | Draft save and publish share `settings.write` | `website/actions.ts` | Separate `settings.publish` if multi-role editors |
| P2-01 | **P2** | SEO | CSP allows `unsafe-eval` / broad `https:` script-src | `next.config.ts` | Tighten when Next allows |
| P2-02 | **P2** | Auth UX | Login email prefilled | `admin/login/page.tsx` | Remove default email |
| P2-03 | **P2** | Nav | `/careers` not in header/footer | Header/Footer | Add or drop from sitemap |
| P2-04 | **P2** | Content | Generic gallery alts; careers email mismatch | Project detail / careers | Editorial polish |
| P2-05 | **P2** | Media | Pending-approval media may surface if active | `mappers/production.ts` | Require `approvalStatus === "approved"` for public |
| P2-06 | **P2** | Security | No CSRF Origin check on server actions | SECURITY backlog | Add Origin/Referer checks |
| P2-07 | **P2** | Auth | Logout does not revoke JWT server-side | `session.ts` | Accept or add denylist/version |
| P2-08 | **P2** | DAM | Optional S3 direct-upload creds; proxy path only | Sprint 8 | Provision if large uploads needed |

---

## 5. Severity summary

| Severity | Count | Launch impact |
|----------|-------|---------------|
| **P0** | 3 | Must fix before production |
| **P1** | 8 | Should fix before launch |
| **P2** | 8 | May fix after launch |

---

## 6. Production launch decision

### **HOLD**

**Do not deploy production. Do not connect `orammedia.com`.**

#### Why HOLD (not READY / READY WITH CONDITIONS)

1. **P0-01** — Production Wrangler env is incomplete; a prod deploy would not match staging infrastructure.  
2. **P0-02** — Unverified editorial language is live on public project pages.  
3. **P0-03** — Canonical/OG/sitemap currently encode `orammedia.com` from build-time public URL; cutover process must prove correct host before DNS attaches.  
4. Remaining **P1** legal (`/privacy`), Journal token hint, robots policy, page-level RBAC, and homepage cache proof.

#### What is already in good shape for staging

- Public primary nav routes resolve  
- Auth redirects and DAM unauth denial  
- Security header baseline (HSTS, nosniff, frame deny, referrer, permissions)  
- Contact rate limit + operator-confirmed Resend delivery  
- Draft/public split for productions (code)  
- Staging D1 / R2 / KV bindings present  

#### Minimum path to re-audit for READY WITH CONDITIONS

1. Strip or rewrite all public `NEEDS VERIFICATION` / internal ops strings.  
2. Ship `/privacy` (and footer link).  
3. Fix robots for staging vs production; rebuild with env-correct `NEXT_PUBLIC_SITE_URL`.  
4. Complete `env.production` bindings + secrets checklist (no values in git).  
5. Close or formally accept homepage ISR lag and page-level RBAC for launch roles.  
6. Re-run contact validation matrix after rate-limit window; optional authenticated CMS smoke.

---

## 7. Operator reminders

- Production deploy and `orammedia.com` attachment remain **explicitly out of scope** until a later approval.  
- If a temporary `CLOUDFLARE_API_TOKEN` was used in WSL for earlier deploys, **close that terminal** so the token leaves memory.  
- Do not print or commit secret values.

---

*End of production readiness audit — 2026-07-18.*
