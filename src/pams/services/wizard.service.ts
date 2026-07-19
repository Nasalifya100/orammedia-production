import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { getDb } from "@/pams/db";
import { productionRepository } from "@/pams/repositories/production.repository";
import { toPublicProject } from "@/pams/mappers/production";
import type { SessionUser } from "@/pams/auth/session";
import {
  parseCompletedSteps,
  parseRightsChecklist,
  type RightsChecklist,
  type WizardScores,
  type WizardStepId,
  type WizardValidation,
  WIZARD_STEPS,
} from "@/pams/types/wizard";

type ProductionFull = NonNullable<
  Awaited<ReturnType<typeof productionRepository.findById>>
>;

function scoreProduction(p: ProductionFull): number {
  let n = 0;
  if (p.title?.trim()) n += 15;
  if (p.slug?.trim()) n += 10;
  if (p.year) n += 10;
  if (p.synopsis?.trim()) n += 15;
  if (p.archivalCategory) n += 10;
  if (p.oramRole?.trim() || p.owasRole?.trim()) n += 10;
  if (p.broadcaster?.trim() || p.streamingPlatform?.trim()) n += 10;
  if (p.kind) n += 10;
  if (p.status !== "unknown") n += 10;
  return Math.min(100, n);
}

function scoreMedia(p: ProductionFull): number {
  const media = p.media ?? [];
  const trailers = p.trailers ?? [];
  let n = 0;
  if (media.some((m) => m.role === "poster")) n += 25;
  if (media.some((m) => m.role === "hero")) n += 25;
  if (media.some((m) => m.role === "og")) n += 15;
  if (media.some((m) => m.role === "gallery" || m.role === "still")) n += 15;
  if (trailers.length > 0) n += 20;
  return Math.min(100, n);
}

function scoreSeo(p: ProductionFull): number {
  let n = 0;
  if (p.seoTitle?.trim()) n += 35;
  if (p.seoDescription?.trim()) n += 35;
  if (p.media.some((m) => m.role === "og" || m.ogEligible)) n += 30;
  return Math.min(100, n);
}

function scoreRights(p: ProductionFull): number {
  const c = parseRightsChecklist(p.rightsChecklistJson);
  const checks = [
    c.posterRights,
    c.trailerRights,
    c.galleryRights,
    c.musicRights,
    c.broadcastRights,
  ];
  const done = checks.filter(Boolean).length;
  let n = (done / checks.length) * 80;
  if (c.approvalStatus === "approved") n += 10;
  if (c.verificationStatus === "verified") n += 10;
  return Math.min(100, Math.round(n));
}

function scoreArchive(p: ProductionFull): number {
  let n = 0;
  if (p.credits.length > 0) n += 30;
  if (p.media.length >= 3) n += 30;
  if (p.synopsis && p.story) n += 20;
  if (p.archivalCategory !== "requires-verification") n += 20;
  return Math.min(100, n);
}

function computeScores(p: ProductionFull): WizardScores {
  const production = scoreProduction(p);
  const media = scoreMedia(p);
  const seo = scoreSeo(p);
  const rights = scoreRights(p);
  const archive = scoreArchive(p);
  const overall = Math.round(
    (production + media + seo + rights + archive) / 5,
  );
  return { production, media, seo, rights, archive, overall };
}

function validateForPublish(p: ProductionFull): WizardValidation {
  const scores = computeScores(p);
  const errors: string[] = [];
  const warnings: string[] = [];
  const rights = parseRightsChecklist(p.rightsChecklistJson);

  if (!p.title?.trim()) errors.push("Title is required.");
  if (!p.slug?.trim()) errors.push("Slug is required.");
  if (!p.synopsis?.trim()) warnings.push("Synopsis is empty.");
  if (!p.media.some((m) => m.role === "poster" || m.role === "hero")) {
    errors.push("Poster or hero image is required.");
  }
  if (!p.seoTitle?.trim()) warnings.push("SEO title is empty.");
  if (!p.seoDescription?.trim()) warnings.push("SEO description is empty.");

  const requiredRights: (keyof RightsChecklist)[] = [
    "posterRights",
    "trailerRights",
    "galleryRights",
  ];
  for (const key of requiredRights) {
    if (!rights[key]) {
      errors.push(`Missing required rights: ${key.replace("Rights", "")}.`);
    }
  }

  if (rights.approvalStatus !== "approved") {
    warnings.push("Approval status is not approved.");
  }

  const lowRes = p.media.filter(
    (m) => m.kind === "image" && (m.width ?? 0) > 0 && (m.width ?? 0) < 1280,
  );
  if (lowRes.length > 0) {
    warnings.push(`${lowRes.length} image(s) below 1280px width.`);
  }

  return {
    errors,
    warnings,
    scores,
    canPublish: errors.length === 0,
  };
}

function stepComplete(step: WizardStepId, p: ProductionFull): boolean {
  switch (step) {
    case "overview":
      return Boolean(p.title && p.slug && p.synopsis);
    case "media":
      return p.media.length > 0;
    case "credits":
      return p.credits.length > 0;
    case "awards":
      return true; // optional
    case "seo":
      return Boolean(p.seoTitle || p.seoDescription);
    case "rights":
      return Boolean(p.rightsChecklistJson);
    case "preview":
      return parseCompletedSteps(p.wizardCompletedJson).includes("preview");
    case "publish":
      return p.published;
    default:
      return false;
  }
}

export const wizardService = {
  async getProduction(id: string) {
    return productionRepository.findById(id);
  },

  getScores(p: ProductionFull) {
    return computeScores(p);
  },

  validate(p: ProductionFull) {
    return validateForPublish(p);
  },

  progressPercent(p: ProductionFull): number {
    const completed = WIZARD_STEPS.filter((s) => stepComplete(s.id, p)).length;
    return Math.round((completed / WIZARD_STEPS.length) * 100);
  },

  completedSteps(p: ProductionFull): WizardStepId[] {
    const stored = parseCompletedSteps(p.wizardCompletedJson);
    const derived = WIZARD_STEPS.filter((s) => stepComplete(s.id, p)).map(
      (s) => s.id,
    );
    return [...new Set([...stored, ...derived])];
  },

  async saveStepProgress(
    id: string,
    step: WizardStepId,
    markComplete = false,
  ) {
    const p = await productionRepository.findById(id);
    if (!p) throw new Error("Production not found");
    const completed = new Set(parseCompletedSteps(p.wizardCompletedJson));
    if (markComplete) completed.add(step);
    return productionRepository.update(id, {
      wizardStep: step,
      wizardCompletedJson: JSON.stringify([...completed]),
    });
  },

  async updateOverview(id: string, data: Record<string, unknown>) {
    return productionRepository.update(id, data);
  },

  async updateSeoHomepage(
    id: string,
    data: {
      seoTitle?: string;
      seoDescription?: string;
      seoCanonical?: string;
      featured?: boolean;
      sortOrder?: number;
      homepageCampaign?: string;
      flagshipCandidate?: boolean;
    },
  ) {
    return productionRepository.update(id, data);
  },

  async updateRightsChecklist(id: string, checklist: RightsChecklist) {
    return productionRepository.update(id, {
      rightsChecklistJson: JSON.stringify(checklist),
    });
  },

  async addCredit(
    productionId: string,
    input: {
      personId?: string;
      personName: string;
      role: string;
      department?: string;
    },
  ) {
    const db = await getDb();
    const order = await db.productionCredit.count({ where: { productionId } });
    return db.productionCredit.create({
      data: {
        productionId,
        personId: input.personId || null,
        personName: input.personName,
        role: input.role,
        department: input.department ?? "crew",
        billingOrder: order,
      },
    });
  },

  async removeCredit(creditId: string, productionId: string) {
    const db = await getDb();
    const credit = await db.productionCredit.findFirst({
      where: { id: creditId, productionId },
    });
    if (!credit) throw new Error("Credit not found");
    return db.productionCredit.delete({ where: { id: creditId } });
  },

  async addTrailer(
    productionId: string,
    input: {
      platform: string;
      url?: string;
      youtubeId?: string;
      muxPlaybackId?: string;
      title?: string;
      preferred?: boolean;
    },
  ) {
    const db = await getDb();
    if (input.preferred) {
      await db.trailer.updateMany({
        where: { productionId },
        data: { preferred: false },
      });
    }
    return db.trailer.create({
      data: {
        productionId,
        platform: input.platform,
        url: input.url ?? null,
        youtubeId: input.youtubeId ?? null,
        muxPlaybackId: input.muxPlaybackId ?? null,
        title: input.title ?? null,
        preferred: input.preferred ?? false,
        officialStatus: "official",
      },
    });
  },

  async searchPeople(q: string) {
    const db = await getDb();
    return db.person.findMany({
      where: { name: { contains: q } },
      take: 20,
      orderBy: { name: "asc" },
    });
  },

  async createPerson(name: string) {
    const db = await getDb();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return db.person.upsert({
      where: { slug },
      create: { name, slug },
      update: { name },
    });
  },

  async publish(id: string, user: SessionUser) {
    const p = await productionRepository.findById(id);
    if (!p) throw new Error("Production not found");
    const validation = validateForPublish(p);
    if (!validation.canPublish) {
      return { ok: false as const, validation };
    }

    await productionRepository.update(id, {
      published: true,
      workflowStatus: "published",
      wizardStep: "publish",
      wizardCompletedJson: JSON.stringify(
        WIZARD_STEPS.map((s) => s.id),
      ),
    });

    const db = await getDb();
    await db.revision.create({
      data: {
        entityType: "production",
        entityId: id,
        snapshot: JSON.stringify(p),
        userId: user.id,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "publish",
        entityType: "production",
        entityId: id,
        summary: `Published production ${p.title} via wizard`,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${p.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/productions");
    revalidateTag("productions", "max");

    return { ok: true as const, validation, slug: p.slug };
  },

  toPreviewProject(p: ProductionFull) {
    return toPublicProject(p);
  },

  async missionControl() {
    const db = await getDb();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      drafts,
      recentlyStarted,
      awaitingApproval,
      readyToPublish,
      publishedToday,
      inWizard,
    ] = await Promise.all([
      db.production.count({ where: { published: false, workflowStatus: "draft" } }),
      db.production.findMany({
        where: { published: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          wizardStep: true,
          wizardCompletedJson: true,
          createdAt: true,
        },
      }),
      db.production.count({
        where: {
          published: false,
          OR: [
            { workflowStatus: "verification" },
            { workflowStatus: "media-review" },
            { workflowStatus: "rights-review" },
          ],
        },
      }),
      db.production.count({
        where: { published: false, workflowStatus: "ready" },
      }),
      db.production.count({
        where: { published: true, updatedAt: { gte: today } },
      }),
      db.production.findMany({
        where: { published: false, wizardStep: { not: "overview" } },
        orderBy: { updatedAt: "desc" },
        take: 8,
        include: { _count: { select: { media: true, credits: true } } },
      }),
    ]);

    const wizardProgress = await Promise.all(
      inWizard.map(async (p) => {
        const full = await productionRepository.findById(p.id);
        return {
          id: p.id,
          title: p.title,
          step: p.wizardStep,
          percent: full ? wizardService.progressPercent(full) : 0,
          media: p._count.media,
          credits: p._count.credits,
        };
      }),
    );

    return {
      drafts,
      recentlyStarted,
      awaitingApproval,
      readyToPublish,
      publishedToday,
      wizardProgress,
    };
  },
};
