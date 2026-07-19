import "server-only";
import { randomUUID } from "node:crypto";
import { mediaRepository } from "@/pams/repositories/media.repository";
import { getDb } from "@/pams/db";
import {
  buildLocalPublicPath,
  buildObjectKey,
  getStorage,
  safeFilename,
  sha256,
  storedNameFromOriginal,
} from "@/platform/storage";
import { processImageVariantsForStorage } from "@/platform/media/processing";
import { resolveMediaUrl } from "@/platform/media/urls";
import {
  MAX_UPLOAD_BYTES,
  type MediaRole,
} from "@/pams/types/media";
import { assertAllowedUploadMime, validateMagicBytes, validateMagicBytesHeader } from "@/pams/security/mime";
import type { SessionUser } from "@/pams/auth/session";
import { isCloudflareWorkersRuntime } from "@/platform/env";

export interface UploadInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  productionId?: string | null;
  role?: MediaRole;
}

export interface UploadAuthorizationInput {
  originalName: string;
  mimeType: string;
  fileSize: number;
  productionId?: string | null;
  role?: MediaRole;
}

export interface MediaInsights {
  duplicateGroups: { checksum: string; count: number }[];
  unusedCount: number;
  missingMetadata: number;
  lowResolution: number;
  recommendations: string[];
}

function aspectRatio(w: number, h: number): string {
  if (!w || !h) return "";
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}

function roleEligibility(role: MediaRole) {
  return {
    heroEligible: role === "hero",
    posterEligible: role === "poster",
    thumbnailEligible: role === "thumbnail",
    homepageEligible: role === "hero" || role === "poster",
    ogEligible: role === "og" || role === "hero" || role === "poster",
    socialEligible: role === "social" || role === "og",
  };
}

async function resolveProduction(productionId?: string | null) {
  if (!productionId) return null;
  const db = await getDb();
  return db.production.findUnique({
    where: { id: productionId },
    select: { slug: true, year: true, title: true },
  });
}

export const mediaService = {
  async authorizeUpload(input: UploadAuthorizationInput, user: SessionUser) {
    if (input.fileSize > MAX_UPLOAD_BYTES) {
      throw new Error("File exceeds maximum upload size (512 MB)");
    }
    assertAllowedUploadMime(input.mimeType);

    const storage = await getStorage();
    const production = await resolveProduction(input.productionId);
    const assetId = randomUUID();
    const storedName = storedNameFromOriginal(input.originalName);
    const objectKey = buildObjectKey({
      productionSlug: production?.slug,
      year: production?.year,
      assetId,
      variant: "original",
      filename: storedName,
    });

    const auth = await storage.createUploadAuthorization({
      key: objectKey,
      mimeType: input.mimeType,
      maxBytes: input.fileSize,
    });

    const db = await getDb();
    const session = await db.uploadSession.create({
      data: {
        id: assetId,
        userId: user.id,
        objectKey,
        mimeType: input.mimeType,
        originalName: input.originalName,
        productionId: input.productionId ?? null,
        role: input.role ?? "gallery",
        maxBytes: input.fileSize,
        expiresAt: new Date(auth.expiresAt),
      },
    });

    let uploadUrl = auth.uploadUrl;
    if (uploadUrl === "__WORKER_PROXY__") {
      // Relative same-origin URL — never bake NEXT_PUBLIC_SITE_URL (build-time) here.
      uploadUrl = `/api/dam/upload/proxy?sessionId=${encodeURIComponent(session.id)}`;
    }

    return {
      sessionId: session.id,
      uploadUrl,
      method: auth.method,
      headers: auth.headers,
      objectKey,
      expiresAt: auth.expiresAt,
      direct: storage.kind === "r2",
      proxy: auth.uploadUrl === "__WORKER_PROXY__",
    };
  },

  async completeDirectUpload(sessionId: string, user: SessionUser) {
    const db = await getDb();
    const session = await db.uploadSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== user.id) {
      throw new Error("Upload session not found");
    }
    if (session.status !== "pending") {
      throw new Error("Upload session is not pending");
    }
    if (session.expiresAt < new Date()) {
      await db.uploadSession.update({
        where: { id: sessionId },
        data: { status: "expired" },
      });
      throw new Error("Upload session expired");
    }

    const storage = await getStorage();
    const head = await storage.head(session.objectKey);
    if (!head) throw new Error("Uploaded object not found in storage");
    if (head.size <= 0 || head.size > session.maxBytes) {
      await storage.delete(session.objectKey).catch(() => undefined);
      throw new Error("Uploaded file exceeds authorized size");
    }

    const production = await resolveProduction(session.productionId);
    const role = (session.role ?? "gallery") as MediaRole;
    const publicUrl = storage.getPublicUrl(session.objectKey);
    const kind = assertAllowedUploadMime(session.mimeType);

    let width: number | undefined;
    let height: number | undefined;
    let variantsJson: string | undefined;
    let processingStatus = "complete";

    if (kind === "image") {
      const buffer = await storage.read(session.objectKey);
      if (buffer) {
        if (!validateMagicBytes(buffer, session.mimeType)) {
          await storage.delete(session.objectKey).catch(() => undefined);
          throw new Error("File content does not match declared type");
        }
        const processed = await processImageVariantsForStorage({
          buffer,
          publicPath: publicUrl,
          writeVariant: async (variantPath, data) => {
            const variantKey = buildObjectKey({
              productionSlug: production?.slug,
              year: production?.year,
              assetId: sessionId,
              variant: variantPath.includes("thumb")
                ? "thumbnail"
                : variantPath.includes("640")
                  ? "640"
                  : variantPath.includes("1280")
                    ? "1280"
                    : variantPath.includes("1920")
                      ? "1920"
                      : "original",
              filename: session.originalName,
            });
            await storage.upload(variantKey, data, "image/webp");
          },
        });
        width = processed.width || undefined;
        height = processed.height || undefined;
        variantsJson =
          Object.keys(processed.variants).length > 0
            ? JSON.stringify(processed.variants)
            : undefined;
        processingStatus = processed.processingStatus;
      }
    } else {
      const buffer = await storage.read(session.objectKey);
      if (buffer) {
        const header = buffer.subarray(0, Math.min(buffer.length, 65_536));
        if (!validateMagicBytesHeader(Buffer.from(header), session.mimeType)) {
          await storage.delete(session.objectKey).catch(() => undefined);
          await db.uploadSession.update({
            where: { id: sessionId },
            data: { status: "failed" },
          });
          throw new Error("File content does not match declared type");
        }
      }
    }

    const asset = await mediaRepository.create({
      title: production?.title
        ? `${production.title} — ${role}`
        : session.originalName.replace(/\.[^.]+$/, ""),
      filename: session.originalName,
      originalName: session.originalName,
      path: publicUrl,
      storageProvider: storage.kind,
      objectKey: session.objectKey,
      processingStatus,
      mimeType: session.mimeType,
      kind,
      role,
      productionId: session.productionId,
      width,
      height,
      aspectRatio: width && height ? aspectRatio(width, height) : null,
      fileSize: head.size,
      checksum: head.checksum,
      approvalStatus: "pending",
      verificationStatus: "unverified",
      archiveStatus: "active",
      variantsJson,
      uploadedByUserId: user.id,
      ...roleEligibility(role),
    });

    await db.uploadSession.update({
      where: { id: sessionId },
      data: { status: "completed" },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "upload",
        entityType: "media_asset",
        entityId: asset.id,
        summary: `Direct upload ${session.originalName}`,
      },
    });

    return asset;
  },

  async upload(input: UploadInput, user: SessionUser) {
    if (input.buffer.length > MAX_UPLOAD_BYTES) {
      throw new Error("File exceeds maximum upload size (512 MB)");
    }

    const kind = assertAllowedUploadMime(input.mimeType);
    if (!validateMagicBytes(input.buffer, input.mimeType)) {
      throw new Error("File content does not match declared type");
    }

    const checksum = sha256(input.buffer);
    const existing = await mediaRepository.findByChecksum(checksum);
    if (existing) {
      return { asset: existing, duplicate: true as const };
    }

    const production = await resolveProduction(input.productionId);
    const role = input.role ?? "gallery";
    const storedName = storedNameFromOriginal(input.originalName);
    const storage = await getStorage();
    const assetId = randomUUID();

    let publicPath: string;
    let objectKey: string | null = null;

    if (storage.kind === "r2") {
      objectKey = buildObjectKey({
        productionSlug: production?.slug,
        year: production?.year,
        assetId,
        variant: "original",
        filename: storedName,
      });
      await storage.upload(objectKey, input.buffer, input.mimeType);
      publicPath = storage.getPublicUrl(objectKey);
    } else {
      const local = buildLocalPublicPath({
        productionSlug: production?.slug,
        year: production?.year,
        filename: storedName,
      });
      await storage.upload(
        local.publicPath.replace(/^\//, ""),
        input.buffer,
        input.mimeType,
      );
      publicPath = local.publicPath;
      objectKey = local.publicPath.replace(/^\//, "");
    }

    let width: number | undefined;
    let height: number | undefined;
    let variantsJson: string | undefined;
    let processingStatus = "complete";

    if (kind === "image") {
      const processed = await processImageVariantsForStorage({
        buffer: input.buffer,
        publicPath,
        writeVariant: async (variantPath, data) => {
          const key = variantPath.replace(/^\//, "");
          await storage.upload(key, data, "image/webp");
        },
      });
      width = processed.width || undefined;
      height = processed.height || undefined;
      variantsJson =
        Object.keys(processed.variants).length > 0
          ? JSON.stringify(processed.variants)
          : undefined;
      processingStatus = processed.processingStatus;
    }

    const asset = await mediaRepository.create({
      title: production?.title
        ? `${production.title} — ${role}`
        : input.originalName.replace(/\.[^.]+$/, ""),
      filename: storedName,
      originalName: input.originalName,
      path: publicPath,
      storageProvider: storage.kind,
      objectKey,
      processingStatus,
      mimeType: input.mimeType,
      kind,
      role,
      productionId: input.productionId ?? null,
      width,
      height,
      aspectRatio: width && height ? aspectRatio(width, height) : null,
      fileSize: input.buffer.length,
      checksum,
      approvalStatus: "pending",
      verificationStatus: "unverified",
      archiveStatus: "active",
      variantsJson,
      uploadedByUserId: user.id,
      ...roleEligibility(role),
    });

    const db = await getDb();
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "upload",
        entityType: "media_asset",
        entityId: asset.id,
        summary: `Uploaded ${input.originalName}`,
      },
    });

    return { asset, duplicate: false as const };
  },

  async updateMetadata(
    id: string,
    data: Record<string, unknown>,
    user: SessionUser,
  ) {
    const updated = await mediaRepository.update(id, data);
    const db = await getDb();
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "update",
        entityType: "media_asset",
        entityId: id,
        summary: "Updated media metadata",
      },
    });
    return updated;
  },

  async setApproval(
    id: string,
    approvalStatus: string,
    user: SessionUser,
  ) {
    const updated = await mediaRepository.update(id, { approvalStatus });
    const db = await getDb();
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "approve",
        entityType: "media_asset",
        entityId: id,
        summary: `Set approval: ${approvalStatus}`,
      },
    });
    return updated;
  },

  async assignRole(
    productionId: string,
    mediaId: string,
    role: MediaRole,
    user: SessionUser,
  ) {
    const asset = await mediaRepository.findById(mediaId);
    if (!asset) throw new Error("Asset not found");
    if (asset.productionId && asset.productionId !== productionId) {
      throw new Error("Asset belongs to another production");
    }

    await mediaRepository.setRoleForProduction(productionId, role, mediaId);
    await mediaRepository.update(mediaId, {
      ...roleEligibility(role),
    });
    const db = await getDb();
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "assign",
        entityType: "media_asset",
        entityId: mediaId,
        summary: `Assigned ${role} for production`,
      },
    });
  },

  async deleteAsset(id: string, user: SessionUser) {
    const asset = await mediaRepository.findById(id);
    if (!asset) throw new Error("Asset not found");
    await deleteAssetFiles(asset);
    await mediaRepository.delete(id);
    const db = await getDb();
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "delete",
        entityType: "media_asset",
        entityId: id,
        summary: `Deleted ${asset.filename}`,
      },
    });
  },

  async rotate(id: string, degrees: 90 | 180 | 270, user: SessionUser) {
    const asset = await mediaRepository.findById(id);
    if (!asset || asset.kind !== "image") throw new Error("Not an image");
    if (await isCloudflareWorkersRuntime()) {
      throw new Error("Image rotation is available in local admin only until processing worker is deployed");
    }
    const { rotateImageBuffer } = await import("@/platform/media/processor-local");
    const storage = await getStorage();
    const key = asset.objectKey ?? asset.path.replace(/^\//, "");
    const buf = await storage.read(key);
    if (!buf) throw new Error("Asset file missing");
    const rotated = await rotateImageBuffer(buf, degrees);
    await storage.replace(key, rotated, asset.mimeType);
    const processed = await processImageVariantsForStorage({
      buffer: rotated,
      publicPath: asset.path,
      writeVariant: async (variantPath, data) => {
        await storage.upload(variantPath.replace(/^\//, ""), data, "image/webp");
      },
    });
    await mediaRepository.update(id, {
      width: processed.width,
      height: processed.height,
      aspectRatio: aspectRatio(processed.width, processed.height),
      variantsJson: JSON.stringify(processed.variants),
      processingStatus: processed.processingStatus,
    });
    const db = await getDb();
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "transform",
        entityType: "media_asset",
        entityId: id,
        summary: `Rotated ${degrees}°`,
      },
    });
  },

  async flip(id: string, axis: "horizontal" | "vertical", user: SessionUser) {
    const asset = await mediaRepository.findById(id);
    if (!asset || asset.kind !== "image") throw new Error("Not an image");
    if (await isCloudflareWorkersRuntime()) {
      throw new Error("Image flip is available in local admin only until processing worker is deployed");
    }
    const { flipImageBuffer } = await import("@/platform/media/processor-local");
    const storage = await getStorage();
    const key = asset.objectKey ?? asset.path.replace(/^\//, "");
    const buf = await storage.read(key);
    if (!buf) throw new Error("Asset file missing");
    const flipped = await flipImageBuffer(buf, axis);
    await storage.replace(key, flipped, asset.mimeType);
    const db = await getDb();
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "transform",
        entityType: "media_asset",
        entityId: id,
        summary: `Flipped ${axis}`,
      },
    });
  },

  async getInsights(): Promise<MediaInsights> {
    const [duplicateGroups, unusedCount, all] = await Promise.all([
      mediaRepository.findDuplicates(),
      mediaRepository.countUnused(),
      mediaRepository.findMany({ take: 500 }),
    ]);

    const missingMetadata = all.filter(
      (a) => !a.altText || !a.caption,
    ).length;
    const lowResolution = all.filter(
      (a) => a.kind === "image" && (a.width ?? 0) > 0 && (a.width ?? 0) < 1280,
    ).length;

    const recommendations: string[] = [];
    if (unusedCount > 0) {
      recommendations.push(`${unusedCount} assets are not linked to a production.`);
    }
    if (duplicateGroups.length > 0) {
      recommendations.push(`${duplicateGroups.length} duplicate file groups detected.`);
    }
    if (lowResolution > 0) {
      recommendations.push(`${lowResolution} images are below 1280px width — consider higher quality masters.`);
    }

    const db = await getDb();
    const productions = await db.production.findMany({
      where: { published: true },
      include: { _count: { select: { media: true, trailers: true } } },
    });
    for (const p of productions) {
      if (p._count.media === 0) {
        recommendations.push(`Missing all media: ${p.title}`);
      }
    }

    return {
      duplicateGroups,
      unusedCount,
      missingMetadata,
      lowResolution,
      recommendations: recommendations.slice(0, 12),
    };
  },

  resolveUrl(asset: {
    path: string;
    storageProvider?: string | null;
    objectKey?: string | null;
    variantsJson?: string | null;
    archiveStatus?: string | null;
  }) {
    return resolveMediaUrl(asset);
  },

  list: mediaRepository.findMany.bind(mediaRepository),
  findById: mediaRepository.findById.bind(mediaRepository),
  findByProduction: mediaRepository.findByProduction.bind(mediaRepository),
};

async function deleteAssetFiles(asset: {
  path: string;
  objectKey?: string | null;
  storageProvider?: string | null;
  variantsJson?: string | null;
}) {
  const storage = await getStorage();
  const paths: string[] = [asset.objectKey ?? asset.path.replace(/^\//, "")];
  if (asset.variantsJson) {
    try {
      const v = JSON.parse(asset.variantsJson) as {
        thumbnail?: string;
        webp?: string;
        avif?: string;
        sizes?: { path: string }[];
      };
      paths.push(
        ...(v.thumbnail ? [v.thumbnail.replace(/^\//, "")] : []),
        ...(v.webp ? [v.webp.replace(/^\//, "")] : []),
        ...(v.avif ? [v.avif.replace(/^\//, "")] : []),
        ...(v.sizes?.map((s) => s.path.replace(/^\//, "")) ?? []),
      );
    } catch {
      /* ignore */
    }
  }
  for (const p of paths) {
    try {
      await storage.delete(p);
    } catch {
      /* ignore missing */
    }
  }
}

export { safeFilename };
