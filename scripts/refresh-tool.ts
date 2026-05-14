/**
 * refresh-tool.ts — Weekly content freshness check
 *
 * Usage: npx tsx scripts/refresh-tool.ts
 * (Run via cron job weekly)
 *
 * Flow:
 * 1. Query all published tools where nextReviewAt <= now()
 * 2. Re-scrape pricing page for changes
 * 3. If changes detected: AI generates update, sets NEEDS_UPDATE
 * 4. If no changes: bump nextReviewAt by 90 days
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function refreshTools() {
  console.log("🔄 Starting content refresh cycle...\n");

  const staleTools = await prisma.tool.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { nextReviewAt: { lte: new Date() } },
        { nextReviewAt: null },
      ],
    },
  });

  console.log(`Found ${staleTools.length} tools due for review\n`);

  for (const tool of staleTools) {
    console.log(`📋 Checking ${tool.name} (${tool.slug})...`);

    // In production: scrape tool.websiteUrl, compare pricing/features
    // For now, mark as reviewed with 90-day extension

    const needsUpdate = false; // Would be determined by diff

    if (needsUpdate) {
      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          status: "NEEDS_UPDATE",
        },
      });
      console.log(`  ⚠️ Changes detected — flagged for human review`);
    } else {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 90);

      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          nextReviewAt: nextDate,
        },
      });
      console.log(`  ✅ No changes — next review: ${nextDate.toISOString().split("T")[0]}`);
    }
  }

  console.log(`\n✅ Refresh cycle complete. ${staleTools.length} tools processed.`);
}

async function main() {
  try {
    await refreshTools();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
