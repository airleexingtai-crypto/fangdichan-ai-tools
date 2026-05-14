import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateDatasetSchema } from "@/lib/seo/schema";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Card, CardContent } from "@/components/ui/card";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: stat } = await supabase.from("StatPage").select("*").eq("slug", slug).single();
  if (!stat) return { title: "Statistics Not Found" };
  return generatePageMeta({
    title: `${stat.title} — AI Real Estate Statistics`,
    description: stat.content?.slice(0, 160) || `Key statistics: ${stat.hero_stat} ${stat.hero_label}`,
    path: `/en/stats/${slug}`,
    type: "article",
  });
}

export default async function StatsPage({ params }: Props) {
  const { slug } = await params;
  const { data: stat } = await supabase
    .from("StatPage")
    .select("*, sources(*)")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .single();

  if (!stat) notFound();

  const sources = stat.sources || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateDatasetSchema({
              title: stat.title,
              description: stat.content?.slice(0, 300) || "",
              citations: sources.map((s: any) => ({ name: s.title, url: s.url })),
            })
          ),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BreadcrumbNav
          className="mb-6"
          items={[
            { label: "Statistics", href: "/en/stats" },
            { label: stat.title, href: `/en/stats/${slug}` },
          ]}
        />

        <article>
          {/* Hero Stat */}
          {stat.hero_stat && (
            <div className="text-center py-12 mb-8 rounded-xl border border-border bg-card">
              <div className="text-6xl font-bold text-gradient">{stat.hero_stat}</div>
              {stat.hero_label && (
                <p className="text-xl text-muted-foreground mt-2">{stat.hero_label}</p>
              )}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-6">{stat.title}</h1>

          {/* Content */}
          {stat.content && (
            <div
              className="prose prose-invert max-w-none mb-10"
              dangerouslySetInnerHTML={{ __html: stat.content }}
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
