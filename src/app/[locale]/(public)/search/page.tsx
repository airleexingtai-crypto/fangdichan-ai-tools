import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { ToolCard } from "@/components/ToolCard";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return generatePageMeta({
    title: q ? `Search: ${q} — AI Tools for Real Estate` : "Search AI Tools",
    description: q ? `Search results for "${q}" in our AI tools directory.` : "Search our directory of AI tools for real estate professionals.",
    path: `/en/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let results: any[] = [];
  if (query) {
    const { data } = await supabase
      .from("Tool")
      .select("*")
      .eq("status", "PUBLISHED")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,tagline.ilike.%${query}%`)
      .limit(20);
    results = data || [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[{ label: "Search", href: "/en/search" }]}
      />

      <h1 className="text-3xl font-bold mb-2">
        {query ? `Results for "${query}"` : "Search AI Tools"}
      </h1>
      <p className="text-muted-foreground mb-8">
        {query
          ? `Found ${results.length} tool${results.length !== 1 ? "s" : ""}`
          : "Enter a search term to find AI tools"}
      </p>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((tool: any) => (
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
      ) : query ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">No tools found matching &ldquo;{query}&rdquo;</p>
          <p className="text-sm text-muted-foreground">
            Try a different search term or <a href="/en/tools" className="text-primary">browse all tools</a>.
          </p>
        </div>
      ) : null}
    </div>
  );
}
