import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/pams/repositories/production.repository", () => ({
  productionRepository: {
    countPublished: vi.fn(),
    findBySlug: vi.fn(),
    findPublished: vi.fn(),
    publishedSlugs: vi.fn(),
  },
}));

import { productionRepository } from "@/pams/repositories/production.repository";
import { productionService } from "@/pams/services/production.service";
import { getProjectBySlug } from "@/lib/data/index";

function baseProduction(overrides: Record<string, unknown> = {}) {
  return {
    id: "prod-1",
    title: "Inkondo",
    slug: "inkondo",
    kind: "tv-series",
    synopsis: "Public synopsis",
    story: null,
    challenge: null,
    creativeDirection: null,
    productionProcess: null,
    behindTheScenes: null,
    resultsJson: null,
    interestingFactsJson: null,
    alternativeTitles: null,
    oramRole: null,
    archivalCategory: "directed-by-owas",
    clientNameText: "Client",
    year: 2025,
    runtime: "Series",
    productionCompanyText: null,
    broadcaster: null,
    streamingPlatform: null,
    published: true,
    workflowStatus: "published",
    portraitPoster: false,
    featured: true,
    sortOrder: 0,
    credits: [],
    media: [
      {
        path: "/projects/inkondo-billboard.jpg",
        role: "poster",
        archiveStatus: "active",
        approvalStatus: "approved",
        sortOrder: 0,
      },
    ],
    trailers: [],
    genres: [],
    relatedFrom: [],
    ...overrides,
  };
}

describe("productionService public slug resolution", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(productionRepository.countPublished).mockResolvedValue(9);
  });

  it("returns a published production by slug", async () => {
    vi.mocked(productionRepository.findBySlug).mockResolvedValue(
      baseProduction() as never,
    );
    const project = await productionService.getPublishedBySlug("inkondo");
    expect(project?.slug).toBe("inkondo");
    expect(project?.published).toBe(true);
  });

  it("returns undefined for unknown slug", async () => {
    vi.mocked(productionRepository.findBySlug).mockResolvedValue(null);
    expect(await productionService.getPublishedBySlug("non-existent")).toBeUndefined();
  });

  it("returns undefined for draft production", async () => {
    vi.mocked(productionRepository.findBySlug).mockResolvedValue(
      baseProduction({
        slug: "strictly-by-invitation",
        title: "Strictly By Invitation",
        published: false,
        workflowStatus: "draft",
      }) as never,
    );
    expect(
      await productionService.getPublishedBySlug("strictly-by-invitation"),
    ).toBeUndefined();
  });

  it("returns undefined for unpublished workflow status", async () => {
    vi.mocked(productionRepository.findBySlug).mockResolvedValue(
      baseProduction({
        slug: "archived-title",
        published: true,
        workflowStatus: "archived",
      }) as never,
    );
    expect(await productionService.getPublishedBySlug("archived-title")).toBeUndefined();
  });
});

describe("getProjectBySlug data layer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(productionRepository.countPublished).mockResolvedValue(9);
  });

  it("resolves published slug at runtime even when absent from build-time static list", async () => {
    vi.mocked(productionRepository.publishedSlugs).mockResolvedValue(["zuba"]);
    vi.mocked(productionRepository.findBySlug).mockResolvedValue(
      baseProduction({ slug: "inkondo", title: "Inkondo" }) as never,
    );

    const buildSlugs = await productionService.getPublishedSlugs();
    expect(buildSlugs).toEqual(["zuba"]);

    const runtime = await getProjectBySlug("inkondo");
    expect(runtime?.slug).toBe("inkondo");
  });

  it("does not leak draft metadata through public query", async () => {
    vi.mocked(productionRepository.findBySlug).mockResolvedValue(
      baseProduction({
        slug: "strictly-by-invitation",
        title: "Secret Draft Title",
        synopsis: "Private synopsis",
        published: false,
        workflowStatus: "draft",
      }) as never,
    );
    expect(await getProjectBySlug("strictly-by-invitation")).toBeUndefined();
  });
});

describe("project route module", () => {
  it("does not restrict runtime slugs with dynamicParams=false", async () => {
    const mod = (await import("@/app/projects/[slug]/page")) as Record<
      string,
      unknown
    >;
    expect(mod.dynamicParams).toBeUndefined();
    expect(mod.generateStaticParams).toBeUndefined();
  });

  it("generates published metadata with canonical URL", async () => {
    vi.mocked(productionRepository.countPublished).mockResolvedValue(9);
    vi.mocked(productionRepository.findBySlug).mockResolvedValue(
      baseProduction() as never,
    );

    vi.resetModules();
    vi.stubEnv(
      "NEXT_PUBLIC_SITE_URL",
      "https://orammedia-staging.nasalifya007.workers.dev",
    );

    const { generateMetadata } = await import("@/app/projects/[slug]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "inkondo" }),
    });

    vi.unstubAllEnvs();

    expect(metadata.title).toBe("Inkondo");
    expect(metadata.alternates?.canonical).toBe(
      "https://orammedia-staging.nasalifya007.workers.dev/projects/inkondo",
    );
    expect(metadata.openGraph?.url).toBe(
      "https://orammedia-staging.nasalifya007.workers.dev/projects/inkondo",
    );
  });

  it("calls notFound for missing or draft slug (no draft metadata leak)", async () => {
    vi.resetModules();
    vi.mocked(productionRepository.countPublished).mockResolvedValue(9);
    vi.mocked(productionRepository.findBySlug).mockResolvedValue(
      baseProduction({
        slug: "strictly-by-invitation",
        title: "Secret Draft Title",
        synopsis: "Private synopsis",
        published: false,
        workflowStatus: "draft",
      }) as never,
    );

    const { generateMetadata } = await import("@/app/projects/[slug]/page");
    await expect(
      generateMetadata({
        params: Promise.resolve({ slug: "strictly-by-invitation" }),
      }),
    ).rejects.toThrow();
  });
});

describe("projects loading.tsx streaming boundary", () => {
  it("does not place loading.tsx under projects/ (prevents streamed 200 for notFound)", async () => {
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    expect(
      existsSync(join(process.cwd(), "src/app/projects/loading.tsx")),
    ).toBe(false);
  });
});
