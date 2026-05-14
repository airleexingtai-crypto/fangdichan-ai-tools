import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aitools.realestate";

  // Fetch all published content
  const [tools, categories, tutorials, stats, comparisons] = await Promise.all([
    supabase.from("Tool").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("Category").select("slug, updated_at"),
    supabase.from("Tutorial").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("StatPage").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("Comparison").select("slug, updated_at").eq("status", "PUBLISHED"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/en/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/en/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/en/compare`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/en/tutorials`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/en/stats`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/en/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/en/glossary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/en/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.3 },
  ];

  const toolPages: MetadataRoute.Sitemap = (tools.data || []).map((t: any) => ({
    url: `${baseUrl}/en/tools/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = (categories.data || []).map((c: any) => ({
    url: `${baseUrl}/en/categories/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const tutorialPages: MetadataRoute.Sitemap = (tutorials.data || []).map((t: any) => ({
    url: `${baseUrl}/en/tutorials/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const statsPages: MetadataRoute.Sitemap = (stats.data || []).map((s: any) => ({
    url: `${baseUrl}/en/stats/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const comparisonPages: MetadataRoute.Sitemap = (comparisons.data || []).map((c: any) => ({
    url: `${baseUrl}/en/compare/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...toolPages, ...categoryPages, ...tutorialPages, ...statsPages, ...comparisonPages];
}
