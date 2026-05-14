// JSON-LD Structured Data generators
// Coverage: Organization, WebSite, SoftwareApplication, FAQ, HowTo, Article,
//           BreadcrumbList, Dataset, DefinedTerm, CollectionPage, ItemList

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aitools.realestate";
const SITE_NAME = "AI Tools for Real Estate";

// ── Site-level ─────────────────────────────────

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Discover and compare the best AI tools for real estate professionals. Pricing, features, reviews, and side-by-side comparisons.",
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
  };
}

export function generateWebSiteSchema(searchUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Discover and compare the best AI tools for real estate professionals.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${searchUrl}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ── Page-level ─────────────────────────────────

export function generateCollectionPageSchema(
  name: string,
  description: string,
  url: string,
  itemCount?: number,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    ...(itemCount != null ? { mainEntity: { "@type": "ItemList", numberOfItems: itemCount } } : {}),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ── Content types ──────────────────────────────

export function generateSoftwareApplicationSchema(tool: {
  name: string;
  description: string;
  url: string;
  logoUrl?: string | null;
  pricingModel?: string;
  avgRating?: number | null;
  reviewCount?: number;
  offers?: { price: string; priceCurrency: string } | null;
  operatingSystem?: string;
  applicationCategory?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description?.slice(0, 500),
    url: tool.url,
    applicationCategory: tool.applicationCategory || "BusinessApplication",
    operatingSystem: tool.operatingSystem || "Web",
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
      ratingValue: Number(tool.avgRating).toFixed(1),
      reviewCount: tool.reviewCount || 0,
    };
  }

  return schema;
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;
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

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description?.slice(0, 300),
    url: article.url,
    ...(article.publishedAt && { datePublished: article.publishedAt }),
    ...(article.updatedAt && { dateModified: article.updatedAt }),
    ...(article.authorName && { author: { "@type": "Person", name: article.authorName } }),
    ...(article.imageUrl && { image: article.imageUrl }),
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
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
    ...(tutorial.estimatedMinutes && { totalTime: `PT${tutorial.estimatedMinutes}M` }),
    step: tutorial.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      itemListElement: [{ "@type": "HowToDirection", text: step.text }],
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

export function generateItemListSchema(items: { name: string; url: string; position: number }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}
