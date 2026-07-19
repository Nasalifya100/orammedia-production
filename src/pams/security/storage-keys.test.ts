import { describe, expect, it } from "vitest";
import {
  assertValidStorageKey,
  isValidStorageKey,
} from "@/pams/security/storage-keys";

describe("storage-keys", () => {
  it("accepts valid production keys", () => {
    expect(isValidStorageKey("productions/inkondo/2025/asset/original.jpg")).toBe(true);
  });

  it("rejects path traversal", () => {
    expect(isValidStorageKey("productions/../.env")).toBe(false);
    expect(isValidStorageKey("../etc/passwd")).toBe(false);
  });

  it("rejects keys outside allowed prefixes", () => {
    expect(isValidStorageKey("private/secret.pdf")).toBe(false);
  });

  it("throws on invalid keys", () => {
    expect(() => assertValidStorageKey("bad/key")).toThrow("Invalid storage key");
  });
});
