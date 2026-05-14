import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo/metadata";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Card, CardContent } from "@/components/ui/card";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMeta({
    title: "AI & Real Estate Glossary — Key Terms Defined",
    description: "A glossary of AI and real estate technology terms.",
    path: locale === "en" ? "/glossary" : `/${locale}/glossary`,
  });
}

const glossaryTerms = [
  { term: "AVM (Automated Valuation Model)", slug: "avm-automated-valuation-model", category: "Property Valuation", definition: "An AI-powered system that estimates property values using mathematical modeling and comparable data." },
  { term: "Predictive Analytics", slug: "predictive-analytics", category: "Data Science", definition: "The use of historical data and machine learning to predict future outcomes in real estate." },
  { term: "NLP (Natural Language Processing)", slug: "nlp-natural-language-processing", category: "AI Technology", definition: "A branch of AI enabling computers to understand and generate human language." },
];

export default async function GlossaryPage({ params }: Props) {
  const { locale } = await params;
  const lhref = (path: string) => locale === "en" ? path : `/${locale}${path}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: "Glossary", href: "/glossary" }]} />
      <h1 className="text-3xl font-bold mt-4 mb-6">AI & Real Estate Glossary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {glossaryTerms.map((g) => (
          <Link key={g.slug} href={lhref(`/glossary/${g.slug}`)} className="no-style">
            <Card className="card-hover h-full">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-1">{g.term}</h3>
                <p className="text-xs text-primary mb-2">{g.category}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">{g.definition}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
