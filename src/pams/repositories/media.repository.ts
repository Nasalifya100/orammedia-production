import "server-only";
import { getDb } from "@/pams/db";
import type { MediaRole } from "@/pams/types/media";

export const mediaRepository = {
  async findById(id: string) {
    const db = await getDb();
    return db.mediaAsset.findUnique({
      where: { id },
      include: {
        production: { select: { id: true, title: true, slug: true, year: true } },
        uploadedBy: { select: { name: true, email: true } },
        tags: { include: { tag: true } },
        people: { include: { person: true } },
      },
    });
  },

  async findMany(filters: {
    productionId?: string;
    role?: string;
    kind?: string;
    approvalStatus?: string;
    q?: string;
    take?: number;
    skip?: number;
  }) {
    const db = await getDb();
    const where: Record<string, unknown> = {};
    if (filters.productionId) where.productionId = filters.productionId;
    if (filters.role) where.role = filters.role;
    if (filters.kind) where.kind = filters.kind;
    if (filters.approvalStatus) where.approvalStatus = filters.approvalStatus;
    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q } },
        { filename: { contains: filters.q } },
        { originalName: { contains: filters.q } },
        { caption: { contains: filters.q } },
        { path: { contains: filters.q } },
      ];
    }

    return db.mediaAsset.findMany({
      where,
      include: {
        production: { select: { title: true, slug: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: filters.take ?? 100,
      skip: filters.skip ?? 0,
    });
  },

  async findByProduction(productionId: string) {
    const db = await getDb();
    return db.mediaAsset.findMany({
      where: { productionId },
      orderBy: [{ role: "asc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });
  },

  async findByChecksum(checksum: string) {
    const db = await getDb();
    return db.mediaAsset.findFirst({ where: { checksum } });
  },

  async findDuplicates(limit = 20) {
    const db = await getDb();
    return db.$queryRaw<{ checksum: string; count: number }[]>`
      SELECT checksum, COUNT(*) as count FROM MediaAsset
      WHERE checksum IS NOT NULL AND checksum != ''
      GROUP BY checksum HAVING count > 1
      LIMIT ${limit}
    `;
  },

  async countUnused() {
    const db = await getDb();
    return db.mediaAsset.count({
      where: { productionId: null, approvalStatus: { not: "archived" } },
    });
  },

  async create(data: Record<string, unknown>) {
    const db = await getDb();
    return db.mediaAsset.create({ data: data as never });
  },

  async update(id: string, data: Record<string, unknown>) {
    const db = await getDb();
    return db.mediaAsset.update({ where: { id }, data: data as never });
  },

  async delete(id: string) {
    const db = await getDb();
    return db.mediaAsset.delete({ where: { id } });
  },

  async setRoleForProduction(productionId: string, role: MediaRole, mediaId: string) {
    const db = await getDb();
    return db.$transaction([
      db.mediaAsset.updateMany({
        where: { productionId, role, id: { not: mediaId } },
        data: { role: "gallery" },
      }),
      db.mediaAsset.update({
        where: { id: mediaId },
        data: { productionId, role },
      }),
    ]);
  },
};
