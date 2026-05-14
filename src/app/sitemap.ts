import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aitools.realestate";
  const locales = ["en", "zh"];

  // Fetch all published content
  const [tools, categories, tutorials, stats, comparisons] = await Promise.all([
    supabase.from("Tool").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("Category").select("slug, updated_at"),
    supabase.from("Tutorial").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("StatPage").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("Comparison").select("slug, updated_at").eq("status", "PUBLISHED"),
  ]);

  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    { url: `${baseUrl}/${locale}`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/${locale}/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/${locale}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/${locale}/compare`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/${locale}/tutorials`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/${locale}/stats`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/${locale}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/${locale}/glossary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/${locale}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.3 },
  ]);

  const generateLocalePages = (items: any[], path: string, freq: string, pri: number) =>
    locales.flatMap((locale) =>
      (items || []).map((item: any) => ({
        url: `${baseUrl}/${locale}/${path}/${item.slug}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: freq as "weekly" | "monthly",
        priority: pri,
      }))
    );

  const toolPages = generateLocalePages(tools.data, "tools", "weekly", 0.8);
  const categoryPages = generateLocalePages(categories.data, "categories", "weekly", 0.7);
  const tutorialPages = generateLocalePages(tutorials.data, "tutorials", "monthly", 0.6);
  const statsPages = generateLocalePages(stats.data, "stats", "monthly", 0.6);
  const comparisonPages = generateLocalePages(comparisons.data, "compare", "weekly", 0.8);

  return [...staticPages, ...toolPages, ...categoryPages, ...tutorialPages, ...statsPages, ...comparisonPages];
}
