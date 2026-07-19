import "server-only";
import type { WebsiteConfiguration } from "@/pams/types/website-config";
import { createDefaultWebsiteConfiguration } from "@/pams/types/website-config";

const MAX_CONFIG_BYTES = 512_000;

export function parseWebsiteConfigJson(configJson: string): WebsiteConfiguration {
  if (configJson.length > MAX_CONFIG_BYTES) {
    throw new Error("Website configuration payload too large");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(configJson);
  } catch {
    throw new Error("Invalid website configuration JSON");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid website configuration");
  }

  const defaults = createDefaultWebsiteConfiguration();
  const input = parsed as Record<string, unknown>;

  delete input.resolvedFlagship;

  const config: WebsiteConfiguration = {
    ...defaults,
    ...(input as Partial<WebsiteConfiguration>),
  };

  for (const item of config.navigation ?? []) {
    if (item.href && !item.href.startsWith("/") && !item.href.startsWith("https://")) {
      throw new Error("Navigation links must be relative or HTTPS");
    }
  }

  if (config.announcementBanner?.href) {
    const href = config.announcementBanner.href;
    if (!href.startsWith("/") && !href.startsWith("https://")) {
      throw new Error("Announcement banner link must be relative or HTTPS");
    }
  }

  return config;
}
