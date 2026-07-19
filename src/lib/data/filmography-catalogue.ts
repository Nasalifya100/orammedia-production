/**
 * ORAM Media Dynamics — Complete filmography catalogue (research ledger).
 * Distinguishes published site pages from vault-only / acting-only titles.
 * Do not fabricate. Mark conflicts REQUIRES VERIFICATION.
 */

export type CatalogueStatus =
  | "published"
  | "unpublished-media"
  | "vault-only"
  | "acting-credit"
  | "branded-incomplete"
  | "requires-verification";

/** @deprecated Prefer archival-classification.ts ArchivalCategory */
export type { ArchivalCategory } from "@/lib/data/archival-classification";

export type CatalogueKind =
  | "feature"
  | "tv-series"
  | "telenovela"
  | "short"
  | "branded"
  | "event"
  | "documentary"
  | "training"
  | "other";

export interface CatalogueSource {
  label: string;
  url?: string;
}

export interface FilmographyEntry {
  id: string;
  title: string;
  slug?: string;
  year?: number;
  yearNote?: string;
  kind: CatalogueKind;
  status: CatalogueStatus;
  genre?: string;
  synopsis?: string;
  director?: string[];
  producer?: string[];
  writer?: string[];
  productionCompany?: string;
  client?: string;
  broadcaster?: string;
  streaming?: string;
  runtime?: string;
  awards?: string;
  festivals?: string;
  cast?: string[];
  crew?: string[];
  notes?: string;
  conflicts?: string[];
  archiveAssets?: string[];
  trailers?: { platform: string; url: string; notes: string }[];
  sources: CatalogueSource[];
}

export const filmographyCatalogue: FilmographyEntry[] = [
  {
    id: "inkondo",
    title: "Inkondo",
    slug: "inkondo",
    year: 2025,
    kind: "tv-series",
    status: "published",
    genre: "Drama",
    synopsis:
      "Forbidden love between children of rival families torn apart by betrayal and secrets.",
    director: ["Owas Ray Mwape"],
    producer: [],
    writer: [],
    productionCompany: "MultiChoice / Zambezi Magic original",
    client: "Zambezi Magic / MultiChoice",
    broadcaster: "Zambezi Magic (DStv 162 / GOtv 3 Supa)",
    streaming: "Showmax",
    cast: [
      "Luke Mumba",
      "Rosheni Mwemba",
      "Evans Phiri",
      "Sophia Chapeshamano",
      "Zen Vlahakis",
    ],
    notes: "Creative lead also credited: Jackson (Jay Rox) Banda.",
    conflicts: [
      "ORAM contractual production scope beyond creative leadership — REQUIRES VERIFICATION",
    ],
    archiveAssets: [
      "/projects/inkondo-billboard.jpg",
      "/media/bts/inkondo-shoot-s2.jpg",
    ],
    trailers: [
      {
        platform: "YouTube",
        url: "https://www.youtube.com/watch?v=SDtK15xguG8",
        notes: "Wired on site — confirm official channel ownership",
      },
    ],
    sources: [
      {
        label: "Zambezi Magic show page",
        url: "https://www.dstv.com/zambezimagic/en-mu/show/inkondo",
      },
      {
        label: "MultiChoice Studios",
        url: "https://www.multichoicestudios.com/show/inkondo",
      },
    ],
  },
  {
    id: "zuba",
    title: "Zuba",
    slug: "zuba",
    year: 2017,
    yearNote: "2017–2025 · 8 seasons (Showmax)",
    kind: "telenovela",
    status: "published",
    genre: "Telenovela / Drama",
    synopsis:
      "A rural young woman works for a wealthy urban family and falls in love with the family’s son.",
    director: ["Owas Ray Mwape"],
    client: "Zambezi Magic / MultiChoice",
    broadcaster: "Zambezi Magic",
    streaming: "Showmax",
    cast: ["Mwaka Mugala", "Sophia Chapeshamano", "Sam Sakala"],
    conflicts: [
      "Episode totals reported as 1,500+ in secondary sources — REQUIRES VERIFICATION; not published as fact",
      "ORAM company production scope beyond directing — REQUIRES VERIFICATION",
    ],
    archiveAssets: ["/projects/zuba.jpg", "/projects/zuba-billboard.jpg"],
    trailers: [
      {
        platform: "YouTube",
        url: "https://www.youtube.com/watch?v=yz1rA4evuzA",
        notes: "Official launch trailer",
      },
    ],
    sources: [
      {
        label: "MultiChoice Studios — six seasons strong",
        url: "https://www.multichoicestudios.com/news/zuba-six-seasons-strong-96",
      },
      {
        label: "Showmax — Zuba",
        url: "https://www.showmax.com/et/stream/series/zuba/b3785e05-c758-3ae8-84c3-194d91cbd0b9/seasons/1",
      },
    ],
  },
  {
    id: "pa-maliketi",
    title: "Pa Maliketi",
    slug: "pa-maliketi",
    year: 2023,
    yearNote: "S2 announced Apr 2025",
    kind: "tv-series",
    status: "published",
    genre: "Comedy",
    synopsis:
      "Mwansa inherits her mother’s stand at Fyakubantu market and faces the drama around her.",
    director: ["Owas Ray Mwape"],
    client: "Zambezi Magic / MultiChoice",
    broadcaster: "Zambezi Magic (DStv 162)",
    cast: [
      "Elizabeth Chisela",
      "Philomena Nyirenda",
      "Robert Nyirenda",
      "Taonga Phiri",
      "Innocent Tembo",
    ],
    conflicts: [
      "ORAM Media Dynamics production-company credit vs directing-only — REQUIRES VERIFICATION",
    ],
    archiveAssets: [
      "/projects/pa-maliketi-s1-cover.jpg",
      "/projects/pa-maliketi-cover.jpg",
    ],
    sources: [
      {
        label: "DStv Zambezi Magic promo",
        url: "https://www.dstv.com/zambezimagic/en-za/video/this-week-pa-maliketi",
      },
      {
        label: "Kinorium cast/director",
        url: "https://en.kinorium.com/11584311/",
      },
    ],
  },
  {
    id: "graft",
    title: "Graft",
    slug: "graft",
    year: 2024,
    kind: "feature",
    status: "published",
    genre: "Drama",
    synopsis: "Poster tagline: When Corruption Sinks Everyone.",
    director: ["Owas Ray Mwape"],
    producer: ["Owas Ray Mwape"],
    productionCompany:
      "Oram Media Works · Owas Films · Oram Film Training Academy",
    cast: ["Kangwa Chileshe", "Sophie Mbao"],
    archiveAssets: ["/projects/graft-poster-hd.jpg"],
    trailers: [
      {
        platform: "Facebook",
        url: "https://www.facebook.com/oramtv/posts/life-on-set-️owas-ray-mwape-film-director-alfred-njovu-graft-orammedia-oramtv/1721962718165889/",
        notes: "BTS / life on set — not a cut trailer",
      },
    ],
    sources: [
      {
        label: "IMDbPro",
        url: "https://pro.imdb.com/title/tt31797916/",
      },
      { label: "Official Graft poster (ORAM archive)" },
    ],
  },
  {
    id: "look-in-the-mirror",
    title: "Look in the Mirror",
    slug: "look-in-the-mirror",
    year: 2024,
    kind: "feature",
    status: "published",
    genre: "Drama",
    director: ["Owas Ray Mwape"],
    productionCompany: "Oram Media Dynamics in association with Owas Films",
    cast: ["Owas Ray Mwape", "Mutinta Mari"],
    crew: ["Maxwell Mwape (DoP)"],
    conflicts: [
      "Poster date September 28 vs reported Lusaka premiere 5 October 2024 — REQUIRES VERIFICATION",
    ],
    archiveAssets: ["/projects/look-in-the-mirror-poster.jpg"],
    trailers: [
      {
        platform: "YouTube",
        url: "https://www.youtube.com/watch?v=NBg0Q-TqNf8",
        notes: "Wired — confirm official upload",
      },
    ],
    sources: [
      { label: "Official poster (ORAM archive)" },
      {
        label: "Oram TV Facebook premiere post",
        url: "https://www.facebook.com/oramtv/posts/an-owas-ray-mwape-filmlook-in-the-mirrorhis-mistake-was-giving-her-a-liftred-car/1081536717315058/",
      },
    ],
  },
  {
    id: "hang",
    title: "Hang!",
    slug: "hang",
    year: 2018,
    kind: "feature",
    status: "published",
    genre: "Comedy / Drama",
    synopsis:
      "An unemployed artist threatens to hang himself on disputed land, creating a media storm.",
    director: ["Owas Ray Mwape"],
    producer: ["Adorah Mwape"],
    writer: ["Owas Ray Mwape", "Adorah Mwape"],
    productionCompany: "Owas Films · Owas Crystal Films · Old Age Productions",
    cast: [
      "Maxwell Mwape",
      "Evans Nkoya",
      "Henry B. J. Phiri",
      "Adorah Mwape",
      "Philomena Nyirenda",
    ],
    crew: ["Macrony Kasitu (DoP)"],
    notes: "Executive Producer on poster: ORAM.EXP.MARKETING LTD",
    archiveAssets: ["/projects/hang-poster.jpg", "/projects/hang-poster-alt.jpg"],
    sources: [
      {
        label: "IMDbPro",
        url: "https://pro.imdb.com/title/tt22114760/",
      },
      { label: "Official Hang! poster (ORAM archive)" },
    ],
  },
  {
    id: "girls-to-ladies",
    title: "Girls to Ladies",
    slug: "girls-to-ladies",
    year: 2020,
    kind: "feature",
    status: "published",
    genre: "Drama",
    director: ["Owas Ray Mwape"],
    writer: ["Ivory van der Boom"],
    producer: ["Adorah Mwape (EP)", "Owas Ray Mwape (EP)"],
    productionCompany: "Owas Films Productions · Old Age Pictures",
    cast: ["Sophie Mbao", "Taonga Phiri", "Owas Ray Mwape"],
    conflicts: [
      "Social-issue theme summaries from secondary profiles — REQUIRES VERIFICATION vs finished film",
      "Exact release year 2020 from secondary profiles — poster does not print year; REQUIRES VERIFICATION",
    ],
    archiveAssets: ["/projects/girls-to-ladies-poster.jpg"],
    notes: "Poster resolution is low — replace with higher master when found",
    sources: [{ label: "Official Girls 2 Ladies poster (ORAM archive)" }],
  },
  {
    id: "secrets-untold",
    title: "Secrets Untold",
    slug: "secrets-untold",
    year: 2015,
    kind: "feature",
    status: "published",
    genre: "Drama",
    director: ["Owas Ray Mwape"],
    writer: ["Owas Ray Mwape", "Ivory van der Boom (screenplay)"],
    productionCompany:
      "Owas Crystal Films · Old Age Productions · X-Konvict Pictures",
    cast: ["Owas Ray Mwape", "Cassie Kabwita", "Catherine Soko", "Adorah Mwape"],
    conflicts: [
      "Premiere date: Kinorium 30 Oct 2015 vs Lusaka Times coverage 17 Nov 2015 (“last week”) — REQUIRES VERIFICATION of exact night",
    ],
    archiveAssets: ["/projects/secrets-untold-poster.jpg"],
    sources: [
      {
        label: "Lusaka Times",
        url: "https://www.lusakatimes.com/2015/11/17/owas-premieres-secrets-untold/",
      },
    ],
  },
  {
    id: "the-wife",
    title: "The Wife",
    slug: "the-wife",
    year: 2013,
    yearNote: "Cited era ~2013 — premiere date REQUIRES VERIFICATION",
    kind: "feature",
    status: "published",
    genre: "Drama",
    synopsis: "Poster tagline: For better, for worse…",
    director: ["Owas Ray Mwape"],
    producer: ["Owas Ray Mwape (EP)"],
    productionCompany: "Owas Films · Old Age Productions · Maynarj Films",
    cast: [
      "Meyer Nyirenda",
      "Owas Ray Mwape",
      "Webster Chiluba",
      "Adora Mwape",
      "Charles Simusokwe",
      "Mwelwa Muswema",
    ],
    crew: ["Maynard Muchangwe (DoC)", "Jeff Simeja (Sound)"],
    conflicts: [
      "Exact premiere date not on poster — year from industry bios (medium confidence)",
    ],
    archiveAssets: ["/projects/the-wife-poster.jpg"],
    sources: [
      { label: "Official The Wife poster (ORAM vault)" },
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "strictly-by-invitation",
    title: "Strictly By Invitation",
    slug: "strictly-by-invitation",
    year: 2016,
    kind: "feature",
    status: "unpublished-media",
    genre: "Thriller / Drama",
    director: ["Owas Ray Mwape", "Robam Mwape"],
    producer: ["Adorah Mwape"],
    productionCompany: "Owas Crystal Films / Old Age Productions",
    conflicts: [
      "Wikipedia emphasises Robam as writer; Lusaka Times / IMDbPro emphasise co-direction — both cited; poster missing",
    ],
    sources: [
      {
        label: "Lusaka Times",
        url: "https://www.lusakatimes.com/2016/07/20/mwape-family-stars-strictly-invitation/",
      },
      {
        label: "IMDbPro",
        url: "https://pro.imdb.com/title/tt22087442/",
      },
    ],
  },
  {
    id: "youth-expo-2023",
    title: "Youth Expo 2023 / Umuntuni Youth Week",
    year: 2023,
    kind: "event",
    status: "branded-incomplete",
    client: "Ministry of Youth, Sport and Arts",
    notes:
      "Oram TV Facebook video names MoYSA as client. No honest event photography in public web set (logo-only assets rejected).",
    trailers: [
      {
        platform: "Facebook",
        url: "https://www.facebook.com/oramtv/videos/oram-media-dynamics-client-ministry-of-youth-sport-and-arts-youthexpo2023umuntun/747038756815619/",
        notes: "Official Oram TV client video",
      },
    ],
    sources: [
      {
        label: "Oram TV Facebook",
        url: "https://www.facebook.com/oramtv/videos/oram-media-dynamics-client-ministry-of-youth-sport-and-arts-youthexpo2023umuntun/747038756815619/",
      },
    ],
  },
  {
    id: "zambia-india-skills",
    title: "Zambia–India Skills Transfer (inaugural)",
    year: 2024,
    kind: "documentary",
    status: "branded-incomplete",
    notes:
      "Oram Media Group documented inaugural programme; Owas Ray Mwape named. Separate Salesian/Enso India training (2022) also involved Oram Film Academy — do not conflate without confirmation.",
    conflicts: [
      "Commissioning client / ministry — REQUIRES VERIFICATION",
      "Relationship to 2022 Salesian Enso training — REQUIRES VERIFICATION (likely distinct)",
    ],
    sources: [
      {
        label: "Oram TV Facebook",
        url: "https://www.facebook.com/oramtv/posts/the-oram-media-group-partners-at-the-inaugural-of-zambia-india-skills-transfer-w/1690059708022857/",
      },
      {
        label: "ANS / Salesian India–Zambia training (context only)",
        url: "https://www.infoans.org/en/sections/news-photos/item/15863-zambia-collaboration-between-india-and-zambia-to-initiate-young-people-into-filmmaking",
      },
    ],
  },
  {
    id: "vindanda",
    title: "Vindanda",
    year: 2019,
    kind: "feature",
    status: "requires-verification",
    director: ["Owas Ray Mwape"],
    notes: "Secondary bios / Kinorium — Mwiche role + directing mentions. No vault poster wired.",
    sources: [
      {
        label: "Secondary bios / Kinorium (confirm before publish)",
      },
    ],
  },
  {
    id: "a-wife-from-above",
    title: "A Wife from Above",
    kind: "feature",
    status: "requires-verification",
    director: ["Owas Ray Mwape"],
    notes:
      "Kinorium director credit. Public YouTube upload exists — confirm official channel before any embed. Distinct from The Wife.",
    trailers: [
      {
        platform: "YouTube",
        url: "https://www.youtube.com/watch?v=WJ62LAQbfWc",
        notes: "REQUIRES VERIFICATION — do not embed until channel ownership confirmed",
      },
    ],
    sources: [{ label: "Kinorium / YouTube (unconfirmed official)" }],
  },
  {
    id: "chenda",
    title: "Chenda",
    year: 2015,
    kind: "feature",
    status: "requires-verification",
    director: ["Owas Ray Mwape"],
    notes: "Cited in Wikipedia / Lusaka Times alongside Secrets Untold. No cleared web poster wired.",
    sources: [
      {
        label: "Lusaka Times (mentions June release)",
        url: "https://www.lusakatimes.com/2015/11/17/owas-premieres-secrets-untold/",
      },
    ],
  },
  {
    id: "the-flask",
    title: "The Flask",
    kind: "feature",
    status: "vault-only",
    notes: "Poster frames in vault. Credits / year / ORAM role REQUIRES VERIFICATION.",
    archiveAssets: ["/media/archive/the-flask-poster.jpg"],
    sources: [{ label: "ORAM vault — The Flask.jpg" }],
  },
  {
    id: "pamodzi",
    title: "Pamodzi",
    kind: "other",
    status: "vault-only",
    notes: "Cover frames in vault. Format / credits REQUIRES VERIFICATION.",
    archiveAssets: ["/media/archive/pamodzi-cover.jpg"],
    sources: [{ label: "ORAM vault — Pamodzi Cover.jpg" }],
  },
  {
    id: "chokolo",
    title: "Chokolo",
    kind: "other",
    status: "vault-only",
    notes: "Cover in vault. Credits REQUIRES VERIFICATION.",
    archiveAssets: ["/media/archive/chokolo-cover.jpg"],
    sources: [{ label: "ORAM vault — Chokolo Cover.jpg" }],
  },
  {
    id: "the-light",
    title: "The Light",
    kind: "other",
    status: "vault-only",
    archiveAssets: ["/media/archive/the-light-poster.jpg"],
    sources: [{ label: "ORAM vault — The Light.jpg" }],
  },
  {
    id: "the-lawyer",
    title: "The Lawyer",
    kind: "other",
    status: "requires-verification",
    notes:
      "Wikipedia lists The Lawyer among Mwape acting appearances; vault has The Lawyer.jpg — acting vs ORAM production REQUIRES VERIFICATION.",
    archiveAssets: ["/media/archive/the-lawyer-poster.jpg"],
    sources: [
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "suwi",
    title: "Suwi",
    year: 2010,
    kind: "feature",
    status: "acting-credit",
    notes: "Mwape acting credit (Dr. Chimba). Not listed as ORAM production without further proof.",
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "mwansa-the-great",
    title: "Mwansa the Great",
    year: 2011,
    kind: "short",
    status: "acting-credit",
    notes: "Acting / writer credit. Associate producer mentions in press — ORAM production claim REQUIRES VERIFICATION.",
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "kabanana",
    title: "Kabanana",
    yearNote: "2004–2008 acting; 2015 listing also appears",
    kind: "tv-series",
    status: "acting-credit",
    notes: "Primary public record is Mwape as Chembo (actor).",
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "fever",
    title: "Fever",
    year: 2018,
    kind: "tv-series",
    status: "acting-credit",
    notes: "Mwape as Marlon (actor) per Wikipedia table.",
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
];

export function getPublishedCatalogue() {
  return filmographyCatalogue.filter((e) => e.status === "published");
}

export function getCatalogueGaps() {
  return filmographyCatalogue.filter((e) => e.status !== "published");
}
