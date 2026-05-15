import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateDatasetSchema } from "@/lib/seo/schema";
import { supabase } from "@/lib/supabase";
import { getTranslation, applyTranslation } from "@/lib/translate";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Card, CardContent } from "@/components/ui/card";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const { data: stat } = await supabase.from("StatPage").select("*").eq("slug", slug).single();
  if (!stat) return { title: "Statistics Not Found" };
  return generatePageMeta({
    title: `${stat.title} — AI Real Estate Statistics`,
    description: stat.content?.slice(0, 160) || `Key statistics: ${stat.hero_stat} ${stat.hero_label}`,
    path: locale === "en" ? `/stats/${slug}` : `/${locale}/stats/${slug}`,
    type: "article",
  });
}

export default async function StatsPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  const lhref = (path: string) => locale === "en" ? path : `/${locale}${path}`;
  const { data: stat } = await supabase
    .from("StatPage")
    .select("*")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (!stat) notFound();

  const translation = await getTranslation("StatPage", stat.id, locale);
  const displayStat = applyTranslation(stat, translation, ["title", "content", "hero_label"]);

  const { data: sourcesData } = await supabase
    .from("StatSource")
    .select("*")
    .eq("stat_page_id", stat.id);

  const sources = sourcesData || [];


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateDatasetSchema({
              title: displayStat.title,
              description: displayStat.content?.slice(0, 300) || "",
              citations: sources.map((s: any) => ({ name: s.title, url: s.url })),
            })
          ),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BreadcrumbNav
          className="mb-6"
          items={[
            { label: t("breadcrumb_stats"), href: "/stats" },
            { label: displayStat.title, href: `/stats/${slug}` },
          ]}
        />

        <article>
          {/* Hero Stat */}
          {stat.hero_stat && (
            <div className="text-center py-12 mb-8 rounded-xl border border-border bg-card">
              <div className="text-6xl font-bold text-gradient">{stat.hero_stat}</div>
              {displayStat.hero_label && (
                <p className="text-xl text-muted-foreground mt-2">{displayStat.hero_label}</p>
              )}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-6">{displayStat.title}</h1>

          {/* Content */}
          {displayStat.content && (
            <div
              className="prose prose-invert max-w-none mb-10"
              dangerouslySetInnerHTML={{ __html: displayStat.content }}
            />
          )}

          {/* Sources */}
          {sources.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="text-xl font-semibold mb-4">Sources</h2>
              <div className="space-y-2">
                {sources.map((source: any) => (
                  <Card key={source.id}>
                    <CardContent className="p-3 flex items-start gap-3">
                      <span className="text-2xl shrink-0">📄</span>
                      <div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="nofollow noopener"
                          className="no-style font-medium text-sm hover:text-primary transition-colors"
                        >
                          {source.title}
                        </a>
                        <p className="text-xs text-muted-foreground">
                          {source.publisher}
                          {source.year && ` (${source.year})`}
                        </p>
                        {source.quote_text && (
                          <blockquote className="text-sm text-muted-foreground mt-1 border-l-2 border-border pl-3 italic">
                            &ldquo;{source.quote_text.slice(0, 300)}&rdquo;
                          </blockquote>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
