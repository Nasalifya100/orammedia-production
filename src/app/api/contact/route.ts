import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { createContactEmailTransport } from "@/lib/email/contact-transport";
import {
  checkRateLimit,
  clientIpFromHeaders,
  CONTACT_RATE,
  rateLimitHeaders,
} from "@/pams/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIpFromHeaders(request.headers);

    const limited = await checkRateLimit(
      `contact:ip:${ip}`,
      CONTACT_RATE.max,
      CONTACT_RATE.windowMs,
    );
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: rateLimitHeaders(limited) },
      );
    }

    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.flatten() },
        { status: 400 },
      );
    }

    const transport = createContactEmailTransport();
    const delivery = await transport.sendInquiry(result.data);

    if (!delivery.ok) {
      console.error("[contact] Delivery failed:", {
        provider: delivery.provider,
        retryable: delivery.retryable,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        {
          error: delivery.retryable
            ? "Unable to send your inquiry right now. Please try again shortly."
            : "Unable to process your inquiry. Please contact us directly.",
        },
        { status: delivery.retryable ? 503 : 500 },
      );
    }

    console.info("[contact] Inquiry delivered:", {
      provider: delivery.provider,
      projectType: result.data.projectType,
      company: result.data.companyName,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Inquiry received successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[contact] Unexpected error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
