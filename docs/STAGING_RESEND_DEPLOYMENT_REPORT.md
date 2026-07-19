# Staging Resend Deployment Report

**Date:** 2026-07-18  
**Branch:** `2026-07-17-mpx0`  
**Staging URL:** https://orammedia-staging.nasalifya007.workers.dev  
**Production:** not modified / domain not connected

---

## 1. Git

| Item | Result |
|------|--------|
| Intended change | Staging `CONTACT_EMAIL_MODE`: `dev` → `auto` in `wrangler.jsonc` |
| Commit | `158ff324550e76aba514d5d883ffc09b1feddc48` |
| Message | Enable Resend contact delivery on Cloudflare staging. |
| Push | **BLOCKED** — this repository has **no `git remote`** configured |

No secret values were committed. Secrets remain only in Cloudflare Workers staging secrets.

---

## 2. Prepared OpenNext bundle (Windows)

| Item | Result |
|------|--------|
| Path | `C:\Users\nasa\Documents\orammedia\.open-next` |
| `worker.js` | Present (2,278 bytes — OpenNext entry wrapper) |
| `assets/` | Present (147 files) |
| `server-functions/default/handler.mjs` | Present |
| `*.wasm` (Prisma query compiler) | Present (2 files) |
| Bundle status | **COMPLETE — ready to deploy** |

---

## 3. Authentication status (Cursor agent shell)

| Item | Result |
|------|--------|
| Temporary `CLOUDFLARE_API_TOKEN` in agent shell | **Not present** |
| `npx wrangler whoami` (agent) | Failed: Invalid access token `[code: 9109]` (stale OAuth file only) |
| User’s interactive PowerShell session | User confirmed token works there |

**Deploy was not executed from Cursor** because the temporary API token exists only in the user’s PowerShell session. Cursor’s shell cannot see that variable, and the token must not be copied into chat or files.

---

## 4. Deployment

| Item | Result |
|------|--------|
| Worker name | `orammedia-staging` (from `wrangler.jsonc`) |
| Command | `npx wrangler deploy --env staging` |
| Status | **PENDING — run in your authenticated PowerShell window** |
| Version ID | *pending* |
| Staging URL | https://orammedia-staging.nasalifya007.workers.dev |
| Production | Not deployed / domain not connected |

---

## 5. Contact / Resend verification

| Item | Result |
|------|--------|
| Safe test inquiry | **Not run** (waiting for successful staging deploy) |
| HTTP 200 | Pending |
| Resend transport (`CONTACT_EMAIL_MODE=auto`) | Pending live verify |
| Inbox delivery | Pending operator confirmation |
| Secrets in logs/output | None exposed by this session |

---

## 6. Exact commands to finish (YOUR PowerShell session only)

Run these in the **same PowerShell window** where `$env:CLOUDFLARE_API_TOKEN` is already set. Do not paste the token into Cursor.

```powershell
cd C:\Users\nasa\Documents\orammedia

# 1) Confirm auth (should show your account; no token printed)
npx wrangler whoami

# 2) Confirm this account can see the staging Worker
npx wrangler deployments list --name orammedia-staging

# 3) Deploy STAGING only (uses prepared .open-next — no rebuild)
npx wrangler deploy --env staging

# 4) Safe contact test (synthetic data only)
$body = @{
  projectType  = "other"
  budgetRange  = "under-50k"
  timeline     = "Staging Resend verification"
  description  = "Safe staging contact delivery verification message."
  companyName  = "ORAM Staging QA"
  fullName     = "Staging Tester"
  email        = "staging-qa@example.com"
  phone        = "+260970000000"
} | ConvertTo-Json

Invoke-WebRequest `
  -Uri "https://orammedia-staging.nasalifya007.workers.dev/api/contact" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing

# 5) Tail logs (look for provider resend / delivery — no secrets)
npx wrangler tail orammedia-staging --format pretty
```

Expected after deploy:

1. Deploy prints **Worker** `orammedia-staging` and a **Current Version ID**
2. Contact POST returns **HTTP 200** and `{ "success": true, ... }`
3. Logs show inquiry delivered with `provider: "resend"` (or equivalent success path)
4. Message arrives in the configured destination inbox (check inbox yourself)

If deploy fails with a permission error, note the **exact Cloudflare permission name** from the error and add it to the API token — do not paste the token into chat.

---

## 7. Remaining production blockers

1. Finish staging deploy + prove Resend inbox delivery  
2. Prior Sprint 8 HOLD items (homepage publish/ISR proof, RBAC viewer user, optional R2 S3 direct-upload secrets, Lighthouse P2)  
3. Add a Git remote and push commit `158ff32` when ready  
4. Do **not** connect `orammedia.com` or deploy production until blockers are closed and explicit approval is given  

---

## 8. Security reminder

When finished, **close the PowerShell terminal** so the temporary `CLOUDFLARE_API_TOKEN` is removed from memory.

---

*End of report — deploy pending user session.*
