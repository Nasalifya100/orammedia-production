"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/pams/auth/session";
import { productionService } from "@/pams/services/production.service";
import { wizardService } from "@/pams/services/wizard.service";
import type { RightsChecklist, WizardStepId } from "@/pams/types/wizard";

function revalidateWizard(productionId: string, slug?: string) {
  revalidatePath(`/admin/productions/${productionId}/wizard`);
  revalidatePath("/admin/productions");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/preview/projects/${slug}`);
}

export async function startWizardAction(formData: FormData) {
  const user = await requireAdminSession("productions.write");
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title required");

  const slug =
    String(formData.get("slug") || "").trim() ||
    title
      .toLowerCase()
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const created = await productionService.createDraft(
    { title, slug, archivalCategory: "requires-verification" },
    user,
  );

  redirect(`/admin/productions/${created.id}/wizard?step=overview`);
}

export async function saveWizardOverviewAction(formData: FormData) {
  await requireAdminSession("productions.write");
  const id = String(formData.get("productionId") || "");
  if (!id) throw new Error("Missing production id");

  await wizardService.updateOverview(id, {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    year: Number(formData.get("year") || 0) || null,
    kind: String(formData.get("kind") || "feature"),
    status: String(formData.get("status") || "unknown"),
    archivalCategory: String(formData.get("archivalCategory") || ""),
    synopsis: String(formData.get("synopsis") || ""),
    oramRole: String(formData.get("oramRole") || ""),
    owasRole: String(formData.get("owasRole") || ""),
    broadcaster: String(formData.get("broadcaster") || ""),
    streamingPlatform: String(formData.get("streamingPlatform") || ""),
    runtime: String(formData.get("runtime") || ""),
  });

  await wizardService.saveStepProgress(id, "overview", true);
  revalidateWizard(id, String(formData.get("slug") || ""));
  return { ok: true };
}

export async function saveWizardAwardsAction(formData: FormData) {
  await requireAdminSession("productions.write");
  const id = String(formData.get("productionId") || "");

  await wizardService.updateOverview(id, {
    productionNotes: String(formData.get("awardsNotes") || ""),
    rightsNotes: String(formData.get("festivalNotes") || ""),
    verificationNotes: String(formData.get("pressNotes") || ""),
  });

  await wizardService.saveStepProgress(id, "awards", true);
  revalidateWizard(id);
  return { ok: true };
}

export async function saveWizardSeoAction(formData: FormData) {
  await requireAdminSession("productions.write");
  const id = String(formData.get("productionId") || "");

  await wizardService.updateSeoHomepage(id, {
    seoTitle: String(formData.get("seoTitle") || ""),
    seoDescription: String(formData.get("seoDescription") || ""),
    seoCanonical: String(formData.get("seoCanonical") || ""),
    featured: formData.get("featured") === "on",
    sortOrder: Number(formData.get("sortOrder") || 999),
    homepageCampaign: String(formData.get("homepageCampaign") || ""),
    flagshipCandidate: formData.get("flagshipCandidate") === "on",
  });

  await wizardService.saveStepProgress(id, "seo", true);
  revalidateWizard(id);
  return { ok: true };
}

export async function saveWizardRightsAction(formData: FormData) {
  await requireAdminSession("productions.write");
  const id = String(formData.get("productionId") || "");
  const bool = (k: string) => formData.get(k) === "on";

  const checklist: RightsChecklist = {
    posterRights: bool("posterRights"),
    trailerRights: bool("trailerRights"),
    galleryRights: bool("galleryRights"),
    musicRights: bool("musicRights"),
    broadcastRights: bool("broadcastRights"),
    approvalStatus: String(formData.get("approvalStatus") || "pending"),
    verificationStatus: String(formData.get("verificationStatus") || "unverified"),
  };

  await wizardService.updateRightsChecklist(id, checklist);
  await wizardService.saveStepProgress(id, "rights", true);
  revalidateWizard(id);
  return { ok: true };
}

export async function addWizardCreditAction(formData: FormData) {
  await requireAdminSession("productions.write");
  const productionId = String(formData.get("productionId") || "");
  await wizardService.addCredit(productionId, {
    personId: String(formData.get("personId") || "") || undefined,
    personName: String(formData.get("personName") || ""),
    role: String(formData.get("role") || "Crew"),
    department: String(formData.get("department") || "crew"),
  });
  await wizardService.saveStepProgress(productionId, "credits", true);
  revalidateWizard(productionId);
}

export async function removeWizardCreditAction(formData: FormData) {
  await requireAdminSession("productions.write");
  const creditId = String(formData.get("creditId") || "");
  const productionId = String(formData.get("productionId") || "");
  await wizardService.removeCredit(creditId, productionId);
  revalidateWizard(productionId);
}

export async function addWizardTrailerAction(formData: FormData) {
  await requireAdminSession("productions.write");
  const productionId = String(formData.get("productionId") || "");
  await wizardService.addTrailer(productionId, {
    platform: String(formData.get("platform") || "youtube"),
    url: String(formData.get("url") || ""),
    youtubeId: String(formData.get("youtubeId") || ""),
    muxPlaybackId: String(formData.get("muxPlaybackId") || ""),
    title: String(formData.get("title") || ""),
    preferred: formData.get("preferred") === "on",
  });
  await wizardService.saveStepProgress(productionId, "media", true);
  revalidateWizard(productionId);
}

export async function searchPeopleAction(q: string) {
  await requireAdminSession("people.read");
  if (!q.trim()) return [];
  return wizardService.searchPeople(q.trim());
}

export async function createPersonAction(name: string) {
  await requireAdminSession("people.write");
  return wizardService.createPerson(name.trim());
}

export async function setWizardStepAction(productionId: string, step: WizardStepId) {
  await requireAdminSession("productions.write");
  await wizardService.saveStepProgress(productionId, step, step === "preview");
  revalidateWizard(productionId);
}

export async function publishWizardAction(formData: FormData) {
  const user = await requireAdminSession("productions.publish");
  const id = String(formData.get("productionId") || "");
  const result = await wizardService.publish(id, user);
  if (!result.ok) {
    throw new Error(
      result.validation.errors.join("; ") || "Publishing blocked — check validation.",
    );
  }
  revalidatePath("/");
  redirect(`/admin/productions/${id}/wizard?step=publish&published=1`);
}

export async function getWizardValidationAction(productionId: string) {
  await requireAdminSession("productions.read");
  const p = await wizardService.getProduction(productionId);
  if (!p) throw new Error("Not found");
  return wizardService.validate(p);
}
