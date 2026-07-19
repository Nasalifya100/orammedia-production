"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/pams/auth/session";
import { websiteConfigService } from "@/pams/services/website-config.service";
import { parseWebsiteConfigJson } from "@/pams/security/website-config";
import type { WebsiteConfiguration } from "@/pams/types/website-config";

function revalidatePreviewPaths() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/contact");
  revalidatePath("/preview", "layout");
  revalidatePath("/admin/website");
  revalidateTag("productions", "max");
}

export async function saveWebsiteDraftAction(
  configJson: string,
): Promise<WebsiteConfiguration> {
  const user = await requireAdminSession("settings.write");
  const config = parseWebsiteConfigJson(configJson);
  const saved = await websiteConfigService.saveDraft(config, user.id);
  revalidatePreviewPaths();
  return saved;
}

export async function publishWebsiteAction(): Promise<{
  ok: boolean;
  errors: string[];
  warnings: string[];
  config?: WebsiteConfiguration;
}> {
  const user = await requireAdminSession("settings.write");
  const result = await websiteConfigService.publish(user.id);

  if (result.errors.length > 0) {
    return { ok: false, errors: result.errors, warnings: result.warnings };
  }

  revalidatePreviewPaths();
  return {
    ok: true,
    errors: [],
    warnings: result.warnings,
    config: result.config,
  };
}

export async function validateWebsiteDraftAction() {
  await requireAdminSession("settings.write");
  return websiteConfigService.validateDraft();
}

export async function createWebsiteSnapshotAction(formData: FormData) {
  const user = await requireAdminSession("settings.write");
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Snapshot name required");
  const description = String(formData.get("description") || "").trim() || undefined;
  await websiteConfigService.createSnapshot(name, user.id, description);
  revalidatePath("/admin/website/snapshots");
  redirect("/admin/website/snapshots?saved=1");
}

export async function restoreWebsiteSnapshotAction(formData: FormData) {
  const user = await requireAdminSession("settings.write");
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Snapshot id required");
  await websiteConfigService.restoreSnapshot(id, user.id);
  revalidatePreviewPaths();
  redirect("/admin/website?restored=1");
}

export async function loadFlagshipMediaAction(productionSlug: string) {
  await requireAdminSession("settings.write");
  const [media, trailers] = await Promise.all([
    websiteConfigService.listMediaForProduction(productionSlug),
    websiteConfigService.listTrailersForProduction(productionSlug),
  ]);
  return { media, trailers };
}
