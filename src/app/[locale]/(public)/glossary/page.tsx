import { generatePageMeta } from "@/lib/seo/metadata";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = generatePageMeta({
  title: "AI & Real Estate Glossary — Key Terms Defined",
  description: "A glossary of AI and real estate technology terms. Understand the language of AI in real estate.",
  path: "/en/glossary",
});

const glossaryTerms = [
  { term: "AVM (Automated Valuation Model)", slug: "avm-automated-valuation-model", category: "Property Valuation", definition: "An AI-powered system that estimates property values using mathematical modeling and comparable data." },
  { term: "Predictive Analytics", slug: "predictive-analytics", category: "Data Science", definition: "The use of historical data and machine learning to predict future outcomes in real estate." },
  { term: "NLP (Natural Language Processing)", slug: "nlp-natural-language-processing", category: "AI Technology", definition: "A branch of AI enabling computers to understand and generate human language." },
];

export default function GlossaryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: "Glossary", href: "/en/glossary" }]} />
      <h1 className="text-3xl font-bold mt-4 mb-6">AI & Real Estate Glossary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {glossaryTerms.map((g) => (
          <Link key={g.slug} href={`/en/glossary/${g.slug}`} className="no-style">
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
