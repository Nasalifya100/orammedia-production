import "server-only";
import { getSiteUrl } from "@/lib/site-url";

export {
  assertProductionSecrets,
  isDeployedEnvironment,
  resolveSessionSecret,
} from "@/pams/security/secrets";

export type DatabaseProvider = "sqlite" | "d1";
export type StorageProviderKind = "local" | "r2";

/** Resolved server-side platform configuration (no secrets). */
export function getPlatformConfig() {
  return {
    databaseProvider: (process.env.DATABASE_PROVIDER ?? "sqlite") as DatabaseProvider,
    storageProvider: (process.env.STORAGE_PROVIDER ?? "local") as StorageProviderKind,
    r2PublicBaseUrl: process.env.R2_PUBLIC_BASE_URL ?? "",
    appUrl: getSiteUrl(),
    isProduction: process.env.NODE_ENV === "production",
    cloudflareEnv: process.env.CF_ENV ?? "local",
  };
}

export async function isCloudflareWorkersRuntime(): Promise<boolean> {
  if (process.env.DATABASE_PROVIDER === "d1") return true;
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    return Boolean(ctx?.env?.DB);
  } catch {
    return false;
  }
}
