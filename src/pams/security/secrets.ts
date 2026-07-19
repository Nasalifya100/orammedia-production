import "server-only";

const DEV_FALLBACK = "oram-pams-dev-secret-change-me-local-only";

export function isDeployedEnvironment(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.CF_ENV === "staging" ||
    process.env.CF_ENV === "production"
  );
}

export function resolveSessionSecret(): string {
  const secret = process.env.PAMS_SESSION_SECRET;
  if (isDeployedEnvironment()) {
    if (!secret || secret.length < 32 || /change-me/i.test(secret)) {
      throw new Error(
        "PAMS_SESSION_SECRET must be a strong value (≥32 chars) in deployed environments.",
      );
    }
    return secret;
  }
  return secret || DEV_FALLBACK;
}

export function assertProductionSecrets(): void {
  if (!isDeployedEnvironment()) return;

  resolveSessionSecret();

  const bootstrapPassword = process.env.PAMS_BOOTSTRAP_PASSWORD;
  if (
    bootstrapPassword === "admin123" ||
    bootstrapPassword === "password" ||
    bootstrapPassword === "oram-admin-change-me"
  ) {
    throw new Error("Insecure default bootstrap password detected.");
  }
}
