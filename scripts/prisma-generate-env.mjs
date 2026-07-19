import { execSync } from "node:child_process";

const generator = process.env.PRISMA_GENERATOR || "client";
if (generator !== "client" && generator !== "cloudflare") {
  console.error(`Invalid PRISMA_GENERATOR=${generator}`);
  process.exit(1);
}

execSync(`npx prisma generate --generator ${generator}`, {
  stdio: "inherit",
  env: process.env,
});
