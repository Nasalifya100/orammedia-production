-- CreateTable
CREATE TABLE "UploadSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "productionId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'gallery',
    "maxBytes" INTEGER NOT NULL,
    "multipartId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "filename" TEXT NOT NULL,
    "originalName" TEXT,
    "path" TEXT NOT NULL,
    "storageProvider" TEXT NOT NULL DEFAULT 'local',
    "objectKey" TEXT,
    "processingStatus" TEXT NOT NULL DEFAULT 'complete',
    "mimeType" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'image',
    "role" TEXT NOT NULL DEFAULT 'gallery',
    "productionId" TEXT,
    "location" TEXT,
    "photographer" TEXT,
    "camera" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "aspectRatio" TEXT,
    "colourSpace" TEXT,
    "fileSize" INTEGER,
    "checksum" TEXT,
    "description" TEXT,
    "copyright" TEXT,
    "expiry" DATETIME,
    "rightsOwner" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending',
    "verificationStatus" TEXT NOT NULL DEFAULT 'unverified',
    "usageRights" TEXT,
    "altText" TEXT,
    "caption" TEXT,
    "heroEligible" BOOLEAN NOT NULL DEFAULT false,
    "posterEligible" BOOLEAN NOT NULL DEFAULT false,
    "thumbnailEligible" BOOLEAN NOT NULL DEFAULT false,
    "homepageEligible" BOOLEAN NOT NULL DEFAULT false,
    "socialEligible" BOOLEAN NOT NULL DEFAULT false,
    "ogEligible" BOOLEAN NOT NULL DEFAULT false,
    "archiveStatus" TEXT NOT NULL DEFAULT 'active',
    "variantsJson" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "uploadedByUserId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MediaAsset_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "Production" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MediaAsset_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MediaAsset" ("altText", "approvalStatus", "archiveStatus", "aspectRatio", "camera", "caption", "colourSpace", "createdAt", "fileSize", "filename", "height", "heroEligible", "id", "kind", "location", "mimeType", "ogEligible", "originalName", "path", "photographer", "productionId", "rightsOwner", "role", "socialEligible", "sortOrder", "updatedAt", "usageRights", "width") SELECT "altText", "approvalStatus", "archiveStatus", "aspectRatio", "camera", "caption", "colourSpace", "createdAt", "fileSize", "filename", "height", "heroEligible", "id", "kind", "location", "mimeType", "ogEligible", "originalName", "path", "photographer", "productionId", "rightsOwner", "role", "socialEligible", "sortOrder", "updatedAt", "usageRights", "width" FROM "MediaAsset";
DROP TABLE "MediaAsset";
ALTER TABLE "new_MediaAsset" RENAME TO "MediaAsset";
CREATE INDEX "MediaAsset_productionId_role_idx" ON "MediaAsset"("productionId", "role");
CREATE INDEX "MediaAsset_approvalStatus_idx" ON "MediaAsset"("approvalStatus");
CREATE INDEX "MediaAsset_heroEligible_idx" ON "MediaAsset"("heroEligible");
CREATE INDEX "MediaAsset_checksum_idx" ON "MediaAsset"("checksum");
CREATE INDEX "MediaAsset_kind_idx" ON "MediaAsset"("kind");
CREATE INDEX "MediaAsset_storageProvider_idx" ON "MediaAsset"("storageProvider");
CREATE INDEX "MediaAsset_objectKey_idx" ON "MediaAsset"("objectKey");
CREATE TABLE "new_Production" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "alternativeTitles" TEXT,
    "year" INTEGER,
    "yearNote" TEXT,
    "runtime" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'feature',
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "workflowStatus" TEXT NOT NULL DEFAULT 'draft',
    "archivalCategory" TEXT NOT NULL DEFAULT 'requires-verification',
    "synopsis" TEXT,
    "story" TEXT,
    "challenge" TEXT,
    "creativeDirection" TEXT,
    "productionProcess" TEXT,
    "behindTheScenes" TEXT,
    "productionNotes" TEXT,
    "resultsJson" TEXT,
    "interestingFactsJson" TEXT,
    "oramRole" TEXT,
    "owasRole" TEXT,
    "productionCompanyId" TEXT,
    "productionCompanyText" TEXT,
    "clientId" TEXT,
    "clientNameText" TEXT,
    "broadcaster" TEXT,
    "streamingPlatform" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 999,
    "portraitPoster" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoCanonical" TEXT,
    "homepageCampaign" TEXT,
    "flagshipCandidate" BOOLEAN NOT NULL DEFAULT false,
    "wizardStep" TEXT NOT NULL DEFAULT 'overview',
    "wizardCompletedJson" TEXT,
    "rightsChecklistJson" TEXT,
    "verificationNotes" TEXT,
    "rightsNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Production_productionCompanyId_fkey" FOREIGN KEY ("productionCompanyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Production_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Production" ("alternativeTitles", "archivalCategory", "behindTheScenes", "broadcaster", "challenge", "clientId", "clientNameText", "createdAt", "creativeDirection", "featured", "id", "interestingFactsJson", "kind", "oramRole", "owasRole", "portraitPoster", "productionCompanyId", "productionCompanyText", "productionNotes", "productionProcess", "published", "resultsJson", "rightsNotes", "runtime", "seoDescription", "seoTitle", "slug", "sortOrder", "status", "story", "streamingPlatform", "synopsis", "title", "updatedAt", "verificationNotes", "workflowStatus", "year", "yearNote") SELECT "alternativeTitles", "archivalCategory", "behindTheScenes", "broadcaster", "challenge", "clientId", "clientNameText", "createdAt", "creativeDirection", "featured", "id", "interestingFactsJson", "kind", "oramRole", "owasRole", "portraitPoster", "productionCompanyId", "productionCompanyText", "productionNotes", "productionProcess", "published", "resultsJson", "rightsNotes", "runtime", "seoDescription", "seoTitle", "slug", "sortOrder", "status", "story", "streamingPlatform", "synopsis", "title", "updatedAt", "verificationNotes", "workflowStatus", "year", "yearNote" FROM "Production";
DROP TABLE "Production";
ALTER TABLE "new_Production" RENAME TO "Production";
CREATE UNIQUE INDEX "Production_slug_key" ON "Production"("slug");
CREATE INDEX "Production_workflowStatus_idx" ON "Production"("workflowStatus");
CREATE INDEX "Production_published_featured_sortOrder_idx" ON "Production"("published", "featured", "sortOrder");
CREATE INDEX "Production_archivalCategory_idx" ON "Production"("archivalCategory");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "UploadSession_userId_status_idx" ON "UploadSession"("userId", "status");

-- CreateIndex
CREATE INDEX "UploadSession_expiresAt_idx" ON "UploadSession"("expiresAt");

