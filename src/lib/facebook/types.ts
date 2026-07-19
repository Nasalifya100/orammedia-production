/** Types for Facebook Graph API page data */

export interface FacebookPageInfo {
  id: string;
  name: string;
  about?: string;
  description?: string;
  category?: string;
  phone?: string;
  website?: string;
  fanCount?: number;
  pictureUrl?: string;
  coverUrl?: string;
  link: string;
}

export interface FacebookPost {
  id: string;
  message?: string;
  createdTime: string;
  permalinkUrl: string;
  fullPicture?: string;
  type?: string;
  /** Direct video source when available from Graph API */
  videoSource?: string;
}

export interface FacebookPageData {
  page: FacebookPageInfo;
  posts: FacebookPost[];
  syncedAt: string;
  source: "graph-api" | "curated";
}

/** Oram Media Dynamics Facebook page IDs / usernames */
export const ORAM_FACEBOOK_PAGES = {
  dynamics: "234872013039224",
  oramtv: "oramtv",
  ceo: "owas.mwape",
} as const;

export const ORAM_FACEBOOK_URLS = {
  dynamics: "https://www.facebook.com/Oram-media-dynamics-234872013039224/",
  oramtv: "https://www.facebook.com/oramtv/",
  ceo: "https://www.facebook.com/owas.mwape/",
} as const;
