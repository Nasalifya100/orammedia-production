import "server-only";
import { productionRepository } from "@/pams/repositories/production.repository";
import { toPublicProject } from "@/pams/mappers/production";
import type { Project } from "@/types";

/** Load any production by slug for admin preview (includes unpublished drafts). */
export async function getDraftProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const row = await productionRepository.findBySlug(slug);
  if (!row) return undefined;
  return toPublicProject(row);
}
