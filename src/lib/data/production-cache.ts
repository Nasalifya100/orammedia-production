import "server-only";
import { unstable_cache } from "next/cache";
import { productionRepository } from "@/pams/repositories/production.repository";
import { toPublicProject } from "@/pams/mappers/production";
import type { Project } from "@/types";

/** Cached published production list — invalidated on publish/media updates via `productions` tag */
export const getCachedPublishedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await productionRepository.findPublished();
    return rows.map(toPublicProject).filter((p) => p.published !== false);
  },
  ["oram-published-projects"],
  { revalidate: 3600, tags: ["productions"] },
);

export const PRODUCTIONS_CACHE_TAG = "productions";
