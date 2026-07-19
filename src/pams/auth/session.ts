import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { resolveSessionSecret } from "@/pams/security/secrets";

const COOKIE = "pams_session";
const TTL = "7d";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
};

function secretKey() {
  return new TextEncoder().encode(resolveSessionSecret());
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ sub: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TTL)
    .sign(secretKey());
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const userId = String(payload.sub);
    if (!userId) return null;
    return loadUserSession(userId);
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.CF_ENV === "staging" ||
    process.env.CF_ENV === "production";
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.CF_ENV === "staging" ||
    process.env.CF_ENV === "production";
  jar.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
}

export async function requireAdminSession(
  permission?: string,
): Promise<SessionUser> {
  const session = await readSession();
  if (!session) throw new Error("UNAUTHORIZED");
  if (
    permission &&
    !session.permissions.includes(permission) &&
    session.role !== "superadmin"
  ) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function loadUserSession(userId: string): Promise<SessionUser | null> {
  const { getDb } = await import("@/pams/db");
  const db = await getDb();
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: { include: { permission: true } },
        },
      },
    },
  });
  if (!user || !user.active) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role.name,
    permissions: user.role.permissions.map((p) => p.permission.key),
  };
}

export function hasPermission(session: SessionUser, permission: string): boolean {
  return session.role === "superadmin" || session.permissions.includes(permission);
}
