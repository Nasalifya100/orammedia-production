# ORAM Production Archive Management System (PAMS)

PAMS is the internal CMS / archive operating system for ORAM Media Dynamics.
The public Next.js website is one consumer of this database.

## Stack

- Next.js App Router (`/admin`)
- Prisma 7 + SQLite (`prisma/pams.db`) — swap `DATABASE_URL` to Postgres for production
- Server Actions + layered services/repositories under `src/pams/`
- Cookie session auth (JWT via `jose`) + RBAC

## Commands

```bash
npm run pams:generate   # Prisma client
npm run pams:migrate    # migrations
npm run pams:seed       # seed from archival mock + classification ledger
npm run pams:studio     # Prisma Studio
```

## Admin

- URL: `/admin/login`
- Default (dev): `admin@orammedia.com` / `oram-admin-change-me`
- Set `PAMS_ADMIN_EMAIL`, `PAMS_ADMIN_PASSWORD`, `PAMS_SESSION_SECRET` in `.env.local`

## Architecture

```
src/pams/
  db.ts                 # Prisma client + SQLite adapter
  auth/                 # sessions, passwords, login actions
  repositories/         # data access
  services/             # business logic
  mappers/              # DB → public Project shape
src/app/admin/          # Admin UI
src/lib/data/index.ts   # Public site reads PAMS first
```

## Dual filmography

- Collection `oram` — official ORAM participation only
- Collection `owas` — full Owas Ray Mwape career
- Linked via `productionId` when a shared production exists; never merged

## Homepage & Website Builder (ORAM OS)

The public homepage is fully data-driven from **Website Configuration** — no hardcoded section order or featured list.

- Admin: `/admin/website` — visual homepage builder
- Snapshots: `/admin/website/snapshots` — named versions, one-click restore
- Preview: `/preview/homepage?scope=draft|published` (admin session required)

Models: `WebsiteConfig` (draft + published rows), `WebsiteSnapshot`

Services:

- `src/pams/services/website-config.service.ts` — draft/publish/snapshots
- `src/pams/services/flagship.service.ts` — flagship cascade (hero, OG, SEO, featured #1)

Changing **Flagship Production** updates hero poster, video, share image, Open Graph defaults, SEO title, and featured position automatically.

Default featured order: Inkondo → Zuba → Graft → Look in the Mirror → Pa Maliketi → Hang! → Girls to Ladies → Secrets Untold → The Wife

Legacy site settings keys (Admin → Settings) remain for backward compatibility but Website Builder is the source of truth.

## DAM 2.0 — Digital Asset Management

- **Library:** `/admin/media` — upload, grid browse, archive intelligence
- **Asset detail:** `/admin/media/[id]` — metadata, approve/reject, rotate/flip, variants
- **Production manager:** `/admin/productions/[id]/media` — hero, poster, gallery, BTS, OG from one screen
- **Upload API:** `POST /api/dam/upload` (multipart, RBAC `media.write`)

Uploads land in `public/assets/dam/{year}/{production-slug}/`. Images auto-generate WebP, AVIF, thumbnail, and responsive sizes via `sharp`.

Services: `media.service.ts`, `media-processor.service.ts`, `media.repository.ts`
