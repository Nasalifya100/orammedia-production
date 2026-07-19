import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { requireAdminSession } from "@/pams/auth/session";
import { assertAllowedUploadMime } from "@/pams/security/mime";
import { checkRateLimit, UPLOAD_AUTH_RATE } from "@/pams/security/rate-limit";
import type { MediaRole } from "@/pams/types/media";
import { MAX_UPLOAD_BYTES } from "@/pams/types/media";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let session;
  try {
    session = await requireAdminSession("media.write");
  } catch {
    // Auth must succeed before importing mediaService (pulls Sharp via processor-local).
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";
  const limit = await checkRateLimit(
    `upload-auth:${session.id}:${ip}`,
    UPLOAD_AUTH_RATE.max,
    UPLOAD_AUTH_RATE.windowMs,
  );
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many upload requests" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      originalName?: string;
      mimeType?: string;
      fileSize?: number;
      productionId?: string;
      role?: string;
    };
    const originalName = String(body.originalName || "");
    const mimeType = String(body.mimeType || "application/octet-stream");
    const fileSize = Number(body.fileSize || 0);
    const productionId = body.productionId ? String(body.productionId) : undefined;
    const role = (String(body.role || "gallery") || "gallery") as MediaRole;

    if (!originalName || !fileSize) {
      return NextResponse.json({ error: "Missing file metadata" }, { status: 400 });
    }
    if (fileSize > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }
    try {
      assertAllowedUploadMime(mimeType);
    } catch {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const { mediaService } = await import("@/pams/services/media.service");
    const auth = await mediaService.authorizeUpload(
      { originalName, mimeType, fileSize, productionId, role },
      session,
    );

    return NextResponse.json({ ok: true, ...auth });
  } catch (error) {
    console.error(
      "[dam/upload/authorize]",
      error instanceof Error ? error.message : "Authorization failed",
    );
    return NextResponse.json({ error: "Authorization failed" }, { status: 500 });
  }
}
