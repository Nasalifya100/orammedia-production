import { describe, expect, it } from "vitest";
import {
  declaredMimeMatchesBuffer,
  detectFileFormat,
} from "@/pams/security/file-signatures";

describe("file-signatures", () => {
  it("detects JPEG", () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    expect(detectFileFormat(buf)).toBe("jpeg");
    expect(declaredMimeMatchesBuffer(buf, "image/jpeg")).toBe(true);
  });

  it("detects PNG", () => {
    const buf = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
    ]);
    expect(detectFileFormat(buf)).toBe("png");
    expect(declaredMimeMatchesBuffer(buf, "image/png")).toBe(true);
  });

  it("rejects MIME spoofing (HTML as JPEG)", () => {
    const buf = Buffer.from("<html><script>alert(1)</script></html>");
    expect(declaredMimeMatchesBuffer(buf, "image/jpeg")).toBe(false);
  });

  it("rejects unknown signatures", () => {
    const buf = Buffer.from([0x00, 0x01, 0x02]);
    expect(detectFileFormat(buf)).toBe("unknown");
  });

  it("accepts quicktime alias for MP4 ftyp", () => {
    const buf = Buffer.from([
      0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70,
      0x69, 0x73, 0x6f, 0x6d,
    ]);
    expect(declaredMimeMatchesBuffer(buf, "video/quicktime")).toBe(true);
  });
});
