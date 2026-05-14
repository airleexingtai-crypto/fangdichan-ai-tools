-- ============================================================
-- AI Tools for Real Estate — Database Setup
-- Run this entire script in Supabase SQL Editor:
--   1. Open your Supabase dashboard
--   2. Click "SQL Editor" in the left menu
--   3. Click "New query"
--   4. Paste this entire file
--   5. Click "Run"
-- ============================================================

-- ======== ENUMS ========
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'AI_GENERATED', 'HUMAN_VERIFIED', 'PUBLISHED', 'NEEDS_UPDATE', 'ARCHIVED');
CREATE TYPE "PricingModel" AS ENUM ('FREE', 'FREEMIUM', 'PAID', 'ENTERPRISE', 'FREE_TRIAL');

-- ======== TABLES ========
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT NOT NULL,
    "affiliateUrl" TEXT,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "pricingModel" "PricingModel" NOT NULL DEFAULT 'FREE',
    "pricingJson" JSONB,
    "featuresJson" JSONB,
    "prosJson" JSONB,
    "consJson" JSONB,
    "useCasesJson" JSONB,
    "foundedYear" INTEGER,
    "apiAvailable" BOOLEAN NOT NULL DEFAULT false,
    "avgRating" DECIMAL(2,1),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "verifiedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ToolCategory" (
    "toolId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ToolCategory_pkey" PRIMARY KEY ("toolId","categoryId")
);

CREATE TABLE "ToolAlternative" (
    "toolId" TEXT NOT NULL,
    "alternativeId" TEXT NOT NULL,
    "reason" TEXT,
    CONSTRAINT "ToolAlternative_pkey" PRIMARY KEY ("toolId","alternativeId")
);

CREATE TABLE "Comparison" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "winnerJson" JSONB,
    "matrixJson" JSONB,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Comparison_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ComparisonTool" (
    "comparisonId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    CONSTRAINT "ComparisonTool_pkey" PRIMARY KEY ("comparisonId","toolId")
);

CREATE TABLE "Tutorial" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "estimatedMinutes" INTEGER,
    "difficulty" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    CONSTRAINT "Tutorial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TutorialTool" (
    "tutorialId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    CONSTRAINT "TutorialTool_pkey" PRIMARY KEY ("tutorialId","toolId")
);

CREATE TABLE "StatPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heroStat" TEXT,
    "heroLabel" TEXT,
    "content" TEXT,
    "chartJson" JSONB,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    CONSTRAINT "StatPage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StatSource" (
    "id" TEXT NOT NULL,
    "statPageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publisher" TEXT,
    "year" INTEGER,
    "quoteText" TEXT,
    CONSTRAINT "StatSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "source" TEXT,
    "sourceUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AffiliateClick" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "pageSlug" TEXT,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT,
    CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ToolTranslation" (
    "id" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT,
    "tagline" TEXT,
    "description" TEXT,
    CONSTRAINT "ToolTranslation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LocaleContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "LocaleContent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentVerification" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "verifiedBy" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "changesJson" JSONB,
    CONSTRAINT "ContentVerification_pkey" PRIMARY KEY ("id")
);

-- ======== INDEXES ========
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");
CREATE INDEX "Tool_status_publishedAt_idx" ON "Tool"("status", "publishedAt");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");
CREATE UNIQUE INDEX "Comparison_slug_key" ON "Comparison"("slug");
CREATE INDEX "Comparison_status_publishedAt_idx" ON "Comparison"("status", "publishedAt");
CREATE UNIQUE INDEX "Tutorial_slug_key" ON "Tutorial"("slug");
CREATE INDEX "Tutorial_status_publishedAt_idx" ON "Tutorial"("status", "publishedAt");
CREATE UNIQUE INDEX "StatPage_slug_key" ON "StatPage"("slug");
CREATE INDEX "StatPage_status_publishedAt_idx" ON "StatPage"("status", "publishedAt");
CREATE INDEX "StatSource_statPageId_idx" ON "StatSource"("statPageId");
CREATE INDEX "Review_toolId_idx" ON "Review"("toolId");
CREATE INDEX "AffiliateClick_toolId_clickedAt_idx" ON "AffiliateClick"("toolId", "clickedAt");
CREATE UNIQUE INDEX "ToolTranslation_toolId_locale_key" ON "ToolTranslation"("toolId", "locale");
CREATE INDEX "ToolTranslation_locale_idx" ON "ToolTranslation"("locale");
CREATE UNIQUE INDEX "LocaleContent_key_locale_key" ON "LocaleContent"("key", "locale");

-- ======== FOREIGN KEYS ========
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ToolCategory" ADD CONSTRAINT "ToolCategory_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ToolCategory" ADD CONSTRAINT "ToolCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ToolAlternative" ADD CONSTRAINT "ToolAlternative_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ToolAlternative" ADD CONSTRAINT "ToolAlternative_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ComparisonTool" ADD CONSTRAINT "ComparisonTool_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ComparisonTool" ADD CONSTRAINT "ComparisonTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tutorial" ADD CONSTRAINT "Tutorial_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TutorialTool" ADD CONSTRAINT "TutorialTool_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TutorialTool" ADD CONSTRAINT "TutorialTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StatPage" ADD CONSTRAINT "StatPage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StatSource" ADD CONSTRAINT "StatSource_statPageId_fkey" FOREIGN KEY ("statPageId") REFERENCES "StatPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AffiliateClick" ADD CONSTRAINT "AffiliateClick_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ToolTranslation" ADD CONSTRAINT "ToolTranslation_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
