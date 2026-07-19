# Security Hardening Report

**Project:** ORAM Media Dynamics / ORAM OS  
**Sprint:** 4 — Security and Production Hardening  
**Date:** 2026-07-17  
**Scope:** Full codebase audit + targeted hardening (no UI redesign, no new features, no deployment changes)

---

## Executive summary

Sprint 4 performed a comprehensive security audit of authentication, server actions, API routes, uploads, preview/admin surfaces, publishing workflows, storage, and headers. **Critical and high-severity vulnerabilities were remediated in code** without removing functionality or changing public design/content.

**Verdict: CONDITIONAL GO**

The application is materially safer for production than at Sprint 3 close. Remaining items are documented below and require operational follow-up (KV-backed rate limits, full magic-byte library, virus scanning, external penetration test, HSTS at edge in production).

**Quality gates:**

| Gate | Result |
|------|--------|
| `npm run lint` | **PASS** — 0 errors, 0 warnings |
| `npm run build` | **PASS** |
| UI/design changes | **None** |
| Feature removal | **None** |
| Cloudflare deployment config | **Unchanged** |

---

## Critical findings (remediated)

### C1 — Unauthenticated arbitrary file read via `/api/dam/asset`

| Field | Detail |
|-------|--------|
| **Problem** | `GET /api/dam/asset?key=` served any storage object without auth; local keys allowed path traversal (`..`). |
| **Risk** | Exposure of vault assets, env files, bucket enumeration. |
| **Severity** | Critical |
| **Fix** | Asset lookup in D1; vault/do-not-use requires `media.read`; invalid keys rejected; local path resolved via `resolveLocalPublicPath()`; safe Content-Type / attachment for non-media. |
| **Files** | `src/app/api/dam/asset/route.ts`, `src/pams/security/storage-keys.ts`, `src/platform/storage/local-provider.ts` |
| **Regression risk** | Low — public active assets still served when registered in DB with non-vault status |

### C2 — Broken MIME validation (all uploads accepted)

| Field | Detail |
|-------|--------|
| **Problem** | `kindFromMime()` returns `"other"` (truthy); checks like `!kindFromMime(mime)` never rejected files. HTML/SVG/JS could be stored. |
| **Risk** | Stored XSS, malware hosting, MIME confusion attacks. |
| **Severity** | Critical |
| **Fix** | `assertAllowedUploadMime()` explicit allowlist; applied in upload routes and `mediaService`. |
| **Files** | `src/pams/security/mime.ts`, `src/pams/services/media.service.ts`, upload API routes |
| **Regression risk** | Low — same allowlist as documented DAM types |

### C3 — Publish bypass via production edit action

| Field | Detail |
|-------|--------|
| **Problem** | `updateProductionAction` accepted `published` / `workflowStatus` with only `productions.write`. |
| **Risk** | Privilege escalation — draft editor publishes without wizard validation. |
| **Severity** | Critical |
| **Fix** | Publish fields applied only when user has `productions.publish`; slug always slugified. |
| **Files** | `src/app/admin/actions.ts` |
| **Regression risk** | Low — superadmin/publish role unchanged; wizard publish path preserved |

### C4 — Cache revalidation open when secret unset

| Field | Detail |
|-------|--------|
| **Problem** | `secret !== process.env.SANITY_REVALIDATE_SECRET` passed when both undefined. |
| **Risk** | Unauthenticated cache purge / DoS. |
| **Severity** | Critical |
| **Fix** | Fail closed (503) if secret not configured; `timingSafeEqual` comparison; header auth supported. |
| **Files** | `src/app/api/revalidate/route.ts` |
| **Regression risk** | Low — requires env var in any environment using revalidate |

---

## High findings

### H1 — JWT permissions trusted without DB revalidation — **FIXED**

| Field | Detail |
|-------|--------|
| **Problem** | Role/permissions embedded in JWT for 7 days; deactivated users retained access. |
| **Fix** | JWT stores only `sub`; `readSession()` reloads user+permissions from DB each request. |
| **Files** | `src/pams/auth/session.ts` |
| **Regression risk** | Low — slight DB read per request (acceptable for admin scale) |

### H2 — Default session secret fallback — **FIXED**

| Field | Detail |
|-------|--------|
| **Problem** | Hardcoded dev secret used when env missing; weak secrets accepted in staging. |
| **Fix** | `resolveSessionSecret()` enforces ≥32 chars in deployed envs; dev-only fallback locally. |
| **Files** | `src/pams/security/secrets.ts`, `src/instrumentation.ts` |
| **Regression risk** | Low — staging/prod must set `PAMS_SESSION_SECRET` |

### H3 — Media approval bypass via metadata form — **FIXED**

| Field | Detail |
|-------|--------|
| **Problem** | `updateMediaMetadataAction` wrote `approvalStatus` with `media.write` only. |
| **Fix** | Approval/verification fields applied only when user has `media.approve`; enum validation on approve action. |
| **Files** | `src/app/admin/media/actions.ts` |
| **Regression risk** | Low — UI unchanged; approvers retain dropdown control |

### H4 — Direct upload size not enforced at completion — **FIXED**

| Field | Detail |
|-------|--------|
| **Problem** | Client could exceed authorized size on R2 PUT. |
| **Fix** | `completeDirectUpload` rejects `head.size > session.maxBytes`; deletes object. |
| **Files** | `src/pams/services/media.service.ts` |
| **Regression risk** | Low |

### H5 — Unauthenticated Facebook sync — **FIXED**

| Field | Detail |
|-------|--------|
| **Problem** | `GET /api/sync/facebook` public. |
| **Fix** | Requires admin `settings.read` or `FACEBOOK_SYNC_SECRET` header. |
| **Files** | `src/app/api/sync/facebook/route.ts` |
| **Regression risk** | Low — cron can use sync secret |

### H6 — No admin route middleware — **FIXED**

| Field | Detail |
|-------|--------|
| **Problem** | Auth duplicated per page; new routes could ship unprotected. |
| **Fix** | `src/middleware.ts` redirects unauthenticated `/admin/*` and `/preview/*` to login. |
| **Regression risk** | Low |

### H7 — Preview accessible to any logged-in user — **FIXED**

| Field | Detail |
|-------|--------|
| **Problem** | Preview layout only checked session presence. |
| **Fix** | Requires `productions.read` permission. |
| **Files** | `src/app/preview/layout.tsx` |
| **Regression risk** | Low — editors retain access via role permissions |

### H8 — IDOR on wizard credit delete — **FIXED**

| Field | Detail |
|-------|--------|
| **Problem** | `removeCredit(creditId)` ignored production scope. |
| **Fix** | Delete requires matching `productionId`. |
| **Files** | `src/pams/services/wizard.service.ts`, wizard actions |
| **Regression risk** | Low |

### H9 — IDOR on media role assignment — **FIXED**

| Field | Detail |
|-------|--------|
| **Problem** | Any asset could be assigned to any production. |
| **Fix** | Rejects if asset belongs to different production. |
| **Files** | `src/pams/services/media.service.ts` |
| **Regression risk** | Low |

### H10 — Unvalidated website config JSON — **FIXED**

| Field | Detail |
|-------|--------|
| **Problem** | `JSON.parse` without size limit or URL sanitization. |
| **Fix** | `parseWebsiteConfigJson()` — size cap, strips `resolvedFlagship`, validates nav/banner hrefs. |
| **Files** | `src/pams/security/website-config.ts`, `src/app/admin/website/actions.ts` |
| **Regression risk** | Low — malicious external URLs blocked at save |

### H11 — No login rate limiting — **FIXED (in-process)**

| Field | Detail |
|-------|--------|
| **Problem** | Unlimited password guessing. |
| **Fix** | Per-IP and per-email rate limits on login; password max length 128. |
| **Files** | `src/pams/auth/actions.ts`, `src/pams/security/rate-limit.ts`, `src/pams/auth/password.ts` |
| **Regression risk** | Low |
| **Remaining** | In-memory limiter resets on Worker isolate restart — use KV for production scale |

### H12 — Upload authorize rate limiting — **FIXED (in-process)**

| Field | Detail |
|-------|--------|
| **Fix** | Per-user+IP limits on `/api/dam/upload/authorize`. |
| **Files** | `src/app/api/dam/upload/authorize/route.ts` |

---

## Medium findings

### M1 — Admin pages lack per-route RBAC — **OPEN**

| Field | Detail |
|-------|--------|
| **Problem** | Pages check session only; any logged-in user sees all admin UI. |
| **Risk** | Information disclosure to low-privilege roles. |
| **Severity** | Medium |
| **Fix (recommended)** | Add `requireAdminSession("…")` per route or shared layout guard. |
| **Regression risk** | Medium — must map permissions per page |

### M2 — CSRF relies on SameSite=Lax only — **OPEN**

| Field | Detail |
|-------|--------|
| **Problem** | No CSRF tokens on server actions / JSON APIs. |
| **Risk** | Cross-site state change if cookie policy weakens. |
| **Severity** | Medium |
| **Fix (recommended)** | Origin/Referer validation middleware; optional CSRF token for admin mutations. |
| **Regression risk** | Low |

### M3 — Magic-byte validation is placeholder — **PARTIAL**

| Field | Detail |
|-------|--------|
| **Problem** | `validateMagicBytes()` is a hook; no `file-type` sniffing yet. |
| **Fix applied** | Hook called on buffered and direct-complete uploads; rejects disallowed MIME at allowlist. |
| **Remaining** | Integrate `file-type` or Sharp probe before persist. |
| **Severity** | Medium |

### M4 — Contact form rate limit in-memory — **OPEN**

| Field | Detail |
|-------|--------|
| **Problem** | Resets per server instance; not durable on Cloudflare. |
| **Severity** | Medium |
| **Fix (recommended)** | Cloudflare Rate Limiting or KV. |

### M5 — Website publish lacks `settings.publish` permission — **OPEN**

| Field | Detail |
|-------|--------|
| **Problem** | Draft save and live publish both use `settings.write`. |
| **Severity** | Medium |
| **Fix (recommended)** | Add `settings.publish` to seed + gate `publishWebsiteAction`. |

### M6 — Repository mass-assignment sinks — **OPEN**

| Field | Detail |
|-------|--------|
| **Problem** | `Record<string, unknown>` on repository updates. |
| **Severity** | Medium |
| **Fix (recommended)** | Typed DTOs / Pick fields at repository boundary. |

### M7 — Sensitive contact data in logs — **FIXED**

| Field | Detail |
|-------|--------|
| **Fix** | Removed email from contact form server logs. |
| **Files** | `src/app/api/contact/route.ts` |

### M8 — Snapshot restore without audit — **FIXED**

| Field | Detail |
|-------|--------|
| **Fix** | Audit log entry on snapshot restore. |
| **Files** | `src/pams/services/website-config.service.ts` |

---

## Low findings

| ID | Issue | Status |
|----|-------|--------|
| L1 | Login form default email (`admin@orammedia.com`) | Open — cosmetic/info leak |
| L2 | `sameSite: lax` on session cookie | Accepted — document strict for future |
| L3 | Generic error messages on upload APIs | **Fixed** — no internal message leak |
| L4 | `$queryRaw` in media duplicates | Safe (parameterized) — no change |
| L5 | D1 ignores Prisma transactions | Documented — no code change |
| L6 | Virus scan not integrated | Open — hook documented in `mime.ts` |
| L7 | HSTS in Next headers (local dev) | **Added** — production should also set at Cloudflare edge |

---

## Fixed vulnerabilities (summary)

1. DAM asset proxy auth + path traversal protection  
2. MIME allowlist enforcement  
3. Publish permission gating on production edit  
4. Revalidate fail-closed + timing-safe secret compare  
5. Session DB revalidation + minimal JWT payload  
6. Strong session secret policy for deployed environments  
7. Media approval permission gating  
8. Upload size enforcement on direct complete  
9. Facebook sync authentication  
10. Admin/preview middleware  
11. Preview permission check  
12. Wizard credit + media assignment IDOR fixes  
13. Website config JSON validation  
14. Login + upload rate limiting (in-process)  
15. Password max length  
16. Logout cookie clearing with matching attributes  
17. CSP + HSTS headers  
18. Contact log PII redaction  
19. Snapshot restore audit logging  
20. Unified `requireAdminSession` on DAM API routes  

---

## Remaining risks

| Risk | Severity | Mitigation path |
|------|----------|-----------------|
| In-memory rate limits on Cloudflare Workers | Medium | Cloudflare Rate Limiting / KV / Durable Object |
| No virus/malware scanning on uploads | Medium | ClamAV worker or cloud scan webhook |
| Incomplete magic-byte verification | Medium | Add `file-type` package |
| Admin page-level RBAC gaps | Medium | Permission checks per route |
| No CSRF tokens | Medium | Origin check + optional tokens |
| Seed default admin password | Medium | Require env password in non-dev seed |
| Separation of duties (website publish) | Medium | `settings.publish` permission |
| External penetration test not performed | High (process) | Schedule before production launch |

---

## Headers verification

| Header | Status |
|--------|--------|
| Content-Security-Policy | **Added** (Next.js headers — allows Next/Mux/YouTube requirements) |
| Strict-Transport-Security | **Added** (also configure at Cloudflare edge for production) |
| X-Content-Type-Options | Present (`nosniff`) |
| X-Frame-Options | Present (`DENY`) |
| Referrer-Policy | Present (`strict-origin-when-cross-origin`) |
| Permissions-Policy | Present (camera self only) |
| X-Robots-Tag | Present on `/admin/*`, `/preview/*` |
| Cross-Origin-Opener-Policy | Not set — optional hardening |
| Cross-Origin-Resource-Policy | Not set — optional for DAM proxy |

---

## Upload security checklist

| Control | Status |
|---------|--------|
| MIME allowlist | **Fixed** |
| Magic-byte validation | **Partial** (hook only) |
| Extension validation | Via MIME + `safeFilename()` |
| Max size (512 MB) | Enforced authorize + complete + buffered |
| Duplicate detection | Checksum (unchanged) |
| Virus scan hook | **Placeholder** in `mime.ts` |
| Filename sanitization | `safeFilename()` / `storedNameFromOriginal()` |
| Object key sanitization | `isValidStorageKey()` prefix + charset |
| Unauthorized upload prevention | `requireAdminSession("media.write")` |
| Multipart validation | R2 native; local multipart route not implemented |

---

## Authentication checklist

| Control | Status |
|---------|--------|
| HttpOnly cookies | Yes |
| Secure cookies (prod/staging) | Yes |
| SameSite | Lax |
| Session expiry | 7 days JWT |
| Logout invalidation | Cookie cleared with matching attrs |
| Session fixation | New token at login |
| Password hashing | bcrypt 12 rounds |
| Timing-safe secret compare | Revalidate route |
| Preview auth | Session + `productions.read` |
| Admin protection | Middleware + page checks |
| DB permission refresh | **Fixed** |

---

## OWASP Top 10 mapping (2021)

| OWASP | Relevance | Sprint 4 status |
|-------|-----------|-----------------|
| A01 Broken Access Control | Publish bypass, IDOR, DAM read | **Mostly fixed** — page RBAC open |
| A02 Cryptographic Failures | Default JWT secret | **Fixed** |
| A03 Injection | Raw SQL | Low risk (parameterized) |
| A04 Insecure Design | Direct upload flow | Hardened size + MIME |
| A05 Security Misconfiguration | Revalidate secret, headers | **Fixed / improved** |
| A06 Vulnerable Components | — | No changes this sprint |
| A07 Auth Failures | No login rate limit | **Fixed (in-process)** |
| A08 Data Integrity | Website JSON | **Validated** |
| A09 Logging Failures | Contact PII in logs | **Fixed** |
| A10 SSRF | Upload/sync routes | Low risk — no user URLs fetched |

---

## Manual penetration test checklist

Use before production launch:

- [ ] Attempt publish via production edit without `productions.publish`
- [ ] Attempt self-approve media with `media.write` only
- [ ] Fetch `/api/dam/asset?key=../../../.env` — expect 400/404
- [ ] Fetch vault asset URL without session — expect 403
- [ ] Upload `text/html` renamed as `.jpg` — expect rejection
- [ ] POST `/api/revalidate` without secret — expect 401/503
- [ ] GET `/api/sync/facebook` without auth — expect 401
- [ ] Brute-force login >10 attempts — expect 429
- [ ] Delete credit belonging to another production — expect error
- [ ] Assign media from production A to production B — expect error
- [ ] Save website draft with `javascript:` nav href — expect error
- [ ] Access `/preview` with read-only role lacking `productions.read` — expect redirect
- [ ] Verify deactivated user cannot access admin after session refresh
- [ ] Verify CSP does not break Mux player / contact form
- [ ] Verify contact form rate limit triggers at threshold

---

## Regression checklist

| Area | Verified |
|------|----------|
| Inkondo poster / flagship | Unchanged |
| Public pages design/content | Unchanged |
| Production Wizard flow | Unchanged |
| Website Builder autosave | Unchanged |
| DAM upload (local) | Functional with stricter MIME |
| DAM upload (direct/R2 path) | Functional with size check |
| Approve/Reject buttons | Unchanged |
| Metadata form approval dropdown | Works for `media.approve` role |
| Publish wizard | Still requires `productions.publish` |
| Preview draft projects | Requires `productions.read` |
| Contact form | Unchanged UI; email not logged |
| Cloudflare wrangler/opennext config | **Not modified** |

---

## New security modules

```
src/pams/security/
  mime.ts           — MIME allowlist + magic-byte hook
  storage-keys.ts   — Key validation + path traversal prevention
  rate-limit.ts     — In-process rate limiting
  secrets.ts        — Session secret policy
  website-config.ts — Draft JSON validation

src/middleware.ts   — Admin/preview session gate
```

---

## Verdict

**CONDITIONAL GO**

Sprint 4 successfully hardens ORAM OS for production readiness without feature regression or UI changes. Critical access-control and upload vulnerabilities are remediated. **Proceed to Sprint 5** after approval, with remaining medium items tracked for operational hardening before public production launch.

**Do not deploy to production** until:

1. `PAMS_SESSION_SECRET` and revalidate/sync secrets are set  
2. KV-backed rate limiting is configured (Cloudflare)  
3. Magic-byte validation is completed  
4. Manual pentest checklist is executed on staging  
5. Cloudflare edge HSTS is confirmed  

---

**Prepared by:** Sprint 4 Security Hardening  
**Next step:** Await approval before Sprint 5.
