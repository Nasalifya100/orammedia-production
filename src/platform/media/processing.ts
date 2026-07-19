import "server-only";
import { isCloudflareWorkersRuntime } from "@/platform/env";
import type { MediaVariants } from "@/pams/types/media";

export type ProcessingStatus = "complete" | "pending_variants" | "failed";

export async function getImageProcessingCapability(): Promise<{
  canProcessServerSide: boolean;
  strategy: "sharp-local" | "deferred-r2" | "none";
}> {
  if (await isCloudflareWorkersRuntime()) {
    return { canProcessServerSide: false, strategy: "deferred-r2" };
  }
  return { canProcessServerSide: true, strategy: "sharp-local" };
}

export async function processImageVariantsForStorage(input: {
  buffer: Buffer;
  publicPath: string;
  writeVariant: (path: string, data: Buffer) => Promise<void>;
}): Promise<{
  variants: MediaVariants;
  width: number;
  height: number;
  processingStatus: ProcessingStatus;
}> {
  const cap = await getImageProcessingCapability();

  if (!cap.canProcessServerSide) {
    return {
      variants: {},
      width: 0,
      height: 0,
      processingStatus: "pending_variants",
    };
  }

  const { processImageVariantsLocal } = await import(
    "@/platform/media/processor-local"
  );
  const result = await processImageVariantsLocal(input.buffer, input.publicPath, input.writeVariant);
  return { ...result, processingStatus: "complete" };
}
