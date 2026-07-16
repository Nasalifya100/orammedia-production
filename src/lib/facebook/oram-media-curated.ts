import type { FacebookPageData, FacebookPost } from "./types";
import { ORAM_FACEBOOK_URLS } from "./types";

/**
 * Curated public data from Oram Media Dynamics Facebook pages (oramtv, Oram-media-dynamics)
 * and linked public sources. Used when Graph API token is not configured.
 * Last researched: June 2025
 */
export const curatedFacebookData: FacebookPageData = {
  source: "curated",
  syncedAt: new Date().toISOString(),
  page: {
    id: "234872013039224",
    name: "Oram Media Dynamics",
    about:
      "A production team that is ever on the move to create content. We create a creative edge to our viewers.",
    description:
      "Zambian film and television production company led by multi-award-winning director Owas Ray Mwape. Specializing in drama series, feature films, branded content, and broadcast production for Zambezi Magic, Showmax, and corporate clients across Zambia.",
    category: "Movie/Television Studio",
    phone: "+260 97 6939364",
    website: "https://www.facebook.com/oramtv/",
    fanCount: 10215,
    link: ORAM_FACEBOOK_URLS.oramtv,
  },
  posts: [
    {
      id: "1690059708022857",
      message:
        "The Oram media group partners at the INAUGURAL of Zambia-India skills transfer with industry experts. Owas Ray Mwape — Film Director.",
      createdTime: "2024-01-01T00:00:00.000Z",
      permalinkUrl:
        "https://www.facebook.com/oramtv/posts/the-oram-media-group-partners-at-the-inaugural-of-zambia-india-skills-transfer-w/1690059708022857/",
      type: "photo",
    },
    {
      id: "1721962718165889",
      message:
        "Life on set — Owas Ray Mwape Film Director #Graft #orammedia #oramtv",
      createdTime: "2024-06-01T00:00:00.000Z",
      permalinkUrl:
        "https://www.facebook.com/oramtv/posts/life-on-set-️owas-ray-mwape-film-director-alfred-njovu-graft-orammedia-oramtv/1721962718165889/",
      type: "photo",
    },
    {
      id: "1081536717315058",
      message:
        "AN Owas Ray Mwape FILM — LOOK IN THE MIRROR. Red carpet premiere. #Lookinthemirror #Orammediadynamics #ZambianFilm",
      createdTime: "2024-09-02T00:00:00.000Z",
      permalinkUrl:
        "https://www.facebook.com/oramtv/posts/an-owas-ray-mwape-filmlook-in-the-mirrorhis-mistake-was-giving-her-a-liftred-car/1081536717315058/",
      type: "video",
    },
    {
      id: "1601906116838217",
      message:
        "Media Diaries — Director Owas Ray Mwape with the Zuba cast. #oramentertainmenttv #zuba #oramtv",
      createdTime: "2023-01-01T00:00:00.000Z",
      permalinkUrl:
        "https://www.facebook.com/oramtv/posts/media-diaries-director-owas-ray-mwape-film-director-with-the-zuba-castoramentert/1601906116838217/",
      type: "photo",
    },
    {
      id: "1608800919482070",
      message:
        "Our job is to tell stories through films. We are Oram TV, Oram Entertainment TV.",
      createdTime: "2023-01-01T00:00:00.000Z",
      permalinkUrl:
        "https://www.facebook.com/oramtv/posts/our-job-is-to-tell-stories-through-films-we-are-oram-tv-oram-entertainment-tv/1608800919482070/",
      type: "photo",
    },
    {
      id: "747038756815619",
      message:
        "Oram Media Dynamics — Client: Ministry of Youth, Sport and Arts #youthexpo2023 #umuntuniyouth #YouthWeekZM #zambia",
      createdTime: "2023-01-01T00:00:00.000Z",
      permalinkUrl:
        "https://www.facebook.com/oramtv/videos/oram-media-dynamics-client-ministry-of-youth-sport-and-arts-youthexpo2023umuntun/747038756815619/",
      type: "video",
    },
    {
      id: "2272060006490955",
      message: "At Oram.",
      createdTime: "2024-11-06T00:00:00.000Z",
      permalinkUrl: "https://www.facebook.com/oramtv/videos/at-oram/2272060006490955/",
      type: "video",
    },
  ],
};

/** Map curated Facebook research into site content structures */
export function getFacebookDerivedContent() {
  return {
    siteConfig: {
      name: "Oram Media Dynamics",
      tagline: "Film & television from Lusaka",
      description:
        "Lusaka film and television production — drama series, features and branded films for Zambezi Magic, Showmax, DStv and institutional clients across Zambia.",
      /** Replace with the live production domain before launch (not Facebook). */
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://orammedia.com",
      logo: "/brand/oram-media-logo.png",
      logoWordmark: "/brand/oram-media-logo.png",
      email: "orammediadynamics@gmail.com",
      phone: "+260 97 6939364",
      emergencyPhone: "+260 97 6939364",
      address: {
        street: "MKP Apartments, Chainama",
        city: "Lusaka",
        state: "",
        zip: "23200",
        country: "Zambia",
      },
      social: {
        facebook: ORAM_FACEBOOK_URLS.oramtv,
        facebookDynamics: ORAM_FACEBOOK_URLS.dynamics,
        instagram: "https://www.instagram.com/orammediad/",
        youtube: "https://www.youtube.com/@orammedia",
        linkedin: "https://www.linkedin.com/pub/dir/owas/mwape",
        twitter: "https://x.com/Orammediad",
        ceo: ORAM_FACEBOOK_URLS.ceo,
      },
    },
    showreelVideoUrl:
      "https://www.facebook.com/oramtv/videos/at-oram/2272060006490955/",
    showreelPoster: "/projects/inkondo-billboard.jpg",
    posts: curatedFacebookData.posts,
  };
}

export function isFacebookVideoUrl(url: string): boolean {
  return /facebook\.com/.test(url) && /\/videos\//.test(url);
}

export function isFacebookPostUrl(url: string): boolean {
  return /facebook\.com/.test(url) && /\/posts\//.test(url);
}

export function getFacebookVideoEmbedUrl(facebookUrl: string): string {
  const encoded = encodeURIComponent(facebookUrl);
  return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&width=1280`;
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Extract project hints from Facebook post messages */
export function postsToProjectHints(posts: FacebookPost[]) {
  return posts.filter((p) => p.type === "video" || p.message?.includes("#"));
}
