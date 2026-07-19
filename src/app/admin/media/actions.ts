"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { mediaService } from "@/pams/services/media.service";
import { requireAdminSession, hasPermission } from "@/pams/auth/session";
import type { ApprovalStatus, MediaRole, VerificationStatus } from "@/pams/types/media";
import { MEDIA_ROLES } from "@/pams/types/media";

function revalidateMediaPaths(productionId?: string | null) {
  revalidatePath("/admin/media");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidateTag("productions", "max");
  if (productionId) {
    revalidatePath(`/admin/productions/${productionId}`);
    revalidatePath(`/admin/productions/${productionId}/media`);
  }
}

const APPROVAL_STATUSES = new Set<ApprovalStatus>([
  "pending",
  "approved",
  "rejected",
  "archived",
]);

const VERIFICATION_STATUSES = new Set<VerificationStatus>([
  "unverified",
  "verified",
  "disputed",
]);

const MEDIA_ROLE_VALUES = new Set(MEDIA_ROLES.map((r) => r.value));

function parseMediaRole(value: string): MediaRole {
  if (MEDIA_ROLE_VALUES.has(value as MediaRole)) return value as MediaRole;
  return "gallery";
}

export async function updateMediaMetadataAction(formData: FormData) {
  const user = await requireAdminSession("media.write");
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");

  const bool = (key: string) => formData.get(key) === "on" || formData.get(key) === "true";

  const data: Record<string, unknown> = {
    title: String(formData.get("title") || ""),
    caption: String(formData.get("caption") || ""),
    altText: String(formData.get("altText") || ""),
    description: String(formData.get("description") || ""),
    location: String(formData.get("location") || ""),
    photographer: String(formData.get("photographer") || ""),
    camera: String(formData.get("camera") || ""),
    copyright: String(formData.get("copyright") || ""),
    rightsOwner: String(formData.get("rightsOwner") || ""),
    usageRights: String(formData.get("usageRights") || ""),
    role: parseMediaRole(String(formData.get("role") || "gallery")),
    heroEligible: bool("heroEligible"),
    posterEligible: bool("posterEligible"),
    thumbnailEligible: bool("thumbnailEligible"),
    homepageEligible: bool("homepageEligible"),
    socialEligible: bool("socialEligible"),
    ogEligible: bool("ogEligible"),
    sortOrder: Number(formData.get("sortOrder") || 0),
  };

  if (hasPermission(user, "media.approve")) {
    const approvalStatus = String(formData.get("approvalStatus") || "") as ApprovalStatus;
    const verificationStatus = String(
      formData.get("verificationStatus") || "",
    ) as VerificationStatus;
    if (APPROVAL_STATUSES.has(approvalStatus)) {
      data.approvalStatus = approvalStatus;
    }
    if (VERIFICATION_STATUSES.has(verificationStatus)) {
      data.verificationStatus = verificationStatus;
    }
  }

  await mediaService.updateMetadata(id, data, user);
  revalidateMediaPaths(String(formData.get("productionId") || "") || null);
}

export async function approveMediaAction(formData: FormData) {
  const user = await requireAdminSession("media.approve");
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "approved") as ApprovalStatus;
  if (!APPROVAL_STATUSES.has(status)) {
    throw new Error("Invalid approval status");
  }
  await mediaService.setApproval(id, status, user);
  revalidateMediaPaths(String(formData.get("productionId") || "") || null);
}

export async function deleteMediaAction(formData: FormData) {
  const user = await requireAdminSession("media.write");
  const id = String(formData.get("id") || "");
  await mediaService.deleteAsset(id, user);
  revalidateMediaPaths(String(formData.get("productionId") || "") || null);
}

export async function assignProductionMediaRoleAction(formData: FormData) {
  const user = await requireAdminSession("media.write");
  const productionId = String(formData.get("productionId") || "");
  const mediaId = String(formData.get("mediaId") || "");
  const role = parseMediaRole(String(formData.get("role") || "gallery"));
  await mediaService.assignRole(productionId, mediaId, role, user);
  revalidateMediaPaths(productionId);
}

export async function rotateMediaAction(formData: FormData) {
  const user = await requireAdminSession("media.write");
  const id = String(formData.get("id") || "");
  const degrees = Number(formData.get("degrees") || 90) as 90 | 180 | 270;
  await mediaService.rotate(id, degrees, user);
  revalidateMediaPaths(String(formData.get("productionId") || "") || null);
}

export async function flipMediaAction(formData: FormData) {
  const user = await requireAdminSession("media.write");
  const id = String(formData.get("id") || "");
  const axis = (String(formData.get("axis") || "horizontal") as "horizontal" | "vertical");
  await mediaService.flip(id, axis, user);
  revalidateMediaPaths(String(formData.get("productionId") || "") || null);
}

export async function getMediaInsightsAction() {
  await requireAdminSession("media.read");
  return mediaService.getInsights();
}
