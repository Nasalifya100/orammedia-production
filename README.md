# Oram Media

Premium film and video production company website built with Next.js 14+, TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Forms:** React Hook Form + Zod
- **CMS:** Sanity (live data with mock fallback)
- **Video:** Mux adaptive streaming (`@mux/mux-player-react`)
- **Hosting:** Vercel-ready

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

## Project Structure

```
src/
├── app/                  # App Router pages
│   ├── page.tsx          # Homepage
│   ├── projects/         # Portfolio + detail pages
│   ├── about/
│   ├── services/
│   ├── contact/
│   └── api/contact/      # Form submission endpoint
├── components/
│   ├── home/             # Homepage sections
│   ├── layout/           # Header, Footer, Cookie consent
│   ├── projects/         # Portfolio components
│   ├── contact/          # Contact form
│   └── ui/               # Shared UI primitives
├── lib/
│   ├── data/
│   │   ├── index.ts      # Sanity fetchers (live + mock fallback)
│   │   └── mock-data.ts  # Demo content when CMS is empty
│   ├── mux.ts            # Mux poster/stream helpers
│   ├── sanity/           # CMS client & GROQ queries
│   └── validations/      # Zod schemas
└── types/                # TypeScript interfaces
sanity/
└── schema/               # Sanity content models
```

## Sanity CMS Setup

1. Create a project at [sanity.io](https://sanity.io)
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_read_token
   SANITY_REVALIDATE_SECRET=random_secret
   ```
3. Run the studio: `npm run sanity`
4. Create a **Site Settings** document (singleton) for the homepage showreel
5. Add projects with optional **Mux Playback ID** per project
6. Configure a Sanity webhook → `POST /api/revalidate?secret=YOUR_SECRET` on publish

Content models: Site Settings, Project, Client Logo, Team Member, Service, Testimonial, Award.

**Fallback:** If Sanity is unconfigured or empty, the site uses mock data automatically.

## Mux Video Setup

1. Upload showreel/project videos at [dashboard.mux.com](https://dashboard.mux.com)
2. Copy the **Playback ID** for each asset
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_MUX_PLAYBACK_ID=showreel_playback_id
   ```
4. Or set per-project in Sanity (`muxPlaybackId` field) and in Site Settings for the hero

The `MediaPlayer` component prefers Mux streaming, then falls back to direct MP4 URLs.

## Features

- Full-viewport autoplay showreel hero
- Filterable portfolio with ISR project pages
- Multi-step contact form with Zod validation
- Client testimonials carousel
- Awards & client logo marquee
- Cookie consent banner
- SEO metadata, sitemap, robots.txt
- Glassmorphism UI with jewel-toned accents

## Production Deployment

Deploy to Vercel:

```bash
npx vercel
```

Replace demo video URLs with Mux playback IDs for production-grade adaptive streaming.

## License

Private — Oram Media © 2025
