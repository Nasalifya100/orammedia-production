import { assertProductionSecrets } from "@/platform/env";

export async function register() {
  assertProductionSecrets();
}
