import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateCollectionPageSchema } from "@/lib/seo/schema";
import { supabase } from "@/lib/supabase";
import { applyTranslation } from "@/lib/translate";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return generatePageMeta({
    title: t("blog_title"),
    description: t("blog_desc"),
    path: locale === "en" ? "/blog" : `/${locale}/blog`,
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  const { data: posts } = await supabase
    .from("BlogPost")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false });

  // Fetch translations for non-en locale
  const postIds = (posts || []).map((p: any) => p.id);
  const { data: translations } = locale !== "en" && postIds.length > 0
    ? await supabase.from("ContentTranslation").select("*")
        .eq("content_type", "BlogPost").in("content_id", postIds).eq("locale", locale)
    : { data: [] };
  const tMap: Record<string, any> = {};
  (translations || []).forEach((t: any) => { tMap[t.content_id] = t; });

  const displayPosts = (posts || []).map((p: any) =>
    applyTranslation(p, tMap[p.id] || null, ["title", "description"])
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[{ label: t("breadcrumb_blog"), href: "/blog" }]}
      />

      <div className="mb-10">
        <h1 className="text-3xl font-bold">{t("blog_title")}</h1>
        <p className="text-muted-foreground mt-2">{t("blog_desc")}</p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateCollectionPageSchema(
              t("blog_title"),
              t("blog_desc"),
              locale === "en" ? "/blog" : `/${locale}/blog`,
              displayPosts?.length,
            ),
          ),
        }}
      />

      {!displayPosts || displayPosts.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          {t("blog_placeholder")}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  {post.category && (
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                  )}
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {post.author && <span>{post.author}</span>}
                    {post.published_at && (
                      <span>
                        {new Date(post.published_at).toLocaleDateString(
                          locale === "zh" ? "zh-CN" : locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : locale === "de" ? "de-DE" : locale === "it" ? "it-IT" : locale === "fr" ? "fr-FR" : "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
