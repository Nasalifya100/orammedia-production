import "server-only";
import {
  getServices,
  getTeamMembers,
  getClientLogos,
  getNewsPosts,
  getAwards,
} from "@/lib/data/index";
import { getOramFacebookData } from "@/lib/facebook/client";
import { getFacebookDerivedContent } from "@/lib/facebook/oram-media-curated";
import { getDefaultMuxPlaybackId } from "@/lib/mux";
import { SHOWREEL_VIDEO, SHOWREEL_POSTER } from "@/lib/data/mock-data";
import {
  getHomepageFeaturedProjects,
  getWebsiteConfiguration,
} from "@/lib/data/website";
import type { WebsiteConfiguration } from "@/pams/types/website-config";
import type {
  Award,
  ClientLogo,
  NewsPost,
  Project,
  Service,
  ShowreelConfig,
  TeamMember,
} from "@/types";
import type { WebsitePreviewPayload } from "@/lib/preview/types";

export type WebsiteDataScope = "draft" | "published";

export interface HomepagePageData {
  scope: WebsiteDataScope;
  config: WebsiteConfiguration;
  featuredProjects: Project[];
  services: Service[];
  teamMembers: TeamMember[];
  clientLogos: ClientLogo[];
  showreel: ShowreelConfig;
  news: NewsPost[];
  awards: Award[];
}

/** Single showreel builder — used by production AND preview */
export async function buildShowreelConfig(
  scope: WebsiteDataScope,
  config?: WebsiteConfiguration,
): Promise<ShowreelConfig> {
  const websiteConfig = config ?? (await getWebsiteConfiguration(scope));
  const resolved = websiteConfig.resolvedFlagship;
  const envMuxId = getDefaultMuxPlaybackId();

  const posterUrl =
    resolved?.heroPosterPath ?? SHOWREEL_POSTER ?? "/projects/inkondo-billboard.jpg";

  const flagshipVideo = resolved?.heroVideoUrl?.trim() || "";
  const muxPlaybackId =
    resolved?.heroVideoMuxId || envMuxId || undefined;

  if (resolved?.heroPosterPath || flagshipVideo || muxPlaybackId) {
    return {
      muxPlaybackId,
      videoUrl: flagshipVideo || SHOWREEL_VIDEO,
      posterUrl,
    };
  }

  const [fbData, fbDerived] = await Promise.all([
    getOramFacebookData(),
    Promise.resolve(getFacebookDerivedContent()),
  ]);
  const videoPost = fbData.posts.find((p) => p.type === "video");

  const videoUrl =
    videoPost?.videoSource ||
    videoPost?.permalinkUrl ||
    fbDerived.showreelVideoUrl ||
    SHOWREEL_VIDEO;

  return {
    muxPlaybackId: envMuxId || undefined,
    videoUrl,
    posterUrl,
  };
}

/** One loader for production homepage and preview — only scope differs */
export async function loadHomepageData(
  scope: WebsiteDataScope,
): Promise<HomepagePageData> {
  const config = await getWebsiteConfiguration(scope);

  const [
    featuredProjects,
    services,
    teamMembers,
    clientLogos,
    news,
    awards,
    showreel,
  ] = await Promise.all([
    getHomepageFeaturedProjects(scope),
    getServices(),
    getTeamMembers(),
    getClientLogos(),
    getNewsPosts(),
    getAwards(),
    buildShowreelConfig(scope, config),
  ]);

  return {
    scope,
    config,
    featuredProjects,
    services,
    teamMembers,
    clientLogos,
    showreel,
    news,
    awards,
  };
}

/** Static page data for inline Website Builder preview */
export async function loadWebsitePreviewPayload(): Promise<WebsitePreviewPayload> {
  const [projects, services, teamMembers, clientLogos, news, awards, showreelFallback] =
    await Promise.all([
      import("@/lib/data/index").then((m) => m.getProjects()),
      getServices(),
      getTeamMembers(),
      getClientLogos(),
      getNewsPosts(),
      getAwards(),
      buildShowreelConfig("published"),
    ]);

  return {
    projects,
    services,
    teamMembers,
    clientLogos,
    news,
    awards,
    fallbackMuxId: showreelFallback.muxPlaybackId,
    showreelFallback,
  };
}
