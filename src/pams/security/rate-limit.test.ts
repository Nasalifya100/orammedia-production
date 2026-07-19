import { describe, expect, it } from "vitest";
import { checkMemoryRateLimit } from "@/pams/security/rate-limit";

describe("rate-limit memory fallback", () => {
  it("allows requests under the limit", () => {
    const key = `test-${Date.now()}`;
    const first = checkMemoryRateLimit(key, 3, 60_000);
    expect(first.allowed).toBe(true);
  });

  it("blocks requests over the limit", () => {
    const key = `block-${Date.now()}`;
    checkMemoryRateLimit(key, 2, 60_000);
    checkMemoryRateLimit(key, 2, 60_000);
    const third = checkMemoryRateLimit(key, 2, 60_000);
    expect(third.allowed).toBe(false);
    expect(third.retryAfterMs).toBeGreaterThan(0);
  });
});
