import "server-only";
import { cache } from "react";
import { getProjectBySlug } from "@/lib/data/index";
import type { Project } from "@/types";

/**
 * Shared public production lookup for project-detail metadata + page.
 * Dedupes within a single request so generateMetadata and the page agree.
 */
export const resolvePublicProject = cache(
  async (slug: string): Promise<Project | undefined> => {
    return getProjectBySlug(slug);
  },
);
