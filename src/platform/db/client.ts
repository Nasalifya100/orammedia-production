import "server-only";
import path from "node:path";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@/generated/prisma/client";
import { isCloudflareWorkersRuntime } from "@/platform/env";

const globalForPrisma = globalThis as unknown as {
  pamsLocalPrisma?: PrismaClient;
  pamsD1Prisma?: PrismaClient;
  pamsD1Binding?: unknown;
};

function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/pams.db";
  if (!raw.startsWith("file:")) return raw;
  const rel = raw.replace(/^file:/, "");
  if (path.isAbsolute(rel)) return `file:${rel}`;
  return `file:${path.join(/* turbopackIgnore: true */ process.cwd(), rel)}`;
}

async function createLocalClient(): Promise<PrismaClient> {
  // Keep better-sqlite3 out of the Workers bundle (native/WASM incompatible path).
  const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
  const adapter = new PrismaBetterSqlite3({ url: resolveDatabaseUrl() });
  return new PrismaClient({ adapter });
}

export async function getLocalDb(): Promise<PrismaClient> {
  if (!globalForPrisma.pamsLocalPrisma) {
    globalForPrisma.pamsLocalPrisma = await createLocalClient();
  }
  return globalForPrisma.pamsLocalPrisma;
}

async function createD1Client(): Promise<PrismaClient> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext({ async: true });
  const binding = env.DB as D1Database | undefined;
  if (!binding) {
    throw new Error("D1 binding DB is not configured in wrangler.jsonc");
  }

  if (
    globalForPrisma.pamsD1Prisma &&
    globalForPrisma.pamsD1Binding === binding
  ) {
    return globalForPrisma.pamsD1Prisma;
  }

  const client = new PrismaClient({ adapter: new PrismaD1(binding) });
  globalForPrisma.pamsD1Binding = binding;
  globalForPrisma.pamsD1Prisma = client;
  return client;
}

/** Environment-aware PAMS database client. */
export async function getDb(): Promise<PrismaClient> {
  if (await isCloudflareWorkersRuntime()) {
    return createD1Client();
  }
  return getLocalDb();
}

export type { PrismaClient };
