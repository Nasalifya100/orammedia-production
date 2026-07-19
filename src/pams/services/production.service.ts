import "server-only";
import { productionRepository } from "@/pams/repositories/production.repository";
import { toPublicProject } from "@/pams/mappers/production";
import { getDb } from "@/pams/db";
import type { Project } from "@/types";
import type { SessionUser } from "@/pams/auth/session";

export const productionService = {
  async listPublishedProjects(): Promise<Project[]> {
    const rows = await productionRepository.findPublished();
    return rows.map(toPublicProject).filter((p) => p.published !== false);
  },

  async listFeaturedProjects(): Promise<Project[]> {
    const rows = await productionRepository.findFeatured();
    return rows.map(toPublicProject);
  },

  async getPublishedBySlug(slug: string): Promise<Project | undefined> {
    const row = await productionRepository.findBySlug(slug);
    if (!row) return undefined;
    const project = toPublicProject(row);
    return project.published !== false ? project : undefined;
  },

  async getPublishedSlugs(): Promise<string[]> {
    return productionRepository.publishedSlugs();
  },

  async isReady(): Promise<boolean> {
    const n = await productionRepository.countPublished();
    return n > 0;
  },

  async listAdmin() {
    return productionRepository.findAllAdmin();
  },

  async getAdmin(id: string) {
    return productionRepository.findById(id);
  },

  async createDraft(
    input: { title: string; slug: string; archivalCategory?: string },
    user: SessionUser,
  ) {
    const created = await productionRepository.create(input);
    const db = await getDb();
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "create",
        entityType: "production",
        entityId: created.id,
        summary: `Created draft production ${created.title}`,
      },
    });
    return created;
  },

  async updateProduction(
    id: string,
    data: Record<string, unknown>,
    user: SessionUser,
  ) {
    const before = await productionRepository.findById(id);
    const updated = await productionRepository.update(id, data);
    const db = await getDb();
    await db.revision.create({
      data: {
        entityType: "production",
        entityId: id,
        snapshot: JSON.stringify(before),
        userId: user.id,
      },
    });
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "update",
        entityType: "production",
        entityId: id,
        summary: `Updated production ${updated.title}`,
      },
    });
    return updated;
  },

  async search(query: string) {
    return productionRepository.search(query);
  },
};
