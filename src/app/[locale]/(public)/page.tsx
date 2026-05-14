import Link from "next/link";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateOrganizationSchema } from "@/lib/seo/schema";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { ArrowRight, BarChart3, Search, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata = generatePageMeta({
  title: "Best AI Tools for Real Estate — Find, Compare & Choose",
  description:
    "Discover and compare the best AI tools for real estate professionals. Pricing, features, reviews, and side-by-side comparisons.",
  path: "/en",
});

const categories = [
  { icon: "🏠", name: "Property Search", slug: "property-search", count: 12 },
  { icon: "📊", name: "Analytics & Data", slug: "analytics", count: 8 },
  { icon: "🤖", name: "Automation", slug: "automation", count: 15 },
  { icon: "💬", name: "CRM & Communication", slug: "crm", count: 10 },
  { icon: "📸", name: "Marketing & Media", slug: "marketing", count: 9 },
  { icon: "📋", name: "Transaction Management", slug: "transaction", count: 6 },
];

const stats = [
  { value: "47%", label: "of agents now use AI tools" },
  { value: "$15B", label: "AI in real estate market by 2027" },
  { value: "3.2x", label: "productivity boost with AI" },
];

export default async function HomePage() {
  // Fetch trending tools
  const { data: trendingTools } = await supabase
    .from("Tool")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("avg_rating", { ascending: false })
    .limit(6);

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationSchema()),
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            The AI Tool Directory{" "}
            <span className="text-gradient">for Real Estate</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Discover, compare, and choose the best AI tools for real estate
            professionals. Structured comparisons, honest reviews, and up-to-date
            pricing — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/tools" className="no-style">
              <Button size="lg" className="text-base">
                <Search className="mr-2 h-4 w-4" />
                Browse All Tools
              </Button>
            </Link>
            <Link href="/en/compare" className="no-style">
              <Button variant="outline" size="lg" className="text-base">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Comparisons
              </Button>
            </Link>
          </div>

          {/* Stats badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Explore by Category</h2>
            <p className="text-muted-foreground mt-1">
              Find the right AI tools for your specific needs
            </p>
          </div>
          <Link href="/en/categories" className="no-style">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/en/categories/${cat.slug}`}
              className="no-style group"
            >
              <div className="card-hover rounded-lg border border-border/50 bg-card p-4 text-center h-full">
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {cat.count} tools
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
            <h2 className="text-2xl font-bold">Trending AI Tools</h2>
            <p className="text-muted-foreground mt-1">
              Most popular tools this month
            </p>
          </div>
          <Link href="/en/tools" className="no-style">
            <Button variant="ghost" size="sm">
              View all tools <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(trendingTools && trendingTools.length > 0
            ? trendingTools
            : placeholderTools
          ).map((tool: any) => (
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
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="rounded-xl border border-border bg-card p-8 md:p-12 text-center">
          <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">
            Stay Updated on AI Tools for Real Estate
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Get weekly updates on new AI tools, comparisons, and industry
            statistics delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit">Subscribe</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}

// Placeholder data for initial render
const placeholderTools = [
  {
    slug: "zillow-ai",
    name: "Zillow AI",
    tagline: "AI-powered property valuation and market predictions",
    logo_url: null,
    pricing_model: "FREEMIUM",
    avg_rating: 4.5,
    review_count: 128,
  },
  {
    slug: "revaluate",
    name: "Revaluate",
    tagline: "Predictive analytics to identify likely sellers",
    logo_url: null,
    pricing_model: "PAID",
    avg_rating: 4.7,
    review_count: 89,
  },
  {
    slug: "quantarium",
    name: "Quantarium",
    tagline: "Automated valuation models and property intelligence",
    logo_url: null,
    pricing_model: "ENTERPRISE",
    avg_rating: 4.3,
    review_count: 56,
  },
];
