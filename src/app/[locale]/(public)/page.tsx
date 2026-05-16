import { Link } from "@/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo/schema";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { ArrowRight, BarChart3, Search, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = { params: Promise<{ locale: string }> };

// localePrefix: "as-needed" — default locale (en) needs NO prefix

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return generatePageMeta({
    title: locale === "zh"
      ? "最佳 AI 工具导航 — 房地产专业版 | 发现·对比·选择"
      : locale === "ko"
        ? "최고의 AI 도구 — 부동산 전문가를 위한 | 검색·비교·선택"
        : locale === "ja"
          ? "最高のAIツール — 不動産プロフェッショナル向け | 検索·比較·選択"
          : "Best AI Tools for Real Estate — Find, Compare & Choose",
    description: t("hero_subtitle"),
    path: locale === "en" ? "/" : `/${locale}`,
    locale,
  });
}

const stats = [
  { value: "47%", labelKey: "stat_adoption" },
  { value: "$15B", labelKey: "stat_market" },
  { value: "3.2x", labelKey: "stat_productivity" },
];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const [{ data: trendingTools }, { data: dbCategories }, { data: toolCategories }, { data: publishedTools }] = await Promise.all([
    supabase.from("Tool").select("*").eq("status", "PUBLISHED").order("avg_rating", { ascending: false }).limit(6),
    supabase.from("Category").select("*").order("sort_order"),
    supabase.from("ToolCategory").select("tool_id, category_id"),
    supabase.from("Tool").select("id").eq("status", "PUBLISHED"),
  ]);

  // Build a set of published tool IDs for fast lookup
  const publishedIds = new Set((publishedTools || []).map((t: any) => t.id));

  // Count published tools per category
  const countMap: Record<string, number> = {};
  (toolCategories || []).forEach((tc: any) => {
    if (publishedIds.has(tc.tool_id)) {
      countMap[tc.category_id] = (countMap[tc.category_id] || 0) + 1;
    }
  });

  const categoryCards = (dbCategories || []).map((cat: any) => ({
    ...cat,
    count: countMap[cat.id] || 0,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema(`${process.env.NEXT_PUBLIC_SITE_URL || "https://airealtools.com"}/${locale}/search`)) }} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t("hero_title")}{" "}
            <span className="text-gradient">{t("hero_highlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/tools"} className="no-style">
              <Button size="lg" className="text-base">
                <Search className="mr-2 h-4 w-4" />
                {t("browse_tools")}
              </Button>
            </Link>
            <Link href={"/compare"} className="no-style">
              <Button variant="outline" size="lg" className="text-base">
                <BarChart3 className="mr-2 h-4 w-4" />
                {t("view_comparisons")}
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{t(stat.labelKey as any)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">{t("explore_categories")}</h2>
            <p className="text-muted-foreground mt-1">{t("find_tools_desc")}</p>
          </div>
          <Link href={"/categories"} className="no-style">
            <Button variant="ghost" size="sm">
              {t("view_all")} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryCards.map((cat: any) => (
            <Link key={cat.slug} href={`/categories/${cat.slug}`} className="no-style group">
              <div className="card-hover rounded-lg border border-border/50 bg-card p-4 text-center h-full">
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("tools_count").replace("{count}", String(cat.count || 0))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">{t("trending_tools")}</h2>
            <p className="text-muted-foreground mt-1">{t("trending_desc")}</p>
          </div>
          <Link href={"/tools"} className="no-style">
            <Button variant="ghost" size="sm">
              {t("view_all_tools")} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {trendingTools && trendingTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingTools.map((tool: any) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                name={tool.name}
                tagline={tool.tagline}
                logoUrl={tool.logo_url}
                pricingModel={tool.pricing_model || "FREE"}
                avgRating={tool.avg_rating}
                reviewCount={tool.review_count}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {t("loading_tools")}
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="rounded-xl border border-border bg-card p-8 md:p-12 text-center">
          <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">{t("cta_title")}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">{t("cta_desc")}</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("cta_placeholder")}
              className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit">{t("cta_button")}</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">{t("cta_disclaimer")}</p>
        </div>
      </section>
    </>
  );
}

