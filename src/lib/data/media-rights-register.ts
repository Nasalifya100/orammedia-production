/**
 * Media rights / source register for assets wired on the public site.
 * ORAM has confirmed permission to publish project media where available.
 */

export type RightsStatus =
  | "oram-owned-or-cleared"
  | "broadcaster-key-art"
  | "partner-logo"
  | "pending-clearance"
  | "do-not-use";

export interface MediaRightsEntry {
  path: string;
  projectSlug?: string;
  role: "hero" | "thumbnail" | "gallery" | "bts" | "poster" | "og" | "brand" | "partner";
  source: string;
  owner: string;
  rights: RightsStatus;
  resolutionNote: string;
  usageApproval: string;
}

export const mediaRightsRegister: MediaRightsEntry[] = [
  {
    path: "/projects/inkondo-billboard.jpg",
    projectSlug: "inkondo",
    role: "poster",
    source: "ORAM / Zambezi Magic key art in project archive",
    owner: "MultiChoice / Zambezi Magic (key art) · ORAM archive hold",
    rights: "oram-owned-or-cleared",
    resolutionNote: "2048×682 landscape",
    usageApproval: "ORAM confirmed project media permission",
  },
  {
    path: "/media/bts/inkondo-shoot-s2.jpg",
    projectSlug: "inkondo",
    role: "bts",
    source: "ORAM set photography — Inkondo S2",
    owner: "ORAM Media Dynamics",
    rights: "oram-owned-or-cleared",
    resolutionNote: "2048×1536",
    usageApproval: "ORAM confirmed",
  },
  {
    path: "/projects/zuba.jpg",
    projectSlug: "zuba",
    role: "poster",
    source: "ORAM archive cast banner",
    owner: "Zambezi Magic / MultiChoice key art · ORAM archive",
    rights: "oram-owned-or-cleared",
    resolutionNote: "1600×533",
    usageApproval: "ORAM confirmed",
  },
  {
    path: "/projects/pa-maliketi-s1-cover.jpg",
    projectSlug: "pa-maliketi",
    role: "poster",
    source: "ORAM vault — Pamaliketi S1 Cover.jpg",
    owner: "Zambezi Magic branded key art · ORAM archive",
    rights: "oram-owned-or-cleared",
    resolutionNote: "Vault cover — high quality landscape",
    usageApproval: "ORAM confirmed",
  },
  {
    path: "/projects/graft-poster-hd.jpg",
    projectSlug: "graft",
    role: "poster",
    source: "ORAM archive theatrical poster",
    owner: "Oram Media Works / Owas Films",
    rights: "oram-owned-or-cleared",
    resolutionNote: "1280×1791",
    usageApproval: "ORAM confirmed",
  },
  {
    path: "/projects/look-in-the-mirror-poster.jpg",
    projectSlug: "look-in-the-mirror",
    role: "poster",
    source: "ORAM vault — Look in the mirror 2.jpg",
    owner: "Oram Media Dynamics / Owas Films",
    rights: "oram-owned-or-cleared",
    resolutionNote: "1638×2048",
    usageApproval: "ORAM confirmed",
  },
  {
    path: "/projects/hang-poster.jpg",
    projectSlug: "hang",
    role: "poster",
    source: "ORAM vault — Hang.jpg",
    owner: "Owas Crystal Films / Old Age · EP ORAM.EXP.MARKETING LTD",
    rights: "oram-owned-or-cleared",
    resolutionNote: "Vault poster — moderate compression",
    usageApproval: "ORAM confirmed",
  },
  {
    path: "/projects/girls-to-ladies-poster.jpg",
    projectSlug: "girls-to-ladies",
    role: "poster",
    source: "ORAM vault — Girls to Ladies.jpg",
    owner: "Owas Films / Old Age Pictures",
    rights: "oram-owned-or-cleared",
    resolutionNote: "Low — replace with higher master when available",
    usageApproval: "ORAM confirmed",
  },
  {
    path: "/projects/secrets-untold-poster.jpg",
    projectSlug: "secrets-untold",
    role: "poster",
    source: "ORAM vault — Secrets Untold.jpg",
    owner: "Owas Crystal Films · ORAM EP on billing",
    rights: "oram-owned-or-cleared",
    resolutionNote: "970×1600",
    usageApproval: "ORAM confirmed",
  },
  {
    path: "/projects/the-wife-poster.jpg",
    projectSlug: "the-wife",
    role: "poster",
    source: "ORAM vault — The Wife.jpg",
    owner: "Owas Films / Old Age / Maynarj Films",
    rights: "oram-owned-or-cleared",
    resolutionNote: "Vault theatrical poster",
    usageApproval: "ORAM confirmed",
  },
  {
    path: "/media/team/owas-ray-mwape-ep.jpg",
    role: "hero",
    source: "ORAM vault — Owas EP.jpg",
    owner: "ORAM Media Dynamics",
    rights: "oram-owned-or-cleared",
    resolutionNote: "1365×1820",
    usageApproval: "ORAM confirmed",
  },
  {
    path: "/media/archive/strictly-by-invitation-mislabeled-zafta.jpg",
    projectSlug: "strictly-by-invitation",
    role: "poster",
    source: "Was mislabeled as Strictly key art",
    owner: "Event / ZAFTA photography",
    rights: "do-not-use",
    resolutionNote: "N/A — archived off live pages",
    usageApproval: "Do not publish as Strictly poster",
  },
  {
    path: "/media/archive/zuba-maxres-multichoice-studios-not-zuba.jpg",
    projectSlug: "zuba",
    role: "gallery",
    source: "MultiChoice Studios Coming Soon card",
    owner: "MultiChoice Studios",
    rights: "do-not-use",
    resolutionNote: "Not Zuba imagery",
    usageApproval: "Do not publish on Zuba pages",
  },
];

export interface TrailerRegisterEntry {
  projectSlug: string;
  platform: "youtube" | "facebook" | "vimeo" | "broadcaster" | "missing";
  url?: string;
  youtubeId?: string;
  officialSource: string;
  resolutionNote: string;
  uploadDate: string;
  status: "wired" | "bts-only" | "missing" | "confirm-channel";
}

export const trailerRegister: TrailerRegisterEntry[] = [
  {
    projectSlug: "inkondo",
    platform: "youtube",
    youtubeId: "SDtK15xguG8",
    url: "https://www.youtube.com/watch?v=SDtK15xguG8",
    officialSource: "YouTube (confirm Zambezi Magic / MultiChoice / ORAM)",
    resolutionNote: "Embed HD",
    uploadDate: "REQUIRES VERIFICATION",
    status: "confirm-channel",
  },
  {
    projectSlug: "zuba",
    platform: "youtube",
    youtubeId: "yz1rA4evuzA",
    url: "https://www.youtube.com/watch?v=yz1rA4evuzA",
    officialSource: "Official Zuba launch trailer (YouTube)",
    resolutionNote: "Embed HD",
    uploadDate: "REQUIRES VERIFICATION",
    status: "wired",
  },
  {
    projectSlug: "look-in-the-mirror",
    platform: "youtube",
    youtubeId: "NBg0Q-TqNf8",
    url: "https://www.youtube.com/watch?v=NBg0Q-TqNf8",
    officialSource: "YouTube (confirm ORAM / Owas Films)",
    resolutionNote: "Embed HD",
    uploadDate: "REQUIRES VERIFICATION",
    status: "confirm-channel",
  },
  {
    projectSlug: "graft",
    platform: "facebook",
    url: "https://www.facebook.com/oramtv/posts/life-on-set-️owas-ray-mwape-film-director-alfred-njovu-graft-orammedia-oramtv/1721962718165889/",
    officialSource: "Oram TV Facebook — life on set",
    resolutionNote: "Social",
    uploadDate: "2024 (approx from curated ledger)",
    status: "bts-only",
  },
  {
    projectSlug: "hang",
    platform: "missing",
    officialSource: "—",
    resolutionNote: "—",
    uploadDate: "—",
    status: "missing",
  },
  {
    projectSlug: "girls-to-ladies",
    platform: "missing",
    officialSource: "—",
    resolutionNote: "—",
    uploadDate: "—",
    status: "missing",
  },
  {
    projectSlug: "secrets-untold",
    platform: "missing",
    officialSource: "—",
    resolutionNote: "—",
    uploadDate: "—",
    status: "missing",
  },
  {
    projectSlug: "pa-maliketi",
    platform: "broadcaster",
    url: "https://www.dstv.com/zambezimagic/en-za/video/this-week-pa-maliketi",
    officialSource: "Zambezi Magic / DStv promo clips",
    resolutionNote: "Platform stream",
    uploadDate: "Various promo dates",
    status: "wired",
  },
  {
    projectSlug: "strictly-by-invitation",
    platform: "missing",
    officialSource: "—",
    resolutionNote: "—",
    uploadDate: "—",
    status: "missing",
  },
];
