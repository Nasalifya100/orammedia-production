import { getDb } from "@/pams/db";

export const statsService = {
  async dashboard() {
    const db = await getDb();
    const [
      productions,
      published,
      people,
      media,
      trailers,
      verificationOpen,
      rightsPending,
      missingPosters,
    ] = await Promise.all([
      db.production.count(),
      db.production.count({
        where: { published: true, workflowStatus: "published" },
      }),
      db.person.count(),
      db.mediaAsset.count(),
      db.trailer.count(),
      db.verificationItem.count({ where: { status: "open" } }),
      db.rightsRecord.count({ where: { status: "pending" } }),
      db.production.count({
        where: {
          published: true,
          media: { none: { role: "poster" } },
        },
      }),
    ]);

    const byWorkflow = await db.production.groupBy({
      by: ["workflowStatus"],
      _count: true,
    });

    const byCategory = await db.production.groupBy({
      by: ["archivalCategory"],
      _count: true,
    });

    const missingTrailers = await db.production.count({
      where: {
        published: true,
        trailers: { none: {} },
      },
    });

    const missingBts = await db.production.count({
      where: {
        published: true,
        media: { none: { role: "bts" } },
      },
    });

    const completeness =
      published === 0
        ? 0
        : Math.round(
            ((published * 4 -
              missingPosters -
              missingTrailers -
              missingBts -
              verificationOpen) /
              (published * 4)) *
              100,
          );

    return {
      productions,
      published,
      people,
      media,
      trailers,
      verificationOpen,
      rightsPending,
      missingPosters,
      missingTrailers,
      missingBts,
      completeness: Math.max(0, Math.min(100, completeness)),
      byWorkflow,
      byCategory,
    };
  },
};
