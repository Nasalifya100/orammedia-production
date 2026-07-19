import { NextResponse } from "next/server";
import { readSession, requireAdminSession } from "@/pams/auth/session";
import { getOramFacebookData } from "@/lib/facebook/client";
import { timingSafeEqual } from "node:crypto";
import {
  checkRateLimit,
  clientIpFromHeaders,
  SYNC_RATE,
  rateLimitHeaders,
} from "@/pams/security/rate-limit";

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Manual Facebook sync — admin session or FACEBOOK_SYNC_SECRET required */
export async function GET(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  const limited = await checkRateLimit(
    `sync:ip:${ip}`,
    SYNC_RATE.max,
    SYNC_RATE.windowMs,
  );
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(limited) },
    );
  }

  const syncSecret = process.env.FACEBOOK_SYNC_SECRET;
  const headerSecret = request.headers.get("x-sync-secret") ?? "";

  let authorized = false;
  if (syncSecret && headerSecret && secretsMatch(headerSecret, syncSecret)) {
    authorized = true;
  } else {
    const session = await readSession();
    if (session) {
      try {
        await requireAdminSession("settings.read");
        authorized = true;
      } catch {
        authorized = false;
      }
    }
  }

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getOramFacebookData();

  return NextResponse.json({
    success: true,
    source: data.source,
    syncedAt: data.syncedAt,
    page: data.page,
    postCount: data.posts.length,
    posts: data.posts.slice(0, 5),
  });
}
