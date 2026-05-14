import { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateDefinedTermSchema } from "@/lib/seo/schema";
import { notFound } from "next/navigation";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ term: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term: termSlug, locale } = await params;
  return generatePageMeta({
    title: `${termSlug.replace(/-/g, " ")} — AI & Real Estate Glossary`,
    description: `Definition and explanation of ${termSlug.replace(/-/g, " ")} in the context of AI tools for real estate.`,
    path: locale === "en" ? `/glossary/${termSlug}` : `/${locale}/glossary/${termSlug}`,
  });
}

export default async function GlossaryPage({ params }: Props) {
  const { term: termSlug, locale } = await params;
  const lhref = (path: string) => locale === "en" ? path : `/${locale}${path}`;

  const definition = glossaryTerms[termSlug] || null;
  if (!definition) notFound();

  const termSchema = generateDefinedTermSchema({
    name: definition.term,
    definition: definition.definition,
    category: "AI Tools for Real Estate Glossary",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(termSchema) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BreadcrumbNav
          className="mb-6"
          items={[
            { label: "Glossary", href: "/glossary" },
            { label: definition.term, href: `/glossary/${termSlug}` },
          ]}
        />

        <article>
          <h1 className="text-3xl font-bold mb-2">{definition.term}</h1>
          <Badge variant="secondary" className="mb-6">{definition.category}</Badge>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="font-semibold text-sm text-muted-foreground mb-2">Definition</h2>
              <p className="text-lg leading-relaxed">{definition.definition}</p>
              {definition.longDefinition && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-muted-foreground">{definition.longDefinition}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {definition.relatedTerms && definition.relatedTerms.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {definition.relatedTerms.map((rt: string) => (
                  <Link key={rt} href={lhref(`/glossary/${rt.toLowerCase().replace(/\s+/g, "-")}`)} className="no-style">
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent/10">
                      {rt}
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

const glossaryTerms: Record<string, { term: string; category: string; definition: string; longDefinition?: string; relatedTerms?: string[] }> = {
  "avm-automated-valuation-model": {
    term: "AVM (Automated Valuation Model)",
    category: "Property Valuation",
    definition: "An AI-powered system that estimates property values using mathematical modeling, comparable sales data, and property characteristics — without requiring a physical appraisal.",
    longDefinition: "AVMs are used by lenders, real estate agents, and investors to quickly assess property values. Modern AI-enhanced AVMs incorporate machine learning to improve accuracy over traditional statistical models, often factoring in satellite imagery, neighborhood trends, and market volatility.",
    relatedTerms: ["Machine Learning", "Property Valuation", "Predictive Analytics"],
  },
  "predictive-analytics": {
    term: "Predictive Analytics",
    category: "Data Science",
    definition: "The use of historical data, statistical algorithms, and machine learning to predict future outcomes — in real estate, this means forecasting property values, identifying likely sellers, or predicting market trends.",
    relatedTerms: ["Machine Learning", "AVM", "Lead Scoring"],
  },
  "nlp-natural-language-processing": {
    term: "NLP (Natural Language Processing)",
    category: "AI Technology",
    definition: "A branch of AI that enables computers to understand, interpret, and generate human language — used in real estate for chatbots, document parsing, and automated listing descriptions.",
    relatedTerms: ["Machine Learning", "Chatbot", "Generative AI"],
  },
};
