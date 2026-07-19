import type { FacebookPageData } from "./types";
import { ORAM_FACEBOOK_PAGES } from "./types";
import { curatedFacebookData } from "./oram-media-curated";

const GRAPH_BASE = "https://graph.facebook.com/v21.0";

interface GraphPageResponse {
  id: string;
  name: string;
  about?: string;
  description?: string;
  category?: string;
  phone?: string;
  website?: string;
  fan_count?: number;
  picture?: { data?: { url?: string } };
  cover?: { source?: string };
  link?: string;
}

interface GraphPostResponse {
  data?: Array<{
    id: string;
    message?: string;
    created_time: string;
    permalink_url: string;
    full_picture?: string;
    attachments?: { data?: Array<{ type?: string; media?: { source?: string } }> };
  }>;
}

/** Fetch live page data from Facebook Graph API */
export async function fetchFacebookPageData(
  pageId: string = ORAM_FACEBOOK_PAGES.oramtv,
): Promise<FacebookPageData | null> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const pageFields =
      "id,name,about,description,category,phone,website,fan_count,picture,cover,link";
    const pageRes = await fetch(
      `${GRAPH_BASE}/${pageId}?fields=${pageFields}&access_token=${token}`,
      { next: { revalidate: 3600 } },
    );

    if (!pageRes.ok) {
      console.error("[facebook] Page fetch failed:", await pageRes.text());
      return null;
    }

    const page: GraphPageResponse = await pageRes.json();

    const postsRes = await fetch(
      `${GRAPH_BASE}/${pageId}/posts?fields=id,message,created_time,permalink_url,full_picture,attachments{type,media}&limit=25&access_token=${token}`,
      { next: { revalidate: 3600 } },
    );

    let posts: FacebookPageData["posts"] = [];
    if (postsRes.ok) {
      const postsJson: GraphPostResponse = await postsRes.json();
      posts =
        postsJson.data?.map((p) => ({
          id: p.id,
          message: p.message,
          createdTime: p.created_time,
          permalinkUrl: p.permalink_url,
          fullPicture: p.full_picture,
          type: p.attachments?.data?.[0]?.type,
          videoSource: p.attachments?.data?.[0]?.media?.source,
        })) ?? [];
    }

    return {
      source: "graph-api",
      syncedAt: new Date().toISOString(),
      page: {
        id: page.id,
        name: page.name,
        about: page.about,
        description: page.description,
        category: page.category,
        phone: page.phone,
        website: page.website,
        fanCount: page.fan_count,
        pictureUrl: page.picture?.data?.url,
        coverUrl: page.cover?.source,
        link: page.link ?? `https://www.facebook.com/${pageId}`,
      },
      posts,
    };
  } catch (error) {
    console.error("[facebook] Graph API error:", error);
    return null;
  }
}

/** Returns live Graph API data or curated fallback */
export async function getOramFacebookData(): Promise<FacebookPageData> {
  const live = await fetchFacebookPageData(ORAM_FACEBOOK_PAGES.oramtv);
  return live ?? curatedFacebookData;
}
