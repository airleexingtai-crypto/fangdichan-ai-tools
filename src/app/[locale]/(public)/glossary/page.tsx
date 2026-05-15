import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateCollectionPageSchema } from "@/lib/seo/schema";
import { supabase } from "@/lib/supabase";
import { applyTranslation } from "@/lib/translate";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return generatePageMeta({
    title: t("glossary_title"),
    description:
      locale === "zh"
        ? "AI与房地产科技术语词典。了解AVM、NLP、计算机视觉等关键术语。"
        : "A dictionary of AI and real estate technology terms. Understand key concepts like AVM, NLP, computer vision, and more.",
    path: locale === "en" ? "/glossary" : `/${locale}/glossary`,
  });
}

export default async function GlossaryPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  const { data: terms } = await supabase
    .from("GlossaryTerm")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("term");

  // Fetch translations for non-en locale
  const termIds = (terms || []).map((g: any) => g.id);
  const { data: translations } = locale !== "en" && termIds.length > 0
    ? await supabase.from("ContentTranslation").select("*")
        .eq("content_type", "GlossaryTerm").in("content_id", termIds).eq("locale", locale)
    : { data: [] };
  const tMap: Record<string, any> = {};
  (translations || []).forEach((tr: any) => { tMap[tr.content_id] = tr; });

  const displayTerms = (terms || []).map((g: any) =>
    applyTranslation(g, tMap[g.id] || null, ["term", "definition"])
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[{ label: t("breadcrumb_glossary"), href: "/glossary" }]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("glossary_title")}</h1>
        <p className="text-muted-foreground mt-2">
          {locale === "zh"
            ? "AI与房地产科技的关键术语和定义"
            : "Key terms and definitions for AI and real estate technology."}
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateCollectionPageSchema(
              locale === "zh" ? "AI房地产术语表" : "AI Real Estate Glossary",
              locale === "zh"
                ? "AI与房地产科技术语词典，包含定义和解释"
                : "A comprehensive glossary of AI and real estate technology terms with definitions.",
              locale === "en" ? "/glossary" : `/${locale}/glossary`,
              displayTerms?.length,
            ),
          ),
        }}
      />

      {!displayTerms || displayTerms.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          {t("blog_placeholder")}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayTerms.map((g: any) => (
            <Link key={g.slug} href={`/glossary/${g.slug}`} className="no-style">
              <Card className="card-hover h-full">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-1">{g.term}</h3>
                  {g.category && (
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {g.category}
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {g.definition}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
