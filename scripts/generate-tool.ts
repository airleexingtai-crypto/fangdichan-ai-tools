/**
 * generate-tool.ts — AI-powered tool profile generator
 *
 * Usage: npx tsx scripts/generate-tool.ts "Tool Name" "https://tool-website.com"
 *
 * Flow:
 * 1. Scrapes the tool's website for pricing, features, description
 * 2. Sends structured prompt to Claude API
 * 3. Validates output with Zod schema
 * 4. Inserts into database with status: AI_GENERATED
 * 5. Outputs the tool ID for human verification
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { generateSlug } from "../src/lib/utils";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// JSON schema for tool profile output
const toolProfileSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().max(160),
  description: z.string().min(100).max(2000),
  features: z.array(z.object({
    name: z.string(),
    description: z.string(),
    tier: z.enum(["free", "pro", "enterprise"]),
  })).max(20),
  pricing_tiers: z.array(z.object({
    name: z.string(),
    price: z.string(),
    billing_period: z.string().optional(),
    features: z.array(z.string()),
    highlighted: z.boolean().default(false),
  })).max(5),
  pros: z.array(z.string()).min(3).max(5),
  cons: z.array(z.string()).min(2).max(4),
  use_cases: z.array(z.object({
    title: z.string(),
    description: z.string(),
    who_for: z.string(),
  })).min(1).max(5),
  seo_title: z.string().max(60),
  seo_description: z.string().max(160),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).min(3).max(5),
});

type ToolProfile = z.infer<typeof toolProfileSchema>;

const SYSTEM_PROMPT = `You are a technical writer specializing in AI tools for the real estate industry.
Given raw data about a real estate AI tool, produce a structured JSON Tool Profile.

CRITICAL RULES:
1. Every factual claim MUST be traceable to the provided raw data
2. Do NOT invent features, pricing, or capabilities not in the source data
3. Write in clear, professional English — no marketing fluff
4. Be balanced: include honest pros AND cons
5. SEO metadata: primary keyword first, under character limits
6. FAQs should address real questions prospects would ask`;

async function generateTool(toolName: string, websiteUrl: string) {
  console.log(`\n🔍 Generating tool profile for: ${toolName}`);
  console.log(`🌐 Website: ${websiteUrl}`);

  // Step 1: Collect raw data
  // In production, use Firecrawl or Cheerio to scrape the website
  // For now, use a placeholder that the AI prompt will work with
  const rawData = {
    toolName,
    websiteUrl,
    // Scraped data would go here in production
    scrapedContent: `Please search for information about "${toolName}" at ${websiteUrl}.
    Look for: pricing plans, features, use cases, target audience, founding year, API availability.
    Search G2, ProductHunt, and Capterra for reviews and ratings.`,
  };

  // Step 2: Call Claude API with structured output
  console.log("🤖 Calling Claude API...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate a Tool Profile JSON for the following real estate AI tool:\n\n${JSON.stringify(rawData, null, 2)}\n\nOutput valid JSON matching the required schema.`,
      },
    ],
  });

  // Step 3: Parse and validate
  const content = response.content[0];
  if (content.type !== "text") throw new Error("Expected text response from Claude");
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in Claude response");

  const parsed = JSON.parse(jsonMatch[0]);
  const validated = toolProfileSchema.parse(parsed);
  console.log("✅ Claude output validated");

  // Step 4: Insert into database
  const slug = generateSlug(validated.name);
  console.log(`📝 Creating tool with slug: ${slug}`);

  const tool = await prisma.tool.create({
    data: {
      slug,
      name: validated.name,
      tagline: validated.tagline,
      websiteUrl,
      description: validated.description,
      pricingModel: validated.pricing_tiers.length > 0 ? "PAID" : "FREE",
      pricingJson: validated.pricing_tiers,
      featuresJson: validated.features,
      prosJson: validated.pros,
      consJson: validated.cons,
      useCasesJson: validated.use_cases,
      status: "AI_GENERATED",
    },
  });

  console.log(`\n✅ Tool created successfully!`);
  console.log(`   ID:     ${tool.id}`);
  console.log(`   Slug:   ${tool.slug}`);
  console.log(`   Status: AI_GENERATED — ready for human verification`);
  console.log(`\n👉 Next step: Open /en/admin to verify and publish this tool.\n`);

  return tool;
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: npx tsx scripts/generate-tool.ts <tool-name> <website-url>");
    process.exit(1);
  }

  const [toolName, websiteUrl] = args;
  try {
    await generateTool(toolName, websiteUrl);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
