import { NextResponse } from "next/server";
import { getDb } from "@/pams/db";
import { requireAdminSession } from "@/pams/auth/session";
import { getStorage } from "@/platform/storage";
import { isPrivateArchiveAsset, resolveDisplayImageUrl } from "@/platform/media/urls";
import {
  assertValidStorageKey,
  isValidStorageKey,
} from "@/pams/security/storage-keys";

export const dynamic = "force-dynamic";

const SAFE_INLINE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
]);

async function authorizeAssetRead(key: string) {
  const db = await getDb();
  // Exact matches only. D1 rejects long LIKE/GLOB patterns from Prisma
  // endsWith / contains (SQLITE: LIKE or GLOB pattern too complex).
  const asset = await db.mediaAsset.findFirst({
    where: {
      objectKey: key,
    },
    select: {
      archiveStatus: true,
      approvalStatus: true,
      objectKey: true,
      path: true,
    },
  });

  if (!asset) {
    return { allowed: false as const, status: 404 as const };
  }

  if (isPrivateArchiveAsset(asset)) {
    try {
      await requireAdminSession("media.read");
    } catch {
      return { allowed: false as const, status: 403 as const };
    }
  }

  return { allowed: true as const, asset };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawKey = searchParams.get("key");
  if (!rawKey || !isValidStorageKey(rawKey)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const key = assertValidStorageKey(rawKey);
  const auth = await authorizeAssetRead(key);
  if (!auth.allowed) {
    return NextResponse.json({ error: "Not found" }, { status: auth.status });
  }

  const storage = await getStorage();
  const head = await storage.head(key);
  if (!head) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buf = await storage.read(key);
  if (!buf) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const mime = head.mimeType.toLowerCase().split(";")[0]?.trim() ?? "application/octet-stream";
  const headers: Record<string, string> = {
    "Cache-Control": "public, max-age=86400",
    "X-Content-Type-Options": "nosniff",
  };

  if (SAFE_INLINE_MIME.has(mime)) {
    headers["Content-Type"] = mime;
  } else {
    headers["Content-Type"] = "application/octet-stream";
    headers["Content-Disposition"] = "attachment";
  }

  return new NextResponse(new Uint8Array(buf), { headers });
}

/** Resolve a display URL for client components (no secrets). */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    path?: string;
    storageProvider?: string;
    objectKey?: string;
    variantsJson?: string;
    archiveStatus?: string;
  };

  if (body.objectKey && isPrivateArchiveAsset({ archiveStatus: body.archiveStatus })) {
    try {
      await requireAdminSession("media.read");
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const url = resolveDisplayImageUrl({
    path: String(body.path || ""),
    storageProvider: body.storageProvider,
    objectKey: body.objectKey,
    variantsJson: body.variantsJson,
    archiveStatus: body.archiveStatus,
  });

  return NextResponse.json({ url });
}
