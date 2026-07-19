import "server-only";
import { getDb } from "@/pams/db";
import {
  applyFlagshipCascade,
  resolveFlagshipMedia,
} from "@/pams/services/flagship.service";
import { validateWebsiteForPublish } from "@/pams/services/website-validation.service";
import {
  createDefaultWebsiteConfiguration,
  type WebsiteConfigScope,
  type WebsiteConfiguration,
} from "@/pams/types/website-config";

function normalizeWebsiteNav(config: WebsiteConfiguration): WebsiteConfiguration {
  const fixHref = (href: string) => (href === "/journal" ? "/blog" : href);
  return {
    ...config,
    navigation: config.navigation?.map((item) => ({
      ...item,
      href: fixHref(item.href),
    })),
    footer: config.footer
      ? {
          ...config.footer,
          links: config.footer.links?.map((item) => ({
            ...item,
            href: fixHref(item.href),
          })),
        }
      : config.footer,
  };
}

function parseConfig(json: string): WebsiteConfiguration {
  try {
    const parsed = JSON.parse(json) as WebsiteConfiguration;
    return normalizeWebsiteNav({
      ...createDefaultWebsiteConfiguration(),
      ...parsed,
    });
  } catch {
    return createDefaultWebsiteConfiguration();
  }
}

function serializeConfig(config: WebsiteConfiguration): string {
  const rest = { ...config };
  delete rest.resolvedFlagship;
  return JSON.stringify(rest);
}

async function ensureRow(scope: WebsiteConfigScope) {
  const db = await getDb();
  const existing = await db.websiteConfig.findUnique({ where: { id: scope } });
  if (existing) return existing;

  const defaults = createDefaultWebsiteConfiguration();
  const withFlagship = await applyFlagshipCascade(defaults);

  return db.websiteConfig.create({
    data: {
      id: scope,
      configJson: serializeConfig(withFlagship),
    },
  });
}

export const websiteConfigService = {
  async getRaw(scope: WebsiteConfigScope): Promise<WebsiteConfiguration> {
    const row = await ensureRow(scope);
    const config = parseConfig(row.configJson);
    const resolved = await resolveFlagshipMedia(config.flagship);
    return { ...config, resolvedFlagship: resolved };
  },

  async getPublished(): Promise<WebsiteConfiguration> {
    return this.getRaw("published");
  },

  async getDraft(): Promise<WebsiteConfiguration> {
    return this.getRaw("draft");
  },

  async saveDraft(
    config: WebsiteConfiguration,
    userId?: string,
  ): Promise<WebsiteConfiguration> {
    const cascaded = await applyFlagshipCascade(config);
    const db = await getDb();
    await db.websiteConfig.upsert({
      where: { id: "draft" },
      create: {
        id: "draft",
        configJson: serializeConfig(cascaded),
        updatedByUserId: userId,
      },
      update: {
        configJson: serializeConfig(cascaded),
        updatedByUserId: userId,
      },
    });
    const resolved = await resolveFlagshipMedia(cascaded.flagship);
    return { ...cascaded, resolvedFlagship: resolved };
  },

  async publish(userId?: string): Promise<{
    config: WebsiteConfiguration;
    warnings: string[];
    errors: string[];
  }> {
    const draft = await this.getDraft();
    const validation = await validateWebsiteForPublish(draft);

    if (validation.errors.length > 0) {
      return {
        config: draft,
        warnings: validation.warnings,
        errors: validation.errors,
      };
    }

    const cascaded = await applyFlagshipCascade(draft);

    const db = await getDb();
    await db.websiteConfig.upsert({
      where: { id: "published" },
      create: {
        id: "published",
        configJson: serializeConfig(cascaded),
        updatedByUserId: userId,
      },
      update: {
        configJson: serializeConfig(cascaded),
        updatedByUserId: userId,
      },
    });

    await db.auditLog.create({
      data: {
        userId: userId ?? null,
        action: "publish",
        entityType: "website_config",
        entityId: "published",
        summary: "Published website configuration",
      },
    });

    const resolved = await resolveFlagshipMedia(cascaded.flagship);
    return {
      config: { ...cascaded, resolvedFlagship: resolved },
      warnings: validation.warnings,
      errors: [],
    };
  },

  async validateDraft() {
    const draft = await this.getDraft();
    return validateWebsiteForPublish(draft);
  },

  async listSnapshots() {
    const db = await getDb();
    return db.websiteSnapshot.findMany({
      orderBy: { createdAt: "desc" },
      include: { createdBy: { select: { name: true, email: true } } },
    });
  },

  async createSnapshot(name: string, userId?: string, description?: string) {
    const draft = await this.getDraft();
    const db = await getDb();
    return db.websiteSnapshot.create({
      data: {
        name,
        description,
        configJson: serializeConfig(draft),
        createdByUserId: userId,
      },
    });
  },

  async restoreSnapshot(snapshotId: string, userId?: string) {
    const db = await getDb();
    const snap = await db.websiteSnapshot.findUnique({
      where: { id: snapshotId },
    });
    if (!snap) throw new Error("Snapshot not found");

    await db.auditLog.create({
      data: {
        userId: userId ?? null,
        action: "restore",
        entityType: "website_snapshot",
        entityId: snapshotId,
        summary: `Restored website snapshot ${snap.name}`,
      },
    });

    const config = parseConfig(snap.configJson);
    return this.saveDraft(config, userId);
  },

  async listProductionOptions() {
    const db = await getDb();
    return db.production.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: { id: true, title: true, slug: true },
    });
  },

  async listMediaForProduction(productionSlug: string) {
    const db = await getDb();
    const prod = await db.production.findUnique({
      where: { slug: productionSlug },
      select: { id: true },
    });
    if (!prod) return [];
    return db.mediaAsset.findMany({
      where: { productionId: prod.id },
      orderBy: [{ role: "asc" }, { filename: "asc" }],
      select: {
        id: true,
        filename: true,
        path: true,
        role: true,
        altText: true,
      },
    });
  },

  async listTrailersForProduction(productionSlug: string) {
    const db = await getDb();
    const prod = await db.production.findUnique({
      where: { slug: productionSlug },
      select: { id: true },
    });
    if (!prod) return [];
    return db.trailer.findMany({
      where: { productionId: prod.id },
      orderBy: [{ preferred: "desc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        platform: true,
        officialStatus: true,
        preferred: true,
      },
    });
  },

  async ensureDefaults() {
    await ensureRow("draft");
    await ensureRow("published");
  },
};
