import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://airealtools.com";

  const [tools, categories, tutorials, stats, comparisons, blogs, glossary] = await Promise.all([
    supabase.from("Tool").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("Category").select("slug, updated_at"),
    supabase.from("Tutorial").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("StatPage").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("Comparison").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("BlogPost").select("slug, updated_at").eq("status", "PUBLISHED"),
    supabase.from("GlossaryTerm").select("slug, updated_at").eq("status", "PUBLISHED"),
  ]);

  // All supported locales — en has no prefix, others use /locale prefix
  const locales = ["", "/ko", "/ja", "/de", "/it", "/fr"]; // zh is handled separately for content translations
  const allLocales = ["", "/zh", "/ko", "/ja", "/de", "/it", "/fr"];

  const multilingual = (path: string, lastmod: Date, freq: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number) =>
    allLocales.map((prefix) => ({
      url: `${baseUrl}${prefix}${path}`,
      lastModified: lastmod,
      changeFrequency: freq,
      priority: prefix ? priority - 0.1 : priority,
    }));

  const bilingual = (path: string, lastmod: Date, freq: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number) =>
    multilingual(path, lastmod, freq, priority);

  const staticPages: MetadataRoute.Sitemap = [
    ...bilingual("", new Date(), "daily", 1.0),
    ...bilingual("/tools", new Date(), "daily", 0.9),
    ...bilingual("/categories", new Date(), "weekly", 0.8),
    ...bilingual("/compare", new Date(), "daily", 0.8),
    ...bilingual("/tutorials", new Date(), "weekly", 0.7),
    ...bilingual("/stats", new Date(), "weekly", 0.7),
    ...bilingual("/blog", new Date(), "daily", 0.6),
    ...bilingual("/glossary", new Date(), "weekly", 0.5),
    ...bilingual("/search", new Date(), "weekly", 0.3),
  ];

  const detailPages = (items: any[] | null, pathPrefix: string, freq: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number) =>
    (items || []).flatMap((item: any) =>
      bilingual(`/${pathPrefix}/${item.slug}`, new Date(item.updated_at), freq, priority)
    );

  return [
    ...staticPages,
    ...detailPages(tools.data, "tools", "weekly", 0.8),
    ...detailPages(categories.data, "categories", "weekly", 0.7),
    ...detailPages(tutorials.data, "tutorials", "monthly", 0.6),
    ...detailPages(stats.data, "stats", "monthly", 0.6),
    ...detailPages(comparisons.data, "compare", "weekly", 0.8),
    ...detailPages(blogs.data, "blog", "weekly", 0.7),
    ...detailPages(glossary.data, "glossary", "monthly", 0.5),
  ];
}
