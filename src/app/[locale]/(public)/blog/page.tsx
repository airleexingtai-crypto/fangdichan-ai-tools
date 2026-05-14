import { generatePageMeta } from "@/lib/seo/metadata";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

export const metadata = generatePageMeta({
  title: "AI Real Estate Blog — Latest News & Analysis",
  description: "Latest news and analysis about AI tools for real estate. New tools, trends, and industry updates.",
  path: "/en/blog",
});

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: "Blog", href: "/en/blog" }]} />
      <h1 className="text-3xl font-bold mt-4 mb-2">AI Real Estate Blog</h1>
      <p className="text-muted-foreground mb-8">Latest news, analysis, and trends in AI for real estate.</p>
      <div className="text-center py-12 text-muted-foreground">
        <p>Blog posts will appear here once content is published.</p>
      </div>
    </div>
  );
}
