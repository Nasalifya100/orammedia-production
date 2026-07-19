import { NextResponse } from "next/server";
import { readSession, requireAdminSession } from "@/pams/auth/session";
import type { MediaRole } from "@/pams/types/media";
import { assertAllowedUploadMime } from "@/pams/security/mime";
import { MAX_UPLOAD_BYTES } from "@/pams/types/media";
import { isCloudflareWorkersRuntime } from "@/platform/env";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await requireAdminSession("media.write");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const productionId = String(formData.get("productionId") || "") || undefined;
    const role = (String(formData.get("role") || "gallery") || "gallery") as MediaRole;
    const files = formData.getAll("files");

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (await isCloudflareWorkersRuntime()) {
      return NextResponse.json(
        {
          error:
            "Use /api/dam/upload/authorize and direct-to-R2 upload on Cloudflare staging.",
        },
        { status: 400 },
      );
    }

    const { mediaService } = await import("@/pams/services/media.service");
    const results = [];

    for (const entry of files) {
      if (!(entry instanceof File)) continue;
      if (entry.size > MAX_UPLOAD_BYTES) {
        results.push({
          name: entry.name,
          error: "File too large",
        });
        continue;
      }

      const buffer = Buffer.from(await entry.arrayBuffer());
      const mimeType = entry.type || "application/octet-stream";

      try {
        assertAllowedUploadMime(mimeType);
      } catch {
        results.push({ name: entry.name, error: "Unsupported file type" });
        continue;
      }

      const result = await mediaService.upload(
        {
          buffer,
          originalName: entry.name,
          mimeType,
          productionId: productionId ?? null,
          role,
        },
        session,
      );

      results.push({
        name: entry.name,
        id: result.asset.id,
        path: result.asset.path,
        duplicate: result.duplicate,
      });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("[dam/upload]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
