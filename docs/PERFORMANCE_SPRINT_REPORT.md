# ORAM OS — Performance Sprint Report (Sprint 2)

**Sprint:** PERFORMANCE AND CLOUDFLARE EFFICIENCY  
**Date:** 2026-07-17  
**Lead:** Performance Engineering  
**Prerequisite:** Release Quality P0 — PASS  

---

## 13. Verdict

### **PASS** (automated gates + implemented optimizations)

| Gate | Result |
|------|--------|
| `npm run lint` | **PASS** — 0 warnings, 0 errors |
| `npm run build` | **PASS** — 40 routes compiled |
| No feature/copy/design changes | **PASS** |
| Regressions in code paths | **Not detected** (automated); manual browser QA pending |

**Browser Core Web Vitals (LCP, INP, CLS, FCP, TBT):** **NOT MEASURED** — Lighthouse / DevTools MCP not executed in this sprint. Do not treat any CWV targets as verified until staging measurement.

---

## 1. Baseline Measurements

### Build output (before optimizations)

Captured from production build prior to Sprint 2 code changes.

**Route types**

| Type | Count | Examples |
|------|-------|----------|
| Static (○) | 10 | `/`, `/about`, `/blog`, `/contact`, `/robots.txt`, `/sitemap.xml` |
| SSG (●) | 12 | `/projects/[slug]` (9 slugs), `/services/[slug]` (3 slugs) |
| Dynamic (ƒ) | 18 | All `/admin/*`, `/preview/*`, `/api/*`, `/projects` index |

**ISR:** Public homepage and most marketing pages use `revalidate = 3600` (1h).

**Largest JS chunks (`.next/static/chunks`, before)**

| Chunk | Size |
|-------|------|
| Framework/shared (hashed) | 1,025.9 KB |
| Secondary shared | 313.6 KB |
| Route/shared | 222.0 KB |
| Route chunk | 159.4 KB |
| CSS | 78.3 KB |

**Total `.next` output:** ~3,452 MB (includes cache, dev artifacts, and all build artifacts on disk).

### Browser metrics

| Metric | `/` | `/projects` | `/projects/inkondo` | Admin |
|--------|-----|-------------|---------------------|-------|
| LCP | NOT MEASURED | NOT MEASURED | NOT MEASURED | NOT MEASURED |
| INP | NOT MEASURED | NOT MEASURED | NOT MEASURED | NOT MEASURED |
| CLS | NOT MEASURED | NOT MEASURED | NOT MEASURED | NOT MEASURED |
| FCP | NOT MEASURED | NOT MEASURED | NOT MEASURED | NOT MEASURED |
| TBT | NOT MEASURED | NOT MEASURED | NOT MEASURED | NOT MEASURED |
| Transferred bytes | NOT MEASURED | NOT MEASURED | NOT MEASURED | NOT MEASURED |
| Request count | NOT MEASURED | NOT MEASURED | NOT MEASURED | NOT MEASURED |

---

## 2. Bottlenecks Found

### Public site

1. **Homepage LCP tied to Mux player when `muxPlaybackId` present** — Hero rendered Mux instead of optimized `next/image` poster, delaying first paint and pulling `@mux/mux-player-react` into critical path.
2. **Lenis + GSAP statically imported in `SmoothScroll`** — Smooth-scroll libraries in initial public JS graph for every non-admin page.
3. **Facebook API fetched on every homepage load** — `buildShowreelConfig()` always called `getOramFacebookData()` even when flagship media was fully resolved from PAMS.
4. **Duplicate `getWebsiteConfiguration()` within a single request** — Metadata + loader both read website config without deduplication.
5. **Published projects list re-queried on every `getProjects()` call** — No cross-request cache despite 1h ISR on pages.
6. **Scroll progress bar active under reduced motion** — Unnecessary Framer scroll spring when user prefers reduced motion.

### Admin / ORAM OS

7. **Website Builder autosave on every edit** — Full `JSON.stringify(config)` POST per toggle/keystroke → server churn, HMR pressure, dev OOM risk.
8. **Mission Control wizard progress** — Sequential N+1 `findById` loop for dashboard stats.
9. **Incomplete cache invalidation on publish** — Website publish did not revalidate `/projects`, `/about`, `/services`, `/contact` or production list tag.

### Architecture (deferred, not fixed this sprint)

10. **`SiteChrome` is a client boundary** wrapping all public routes (Header, Lenis, PageTransition, CookieConsent) — justified for pathname + scroll, but keeps ~50 client components in public graph.
11. **50 `"use client"` modules** — Most require motion, forms, uploads, or admin interactivity; no unsafe mass conversion attempted.
12. **Cloudflare incompatibility** — SQLite, Sharp, local filesystem, large uploads remain Node-only (see §10).

---

## 3. Changes Implemented

| Area | Change | File(s) |
|------|--------|---------|
| **Homepage LCP** | Poster-first hero: `next/image` always `priority`; Mux deferred via `requestIdleCallback` / 1.5s fallback; dynamic import of Mux player | `HeroShowreel.tsx` |
| **Video bundle** | Mux removed from hero critical import path | `HeroShowreel.tsx` |
| **Smooth scroll** | Lenis + GSAP + ScrollTrigger loaded asynchronously after mount | `SmoothScroll.tsx` |
| **Server data** | Skip Facebook fetch when flagship poster/video/Mux already resolved | `homepage-loader.ts` |
| **Request dedup** | `React.cache()` on `getWebsiteConfiguration()` | `website.ts` |
| **Production list cache** | `unstable_cache` for published projects (1h, `productions` tag) | `production-cache.ts`, `index.ts` |
| **Cache invalidation** | `revalidateTag('productions')` + path revalidation on publish/media/website | `wizard.service.ts`, `website/actions.ts`, `media/actions.ts` |
| **Reduced motion** | `ScrollProgress` returns null when reduced motion preferred | `ScrollProgress.tsx` |
| **Fonts** | Inter limited to weights 400, 500, 600 (Fraunces variable unchanged) | `layout.tsx` |
| **Reveal** | Scroll fallback listeners skip when already visible | `Reveal.tsx` |
| **Website Builder** | 700ms debounced draft autosave; cleanup on unmount | `WebsiteBuilder.tsx` |
| **Dashboard** | Parallel `Promise.all` for wizard progress queries | `wizard.service.ts` |

**Not changed (by design):** Copy, layout design, Inkondo official media, motion language, Framer/GSAP/Lenis presence, admin feature set.

---

## 4. Before-and-After Measurements

### Build

| Check | Before | After |
|-------|--------|-------|
| `npm run lint` | 0 warnings | 0 warnings |
| `npm run build` | PASS | PASS |
| Routes compiled | 40 | 40 |
| Turbopack NFT warning | Resolved (P0) | Still clean |

### JS chunks (largest non-framework route-related chunk)

| | Before | After | Delta |
|---|--------|-------|-------|
| Notable route chunk | 159.4 KB | 132.7 KB | **−26.7 KB (~17%)** |
| Framework chunk | 1,025.9 KB | 1,025.9 KB | unchanged (expected) |

*Chunk hashes differ between builds; sizes are comparable artifacts from consecutive production builds.*

### Browser CWV

**NOT MEASURED** — Re-run Lighthouse or DevTools on staging after deploy to populate this section.

---

## 5. Bundle Analysis

### Client component count

**50** files with `"use client"`.

### Public bundle contributors (high level)

| Library | Public exposure | Mitigation applied |
|---------|-----------------|-------------------|
| Framer Motion | Header, hero, reveals, page transition | Kept; reduced scroll work under reduced motion |
| Lenis + GSAP | All public pages via `SiteChrome` | **Dynamic import after mount** |
| `@mux/mux-player-react` | Homepage (when Mux configured) | **Dynamic import + idle deferral** |
| React Hook Form + Zod | `/contact` only | Already route-scoped |
| Prisma / Sharp | Server-only (`server-only`, API routes) | Not in client bundles |

### Admin-only isolation

Admin routes (`/admin/*`) use separate layout; wizard, DAM, Website Builder client components are not imported by public pages. `WebsitePreviewPanel` is admin-only.

### Evidence: no Prisma in client graph

- `src/pams/db.ts` has `import "server-only"`
- Upload API and services are server routes / server actions

---

## 6. Image and Video Findings

### Homepage hero (LCP candidate)

- **LCP element:** Official Inkondo poster (`resolvedFlagship.heroPosterPath` or `/projects/inkondo-billboard.jpg`)
- **Fix:** Image always rendered with `priority`, `quality={92}`, `sizes="100vw"`
- **Video:** Mux overlays after idle; no duplicate Mux poster request
- **Gradients:** CSS overlays only; do not block image download

### Project pages

- Hero uses `priority` on above-the-fold poster/banner (`ProjectDetailView`)
- Gallery images lazy-load by default (no `priority`)
- `sizes="100vw"` on full-width gallery — appropriate for cinema-tall layout

### DAM variants

- Public site uses mapped `thumbnail` / path from PAMS; WebP/AVIF generated at upload
- **Recommendation (non-blocker):** Wire `variantsJson.webp` / `avif` in public mappers for card/gallery contexts in a future sprint

### Video

- **Trailers:** Click-to-open modal (`TrailerButton` → `ProjectVideoModal`); no eager iframe load ✓
- **YouTube/Mux:** Loaded only when modal opens or hero video mounts after idle
- **Showreel fallback:** YouTube URL in config when no Mux; video does not block poster LCP after fix

---

## 7. Database Findings

| Pattern | Severity | Action |
|---------|----------|--------|
| `getWebsiteConfiguration` duplicate reads per request | Medium | **Fixed** — `React.cache()` |
| `getProjects()` full published query every call | Medium | **Fixed** — `unstable_cache` + tag |
| `buildShowreelConfig` Facebook fetch when flagship complete | Medium | **Fixed** — early return |
| Wizard `missionControl` N+1 | Low | **Improved** — parallel fetch (still N queries; acceptable at current scale) |
| `loadHomepageData` — 7 parallel reads | OK | Already `Promise.all` |
| `websiteConfigService.getRaw` → `resolveFlagshipMedia` | OK | Required for hero paths |

**Indexes:** No new indexes added — existing Prisma indexes on `published`, `featured`, `workflowStatus` sufficient at current SQLite scale.

---

## 8. Caching Strategy

| Resource | Strategy | Invalidation |
|----------|----------|--------------|
| Published homepage `/` | ISR 1h + static generation | `revalidatePath('/')`, website publish, wizard publish |
| Public projects index/detail | ISR 1h + `unstable_cache` tag `productions` | `revalidateTag('productions')`, publish actions |
| About, Services, Contact | ISR 1h | Website publish paths |
| Draft preview `/preview/*` | `force-dynamic`, no shared cache with published | Scope param `draft` vs `published` |
| Admin `/admin/*` | Dynamic (`ƒ`), session-gated | Never publicly cached |
| Website config (published) | DB + per-request `cache()` | Publish / restore snapshot |
| Uploaded assets `/assets/dam/*` | Static files + CDN-ready headers | Media update → `revalidateTag('productions')` |
| JSON-LD | Inline in SSR/SSG HTML | Follows page revalidation |

**Rule:** Draft preview never reads published cache tags; preview routes remain dynamic.

---

## 9. Website Builder Memory Investigation

### Symptoms

Dev server OOM (~7.4 GB heap) after long Website Builder sessions with frequent edits.

### Root causes (evidence-based)

| Cause | Type | Evidence |
|-------|------|----------|
| **Immediate full-config autosave** | Dev + server load | Every UI change called `saveWebsiteDraftAction(JSON.stringify(entireConfig))` |
| **Inline dual preview tree** | Dev memory | `WebsitePreviewPanel` renders full `DynamicHomepage` + `SmoothScroll` + Header/Footer; split view doubles tree |
| **HMR + Turbopack retention** | Dev-only | Next.js dev rebuilds on large client state |
| **Large JSON cloning** | Dev pressure | Full website config serialized repeatedly |

### Not a production memory leak

Production admin is dynamic SSR; no HMR. Debounced autosave reduces server and client churn in dev and prod.

### Fix applied

- **700ms debounced autosave** with pending config ref and unmount cleanup

### Remaining recommendations (non-blocker)

- Consider iframe-isolated preview for split view only (trade-off: preview fidelity)
- Paginate DAM grid beyond 300 assets
- Add `React.memo` on preview panel when config reference unchanged

---

## 10. Cloudflare Risks — Deferred to Deployment Sprint

Do **not** deploy to Workers/Pages without addressing:

| Item | Risk |
|------|------|
| **SQLite + better-sqlite3** | Node native binding; not Workers-compatible |
| **Prisma adapter** | Requires Node runtime |
| **Sharp image processing** | Native module; use Cloudflare Images or external worker |
| **Local filesystem** (`public/assets/dam/`) | Workers have read-only bundle FS; need R2 |
| **DAM upload API** | Large bodies (512 MB limit on Workers); use direct-to-R2 uploads |
| **Long-running uploads/processing** | CPU time limits on free plan |
| **`path.join(process.cwd())` in db.ts** | Node path API (mitigated with turbopackIgnore for build) |
| **Session/JWT auth** | Compatible, but secret storage via Workers secrets |
| **ISR / `unstable_cache`** | Different model on Pages; map to CDN cache rules |

---

## 11. Manual QA Checklist

Run on staging after deploy:

- [ ] Homepage hero shows official Inkondo poster immediately; video fades in after load (if Mux configured)
- [ ] `/projects` and `/projects/inkondo` render correctly
- [ ] Website Builder draft preview matches production renderer
- [ ] Website Builder autosave still persists (wait ~1s after edit)
- [ ] Production Wizard autosave on overview step
- [ ] DAM upload + assign to production
- [ ] Publish production → homepage/project updates within revalidation window
- [ ] Publish website → featured/homepage updates
- [ ] `prefers-reduced-motion`: no scroll progress bar; hero video deferred/skipped
- [ ] No new console errors or hydration warnings
- [ ] Trailer modal: video loads only on click

---

## 12. Remaining Non-Blockers

1. **CWV measurement** — Run Lighthouse mobile on staging; target LCP on hero poster
2. **DAM variant selection in public mappers** — Prefer WebP/AVIF from `variantsJson` for cards
3. **SiteChrome client boundary** — Could split static Footer to server with composition pattern (larger refactor)
4. **DAM grid virtualization** — Justified when asset count > 500
5. **Mission Control** — Single aggregated SQL for wizard progress vs N parallel `findById`
6. **FeaturedWorkRotator** — Below-fold; already lazy; could defer client mount
7. **Facebook sync** — Still available as showreel fallback when flagship incomplete

---

## Client Component Audit Summary (Phase 2)

| Category | Count | Action |
|----------|-------|--------|
| Motion (Reveal, SplitHeading, Parallax, etc.) | 12 | Keep — required for approved motion language |
| Admin (wizard, DAM, builder) | 18 | Keep — admin-only routes |
| Layout (Header, SiteChrome, CookieConsent) | 5 | Keep — need pathname, scroll, consent |
| Projects (modal, filter, grid) | 8 | Keep — interactivity |
| Homepage sections | 7 | Partially client due to Reveal; `DynamicHomepage` shell is **server** |

**Conclusion:** No safe mass conversion without breaking motion or admin UX. Largest win was deferring Lenis/GSAP/Mux out of critical path.

---

## Dependency Audit Summary (Phase 3)

| Dependency | Public | Admin | Notes |
|------------|--------|-------|-------|
| framer-motion | Yes | Yes | Core motion |
| gsap + lenis | Yes (deferred) | No | Now dynamic import |
| @mux/mux-player-react | Yes (deferred) | Trailers admin | Dynamic |
| sharp | No | API | Server-only |
| prisma | No | Server | `server-only` |
| react-hook-form + zod | Contact | — | Route-scoped |
| lucide-react | Tree-shaken icons | — | OK |

---

*End of report. Awaiting approval before Sprint 3.*
