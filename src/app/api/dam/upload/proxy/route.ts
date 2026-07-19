import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { requireAdminSession } from "@/pams/auth/session";
import { checkRateLimit, UPLOAD_AUTH_RATE } from "@/pams/security/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Worker-binding upload proxy used when R2 S3 API credentials are not configured.
 * Browser PUTs bytes here; the Worker writes to DAM_BUCKET.
 */
export async function PUT(request: Request) {
  let session;
  try {
    session = await requireAdminSession("media.write");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";
  const limit = await checkRateLimit(
    `upload-proxy:${session.id}:${ip}`,
    UPLOAD_AUTH_RATE.max,
    UPLOAD_AUTH_RATE.windowMs,
  );
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many upload requests" }, { status: 429 });
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId") || "";
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  try {
    const { getDb } = await import("@/pams/db");
    const { getStorage } = await import("@/platform/storage");
    const db = await getDb();
    const uploadSession = await db.uploadSession.findUnique({
      where: { id: sessionId },
    });
    if (!uploadSession || uploadSession.userId !== session.id) {
      return NextResponse.json({ error: "Upload session not found" }, { status: 404 });
    }
    if (uploadSession.status !== "pending") {
      return NextResponse.json({ error: "Upload session is not pending" }, { status: 400 });
    }
    if (uploadSession.expiresAt < new Date()) {
      await db.uploadSession.update({
        where: { id: sessionId },
        data: { status: "expired" },
      });
      return NextResponse.json({ error: "Upload session expired" }, { status: 400 });
    }

    const contentType =
      request.headers.get("content-type") || uploadSession.mimeType || "application/octet-stream";
    if (contentType.split(";")[0].trim() !== uploadSession.mimeType) {
      return NextResponse.json({ error: "Content-Type mismatch" }, { status: 400 });
    }

    const ab = await request.arrayBuffer();
    if (ab.byteLength <= 0 || ab.byteLength > uploadSession.maxBytes) {
      return NextResponse.json({ error: "Invalid upload size" }, { status: 400 });
    }

    const storage = await getStorage();
    await storage.upload(
      uploadSession.objectKey,
      Buffer.from(ab),
      uploadSession.mimeType,
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[dam/upload/proxy]", error instanceof Error ? error.message : "failed");
    return NextResponse.json({ error: "Proxy upload failed" }, { status: 500 });
  }
}
