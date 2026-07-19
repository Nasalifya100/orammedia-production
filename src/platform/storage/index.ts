import "server-only";
import { getPlatformConfig, isCloudflareWorkersRuntime } from "@/platform/env";
import { LocalStorageProvider } from "@/platform/storage/local-provider";
import { R2StorageProvider } from "@/platform/storage/r2-provider";
import type { StorageProvider } from "@/platform/storage/types";

let localProvider: LocalStorageProvider | null = null;
let r2Provider: R2StorageProvider | null = null;

export async function getStorage(): Promise<StorageProvider> {
  const config = getPlatformConfig();
  if (config.storageProvider === "r2" || (await isCloudflareWorkersRuntime())) {
    if (!r2Provider) r2Provider = new R2StorageProvider();
    return r2Provider;
  }
  if (!localProvider) localProvider = new LocalStorageProvider();
  return localProvider;
}

export { sha256, safeFilename } from "@/platform/storage/crypto";
export {
  buildObjectKey,
  buildLocalPublicPath,
  storedNameFromOriginal,
  variantSuffixPath,
} from "@/platform/storage/keys";
