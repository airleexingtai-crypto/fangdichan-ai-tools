import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Search, SlidersHorizontal, Grid3x3, List } from "lucide-react";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMeta({
    title: locale === "zh" ? "所有 AI 工具 — 浏览与对比" : "All AI Tools for Real Estate — Browse & Compare",
    description: locale === "zh"
      ? "浏览完整的房地产 AI 工具目录。按分类、定价和功能筛选。"
      : "Browse our complete directory of AI tools for real estate professionals. Filter by category, pricing model, and features.",
    path: locale === "en" ? "/tools" : `/${locale}/tools`,
  });
}

const SORT_OPTIONS = {
  rating: { field: "avg_rating", dir: "desc", label: "Top Rated" },
  newest: { field: "published_at", dir: "desc", label: "Newest" },
  reviews: { field: "review_count", dir: "desc", label: "Most Reviewed" },
  name: { field: "name", dir: "asc", label: "Name (A-Z)" },
} as const;

const PRICING_FILTERS = ["FREE", "FREEMIUM", "PAID", "ENTERPRISE", "FREE_TRIAL"] as const;
const PRICING_LABELS: Record<string, string> = {
  FREE: "Free", FREEMIUM: "Freemium", PAID: "Paid", ENTERPRISE: "Enterprise", FREE_TRIAL: "Free Trial",
};

export default async function ToolsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const search = (sp.search as string) || "";
  const categorySlug = (sp.category as string) || "";
  const pricing = (sp.pricing as string) || "";
  const sortKey = ((sp.sort as string) || "rating") as keyof typeof SORT_OPTIONS;
  const PER_PAGE = 12;

  const lhref = (path: string) => locale === "en" ? path : `/${locale}${path}`;

  // Fetch categories for filter sidebar
  const { data: categories } = await supabase.from("Category").select("slug, name, icon").order("name");

  // Build tool query
  let query = supabase.from("Tool").select("*", { count: "exact" }).eq("status", "PUBLISHED");

  if (search) query = query.or(`name.ilike.%${search}%,tagline.ilike.%${search}%`);
  if (pricing) query = query.eq("pricing_model", pricing);

  if (categorySlug) {
    const { data: catTools } = await supabase
      .from("ToolCategory")
      .select("tool_id, category:Category!inner(slug)")
      .eq("category.slug", categorySlug);
    if (catTools?.length) {
      query = query.in("id", catTools.map((t: any) => t.tool_id));
    }
  }

  const sort = SORT_OPTIONS[sortKey] || SORT_OPTIONS.rating;
  query = query.order(sort.field, { ascending: sort.dir === "asc" });

  const { data: tools, count } = await query.range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
  const totalPages = Math.ceil((count || 0) / PER_PAGE);

  const buildUrl = (overrides: Record<string, string>) => {
    const p = new URLSearchParams();
    p.set("sort", sortKey);
    if (search) p.set("search", search);
    if (categorySlug) p.set("category", categorySlug);
    if (pricing) p.set("pricing", pricing);
    Object.entries(overrides).forEach(([k, v]) => { if (v) p.set(k, v); else p.delete(k); });
    return `${lhref("/tools")}?${p.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: "All Tools", href: lhref("/tools") }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {locale === "zh" ? "所有 AI 工具" : "All AI Tools"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {locale === "zh"
              ? `浏览 ${count || 0} 款房地产 AI 工具`
              : `Browse and compare ${count || 0} AI tools for real estate`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile filter toggle (visual only for now) */}
          <Button variant="outline" size="sm" className="lg:hidden">
            <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
          </Button>
          <Select>
            <SelectTrigger className="w-36 h-9 text-sm">
              {SORT_OPTIONS[sortKey].label}
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
                <SelectItem key={key} value={key}>
                  <a href={buildUrl({ sort: key })} className="no-style block w-full">
                    {opt.label}
                  </a>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  defaultValue={search}
                  placeholder={locale === "zh" ? "搜索工具..." : "Search tools..."}
                  className="pl-8 h-9 text-sm"
                />
              </div>
              <input type="hidden" name="sort" value={sortKey} />
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
              {pricing && <input type="hidden" name="pricing" value={pricing} />}
            </form>

            {/* Pricing Filter */}
            <div>
              <h3 className="font-semibold text-sm mb-2">{locale === "zh" ? "定价模式" : "Pricing"}</h3>
              <div className="flex flex-wrap gap-1.5">
                <Link href={buildUrl({ pricing: "" })} className="no-style">
                  <Badge variant={!pricing ? "default" : "outline"} className="cursor-pointer text-xs">
                    {locale === "zh" ? "全部" : "All"}
                  </Badge>
                </Link>
                {PRICING_FILTERS.map((p) => (
                  <Link key={p} href={buildUrl({ pricing: p })} className="no-style">
                    <Badge variant={pricing === p ? "default" : "outline"} className="cursor-pointer text-xs">
                      {PRICING_LABELS[p]}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-sm mb-2">{locale === "zh" ? "分类" : "Categories"}</h3>
              <div className="space-y-1">
                <Link href={buildUrl({ category: "" })} className="no-style">
                  <div className={`text-sm px-2 py-1 rounded-md transition-colors ${!categorySlug ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                    {locale === "zh" ? "全部" : "All Categories"}
                  </div>
                </Link>
                {(categories || []).map((cat: any) => (
                  <Link key={cat.slug} href={buildUrl({ category: cat.slug })} className="no-style">
                    <div className={`text-sm px-2 py-1 rounded-md transition-colors flex items-center gap-1.5 ${categorySlug === cat.slug ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                      <span>{cat.icon}</span>
                      {cat.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {search && (
              <Link href={buildUrl({ search: "" })} className="no-style">
                <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
                  Clear all filters
                </Button>
              </Link>
            )}
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1">
          {tools && tools.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {tools.map((tool: any) => (
                  <ToolCard
                    key={tool.slug}
                    slug={tool.slug}
                    name={tool.name}
                    tagline={tool.tagline}
                    logoUrl={tool.logo_url}
                    pricingModel={tool.pricing_model}
                    avgRating={tool.avg_rating}
                    reviewCount={tool.review_count}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {page > 1 && (
                    <Link href={buildUrl({ page: String(page - 1) })} className="no-style">
                      <Button variant="outline" size="sm">Previous</Button>
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                    .map((p, i, arr) => (
                      <span key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && <span className="text-muted-foreground mx-1">...</span>}
                        <Link href={buildUrl({ page: String(p) })} className="no-style">
                          <Button variant={p === page ? "default" : "outline"} size="sm" className="min-w-[2.25rem]">
                            {p}
                          </Button>
                        </Link>
                      </span>
                    ))}
                  {page < totalPages && (
                    <Link href={buildUrl({ page: String(page + 1) })} className="no-style">
                      <Button variant="outline" size="sm">Next</Button>
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {locale === "zh" ? "未找到匹配的工具" : "No matching tools found"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {locale === "zh"
                    ? "尝试调整筛选条件或清除搜索。"
                    : "Try adjusting your filters or clearing the search."}
                </p>
                <Link href={lhref("/tools")} className="no-style">
                  <Button variant="outline" size="sm">
                    {locale === "zh" ? "清除筛选" : "Clear All Filters"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
