"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession, hasPermission } from "@/pams/auth/session";
import { productionService } from "@/pams/services/production.service";
import { siteSettingsService } from "@/pams/services/site-settings.service";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProductionAction(formData: FormData) {
  const user = await requireAdminSession("productions.write");
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title required");
  const slug = slugify(String(formData.get("slug") || "").trim() || title);
  const archivalCategory = String(
    formData.get("archivalCategory") || "requires-verification",
  );

  const created = await productionService.createDraft(
    { title, slug, archivalCategory },
    user,
  );
  revalidatePath("/admin/productions");
  redirect(`/admin/productions/${created.id}`);
}

export async function updateProductionAction(formData: FormData) {
  const user = await requireAdminSession("productions.write");
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");

  const bool = (key: string) => formData.get(key) === "on" || formData.get(key) === "true";
  const canPublish = hasPermission(user, "productions.publish");

  const data: Record<string, unknown> = {
    title: String(formData.get("title") || ""),
    slug: slugify(String(formData.get("slug") || "")),
    year: Number(formData.get("year") || 0) || null,
    synopsis: String(formData.get("synopsis") || ""),
    story: String(formData.get("story") || ""),
    challenge: String(formData.get("challenge") || ""),
    creativeDirection: String(formData.get("creativeDirection") || ""),
    productionProcess: String(formData.get("productionProcess") || ""),
    behindTheScenes: String(formData.get("behindTheScenes") || ""),
    oramRole: String(formData.get("oramRole") || ""),
    owasRole: String(formData.get("owasRole") || ""),
    archivalCategory: String(formData.get("archivalCategory") || ""),
    productionCompanyText: String(formData.get("productionCompanyText") || ""),
    clientNameText: String(formData.get("clientNameText") || ""),
    broadcaster: String(formData.get("broadcaster") || ""),
    streamingPlatform: String(formData.get("streamingPlatform") || ""),
    runtime: String(formData.get("runtime") || ""),
    sortOrder: Number(formData.get("sortOrder") || 999),
    featured: bool("featured"),
    portraitPoster: bool("portraitPoster"),
  };

  if (canPublish) {
    data.published = bool("published");
    data.workflowStatus = bool("published")
      ? "published"
      : String(formData.get("workflowStatus") || "draft");
  }

  await productionService.updateProduction(id, data, user);
  revalidatePath("/admin/productions");
  revalidatePath(`/admin/productions/${id}`);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${String(data.slug)}`);
  redirect(`/admin/productions/${id}?saved=1`);
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdminSession("settings.write");
  await siteSettingsService.set(
    "homepage.hero.path",
    String(formData.get("homepageHero") || "/projects/inkondo-billboard.jpg"),
  );
  await siteSettingsService.set(
    "showreel.poster.path",
    String(formData.get("showreelPoster") || "/projects/inkondo-billboard.jpg"),
  );
  await siteSettingsService.set(
    "flagship.production.slug",
    slugify(String(formData.get("flagshipSlug") || "inkondo")),
  );
  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
