import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateSoftwareApplicationSchema, generateFAQSchema } from "@/lib/seo/schema";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AffiliateCTA } from "@/components/AffiliateCTA";
import { ToolCard } from "@/components/ToolCard";
import { Star, Globe, Calendar, Wrench, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: tool } = await supabase.from("Tool").select("*").eq("slug", slug).single();

  if (!tool) return { title: "Tool Not Found" };

  return generatePageMeta({
    title: `${tool.name} — AI Tool for Real Estate | Pricing, Features & Reviews`,
    description: tool.description?.slice(0, 160) || `${tool.name}: ${tool.tagline}. Pricing, features, pros & cons, and alternatives.`,
    path: `/en/tools/${slug}`,
    type: "website",
    updatedAt: tool.updated_at,
  });
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;

  const { data: tool } = await supabase
    .from("Tool")
    .select("*, categories(ToolCategory(category:Category(*)))")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .single();

  if (!tool) notFound();

  const category = tool.categories?.[0]?.category;
  const features = (tool.features_json as any[]) || [];
  const pros = (tool.pros_json as string[]) || [];
  const cons = (tool.cons_json as string[]) || [];
  const useCases = (tool.use_cases_json as any[]) || [];
  const pricingTiers = (tool.pricing_json as any[]) || [];
  const faqs = [
    { question: `What is ${tool.name}?`, answer: tool.description?.slice(0, 300) || "" },
    { question: `How much does ${tool.name} cost?`, answer: tool.pricing_model === "FREE" ? `${tool.name} is free to use.` : `${tool.name} offers ${tool.pricing_model?.toLowerCase()} pricing. Check their website for current pricing.` },
    { question: `Does ${tool.name} have an API?`, answer: tool.api_available ? `Yes, ${tool.name} provides an API for integration.` : `${tool.name} does not currently offer a public API.` },
  ];

  const toolSchema = generateSoftwareApplicationSchema({
    name: tool.name,
    description: tool.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/en/tools/${tool.slug}`,
    logoUrl: tool.logo_url,
    pricingModel: tool.pricing_model,
    avgRating: tool.avg_rating,
    reviewCount: tool.review_count,
    offers: pricingTiers[0] ? { price: pricingTiers[0].price, priceCurrency: "USD" } : null,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <BreadcrumbNav
          className="mb-6"
          items={[
            { label: "AI Tools", href: "/en/tools" },
            ...(category ? [{ label: category.name, href: `/en/categories/${category.slug}` }] : []),
            { label: tool.name, href: `/en/tools/${tool.slug}` },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 overflow-hidden">
                {tool.logo_url ? (
                  <img src={tool.logo_url} alt={tool.name} className="w-12 h-12 object-contain" />
                ) : (
                  <span className="text-2xl font-bold text-primary">{tool.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                <p className="text-lg text-muted-foreground mt-1">{tool.tagline}</p>
                <div className="flex items-center gap-3 mt-2">
                  {tool.avg_rating && (
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-accent-warm text-accent-warm" />
                      {Number(tool.avg_rating).toFixed(1)} ({tool.review_count} reviews)
                    </span>
                  )}
                  <Badge variant="secondary">{tool.pricing_model}</Badge>
                </div>
              </div>
            </div>

            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                <p className="text-base leading-relaxed">{tool.description}</p>
                {tool.long_description && (
                  <div dangerouslySetInnerHTML={{ __html: tool.long_description }} />
                )}
              </div>
            </section>

            {/* Features */}
            {features.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((f: any, i: number) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-sm mb-1">{f.name}</h3>
                        {f.description && (
                          <p className="text-sm text-muted-foreground">{f.description}</p>
                        )}
                        {f.tier && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {f.tier}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Pricing */}
            {pricingTiers.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Pricing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {pricingTiers.map((tier: any, i: number) => (
                    <Card key={i} className={tier.highlighted ? "border-primary/50 ring-1 ring-primary/20" : ""}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{tier.name}</h3>
                        <div className="text-2xl font-bold mt-2">{tier.price || "Free"}</div>
                        <p className="text-xs text-muted-foreground mt-1">{tier.billing_period}</p>
                        {tier.features && (
                          <ul className="mt-3 space-y-1">
                            {(tier.features as string[]).map((f: string, j: number) => (
                              <li key={j} className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent-success shrink-0 mt-0.5" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Use Cases */}
            {useCases.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Use Cases</h2>
                <div className="space-y-3">
                  {useCases.map((uc: any, i: number) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{uc.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{uc.description}</p>
                        {uc.who_for && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Best for: {uc.who_for}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Pros & Cons */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Pros & Cons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-accent-success/20">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-accent-success mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Pros
                    </h3>
                    <ul className="space-y-2">
                      {pros.map((pro: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-accent-success mt-1">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-destructive/20">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-destructive mb-3 flex items-center gap-2">
                      <XCircle className="h-4 w-4" /> Cons
                    </h3>
                    <ul className="space-y-2">
                      {cons.map((con: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-destructive mt-1">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-semibold mb-3">FAQ</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Summary Card */}
            <Card className="sticky top-24">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold">Quick Summary</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Pricing</dt>
                    <dd className="font-medium">{tool.pricing_model}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">API</dt>
                    <dd className="font-medium">{tool.api_available ? "Available" : "N/A"}</dd>
                  </div>
                  {tool.founded_year && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Founded</dt>
                      <dd className="font-medium">{tool.founded_year}</dd>
                    </div>
                  )}
                  {category && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="font-medium">
                        <a href={`/en/categories/${category.slug}`} className="no-style text-primary hover:text-accent-secondary">
                          {category.name}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                <Separator />

                {/* CTA Buttons */}
                <AffiliateCTA
                  toolName={tool.name}
                  affiliateUrl={tool.affiliate_url || tool.website_url}
                  toolId={tool.id}
                  pageSlug={`tools/${tool.slug}`}
                  variant="default"
                />

                <a
                  href={tool.website_url}
                  target="_blank"
                  rel="nofollow"
                  className="no-style"
                >
                  <Button variant="outline" className="w-full" size="sm">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
