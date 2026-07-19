import { getDb } from "@/pams/db";

export const productionInclude = {
  credits: { orderBy: { billingOrder: "asc" as const } },
  media: { orderBy: { sortOrder: "asc" as const } },
  trailers: true,
  genres: { include: { genre: true } },
  relatedFrom: { include: { toProduction: { select: { slug: true } } } },
} as const;

export const productionRepository = {
  async countPublished() {
    const db = await getDb();
    return db.production.count({
      where: { published: true, workflowStatus: "published" },
    });
  },

  async findPublished() {
    const db = await getDb();
    return db.production.findMany({
      where: { published: true, workflowStatus: "published" },
      include: productionInclude,
      orderBy: { sortOrder: "asc" },
    });
  },

  async findFeatured() {
    const db = await getDb();
    return db.production.findMany({
      where: {
        published: true,
        workflowStatus: "published",
        featured: true,
      },
      include: productionInclude,
      orderBy: { sortOrder: "asc" },
    });
  },

  async findBySlug(slug: string) {
    const db = await getDb();
    return db.production.findUnique({
      where: { slug },
      include: productionInclude,
    });
  },

  async findAllAdmin() {
    const db = await getDb();
    return db.production.findMany({
      include: {
        media: true,
        trailers: true,
        credits: true,
        _count: { select: { media: true, trailers: true, credits: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
  },

  async findById(id: string) {
    const db = await getDb();
    return db.production.findUnique({
      where: { id },
      include: {
        ...productionInclude,
        verifications: true,
        rights: true,
        awards: { include: { award: true } },
        festivals: { include: { festival: true } },
      },
    });
  },

  async create(data: {
    title: string;
    slug: string;
    archivalCategory?: string;
    workflowStatus?: string;
  }) {
    const db = await getDb();
    return db.production.create({
      data: {
        title: data.title,
        slug: data.slug,
        archivalCategory: data.archivalCategory ?? "requires-verification",
        workflowStatus: data.workflowStatus ?? "draft",
      },
    });
  },

  async update(id: string, data: Record<string, unknown>) {
    const db = await getDb();
    return db.production.update({ where: { id }, data });
  },

  async search(query: string) {
    const db = await getDb();
    return db.production.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { synopsis: { contains: query } },
          { slug: { contains: query } },
        ],
      },
      take: 40,
      orderBy: { title: "asc" },
    });
  },

  async publishedSlugs() {
    const db = await getDb();
    const rows = await db.production.findMany({
      where: { published: true, workflowStatus: "published" },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  },
};
