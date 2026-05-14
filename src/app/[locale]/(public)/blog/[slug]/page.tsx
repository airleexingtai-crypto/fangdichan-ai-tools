import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generatePageMeta({
    title: `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — AI Real Estate Blog`,
    description: `Latest news and analysis about AI tools for real estate.`,
    path: `/en/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;

  // Phase 1: Blog content from DB (placeholder for now)
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[
          { label: "Blog", href: "/en/blog" },
          { label: slug.replace(/-/g, " "), href: `/en/blog/${slug}` },
        ]}
      />

      <article>
        <h1 className="text-3xl font-bold mb-4">
          {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
        <div className="prose prose-invert max-w-none">
          <p>Blog content coming soon. This page will display AI-generated, human-verified industry news and analysis.</p>
        </div>
      </article>
    </div>
  );
}
