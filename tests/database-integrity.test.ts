import path from "node:path";
import { describe, expect, it } from "vitest";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const dbPath = path.join(process.cwd(), "prisma/pams.db");

describe("database release gates", () => {
  const db = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: `file:${dbPath}` }),
  });

  it("has website builder tables", async () => {
    expect(await db.websiteConfig.count()).toBeGreaterThanOrEqual(0);
    expect(await db.websiteSnapshot.count()).toBeGreaterThanOrEqual(0);
  });

  it("excludes drafts from published queries", async () => {
    const published = await db.production.findMany({
      where: { published: true, workflowStatus: "published" },
      select: { slug: true },
    });
    const drafts = await db.production.findMany({
      where: { published: false },
      select: { slug: true },
    });
    for (const d of drafts) {
      expect(published.some((p) => p.slug === d.slug)).toBe(false);
    }
  });

  it("preserves Inkondo flagship in website config", async () => {
    const row = await db.websiteConfig.findFirst({
      where: { id: { in: ["draft", "published"] } },
    });
    if (!row) return;
    const config = JSON.parse(row.configJson) as { flagship?: { productionSlug?: string } };
    expect(config.flagship?.productionSlug).toBe("inkondo");
  });

  it("migration history is complete", async () => {
    const migrations = await db.$queryRawUnsafe<{ migration_name: string }[]>(
      "SELECT migration_name FROM _prisma_migrations WHERE rolled_back_at IS NULL",
    );
    const names = migrations.map((m) => m.migration_name);
    expect(names).toContain("20250717_website_builder");
    expect(names).toContain("20260717010405_init_pams");
  });
});
