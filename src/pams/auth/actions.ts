"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/pams/db";
import { verifyPassword } from "@/pams/auth/password";
import { checkRateLimit, LOGIN_RATE } from "@/pams/security/rate-limit";
import {
  clearSessionCookie,
  createSessionToken,
  loadUserSession,
  setSessionCookie,
} from "@/pams/auth/session";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const ipLimit = await checkRateLimit(`login:ip:${ip}`, LOGIN_RATE.max, LOGIN_RATE.windowMs);
  if (!ipLimit.allowed) {
    return { error: "Too many login attempts. Please try again later." };
  }

  const emailLimit = await checkRateLimit(
    `login:email:${email}`,
    LOGIN_RATE.max,
    LOGIN_RATE.windowMs,
  );
  if (!emailLimit.allowed) {
    return { error: "Too many login attempts. Please try again later." };
  }

  const db = await getDb();
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.active) {
    return { error: "Invalid credentials." };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return { error: "Invalid credentials." };

  const session = await loadUserSession(user.id);
  if (!session) return { error: "Unable to create session." };

  const token = await createSessionToken(session);
  await setSessionCookie(token);

  await db.auditLog.create({
    data: {
      userId: user.id,
      action: "login",
      entityType: "user",
      entityId: user.id,
      summary: `Admin login ${user.email}`,
    },
  });

  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
