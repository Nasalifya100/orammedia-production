/**
 * ORAM Media Dynamics — Archival Classification Register
 * Chief Archivist ledger · Verification date: 2026-07-17
 *
 * CRITICAL: Not every Owas Ray Mwape credit is an ORAM production.
 * Accuracy over quantity. Conflicts → Requires Verification.
 */

export type ArchivalCategory =
  | "oram-production"
  | "oram-co-production"
  | "oram-service"
  | "directed-by-owas"
  | "produced-by-owas"
  | "executive-produced-by-owas"
  | "acting-credit-only"
  | "personal-filmography"
  | "requires-verification";

export const ARCHIVAL_CATEGORY_LABELS: Record<ArchivalCategory, string> = {
  "oram-production": "ORAM Media Dynamics Production",
  "oram-co-production": "ORAM Media Dynamics Co-Production",
  "oram-service": "ORAM Media Dynamics Service Production",
  "directed-by-owas": "Directed by Owas Ray Mwape",
  "produced-by-owas": "Produced by Owas Ray Mwape",
  "executive-produced-by-owas": "Executive Produced by Owas Ray Mwape",
  "acting-credit-only": "Acting Credit Only",
  "personal-filmography": "Personal Filmography",
  "requires-verification": "Requires Verification",
};

export type MediaPresence =
  | "live"
  | "vault"
  | "missing"
  | "partial"
  | "unofficial"
  | "n/a";

export interface ArchivalTitle {
  id: string;
  title: string;
  alternativeTitles?: string[];
  year?: number;
  yearNote?: string;
  kind:
    | "feature"
    | "tv-series"
    | "telenovela"
    | "short"
    | "branded"
    | "documentary"
    | "event"
    | "other";
  genre?: string;
  runtime?: string;
  status: "released" | "ongoing" | "concluded" | "unknown";
  synopsis?: string;
  /** Primary archival bucket — one per title */
  category: ArchivalCategory;
  /** Secondary classifications (e.g. also directed by Owas) */
  alsoClassifiedAs?: ArchivalCategory[];
  director?: string[];
  producer?: string[];
  executiveProducer?: string[];
  writer?: string[];
  productionCompany?: string;
  oramRole: string;
  owasRole: string;
  broadcaster?: string;
  streaming?: string;
  client?: string;
  festival?: string;
  awards?: string[];
  cast?: string[];
  crew?: string[];
  trailer?: { status: MediaPresence; url?: string; note?: string };
  teaser?: { status: MediaPresence; note?: string };
  poster?: { status: MediaPresence; path?: string; note?: string };
  stills?: { status: MediaPresence; note?: string };
  bts?: { status: MediaPresence; note?: string };
  logos?: { status: MediaPresence; note?: string };
  officialWebsite?: string;
  socialLinks?: string[];
  siteSlug?: string;
  sitePublished: boolean;
  recommendAddToSite: boolean;
  sources: { label: string; url?: string }[];
  conflicts?: string[];
  researchNotes?: string;
}

export const ARCHIVE_RESEARCH_DATE = "2026-07-17";

/**
 * Definitive title register — researched 2026-07-17 from Zambezi Magic,
 * MultiChoice, Showmax press, IMDb/IMDbPro refs in-repo, Kinorium, Lusaka Times,
 * Diggers, Wikipedia (cross-check only), ORAM vault/posters, Oram TV Facebook.
 */
export const archivalTitles: ArchivalTitle[] = [
  // ─── LIVE SITE SLATE ─────────────────────────────────────────────
  {
    id: "inkondo",
    title: "Inkondo",
    year: 2025,
    kind: "tv-series",
    genre: "Drama",
    status: "ongoing",
    synopsis:
      "Forbidden love between children of rival bus-war families torn apart by betrayal, violence, and secrets.",
    category: "directed-by-owas",
    alsoClassifiedAs: ["requires-verification"],
    director: ["Owas Ray Mwape"],
    productionCompany: "MultiChoice / Zambezi Magic original",
    oramRole:
      "Creative leadership documented in premiere materials (with Jackson Jay Rox Banda). Classified as Directed by Owas Ray Mwape.",
    owasRole: "Film director (premiere materials)",
    broadcaster: "Zambezi Magic (DStv 162 · GOtv 3 Supa)",
    streaming: "Showmax",
    client: "Zambezi Magic / MultiChoice",
    cast: [
      "Luke Mumba",
      "Rosheni Mwemba",
      "Evans Phiri",
      "Sophia Chapeshamano",
      "Zen Vlahakis",
    ],
    trailer: {
      status: "live",
      url: "https://www.youtube.com/watch?v=SDtK15xguG8",
      note: "Confirm official channel ownership",
    },
    poster: {
      status: "live",
      path: "/projects/inkondo-billboard.jpg",
    },
    stills: { status: "live", note: "Billboard / key art" },
    bts: {
      status: "live",
      note: "Inkondo S2 ORAM set photography in /media/bts/",
    },
    logos: { status: "missing" },
    siteSlug: "inkondo",
    sitePublished: true,
    recommendAddToSite: false,
    sources: [
      {
        label: "Zambezi Magic — Inkondo",
        url: "https://www.dstv.com/zambezimagic/en-mu/show/inkondo",
      },
      {
        label: "MultiChoice Studios — Inkondo",
        url: "https://www.multichoicestudios.com/show/inkondo",
      },
      {
        label: "Zambian Business Times — MultiChoice Zambia showcase",
        url: "https://zambianbusinesstimes.com/multichoice-zambia-unveils-new-local-content-lineup-across-its-power-of-three-platforms/",
      },
    ],
    conflicts: [
      "Do not claim ORAM as sole production company without MultiChoice/ORAM contract confirmation",
    ],
    researchNotes:
      "Flagship public face of ORAM creative work. Premiere 5 May 2025 20:00 CAT Mon–Wed.",
  },
  {
    id: "zuba",
    title: "Zuba",
    year: 2017,
    yearNote: "2017–2025 · 8 seasons (Showmax)",
    kind: "telenovela",
    genre: "Telenovela / Drama",
    runtime: "22–24 min (Wikipedia — cross-check)",
    status: "concluded",
    synopsis:
      "A rural young woman works for a wealthy urban family and falls in love with the family’s son.",
    category: "directed-by-owas",
    alsoClassifiedAs: ["requires-verification"],
    director: ["Owas Ray Mwape"],
    productionCompany: "Zambezi Magic / MultiChoice",
    oramRole:
      "Director credit established in public network materials. Classified as Directed by Owas Ray Mwape.",
    owasRole: "Director (MultiChoice / Showmax press)",
    broadcaster: "Zambezi Magic",
    streaming: "Showmax",
    client: "Zambezi Magic / MultiChoice",
    cast: [
      "Mwaka Mugala",
      "Sophia Chapeshamano",
      "Sam Sakala",
      "Barbara Maramwidze",
      "Sheba Mwale",
      "Anne Katamanda",
    ],
    trailer: {
      status: "live",
      url: "https://www.youtube.com/watch?v=yz1rA4evuzA",
      note: "Official launch trailer",
    },
    poster: { status: "live", path: "/projects/zuba-billboard.jpg" },
    stills: { status: "live", note: "Cast banner + billboard" },
    bts: { status: "missing", note: "Social coverage exists; cleared gallery thin" },
    logos: { status: "missing" },
    siteSlug: "zuba",
    sitePublished: true,
    recommendAddToSite: false,
    sources: [
      {
        label: "Showmax / Rainbow News Zambia — directed by Owas Ray Mwape",
        url: "https://rainbownewszambia.com/archives/13073",
      },
      {
        label: "MultiChoice Studios — six seasons strong",
        url: "https://www.multichoicestudios.com/news/zuba-six-seasons-strong-96",
      },
      {
        label: "Wikipedia — Zuba (TV Series) — cross-check only",
        url: "https://en.wikipedia.org/wiki/Zuba_(TV_Series)",
      },
    ],
    conflicts: [
      "1,500+ episode claims (Wikipedia) — NOT published as site fact until MultiChoice confirms",
      "Premiere year variously 2017 (Wikipedia) vs 2018 (some press) — use 2017–2025 run with caution",
    ],
  },
  {
    id: "graft",
    title: "Graft",
    year: 2024,
    kind: "feature",
    genre: "Drama",
    status: "released",
    synopsis: "Poster tagline: When Corruption Sinks Everyone.",
    category: "oram-co-production",
    alsoClassifiedAs: ["directed-by-owas", "produced-by-owas"],
    director: ["Owas Ray Mwape"],
    producer: ["Owas Ray Mwape"],
    productionCompany:
      "Oram Media Works · Owas Films · Oram Film Training Academy",
    oramRole:
      "Billed as Oram Media Works / Oram Film Training Academy with Owas Films — co-production / group banner on official poster.",
    owasRole: "Director · Producer",
    cast: ["Kangwa Chileshe", "Sophie Mbao"],
    trailer: {
      status: "missing",
      note: "Facebook BTS only — not a cut trailer",
      url: "https://www.facebook.com/oramtv/posts/life-on-set-️owas-ray-mwape-film-director-alfred-njovu-graft-orammedia-oramtv/1721962718165889/",
    },
    poster: { status: "live", path: "/projects/graft-poster-hd.jpg" },
    stills: { status: "missing" },
    bts: { status: "unofficial", note: "Oram TV Facebook life-on-set" },
    logos: { status: "vault", note: "On poster billing" },
    siteSlug: "graft",
    sitePublished: true,
    recommendAddToSite: false,
    sources: [
      {
        label: "IMDbPro — Graft",
        url: "https://pro.imdb.com/title/tt31797916/",
      },
      { label: "Official Graft poster (ORAM archive)" },
    ],
  },
  {
    id: "look-in-the-mirror",
    title: "Look in the Mirror",
    year: 2024,
    kind: "feature",
    genre: "Drama",
    status: "released",
    category: "oram-co-production",
    alsoClassifiedAs: ["directed-by-owas"],
    director: ["Owas Ray Mwape"],
    writer: ["Chris Mukuli"],
    productionCompany: "Oram Media Dynamics in association with Owas Films",
    oramRole:
      "Production credit on official poster: Oram Media Dynamics in association with Owas Films.",
    owasRole: "Director · Cast",
    cast: ["Owas Ray Mwape", "Mutinta Mari"],
    crew: ["Maxwell Mwape (DoP)"],
    trailer: {
      status: "live",
      url: "https://www.youtube.com/watch?v=NBg0Q-TqNf8",
      note: "Confirm official channel",
    },
    poster: {
      status: "live",
      path: "/projects/look-in-the-mirror-poster.jpg",
    },
    stills: {
      status: "live",
      note: "/projects/look-in-the-mirror-film.jpg",
    },
    bts: { status: "missing" },
    logos: { status: "vault" },
    siteSlug: "look-in-the-mirror",
    sitePublished: true,
    recommendAddToSite: false,
    sources: [
      { label: "Official poster (ORAM archive)" },
      {
        label: "News Diggers — premiere promotion / writer Chris Mukuli",
        url: "https://diggers.news/lifestyle/2024/09/21/i-want-to-compete-mentality-makes-it-hard-to-help-upcoming-filmmakers-owas/",
      },
      {
        label: "Kinorium — Look in the Mirror (2024)",
        url: "https://en.kinorium.com/11983063/",
      },
    ],
    conflicts: [
      "Poster date Sept 28 vs reported Lusaka premiere 5 Oct 2024",
      "Kinorium lists Owas Crystal Films / Tylenol Studios — poster ORAM credit preferred for site; note conflict",
      "Kinorium also lists a 2017 Look in the Mirror — distinct listing; do not conflate without verification",
    ],
  },
  {
    id: "pa-maliketi",
    title: "Pa Maliketi",
    year: 2023,
    yearNote: "S2 announced Apr 2025 (MultiChoice Zambia)",
    kind: "tv-series",
    genre: "Comedy",
    status: "ongoing",
    synopsis:
      "Mwansa inherits her mother’s stand at Fyakubantu market.",
    category: "directed-by-owas",
    alsoClassifiedAs: ["requires-verification"],
    director: ["Owas Ray Mwape"],
    productionCompany: "Zambezi Magic (Kinorium listing)",
    oramRole:
      "Director credit established in public materials. Classified as Directed by Owas Ray Mwape.",
    owasRole: "Director (Kinorium)",
    broadcaster: "Zambezi Magic (DStv 162)",
    client: "Zambezi Magic / MultiChoice",
    cast: [
      "Elizabeth Chisela",
      "Philomena Nyirenda",
      "Robert Nyirenda",
      "Taonga Phiri",
      "Innocent Tembo",
    ],
    trailer: {
      status: "live",
      url: "https://www.dstv.com/zambezimagic/en-za/video/this-week-pa-maliketi",
      note: "Broadcaster promo — not a cut trailer file",
    },
    poster: { status: "live", path: "/projects/pa-maliketi-cover.jpg" },
    stills: { status: "partial", note: "Key art only" },
    bts: { status: "missing" },
    logos: { status: "vault" },
    siteSlug: "pa-maliketi",
    sitePublished: true,
    recommendAddToSite: false,
    sources: [
      {
        label: "DStv / Zambezi Magic promo",
        url: "https://www.dstv.com/zambezimagic/en-za/video/this-week-pa-maliketi",
      },
      {
        label: "Kinorium — Pa Maliketi",
        url: "https://en.kinorium.com/11584311/",
      },
      {
        label: "Zambian Business Times — S2 slate",
        url: "https://zambianbusinesstimes.com/multichoice-zambia-unveils-new-local-content-lineup-across-its-power-of-three-platforms/",
      },
    ],
  },
  {
    id: "hang",
    title: "Hang!",
    alternativeTitles: ["hang! A Cry of an Artist"],
    year: 2018,
    kind: "feature",
    genre: "Comedy / Drama",
    status: "released",
    synopsis:
      "An unemployed artist creates a media storm when he threatens to hang himself on disputed land.",
    category: "oram-co-production",
    alsoClassifiedAs: ["directed-by-owas"],
    director: ["Owas Ray Mwape"],
    producer: ["Adorah Mwape"],
    executiveProducer: ["ORAM.EXP.MARKETING LTD"],
    writer: ["Owas Ray Mwape", "Adorah Mwape"],
    productionCompany: "Owas Films · Owas Crystal Films · Old Age Productions",
    oramRole: "Executive Producer — ORAM.EXP.MARKETING LTD (official poster)",
    owasRole: "Director · Co-writer",
    cast: [
      "Maxwell Mwape",
      "Evans Nkoya",
      "Adorah Mwape",
      "Philomena Nyirenda",
    ],
    crew: ["Macrony Kasitu (DoP)"],
    trailer: { status: "missing" },
    poster: { status: "live", path: "/projects/hang-poster.jpg" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "vault" },
    siteSlug: "hang",
    sitePublished: true,
    recommendAddToSite: false,
    sources: [
      {
        label: "IMDbPro — Hang!",
        url: "https://pro.imdb.com/title/tt22114760/",
      },
      { label: "Official Hang! poster (ORAM archive)" },
    ],
  },
  {
    id: "girls-to-ladies",
    title: "Girls to Ladies",
    alternativeTitles: ["Girls 2 Ladies"],
    year: 2020,
    yearNote: "Year from secondary profiles — not on poster",
    kind: "feature",
    genre: "Drama",
    status: "released",
    category: "personal-filmography",
    alsoClassifiedAs: ["directed-by-owas", "executive-produced-by-owas"],
    director: ["Owas Ray Mwape"],
    executiveProducer: ["Adorah Mwape", "Owas Ray Mwape"],
    writer: ["Ivory van der Boom"],
    productionCompany: "Owas Films Productions · Old Age Pictures",
    oramRole:
      "No ORAM Media Dynamics company credit on poster — classified as personal / Owas Films.",
    owasRole: "Director · Executive Producer · Cast",
    cast: ["Sophie Mbao", "Taonga Phiri", "Owas Ray Mwape"],
    crew: ["Maxwell Mwape (DoP)"],
    trailer: { status: "missing" },
    poster: {
      status: "live",
      path: "/projects/girls-to-ladies-poster.jpg",
      note: "Low resolution — replace with master",
    },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "vault" },
    siteSlug: "girls-to-ladies",
    sitePublished: true,
    recommendAddToSite: false,
    sources: [{ label: "Official Girls 2 Ladies poster (ORAM archive)" }],
    conflicts: [
      "Release year 2020 not printed on poster",
      "Do not list as ORAM production without company billing proof",
    ],
  },
  {
    id: "secrets-untold",
    title: "Secrets Untold",
    alternativeTitles: ["Secrets Untold: The Wife 2"],
    year: 2015,
    kind: "feature",
    genre: "Drama",
    status: "released",
    category: "oram-co-production",
    alsoClassifiedAs: ["directed-by-owas"],
    director: ["Owas Ray Mwape"],
    writer: ["Owas Ray Mwape", "Ivory van der Boom (screenplay)"],
    executiveProducer: ["ORAM"],
    productionCompany:
      "Owas Crystal Films · Old Age Productions · X-Konvict Pictures",
    oramRole: "Executive Producer (poster billing: ORAM)",
    owasRole: "Director · Writer · Cast",
    cast: [
      "Owas Ray Mwape",
      "Cassie Kabwita",
      "Catherine Soko",
      "Adorah Mwape",
    ],
    trailer: { status: "missing" },
    poster: { status: "live", path: "/projects/secrets-untold-poster.jpg" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "vault" },
    siteSlug: "secrets-untold",
    sitePublished: true,
    recommendAddToSite: false,
    sources: [
      {
        label: "Lusaka Times — premiere",
        url: "https://www.lusakatimes.com/2015/11/17/owas-premieres-secrets-untold/",
      },
      { label: "Official Secrets Untold poster (ORAM archive)" },
    ],
    conflicts: [
      "Premiere date Kinorium 30 Oct 2015 vs Lusaka Times 17 Nov 2015 coverage",
    ],
  },
  {
    id: "the-wife",
    title: "The Wife",
    year: 2013,
    yearNote: "~2013 founding era",
    kind: "feature",
    genre: "Drama",
    status: "released",
    synopsis: "Poster tagline: For better, for worse…",
    category: "personal-filmography",
    alsoClassifiedAs: ["directed-by-owas", "executive-produced-by-owas"],
    director: ["Owas Ray Mwape"],
    executiveProducer: ["Owas Ray Mwape"],
    productionCompany: "Owas Films · Old Age Productions · Maynarj Films",
    oramRole:
      "No ORAM Media Dynamics branding on poster — personal / Owas Films era. Do not claim as ORAM production.",
    owasRole: "Director · Executive Producer · Cast",
    cast: [
      "Meyer Nyirenda",
      "Owas Ray Mwape",
      "Webster Chiluba",
      "Adora Mwape",
      "Charles Simusokwe",
      "Mwelwa Muswema",
    ],
    crew: ["Maynard Muchangwe (DoC)", "Jeff Simeja (Sound)"],
    trailer: { status: "missing" },
    poster: { status: "live", path: "/projects/the-wife-poster.jpg" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "vault" },
    siteSlug: "the-wife",
    sitePublished: true,
    recommendAddToSite: false,
    sources: [
      { label: "Official The Wife poster (ORAM vault)" },
      {
        label: "Kinorium — The Wife (2013)",
        url: "https://en.kinorium.com/name/2359357/",
      },
    ],
  },

  // ─── HELD / MISSING MEDIA ────────────────────────────────────────
  {
    id: "strictly-by-invitation",
    title: "Strictly By Invitation",
    year: 2016,
    kind: "feature",
    genre: "Thriller / Drama",
    status: "released",
    category: "personal-filmography",
    alsoClassifiedAs: ["directed-by-owas"],
    director: ["Owas Ray Mwape", "Robam Mwape"],
    producer: ["Adorah Mwape"],
    writer: ["Robam Mwape"],
    productionCompany: "Owas Crystal Films / Old Age Productions",
    oramRole:
      "No verified ORAM Media Dynamics company credit — personal / family Owas Crystal Films production.",
    owasRole: "Co-director · Cast",
    trailer: { status: "missing" },
    poster: {
      status: "missing",
      note: "Prior mislabeled ZAFTA photo removed — HOLD publish",
    },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    siteSlug: "strictly-by-invitation",
    sitePublished: false,
    recommendAddToSite: true,
    researchNotes: "Publish only after honest key art cleared.",
    sources: [
      {
        label: "Lusaka Times",
        url: "https://www.lusakatimes.com/2016/07/20/mwape-family-stars-strictly-invitation/",
      },
      {
        label: "IMDbPro",
        url: "https://pro.imdb.com/title/tt22087442/",
      },
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },

  // ─── ORAM SERVICE / BRANDED ──────────────────────────────────────
  {
    id: "youth-expo-2023",
    title: "Youth Expo 2023 / Umuntuni Youth Week",
    year: 2023,
    kind: "event",
    status: "released",
    category: "oram-service",
    oramRole: "Client production — Oram TV Facebook names MoYSA as client",
    owasRole: "Not established as director from public post alone",
    client: "Ministry of Youth, Sport and Arts",
    trailer: {
      status: "live",
      url: "https://www.facebook.com/oramtv/videos/oram-media-dynamics-client-ministry-of-youth-sport-and-arts-youthexpo2023umuntun/747038756815619/",
    },
    poster: { status: "missing", note: "Logo-only assets rejected" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: true,
    researchNotes: "Needs honest event photography before case study.",
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
    status: "released",
    category: "requires-verification",
    alsoClassifiedAs: ["oram-service"],
    oramRole:
      "Oram Media Group documented inaugural programme",
    owasRole: "Named in Oram TV coverage",
    trailer: { status: "missing" },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Oram TV Facebook",
        url: "https://www.facebook.com/oramtv/posts/the-oram-media-group-partners-at-the-inaugural-of-zambia-india-skills-transfer-w/1690059708022857/",
      },
    ],
    conflicts: [
      "Distinct from 2022 Salesian/Enso India training — do not conflate",
    ],
  },

  // ─── OWAS PERSONAL / DIRECTED — NOT AUTOMATICALLY ORAM ───────────
  {
    id: "chenda",
    title: "Chenda",
    year: 2015,
    yearNote: "Cinema premiere cited Nov 2014 in promo; Wikipedia 2015",
    kind: "feature",
    genre: "Drama",
    status: "released",
    synopsis:
      "Domestic drama of fidelity and loyalty; among first Zambian films aired on Zambezi Magic (academic source).",
    category: "personal-filmography",
    alsoClassifiedAs: ["directed-by-owas"],
    director: ["Owas Ray Mwape"],
    productionCompany: "Owas Crystal Films · Old Age Pictures · Crystal Studios",
    oramRole: "No verified ORAM Media Dynamics company credit — Owas Crystal Films.",
    owasRole: "Director · Cast (Emmit)",
    cast: [
      "Flora Suya",
      "Mingeli Palata",
      "Owas Ray Mwape",
      "Dambisa",
      "Catherine Soko",
      "Adora",
    ],
    trailer: {
      status: "unofficial",
      note: "Zambian Music Blog hosted Owas Crystal Films trailer — verify rights before embed",
    },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: true,
    researchNotes:
      "Strong personal filmography candidate. Add when poster/stills cleared. Do NOT file as ORAM production.",
    sources: [
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
      {
        label: "Zambian Music Blog — Chenda trailer",
        url: "https://zambianmusicblog.co/video-owas-crystal-films-chenda-trailer/",
      },
      {
        label: "Duke UP chapter — Zambezi Magic / Chenda (academic)",
        url: "https://doi.org/10.1515/9781478094173-007",
      },
    ],
  },
  {
    id: "vindanda",
    title: "Vindanda",
    year: 2019,
    kind: "feature",
    genre: "Drama",
    status: "released",
    category: "personal-filmography",
    alsoClassifiedAs: [
      "directed-by-owas",
      "executive-produced-by-owas",
    ],
    director: ["Owas Ray Mwape"],
    executiveProducer: ["Owas Ray Mwape"],
    writer: ["Owas Ray Mwape"],
    oramRole: "No ORAM company credit verified — personal filmography.",
    owasRole: "Director · Writer · Executive Producer · Cast (Mwiche)",
    trailer: { status: "missing" },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: true,
    sources: [
      {
        label: "IMDb — Girls to Ladies / Vindanda known-for",
        url: "https://www.imdb.com/name/nm4145704/",
      },
      {
        label: "Kinorium — Owas Ray Mwape",
        url: "https://en.kinorium.com/name/2359357/",
      },
    ],
  },
  {
    id: "a-wife-from-above",
    title: "A Wife from Above",
    year: 2017,
    kind: "feature",
    genre: "Drama",
    status: "released",
    category: "requires-verification",
    alsoClassifiedAs: ["directed-by-owas", "personal-filmography"],
    director: ["Owas Ray Mwape"],
    productionCompany: "Owas Crystal Films (Kinorium related)",
    oramRole: "Not established — do not claim ORAM production.",
    owasRole: "Director (Kinorium)",
    trailer: {
      status: "unofficial",
      url: "https://www.youtube.com/watch?v=WJ62LAQbfWc",
      note: "Do not embed until channel ownership confirmed — distinct from The Wife",
    },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Kinorium — A Wife from Above",
        url: "https://en.kinorium.com/name/2359357/",
      },
    ],
    conflicts: ["Must not be confused with The Wife (~2013)"],
  },
  {
    id: "ministers-house",
    title: "Minister’s House",
    year: 2014,
    kind: "feature",
    genre: "Comedy",
    status: "released",
    category: "personal-filmography",
    alsoClassifiedAs: ["directed-by-owas", "acting-credit-only"],
    director: ["Owas Ray Mwape"],
    oramRole: "No ORAM company credit verified.",
    owasRole: "Director · Cast (Jonathan Banda)",
    cast: ["Owas Ray Mwape"],
    trailer: { status: "missing" },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: true,
    sources: [
      {
        label: "Kinorium — Minister’s House",
        url: "https://en.kinorium.com/name/2359357/",
      },
    ],
  },
  {
    id: "the-flask",
    title: "The Flask",
    year: 2024,
    kind: "feature",
    genre: "Drama",
    status: "released",
    category: "executive-produced-by-owas",
    alsoClassifiedAs: ["personal-filmography", "requires-verification"],
    director: ["Maxwell Mwape"],
    executiveProducer: ["Owas Ray Mwape"],
    oramRole:
      "Vault poster on file — not claimed as an ORAM Media Dynamics company production.",
    owasRole: "Executive Producer (Kinorium) · possibly cast",
    trailer: { status: "missing" },
    poster: {
      status: "vault",
      path: "/media/archive/the-flask-poster.jpg",
    },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Kinorium — The Flask",
        url: "https://en.kinorium.com/name/2359357/",
      },
      { label: "ORAM vault — The Flask.jpg" },
    ],
  },
  {
    id: "look-in-the-mirror-2017",
    title: "Look in the Mirror (2017 listing)",
    year: 2017,
    kind: "feature",
    genre: "Drama",
    status: "unknown",
    category: "requires-verification",
    director: ["Owas Ray Mwape"],
    oramRole: "Unknown — may be earlier cut / alternate listing vs 2024 feature.",
    owasRole: "Director (Kinorium) · Actor (Kinorium)",
    trailer: { status: "missing" },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    conflicts: [
      "Kinorium lists both 2017 and 2024 Look in the Mirror — verify whether remake, re-release, or duplicate",
    ],
    sources: [
      {
        label: "Kinorium filmography",
        url: "https://en.kinorium.com/name/2359357/",
      },
    ],
  },

  // ─── ACTING CREDITS ONLY ─────────────────────────────────────────
  {
    id: "suwi",
    title: "Suwi",
    year: 2010,
    kind: "feature",
    genre: "Drama",
    runtime: "78 min",
    status: "released",
    category: "acting-credit-only",
    oramRole: "None — not an ORAM production.",
    owasRole: "Actor — Dr. Chimba",
    trailer: { status: "n/a" },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
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
    genre: "Short / Adventure / Drama",
    runtime: "23 min",
    status: "released",
    category: "acting-credit-only",
    alsoClassifiedAs: ["requires-verification"],
    director: ["Rungano Nyoni"],
    writer: ["Owas Ray Mwape (writer credit on Wikipedia)"],
    oramRole: "None as production company.",
    owasRole: "Actor · Writer",
    trailer: { status: "n/a" },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
      {
        label: "Kinorium — Mwansa the Great",
        url: "https://en.kinorium.com/name/2359357/",
      },
    ],
  },
  {
    id: "africa-first-volume-two",
    title: "Africa First: Volume Two",
    year: 2012,
    kind: "other",
    status: "released",
    category: "acting-credit-only",
    oramRole: "None",
    owasRole: "Actor — Mwansa (adult), segment Mwansa the Great",
    trailer: { status: "n/a" },
    poster: { status: "n/a" },
    stills: { status: "n/a" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia / Kinorium",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "kabanana",
    title: "Kabanana",
    yearNote: "2004–2008 primary run; Wikipedia also lists 2015",
    kind: "tv-series",
    status: "concluded",
    category: "acting-credit-only",
    oramRole: "None",
    owasRole: "Actor — Chembo",
    trailer: { status: "n/a" },
    poster: { status: "n/a" },
    stills: { status: "n/a" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
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
    genre: "Drama",
    status: "released",
    category: "acting-credit-only",
    oramRole: "None",
    owasRole: "Actor — Marlon",
    trailer: { status: "n/a" },
    poster: { status: "n/a" },
    stills: { status: "n/a" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "husband-4-rent",
    title: "Husband 4 Rent",
    year: 2019,
    kind: "feature",
    genre: "Comedy",
    status: "released",
    category: "acting-credit-only",
    director: ["Adora Mwape"],
    oramRole: "None verified",
    owasRole: "Actor (Kinorium)",
    trailer: { status: "missing" },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Kinorium",
        url: "https://en.kinorium.com/name/2359357/",
      },
    ],
  },
  {
    id: "shawa",
    title: "Shawa",
    year: 2019,
    kind: "feature",
    genre: "Drama",
    status: "released",
    category: "acting-credit-only",
    director: ["Maxwell Mwape"],
    oramRole: "None verified",
    owasRole: "Actor (Kinorium)",
    trailer: { status: "missing" },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Kinorium",
        url: "https://en.kinorium.com/name/2359357/",
      },
    ],
  },
  {
    id: "kwacha",
    title: "Kwacha",
    year: 2016,
    kind: "feature",
    genre: "Drama",
    runtime: "111 min",
    status: "released",
    category: "acting-credit-only",
    director: ["Maynard Muchangwe"],
    oramRole: "None verified",
    owasRole: "Actor (Kinorium)",
    trailer: { status: "missing" },
    poster: { status: "missing" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Kinorium",
        url: "https://en.kinorium.com/name/2359357/",
      },
    ],
  },
  {
    id: "a-beautiful-lie",
    title: "A Beautiful Lie",
    year: 2014,
    kind: "feature",
    genre: "Drama",
    status: "released",
    category: "acting-credit-only",
    director: ["Mingeli Palata"],
    oramRole: "None",
    owasRole: "Actor",
    trailer: { status: "n/a" },
    poster: { status: "missing" },
    stills: { status: "n/a" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia / Kinorium",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "red-bag",
    title: "Red Bag",
    alternativeTitles: ["Redbag"],
    year: 2014,
    kind: "feature",
    genre: "Action / Comedy",
    runtime: "127 min",
    status: "released",
    category: "acting-credit-only",
    director: ["Frank Sibukku"],
    oramRole: "None",
    owasRole: "Actor",
    trailer: { status: "n/a" },
    poster: { status: "missing" },
    stills: { status: "n/a" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia / Kinorium",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "justice-at-stake",
    title: "Justice at Stake",
    year: 2012,
    kind: "feature",
    genre: "Drama",
    status: "released",
    category: "acting-credit-only",
    director: ["Felix C. Muyembi"],
    oramRole: "None",
    owasRole: "Actor",
    trailer: { status: "n/a" },
    poster: { status: "missing" },
    stills: { status: "n/a" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia / Kinorium",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },

  // ─── WIKIPEDIA-NAMED ACTING — THIN PUBLIC RECORD ──────────────────
  {
    id: "the-lawyer",
    title: "The Lawyer",
    kind: "other",
    status: "unknown",
    category: "requires-verification",
    alsoClassifiedAs: ["acting-credit-only"],
    oramRole: "Vault holds The Lawyer key art — acting credit in public profiles.",
    owasRole: "Acting appearance (Wikipedia list)",
    trailer: { status: "missing" },
    poster: { status: "vault", path: "/media/archive/the-lawyer-poster.jpg" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "complicated-affairs",
    title: "Complicated Affairs",
    kind: "other",
    status: "unknown",
    category: "acting-credit-only",
    oramRole: "None",
    owasRole: "Acting appearance (Wikipedia list only — thin record)",
    trailer: { status: "n/a" },
    poster: { status: "missing" },
    stills: { status: "n/a" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "chidongo",
    title: "Chidongo",
    kind: "other",
    status: "unknown",
    category: "acting-credit-only",
    oramRole: "None",
    owasRole: "Acting appearance (Wikipedia list only)",
    trailer: { status: "n/a" },
    poster: { status: "missing" },
    stills: { status: "n/a" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "the-ticket",
    title: "The Ticket",
    kind: "other",
    status: "unknown",
    category: "acting-credit-only",
    oramRole: "None",
    owasRole: "Acting appearance (Wikipedia list only)",
    trailer: { status: "n/a" },
    poster: { status: "missing" },
    stills: { status: "n/a" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },
  {
    id: "guilt",
    title: "Guilt",
    kind: "other",
    status: "unknown",
    category: "acting-credit-only",
    oramRole: "None",
    owasRole: "Acting appearance (Wikipedia list only)",
    trailer: { status: "n/a" },
    poster: { status: "missing" },
    stills: { status: "n/a" },
    bts: { status: "n/a" },
    logos: { status: "n/a" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
  },

  // ─── VAULT-ONLY UNVERIFIED TITLES ────────────────────────────────
  {
    id: "pamodzi",
    title: "Pamodzi",
    kind: "other",
    status: "unknown",
    category: "requires-verification",
    oramRole: "Vault cover only — credits unknown",
    owasRole: "Unknown",
    trailer: { status: "missing" },
    poster: { status: "vault", path: "/media/archive/pamodzi-cover.jpg" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [{ label: "ORAM vault — Pamodzi Cover.jpg" }],
  },
  {
    id: "chokolo",
    title: "Chokolo",
    kind: "other",
    status: "unknown",
    category: "requires-verification",
    oramRole: "Vault cover only — credits unknown",
    owasRole: "Unknown",
    trailer: { status: "missing" },
    poster: { status: "vault", path: "/media/archive/chokolo-cover.jpg" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [{ label: "ORAM vault — Chokolo Cover.jpg" }],
  },
  {
    id: "the-light",
    title: "The Light",
    kind: "other",
    status: "unknown",
    category: "requires-verification",
    oramRole: "Vault poster only — credits unknown",
    owasRole: "Unknown",
    trailer: { status: "missing" },
    poster: { status: "vault", path: "/media/archive/the-light-poster.jpg" },
    stills: { status: "missing" },
    bts: { status: "missing" },
    logos: { status: "missing" },
    sitePublished: false,
    recommendAddToSite: false,
    sources: [{ label: "ORAM vault — The Light.jpg" }],
  },
];

// ─── Aggregators ───────────────────────────────────────────────────

export function byCategory(cat: ArchivalCategory) {
  return archivalTitles.filter((t) => t.category === cat);
}

export function oramPortfolioTitles() {
  return archivalTitles.filter((t) =>
    ["oram-production", "oram-co-production", "oram-service"].includes(
      t.category,
    ),
  );
}

export function owasPersonalFilmography() {
  return archivalTitles.filter(
    (t) =>
      t.category === "personal-filmography" ||
      t.category === "directed-by-owas" ||
      t.category === "produced-by-owas" ||
      t.category === "executive-produced-by-owas" ||
      t.alsoClassifiedAs?.includes("personal-filmography") ||
      t.alsoClassifiedAs?.includes("directed-by-owas"),
  );
}

export function actingCreditsOnly() {
  return archivalTitles.filter((t) => t.category === "acting-credit-only");
}

export function missingProductionsToAdd() {
  return archivalTitles.filter((t) => t.recommendAddToSite && !t.sitePublished);
}

export function mediaGaps(field: "trailer" | "poster" | "stills" | "bts" | "logos") {
  return archivalTitles.filter((t) => {
    const m = t[field];
    return m && (m.status === "missing" || m.status === "unofficial");
  });
}

export function verificationRegister() {
  return archivalTitles.filter(
    (t) =>
      t.category === "requires-verification" ||
      t.alsoClassifiedAs?.includes("requires-verification") ||
      (t.conflicts && t.conflicts.length > 0),
  );
}

export function computeArchiveCompleteness() {
  const scored = archivalTitles.filter(
    (t) =>
      t.category !== "acting-credit-only" ||
      t.recommendAddToSite ||
      t.sitePublished,
  );
  // Score narrative/production titles more heavily than thin acting lists
  const productionLike = archivalTitles.filter(
    (t) =>
      ![
        "acting-credit-only",
      ].includes(t.category) || t.sitePublished,
  );

  let points = 0;
  let max = 0;
  for (const t of productionLike) {
    const dims = [
      Boolean(t.synopsis || t.year),
      Boolean(t.director?.length),
      t.poster?.status === "live" || t.poster?.status === "vault",
      t.trailer?.status === "live",
      t.bts?.status === "live",
      t.stills?.status === "live",
      Boolean(t.cast?.length),
      t.sitePublished || !t.recommendAddToSite,
      t.category !== "requires-verification",
      Boolean(t.sources.length),
    ];
    max += dims.length;
    points += dims.filter(Boolean).length;
  }

  const pct = max === 0 ? 0 : Math.round((points / max) * 100);
  return {
    percent: pct,
    points,
    max,
    titleCount: archivalTitles.length,
    productionLikeCount: productionLike.length,
    scoredCount: scored.length,
  };
}

export function getArchivalTitle(id: string) {
  return archivalTitles.find((t) => t.id === id || t.siteSlug === id);
}
