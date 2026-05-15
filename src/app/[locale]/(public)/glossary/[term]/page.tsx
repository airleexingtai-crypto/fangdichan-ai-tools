import { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateDefinedTermSchema } from "@/lib/seo/schema";
import { supabase } from "@/lib/supabase";
import { getTranslation, applyTranslation } from "@/lib/translate";
import { notFound } from "next/navigation";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ term: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term: termSlug, locale } = await params;
  const { data: entry } = await supabase
    .from("GlossaryTerm")
    .select("*")
    .eq("slug", termSlug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (!entry) {
    return generatePageMeta({
      title: "Term Not Found",
      description: "",
      path: locale === "en" ? `/glossary/${termSlug}` : `/${locale}/glossary/${termSlug}`,
      noIndex: true,
    });
  }

  return generatePageMeta({
    title: `${entry.term} — AI & Real Estate Glossary`,
    description: entry.definition?.slice(0, 160) || "",
    path: locale === "en" ? `/glossary/${termSlug}` : `/${locale}/glossary/${termSlug}`,
  });
}

export default async function GlossaryPage({ params }: Props) {
  const { term: termSlug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  const { data: entry } = await supabase
    .from("GlossaryTerm")
    .select("*")
    .eq("slug", termSlug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (!entry) notFound();

  const translation = await getTranslation("GlossaryTerm", entry.id, locale);
  const displayEntry = applyTranslation(entry, translation, ["term", "definition"]);

  // Resolve related slugs to full terms for display
  const relatedSlugs: string[] = (entry.related_slugs as string[]) || [];
  const { data: relatedTerms } = relatedSlugs.length > 0
    ? await supabase.from("GlossaryTerm").select("slug, term").in("slug", relatedSlugs)
    : { data: [] };

  const termSchema = generateDefinedTermSchema({
    name: displayEntry.term,
    definition: displayEntry.definition,
    category: entry.category || "AI Real Estate Glossary",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BreadcrumbNav
          className="mb-6"
          items={[
            { label: t("breadcrumb_glossary"), href: "/glossary" },
            { label: displayEntry.term, href: `/glossary/${termSlug}` },
          ]}
        />

        <article>
          <h1 className="text-3xl font-bold mb-2">{displayEntry.term}</h1>
          {entry.category && (
            <Badge variant="secondary" className="mb-6">{entry.category}</Badge>
          )}

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="font-semibold text-sm text-muted-foreground mb-2">
                {t("glossary_definition")}
              </h2>
              <p className="text-lg leading-relaxed">{displayEntry.definition}</p>
              {displayEntry.long_definition && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-muted-foreground">{displayEntry.long_definition}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {relatedTerms && relatedTerms.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">{t("glossary_related")}</h2>
              <div className="flex flex-wrap gap-2">
                {relatedTerms.map((rt: any) => (
                  <Link key={rt.slug} href={`/glossary/${rt.slug}`} className="no-style">
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent/10">
                      {rt.term}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}
