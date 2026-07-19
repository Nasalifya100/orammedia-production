/**
 * ORAM Media Dynamics — Master Digital Archive Register
 * Missions 7–10: facts, media, recommendations, completeness.
 * Verification date: 2026-07-17
 * Do not fabricate. Conflicts → REQUIRES VERIFICATION.
 */

export type Confidence = "high" | "medium" | "low" | "conflict";
export type PublishRecommendation =
  | "Published"
  | "Publish-ready"
  | "Vault Only"
  | "Archive Only"
  | "Private"
  | "Acting credit only";

export interface FactRegisterEntry {
  id: string;
  projectId: string;
  fact: string;
  source: string;
  sourceUrl?: string;
  verificationDate: string;
  confidence: Confidence;
  rightsStatus: "public-record" | "oram-cleared" | "broadcaster" | "requires-clearance";
}

export interface AssetCrossRef {
  id: string;
  projectId: string;
  vaultPath: string;
  publicPath?: string;
  role: string;
  owner: string;
  resolution: string;
  rights: string;
  approval: string;
  recommendation: "keep-archive" | "promote-to-public" | "replace-public" | "do-not-use" | "already-live";
  notes?: string;
}

export interface MissingProjectRec {
  title: string;
  evidence: string;
  recommendation: PublishRecommendation;
  blocker: string;
}

export const ARCHIVE_VERIFICATION_DATE = "2026-07-17";

/**
 * Completeness refreshed by Chief Archivist pass (archival-classification.ts).
 * Sole ORAM productions verified: 0 · Co-productions: 4 · Directed-by-Owas network: 3
 */
export const ARCHIVE_COMPLETENESS_PCT = 55;

/** Core fact register — every published claim should map here */
export const factRegister: FactRegisterEntry[] = [
  {
    id: "inkondo-premiere",
    projectId: "inkondo",
    fact: "Inkondo premiered 5 May 2025 at 20:00 CAT on Zambezi Magic",
    source: "MultiChoice Zambia showcase / Zambezi Magic announcement",
    sourceUrl:
      "https://zambianbusinesstimes.com/multichoice-zambia-unveils-new-local-content-lineup-across-its-power-of-three-platforms/",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "public-record",
  },
  {
    id: "inkondo-synopsis",
    projectId: "inkondo",
    fact: "Forbidden love between children of rival families (Nampindi / Dimuna)",
    source: "Zambezi Magic / MultiChoice Studios show pages",
    sourceUrl: "https://www.dstv.com/zambezimagic/en-mu/show/inkondo",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "broadcaster",
  },
  {
    id: "zuba-first-telenovela",
    projectId: "zuba",
    fact: "Described by MultiChoice Studios as Zambia’s first telenovela; directed by Owas Ray Mwape",
    source: "MultiChoice Studios news",
    sourceUrl: "https://www.multichoicestudios.com/news/zuba-six-seasons-strong-96",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "broadcaster",
  },
  {
    id: "zuba-seasons",
    projectId: "zuba",
    fact: "Showmax lists 8 seasons",
    source: "Showmax series page",
    sourceUrl:
      "https://www.showmax.com/et/stream/series/zuba/b3785e05-c758-3ae8-84c3-194d91cbd0b9/seasons/1",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "broadcaster",
  },
  {
    id: "zuba-episodes-conflict",
    projectId: "zuba",
    fact: "Secondary sources report 1,500+ episodes — NOT published as site fact",
    source: "Wikipedia / press summaries",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "conflict",
    rightsStatus: "public-record",
  },
  {
    id: "hang-plot",
    projectId: "hang",
    fact: "Unemployed artist threatens to hang himself on disputed land; media storm",
    source: "IMDbPro",
    sourceUrl: "https://pro.imdb.com/title/tt22114760/",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "public-record",
  },
  {
    id: "hang-ep-oram",
    projectId: "hang",
    fact: "Executive Producer on official poster: ORAM.EXP.MARKETING LTD",
    source: "Official Hang! poster (ORAM vault)",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "oram-cleared",
  },
  {
    id: "wife-credits-poster",
    projectId: "the-wife",
    fact: "Director & EP Owas Ray Mwape; Owas Films / Old Age / Maynarj Films; cast Meyer Nyirenda, Webster Chiluba, Adora Mwape et al.",
    source: "Official The Wife poster (ORAM vault)",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "oram-cleared",
  },
  {
    id: "wife-year",
    projectId: "the-wife",
    fact: "Year commonly cited as 2013 (Owas Films founding era) — premiere date not on poster",
    source: "Wikipedia / industry bios",
    sourceUrl: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "medium",
    rightsStatus: "public-record",
  },
  {
    id: "litm-date-conflict",
    projectId: "look-in-the-mirror",
    fact: "Poster lists September 28; press reports cite 5 October 2024 Lusaka premiere",
    source: "Poster vs secondary premiere reports",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "conflict",
    rightsStatus: "oram-cleared",
  },
  {
    id: "secrets-ster-kinekor",
    projectId: "secrets-untold",
    fact: "Ster Kinekor Lusaka premiere covered by Lusaka Times (Nov 2015)",
    source: "Lusaka Times",
    sourceUrl: "https://www.lusakatimes.com/2015/11/17/owas-premieres-secrets-untold/",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "public-record",
  },
  {
    id: "pa-maliketi-s2",
    projectId: "pa-maliketi",
    fact: "Pa Maliketi Season 2 cited for 24 April 2025 in MultiChoice Zambia slate",
    source: "Zambian Business Times / MultiChoice showcase",
    sourceUrl:
      "https://zambianbusinesstimes.com/multichoice-zambia-unveils-new-local-content-lineup-across-its-power-of-three-platforms/",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "public-record",
  },
  {
    id: "strictly-premiere",
    projectId: "strictly-by-invitation",
    fact: "Ster Kinekor Arcades premiere 28 July 2016",
    source: "Lusaka Times",
    sourceUrl:
      "https://www.lusakatimes.com/2016/07/20/mwape-family-stars-strictly-invitation/",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "public-record",
  },
  {
    id: "owas-best-actor",
    projectId: "studio",
    fact: "National Best Actor awards 1990, 1991, 1992",
    source: "Wikipedia — Owas Ray Mwape",
    sourceUrl: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
    verificationDate: ARCHIVE_VERIFICATION_DATE,
    confidence: "high",
    rightsStatus: "public-record",
  },
];

/** Vault ↔ public asset cross-reference */
export const assetCrossRef: AssetCrossRef[] = [
  {
    id: "inkondo-billboard",
    projectId: "inkondo",
    vaultPath: "public/projects/inkondo-billboard.jpg",
    publicPath: "/projects/inkondo-billboard.jpg",
    role: "Key art / CTA / thumb",
    owner: "Zambezi Magic / MultiChoice · ORAM archive",
    resolution: "2048×682",
    rights: "ORAM cleared for site",
    approval: "ORAM confirmed project media",
    recommendation: "already-live",
  },
  {
    id: "inkondo-bts-s2",
    projectId: "inkondo",
    vaultPath: "Inkondo Shoot S2.jpg",
    publicPath: "/media/bts/inkondo-shoot-s2.jpg",
    role: "Hero / BTS gallery",
    owner: "ORAM Media Dynamics",
    resolution: "2048×1536",
    rights: "ORAM owned",
    approval: "ORAM confirmed",
    recommendation: "already-live",
  },
  {
    id: "hang-poster",
    projectId: "hang",
    vaultPath: "Hang.jpg",
    publicPath: "/projects/hang-poster.jpg",
    role: "Poster",
    owner: "Owas Crystal / Old Age · EP ORAM",
    resolution: "Vault export (moderate compression)",
    rights: "ORAM cleared",
    approval: "ORAM confirmed",
    recommendation: "already-live",
    notes: "Hang 2.jpg is alternate — keep vault; do not duplicate in UI",
  },
  {
    id: "wife-poster",
    projectId: "the-wife",
    vaultPath: "The Wife.jpg",
    publicPath: "/projects/the-wife-poster.jpg",
    role: "Poster",
    owner: "Owas Films / Old Age / Maynarj",
    resolution: "Vault poster",
    rights: "ORAM cleared",
    approval: "ORAM confirmed",
    recommendation: "promote-to-public",
  },
  {
    id: "litm-poster",
    projectId: "look-in-the-mirror",
    vaultPath: "Look in the mirror 2.jpg",
    publicPath: "/projects/look-in-the-mirror-poster.jpg",
    role: "Poster",
    owner: "Oram Media Dynamics / Owas Films",
    resolution: "1638×2048",
    rights: "ORAM cleared",
    approval: "ORAM confirmed",
    recommendation: "already-live",
    notes: "Keep over Leading Men PNG (archived do-not-use)",
  },
  {
    id: "litm-premier-verify",
    projectId: "look-in-the-mirror",
    vaultPath: "Look in the mirror premier.jpg",
    role: "Premiere photography",
    owner: "REQUIRES VERIFICATION of title on backdrop",
    resolution: "Vault still",
    rights: "pending title check",
    approval: "Hold",
    recommendation: "keep-archive",
    notes: "Do not publish until title verified (prior audit: 90K backdrop risk)",
  },
  {
    id: "girls-lowres",
    projectId: "girls-to-ladies",
    vaultPath: "Girls to Ladies.jpg",
    publicPath: "/projects/girls-to-ladies-poster.jpg",
    role: "Poster",
    owner: "Owas Films / Old Age Pictures",
    resolution: "Low — pixelation visible",
    rights: "ORAM cleared",
    approval: "ORAM confirmed",
    recommendation: "replace-public",
    notes: "Seek higher-resolution master from vault/masters",
  },
  {
    id: "pa-maliketi-s1",
    projectId: "pa-maliketi",
    vaultPath: "Pamaliketi S1 Cover.jpg",
    publicPath: "/projects/pa-maliketi-s1-cover.jpg",
    role: "Season 1 key art",
    owner: "Zambezi Magic branded · ORAM archive",
    resolution: "High landscape",
    rights: "ORAM cleared",
    approval: "ORAM confirmed",
    recommendation: "already-live",
    notes: "S2 ‘to be edited’ frames stay vault until finished",
  },
  {
    id: "strictly-mislabeled",
    projectId: "strictly-by-invitation",
    vaultPath: "public/media/archive/strictly-by-invitation-mislabeled-zafta.jpg",
    role: "False poster",
    owner: "ZAFTA event photo",
    resolution: "N/A",
    rights: "do-not-use as Strictly art",
    approval: "Rejected",
    recommendation: "do-not-use",
  },
  {
    id: "flask-vault",
    projectId: "the-flask",
    vaultPath: "The Flask.jpg",
    publicPath: "/media/archive/the-flask-poster.jpg",
    role: "Poster candidate",
    owner: "REQUIRES VERIFICATION",
    resolution: "Vault",
    rights: "ORAM vault hold",
    approval: "Hold pending credits",
    recommendation: "keep-archive",
  },
  {
    id: "pamodzi-vault",
    projectId: "pamodzi",
    vaultPath: "Pamodzi Cover.jpg",
    publicPath: "/media/archive/pamodzi-cover.jpg",
    role: "Cover candidate",
    owner: "REQUIRES VERIFICATION",
    resolution: "Vault",
    rights: "ORAM vault hold",
    approval: "Hold",
    recommendation: "keep-archive",
  },
];

/** Missing / incomplete productions vs website */
export const missingProjectRecs: MissingProjectRec[] = [
  {
    title: "Strictly By Invitation (2016)",
    evidence: "Lusaka Times + IMDbPro; content written; poster missing",
    recommendation: "Publish-ready",
    blocker: "Honest official poster / stills",
  },
  {
    title: "Chenda (2015)",
    evidence: "Wikipedia + Lusaka Times mention; no vault poster found",
    recommendation: "Vault Only",
    blocker: "Poster, synopsis, credits pack",
  },
  {
    title: "Vindanda (2019)",
    evidence: "Secondary bios / Kinorium acting+directing mentions",
    recommendation: "Vault Only",
    blocker: "Official media + ORAM role confirmation",
  },
  {
    title: "A Wife from Above",
    evidence: "Kinorium director credit; YouTube upload exists — channel ownership unconfirmed",
    recommendation: "Archive Only",
    blocker: "Confirm official upload before any embed; locate poster",
  },
  {
    title: "Youth Expo 2023",
    evidence: "Oram TV Facebook client video (MoYSA)",
    recommendation: "Publish-ready",
    blocker: "Event photography (not logos)",
  },
  {
    title: "Zambia–India Skills Transfer",
    evidence: "Oram TV Facebook; distinct from 2022 Salesian training",
    recommendation: "Publish-ready",
    blocker: "Honest stills; commissioning client confirmation",
  },
  {
    title: "The Flask / Pamodzi / Chokolo / The Light / Lilata / Shawa",
    evidence: "Vault key art only",
    recommendation: "Vault Only",
    blocker: "Year, credits, ORAM role, synopsis from primary sources",
  },
  {
    title: "Suwi / Mwansa the Great / Kabanana / Fever",
    evidence: "Acting filmography (Wikipedia)",
    recommendation: "Acting credit only",
    blocker: "Do not list as ORAM productions without production proof",
  },
];

/** Completeness model for Mission 10 */
export const archiveCompleteness = {
  verificationDate: ARCHIVE_VERIFICATION_DATE,
  publishedCaseStudies: 9,
  catalogueTitlesLogged: 28,
  titlesWithOfficialPosterLive: 9,
  titlesWithOfficialTrailerWired: 3,
  titlesWithBtsGallery: 1,
  factRegisterEntries: factRegister.length,
  assetCrossRefs: assetCrossRef.length,
  /** Weighted: posters 30%, credits 20%, synopsis 20%, trailers 15%, BTS 10%, awards 5% */
  estimatedCompletenessPercent: 64,
  readiness: "HOLD" as const,
  readinessNote:
    "Authoritative for published slate; not yet the complete ORAM historical archive until Strictly media, vault titles, and trailers land.",
};
