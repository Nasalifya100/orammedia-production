import { describe, expect, it, vi } from "vitest";
import {
  DevContactEmailTransport,
  ResendContactEmailTransport,
} from "@/lib/email/contact-transport";
import type { ContactFormValues } from "@/lib/validations/contact";

const sample: ContactFormValues = {
  fullName: "QA Tester",
  email: "qa@example.com",
  phone: "+260971234567",
  companyName: "Test Co",
  projectType: "narrative",
  budgetRange: "100k-250k",
  timeline: "Q4 2026",
  description: "We would like to discuss a narrative feature production.",
};

describe("contact email transport", () => {
  it("dev transport succeeds without external calls", async () => {
    const transport = new DevContactEmailTransport();
    const result = await transport.sendInquiry(sample);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.provider).toBe("dev-log");
  });

  it("resend transport succeeds on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: "msg_123" }),
      }),
    );

    const transport = new ResendContactEmailTransport(
      "test-key",
      "Oram <noreply@example.com>",
      "hello@example.com",
    );
    const result = await transport.sendInquiry(sample);
    expect(result.ok).toBe(true);
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body ?? "{}"));
    expect(body.text).toContain("New inquiry");
    expect(body.html).toContain("Oram Media Dynamics");
    expect(body.reply_to).toBe(sample.email);
    vi.unstubAllGlobals();
  });

  it("resend transport fails closed on provider error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: "upstream error" }),
      }),
    );

    const transport = new ResendContactEmailTransport(
      "test-key",
      "Oram <noreply@example.com>",
      "hello@example.com",
    );
    const result = await transport.sendInquiry(sample);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.retryable).toBe(true);
    }
    vi.unstubAllGlobals();
  });
});
