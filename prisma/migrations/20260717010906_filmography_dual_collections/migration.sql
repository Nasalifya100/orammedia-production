-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FilmographyEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collection" TEXT NOT NULL,
    "productionId" TEXT,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 0,
    "yearNote" TEXT,
    "kind" TEXT,
    "notes" TEXT,
    "oramInvolvement" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 999,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FilmographyEntry_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FilmographyEntry" ("collection", "createdAt", "id", "kind", "notes", "oramInvolvement", "productionId", "published", "sortOrder", "title", "updatedAt", "year", "yearNote") SELECT "collection", "createdAt", "id", "kind", "notes", "oramInvolvement", "productionId", "published", "sortOrder", "title", "updatedAt", coalesce("year", 0) AS "year", "yearNote" FROM "FilmographyEntry";
DROP TABLE "FilmographyEntry";
ALTER TABLE "new_FilmographyEntry" RENAME TO "FilmographyEntry";
CREATE INDEX "FilmographyEntry_collection_sortOrder_idx" ON "FilmographyEntry"("collection", "sortOrder");
CREATE INDEX "FilmographyEntry_productionId_idx" ON "FilmographyEntry"("productionId");
CREATE UNIQUE INDEX "FilmographyEntry_collection_title_year_key" ON "FilmographyEntry"("collection", "title", "year");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
