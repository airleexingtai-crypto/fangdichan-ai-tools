import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateArticleSchema } from "@/lib/seo/schema";
import { supabase } from "@/lib/supabase";
import { getTranslation, applyTranslation } from "@/lib/translate";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const { data: post } = await supabase
    .from("BlogPost")
    .select("*")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (!post) {
    return generatePageMeta({
      title: "Blog Post Not Found",
      description: "",
      path: locale === "en" ? `/blog/${slug}` : `/${locale}/blog/${slug}`,
      noIndex: true,
    });
  }

  return generatePageMeta({
    title: `${post.title} — AI Real Estate Blog`,
    description: post.description?.slice(0, 160) || "",
    path: locale === "en" ? `/blog/${slug}` : `/${locale}/blog/${slug}`,
    type: "article",
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  const { data: post } = await supabase
    .from("BlogPost")
    .select("*")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (!post) notFound();

  const translation = await getTranslation("BlogPost", post.id, locale);
  const displayPost = applyTranslation(post, translation, ["title", "description", "content"]);

  const articleSchema = generateArticleSchema({
    title: displayPost.title,
    description: displayPost.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}${locale === "en" ? "" : `/${locale}`}/blog/${slug}`,
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
    authorName: post.author,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <BreadcrumbNav
        className="mb-6"
        items={[
          { label: t("breadcrumb_blog"), href: "/blog" },
          { label: displayPost.title, href: `/blog/${slug}` },
        ]}
      />

      <article>
        <header className="mb-8">
          {post.category && (
            <Badge variant="secondary" className="mb-3">
              {post.category}
            </Badge>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{displayPost.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {post.author && <span>{post.author}</span>}
            {post.published_at && (
              <>
                <span className="text-border">|</span>
                <span>
                  {new Date(post.published_at).toLocaleDateString(
                    locale === "zh" ? "zh-CN" : locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : locale === "de" ? "de-DE" : locale === "it" ? "it-IT" : locale === "fr" ? "fr-FR" : "en-US",
                    { month: "long", day: "numeric", year: "numeric" },
                  )}
                </span>
              </>
            )}
          </div>
        </header>

        {displayPost.content && (
          <div
            className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: displayPost.content }}
          />
        )}
      </article>
    </div>
  );
}
