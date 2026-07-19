import "server-only";

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const memoryBuckets = new Map<string, Bucket>();

/** In-memory limiter — local development fallback only. */
export function checkMemoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const entry = memoryBuckets.get(key);

  if (!entry || now > entry.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, retryAfterMs: 0 };
}

type KvNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

async function getKvNamespace(): Promise<KvNamespace | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    const kv = (ctx?.env as { RATE_LIMIT_KV?: KvNamespace } | undefined)?.RATE_LIMIT_KV;
    return kv ?? null;
  } catch {
    return null;
  }
}

/**
 * Distributed rate limiter with KV when available, in-memory fallback locally.
 * KV is eventually consistent — do not rely on strict transactional guarantees.
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const kv = await getKvNamespace();
  if (!kv) {
    return checkMemoryRateLimit(key, maxRequests, windowMs);
  }

  const now = Date.now();
  const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  const raw = await kv.get(key);
  let entry: Bucket;

  if (raw) {
    try {
      entry = JSON.parse(raw) as Bucket;
    } catch {
      entry = { count: 0, resetAt: now + windowMs };
    }
  } else {
    entry = { count: 0, resetAt: now + windowMs };
  }

  if (now > entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs };
    await kv.put(key, JSON.stringify(entry), { expirationTtl: ttlSeconds });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  await kv.put(key, JSON.stringify(entry), { expirationTtl: ttlSeconds });
  return { allowed: true, retryAfterMs: 0 };
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  if (result.allowed || result.retryAfterMs <= 0) return {};
  return { "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)) };
}

export const LOGIN_RATE = {
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX ?? 10),
  windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS ?? 900_000),
};

export const UPLOAD_AUTH_RATE = {
  max: Number(process.env.UPLOAD_AUTH_RATE_LIMIT_MAX ?? 60),
  windowMs: Number(process.env.UPLOAD_AUTH_RATE_LIMIT_WINDOW_MS ?? 3_600_000),
};

export const CONTACT_RATE = {
  max: Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 5),
  windowMs: Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 3_600_000),
};

export const REVALIDATE_RATE = {
  max: Number(process.env.REVALIDATE_RATE_LIMIT_MAX ?? 30),
  windowMs: Number(process.env.REVALIDATE_RATE_LIMIT_WINDOW_MS ?? 3_600_000),
};

export const SYNC_RATE = {
  max: Number(process.env.SYNC_RATE_LIMIT_MAX ?? 10),
  windowMs: Number(process.env.SYNC_RATE_LIMIT_WINDOW_MS ?? 3_600_000),
};

/** Normalize client IP — prefer first X-Forwarded-For when behind trusted proxy. */
export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  return forwarded || realIp || "unknown";
}
