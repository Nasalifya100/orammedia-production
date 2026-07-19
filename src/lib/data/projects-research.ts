/**
 * Research ledger for ORAM portfolio case studies.
 * Public pages render verified copy only; this file records sources and gaps.
 * Do not invent facts. Mark gaps as NEEDS VERIFICATION.
 */

export type VerificationStatus = "verified" | "needs-verification" | "missing";

export interface ProjectResearchLedger {
  slug: string;
  title: string;
  status: "complete" | "needs-verification" | "media-blocked";
  sources: { label: string; url?: string }[];
  gaps: string[];
  trailers: { status: VerificationStatus; notes: string; url?: string }[];
  media: { posters: string; stills: string; bts: string; logos: string };
}

export const projectResearchLedger: ProjectResearchLedger[] = [
  {
    slug: "inkondo",
    title: "Inkondo",
    status: "complete",
    sources: [
      {
        label: "Zambezi Magic — Inkondo show page",
        url: "https://www.dstv.com/zambezimagic/en-mu/show/inkondo",
      },
      {
        label: "MultiChoice Studios — Inkondo",
        url: "https://www.multichoicestudios.com/show/inkondo",
      },
      {
        label: "MultiChoice Zambia content showcase (Zambian Business Times)",
        url: "https://zambianbusinesstimes.com/multichoice-zambia-unveils-new-local-content-lineup-across-its-power-of-three-platforms/",
      },
      {
        label: "Zambezi Magic premiere announcement (syndicated)",
        url: "https://www.linkedin.com/posts/eliaslmulenga_zambezi-magic-tv-announces-new-gripping-activity-7317827151309758464-sd05",
      },
      { label: "ORAM archive — Inkondo billboard + S2 BTS stills" },
    ],
    gaps: [
      "Full writer / producer credit block — NEEDS VERIFICATION from call sheet or MultiChoice press kit",
      "Exact ORAM Media Dynamics contractual role beyond public creative leadership — NEEDS VERIFICATION",
    ],
    trailers: [
      {
        status: "verified",
        notes: "YouTube embed already wired (site ID SDtK15xguG8) — confirm channel is Zambezi Magic / MultiChoice / ORAM before launch",
        url: "https://www.youtube.com/watch?v=SDtK15xguG8",
      },
    ],
    media: {
      posters: "Archive billboard kept (strongest official key art on disk)",
      stills: "BTS S2 set photography in archive; cast PNG available if rights cleared for web",
      bts: "Strong — shoot-s2 series + lighting crew",
      logos: "Use Zambezi Magic / MultiChoice partner marks already in /partners",
    },
  },
  {
    slug: "zuba",
    title: "Zuba",
    status: "complete",
    sources: [
      {
        label: "MultiChoice Studios — Zuba six seasons strong",
        url: "https://www.multichoicestudios.com/news/zuba-six-seasons-strong-96",
      },
      {
        label: "Showmax — Zuba",
        url: "https://www.showmax.com/et/stream/series/zuba/b3785e05-c758-3ae8-84c3-194d91cbd0b9/seasons/1",
      },
      {
        label: "Wikipedia — Zuba (TV series) — secondary; cross-check only",
        url: "https://en.wikipedia.org/wiki/Zuba_(TV_series)",
      },
      {
        label: "Official Zuba launch trailer (YouTube)",
        url: "https://www.youtube.com/watch?v=yz1rA4evuzA",
      },
      { label: "ORAM archive — zuba.jpg cast banner + farewell billboard" },
    ],
    gaps: [
      "Exact episode total (reports of 1,500+) — NEEDS VERIFICATION from MultiChoice",
      "Full series producer / writer credits — NEEDS VERIFICATION",
      "ORAM company production scope beyond Mwape directing credit — NEEDS VERIFICATION",
    ],
    trailers: [
      {
        status: "verified",
        notes: "Official launch trailer yz1rA4evuzA; site also retains prior preview IDs",
        url: "https://www.youtube.com/watch?v=yz1rA4evuzA",
      },
    ],
    media: {
      posters: "zuba.jpg preferred primary; farewell Zikomo graphic demoted to supporting",
      stills: "Cast square PNG in archive — optional if cleared",
      bts: "Missing dedicated graded unit stills",
      logos: "Zambezi Magic / Showmax / DStv partners on site",
    },
  },
  {
    slug: "graft",
    title: "Graft",
    status: "needs-verification",
    sources: [
      {
        label: "IMDbPro — Graft (2024) credits",
        url: "https://pro.imdb.com/title/tt31797916/",
      },
      { label: "Official Graft theatrical poster (ORAM archive) — billing block" },
      {
        label: "Oram TV — life on Graft set (Facebook)",
        url: "https://www.facebook.com/oramtv/posts/life-on-set-️owas-ray-mwape-film-director-alfred-njovu-graft-orammedia-oramtv/1721962718165889/",
      },
    ],
    gaps: [
      "Official YouTube/Vimeo trailer — MISSING (Facebook set doc is not a trailer)",
      "Full cast beyond Kangwa Chileshe / Sophie Mbao — partial from poster; NEEDS VERIFICATION",
      "Festival selections / awards — MISSING in public record found",
      "Theatrical premiere date/venue — NEEDS VERIFICATION",
    ],
    trailers: [
      {
        status: "missing",
        notes: "Recommend cut from ORAM masters; current Facebook post is BTS only",
        url: "https://www.facebook.com/oramtv/posts/life-on-set-️owas-ray-mwape-film-director-alfred-njovu-graft-orammedia-oramtv/1721962718165889/",
      },
    ],
    media: {
      posters: "graft-poster-hd.jpg kept as single UI master",
      stills: "Missing unit stills (poster collage only)",
      bts: "Facebook documentation exists; no cleared stills in public/ yet",
      logos: "ORAM / Owas Films on poster",
    },
  },
  {
    slug: "look-in-the-mirror",
    title: "Look in the Mirror",
    status: "needs-verification",
    sources: [
      { label: "Official poster — ORAM Media Dynamics / Owas Films billing" },
      {
        label: "Kinorium — Mutinta Marie / Look in the Mirror (2024)",
        url: "https://en.kinorium.com/name/6386268/",
      },
      {
        label: "YouTube trailers wired on site (NBg0Q-TqNf8 / 4HAj6fyKcJg) — confirm official channel ownership",
      },
    ],
    gaps: [
      "Public premiere date conflict: poster lists September 28; press reports cite 5 October 2024 Lusaka — NEEDS VERIFICATION which is release vs premiere night",
      "Full cast beyond Owas Ray Mwape / Mutinta Mari — NEEDS VERIFICATION from premiere programme",
      "Venue (Levy Cinemas reported in secondary coverage) — NEEDS VERIFICATION",
    ],
    trailers: [
      {
        status: "needs-verification",
        notes: "Existing YouTube IDs retained; confirm they are official ORAM / Owas Films uploads",
        url: "https://www.youtube.com/watch?v=NBg0Q-TqNf8",
      },
    ],
    media: {
      posters: "look-in-the-mirror-poster.jpg (archive) — hero quality",
      stills: "Missing cleared production stills",
      bts: "Premiere photography in root vault — verify title before use",
      logos: "ORAM Media Dynamics on poster",
    },
  },
  {
    slug: "secrets-untold",
    title: "Secrets Untold",
    status: "complete",
    sources: [
      {
        label: "Lusaka Times — Owas premieres Secrets Untold",
        url: "https://www.lusakatimes.com/2015/11/17/owas-premieres-secrets-untold/",
      },
      {
        label: "Wikipedia — Owas Ray Mwape (Ster Kinekor premiere note)",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
      { label: "Official poster — Secrets Untold: The Wife 2 (ORAM archive)" },
    ],
    gaps: [
      "Official trailer — MISSING",
      "Awards detail (ZAFTA mentions in secondary sources) — NEEDS VERIFICATION with award programme",
    ],
    trailers: [
      {
        status: "missing",
        notes: "Recommend teaser from ORAM masters; do not use showreel as film trailer",
      },
    ],
    media: {
      posters: "secrets-untold-poster.jpg kept",
      stills: "secrets-untold.png landscape asset on disk — review before gallery use",
      bts: "Missing",
      logos: "Owas Crystal / Old Age / X-Konvict on poster; ORAM as EP on billing",
    },
  },
  {
    slug: "strictly-by-invitation",
    title: "Strictly By Invitation",
    status: "media-blocked",
    sources: [
      {
        label: "Lusaka Times — Mwape family stars in Strictly by Invitation",
        url: "https://www.lusakatimes.com/2016/07/20/mwape-family-stars-strictly-invitation/",
      },
      {
        label: "IMDbPro — Strictly by Invitation (2016)",
        url: "https://pro.imdb.com/title/tt22087442/",
      },
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
    gaps: [
      "Official poster / stills — MISSING in project archive (prior thumb was mislabeled ZAFTA red carpet)",
      "Official trailer — MISSING",
      "Writer credit conflict: Lusaka Times (co-direct Owas+Robam) vs Wikipedia (Robam writer / Adorah producer) — both cited; IMDbPro lists Owas + Robam directors, Adora producer",
    ],
    trailers: [
      {
        status: "missing",
        notes: "Recommend teaser from ORAM masters before publishing project page",
      },
    ],
    media: {
      posters: "MISSING — project unpublished until honest key art is added",
      stills: "MISSING",
      bts: "MISSING",
      logos: "Owas Crystal Films / Old Age Productions per press",
    },
  },
];
