import { execSync } from "node:child_process";
import fs from "node:fs";

const sql = execSync(
  "npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script",
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
);

fs.mkdirSync("migrations", { recursive: true });
fs.writeFileSync("migrations/0001_init.sql", sql);
console.log(`Wrote migrations/0001_init.sql (${sql.length} bytes)`);
