import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  clientIpFromHeaders,
  REVALIDATE_RATE,
  rateLimitHeaders,
} from "@/pams/security/rate-limit";

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** On-demand ISR revalidation — call from Sanity webhook on publish */
export async function POST(request: NextRequest) {
  const ip = clientIpFromHeaders(request.headers);
  const limited = await checkRateLimit(
    `revalidate:ip:${ip}`,
    REVALIDATE_RATE.max,
    REVALIDATE_RATE.windowMs,
  );
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(limited) },
    );
  }

  const expected = process.env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "Revalidation not configured" }, { status: 503 });
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.nextUrl.searchParams.get("secret") ??
    "";

  if (!provided || !secretsMatch(provided, expected)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    revalidateTag("sanity", "max");
    revalidatePath("/", "layout");
    revalidatePath("/projects");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/contact");

    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
