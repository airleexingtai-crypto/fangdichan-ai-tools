import { generatePageMeta } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { ToolCard } from "@/components/ToolCard";

export const metadata = generatePageMeta({
  title: "All AI Tools for Real Estate — Browse & Compare",
  description: "Browse our complete directory of AI tools for real estate professionals. Filter by category, pricing model, and features.",
  path: "/en/tools",
});

export default async function ToolsPage() {
  const { data: tools } = await supabase.from("Tool").select("*").eq("status", "PUBLISHED").order("avg_rating", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: "All Tools", href: "/en/tools" }]} />
      <h1 className="text-3xl font-bold mt-4 mb-2">All AI Tools for Real Estate</h1>
      <p className="text-muted-foreground mb-8">Browse and compare {tools?.length || 0} AI tools</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools?.map((tool: any) => (
          <ToolCard key={tool.slug} slug={tool.slug} name={tool.name} tagline={tool.tagline} logoUrl={tool.logo_url} pricingModel={tool.pricing_model} avgRating={tool.avg_rating} reviewCount={tool.review_count} />
        ))}
      </div>
    </div>
  );
}
