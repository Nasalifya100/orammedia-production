import type { ContactFormValues } from "@/lib/validations/contact";

export type ContactDeliveryResult =
  | { ok: true; provider: string; messageId?: string }
  | { ok: false; provider: string; error: string; retryable: boolean };

export interface ContactEmailTransport {
  sendInquiry(data: ContactFormValues): Promise<ContactDeliveryResult>;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(data: ContactFormValues): string {
  return `
    <h2>New inquiry — Oram Media Dynamics</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Company:</strong> ${escapeHtml(data.companyName)}</p>
    <p><strong>Project type:</strong> ${escapeHtml(data.projectType)}</p>
    <p><strong>Budget:</strong> ${escapeHtml(data.budgetRange)}</p>
    <p><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>
    <p><strong>Description:</strong></p>
    <p>${escapeHtml(data.description).replace(/\n/g, "<br/>")}</p>
  `.trim();
}

function buildEmailText(data: ContactFormValues): string {
  return [
    "New inquiry — Oram Media Dynamics",
    "",
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Company: ${data.companyName}`,
    `Project type: ${data.projectType}`,
    `Budget: ${data.budgetRange}`,
    `Timeline: ${data.timeline}`,
    "",
    "Description:",
    data.description,
  ].join("\n");
}

/** Local dev — logs metadata only, never message body or email address. */
export class DevContactEmailTransport implements ContactEmailTransport {
  async sendInquiry(data: ContactFormValues): Promise<ContactDeliveryResult> {
    console.info("[contact:dev] Inquiry captured (not sent)", {
      projectType: data.projectType,
      budgetRange: data.budgetRange,
      company: data.companyName,
      timestamp: new Date().toISOString(),
    });
    return { ok: true, provider: "dev-log" };
  }
}

/** Resend HTTP API — production/staging transport. */
export class ResendContactEmailTransport implements ContactEmailTransport {
  constructor(
    private apiKey: string,
    private from: string,
    private to: string,
  ) {}

  async sendInquiry(data: ContactFormValues): Promise<ContactDeliveryResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.from,
          to: [this.to],
          reply_to: data.email,
          subject: `New inquiry: ${data.projectType} — ${data.companyName}`,
          html: buildEmailHtml(data),
          text: buildEmailText(data),
        }),
        signal: controller.signal,
      });

      const payload = (await res.json().catch(() => ({}))) as {
        id?: string;
        message?: string;
      };

      if (!res.ok) {
        return {
          ok: false,
          provider: "resend",
          error: payload.message || `Resend HTTP ${res.status}`,
          retryable: res.status >= 500 || res.status === 429,
        };
      }

      return { ok: true, provider: "resend", messageId: payload.id };
    } catch (error) {
      const retryable = error instanceof Error && error.name === "AbortError";
      return {
        ok: false,
        provider: "resend",
        error: error instanceof Error ? error.message : "Email delivery failed",
        retryable,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

export function createContactEmailTransport(): ContactEmailTransport {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  const mode = process.env.CONTACT_EMAIL_MODE ?? "auto";

  const isDeployed =
    process.env.NODE_ENV === "production" ||
    process.env.CF_ENV === "staging" ||
    process.env.CF_ENV === "production";

  if (mode === "dev" || (!isDeployed && mode === "auto")) {
    return new DevContactEmailTransport();
  }

  if (apiKey && from && to) {
    return new ResendContactEmailTransport(apiKey, from, to);
  }

  if (isDeployed) {
    throw new Error(
      "Contact email transport not configured. Set RESEND_API_KEY, CONTACT_FROM_EMAIL, and CONTACT_TO_EMAIL.",
    );
  }

  return new DevContactEmailTransport();
}
