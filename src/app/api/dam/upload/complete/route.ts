import { NextResponse } from "next/server";
import { requireAdminSession } from "@/pams/auth/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let session;
  try {
    session = await requireAdminSession("media.write");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as { sessionId?: string };
    const sessionId = String(body.sessionId || "");
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const { mediaService } = await import("@/pams/services/media.service");
    const asset = await mediaService.completeDirectUpload(sessionId, session);
    return NextResponse.json({
      ok: true,
      id: asset.id,
      path: asset.path,
      processingStatus: asset.processingStatus,
    });
  } catch (error) {
    console.error("[dam/upload/complete]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Completion failed" },
      { status: 500 },
    );
  }
}
