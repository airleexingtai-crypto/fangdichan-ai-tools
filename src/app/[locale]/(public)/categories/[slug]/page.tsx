import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMeta } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { ToolCard } from "@/components/ToolCard";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: category } = await supabase.from("Category").select("*").eq("slug", slug).single();
  if (!category) return { title: "Category Not Found" };
  return generatePageMeta({
    title: `${category.name} AI Tools — Best AI for Real Estate ${category.name}`,
    description: category.description?.slice(0, 160) || `Browse the best AI tools for ${category.name} in real estate. Compare pricing, features, and reviews.`,
    path: `/en/categories/${slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const { data: category } = await supabase.from("Category").select("*").eq("slug", slug).single();
  if (!category) notFound();

  const { data: tools } = await supabase
    .from("ToolCategory")
    .select("tool:Tool(*)")
    .eq("categoryId", category.id)
    .eq("tool.status", "PUBLISHED")
    .order("is_primary", { ascending: false });

  const toolList = tools?.map((tc: any) => tc.tool).filter(Boolean) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[
          { label: "Categories", href: "/en/categories" },
          { label: category.name, href: `/en/categories/${slug}` },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.name} AI Tools</h1>
        <p className="text-muted-foreground mt-2">{category.description}</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-border">
        <span className="text-sm text-muted-foreground">{toolList.length} tools found</span>
      </div>

      {toolList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolList.map((tool: any) => (
            <ToolCard
              key={tool.slug}
              slug={tool.slug}
              name={tool.name}
              tagline={tool.tagline}
              logoUrl={tool.logo_url}
              pricingModel={tool.pricing_model}
              avgRating={tool.avg_rating}
              reviewCount={tool.review_count}
              categoryName={category.name}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No tools in this category yet.</p>
        </div>
      )}
    </div>
  );
}
