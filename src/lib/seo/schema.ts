// JSON-LD Schema generators — ensures every page has proper structured data

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aitools.realestate";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Tools for Real Estate",
    url: SITE_URL,
    description: "Discover and compare the best AI tools for real estate professionals.",
    sameAs: [],
  };
}

export function generateSoftwareApplicationSchema(tool: {
  name: string;
  description: string;
  url: string;
  logoUrl?: string | null;
  pricingModel?: string;
  avgRating?: number | null;
  reviewCount?: number;
  offers?: { price: string; priceCurrency: string } | null;
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description?.slice(0, 500),
    url: tool.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
  };

  if (tool.offers) {
    schema.offers = {
      "@type": "Offer",
      price: tool.offers.price || "0",
      priceCurrency: tool.offers.priceCurrency || "USD",
    };
  }

  if (tool.avgRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: tool.avgRating.toString(),
      reviewCount: tool.reviewCount || 0,
    };
  }

  return schema;
}

export function generateHowToSchema(tutorial: {
  title: string;
  description: string;
  steps: { name: string; text: string }[];
  estimatedMinutes?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tutorial.title,
    description: tutorial.description,
    ...(tutorial.estimatedMinutes && {
      totalTime: `PT${tutorial.estimatedMinutes}M`,
    }),
    step: tutorial.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      itemListElement: [
        {
          "@type": "HowToDirection",
          text: step.text,
        },
      ],
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateDatasetSchema(stats: {
  title: string;
  description: string;
  citations: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: stats.title,
    description: stats.description,
    citation: stats.citations.map((c) => ({
      "@type": "CreativeWork",
      name: c.name,
      url: c.url,
    })),
  };
}

export function generateDefinedTermSchema(term: {
  name: string;
  definition: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.name,
    description: term.definition,
    ...(term.category && { inDefinedTermSet: { "@type": "DefinedTermSet", name: term.category } }),
  };
}
