import { Metadata } from "next";
import Link from "next/link";
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
import { Star, Globe, Calendar, Wrench, CheckCircle2, XCircle } from "lucide-react";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const { data: tool } = await supabase.from("Tool").select("*").eq("slug", slug).single();

  if (!tool) return { title: "Tool Not Found" };

  return generatePageMeta({
    title: locale === "zh"
      ? `${tool.name} — AI 工具详情 | 功能、价格与评价`
      : `${tool.name} — AI Tool for Real Estate | Pricing, Features & Reviews`,
    description: tool.description?.slice(0, 160) || `${tool.name}: ${tool.tagline}`,
    path: locale === "en" ? `/tools/${slug}` : `/${locale}/tools/${slug}`,
    updatedAt: tool.updated_at,
  });
}

const PRICING_LABEL: Record<string, string> = {
  FREE: "Free", FREEMIUM: "Freemium", PAID: "Paid", ENTERPRISE: "Enterprise", FREE_TRIAL: "Free Trial",
};

function renderFeatures(features: any) {
  const items = Array.isArray(features) ? features : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((f: any, i: number) => (
        <Card key={i}>
          <CardContent className="p-4">
            {typeof f === "string" ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-success shrink-0 mt-0.5" />
                <span className="text-sm">{f}</span>
              </div>
            ) : (
              <>
                <h3 className="font-medium text-sm mb-1">{f.name}</h3>
                {f.description && <p className="text-sm text-muted-foreground">{f.description}</p>}
                {f.tier && <Badge variant="outline" className="mt-2 text-xs">{f.tier}</Badge>}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function renderPricing(pricingJson: any) {
  if (!pricingJson) return null;
  const tiers = Object.entries(pricingJson as Record<string, string>);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {tiers.map(([name, price], i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm capitalize">{name.replace(/_/g, " ")}</h3>
            <div className="text-2xl font-bold mt-2">{price === "Custom pricing" || price === "Custom pricing based on volume" || price === "Custom" ? "Custom" : price}</div>
            <p className="text-xs text-muted-foreground mt-1">{typeof price === "string" && price.startsWith("$") ? "per month" : ""}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function renderUseCases(useCases: any) {
  const items = Array.isArray(useCases) ? useCases : [];
  return (
    <div className="space-y-3">
      {items.map((uc: any, i: number) => (
        <Card key={i}>
          <CardContent className="p-4">
            {typeof uc === "string" ? (
              <p className="text-sm">{uc}</p>
            ) : (
              <>
                <h3 className="font-medium">{uc.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{uc.description}</p>
                {uc.who_for && <p className="text-xs text-muted-foreground mt-2">Best for: {uc.who_for}</p>}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function ToolPage({ params }: Props) {
  const { slug, locale } = await params;
  const lhref = (path: string) => locale === "en" ? path : `/${locale}${path}`;

  const { data: tool } = await supabase
    .from("Tool")
    .select("*, categories:ToolCategory(category:Category(*))")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .single();

  if (!tool) notFound();

  const category = tool.categories?.[0]?.category;
  const features = tool.features_json;
  const pros = (tool.pros_json as string[]) || [];
  const cons = (tool.cons_json as string[]) || [];
  const useCases = tool.use_cases_json;
  const pricingTiers = tool.pricing_json;

  const faqs = [
    { question: `What is ${tool.name}?`, answer: tool.description?.slice(0, 300) || "" },
    { question: `How much does ${tool.name} cost?`, answer: tool.pricing_model === "FREE" ? `${tool.name} is free to use.` : `${tool.name} offers ${tool.pricing_model?.toLowerCase()} pricing. Check their website for current pricing.` },
    { question: `Does ${tool.name} have an API?`, answer: tool.api_available ? `Yes, ${tool.name} provides an API for integration.` : `${tool.name} does not currently offer a public API.` },
  ];

  // Fetch alternatives
  const { data: altLinks } = await supabase
    .from("ToolAlternative")
    .select("alternative:Tool!alternativeId(id, slug, name, tagline, logo_url, pricing_model, avg_rating, review_count)")
    .or(`tool_id.eq.${tool.id},alternative_id.eq.${tool.id}`)
    .limit(6);

  const alternatives = altLinks
    ?.map((al: any) => al.alternative)
    .filter((alt: any) => alt && alt.id !== tool.id)
    .filter((alt: any, i: number, arr: any[]) => arr.findIndex((a: any) => a.id === alt.id) === i);

  const toolSchema = generateSoftwareApplicationSchema({
    name: tool.name,
    description: tool.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/tools/${tool.slug}`,
    logoUrl: tool.logo_url,
    pricingModel: tool.pricing_model,
    avgRating: tool.avg_rating,
    reviewCount: tool.review_count,
    offers: null,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BreadcrumbNav
          className="mb-6"
          items={[
            { label: "AI Tools", href: "/tools" },
            ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
            { label: tool.name, href: `/tools/${tool.slug}` },
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
                  <Badge variant="secondary">{PRICING_LABEL[tool.pricing_model] || tool.pricing_model}</Badge>
                </div>
              </div>
            </div>

            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{locale === "zh" ? "概览" : "Overview"}</h2>
              <p className="text-base leading-relaxed text-muted-foreground">{tool.description}</p>
              {tool.long_description && (
                <div className="mt-4 prose prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: tool.long_description }} />
              )}
            </section>

            {/* Features */}
            {features && (
              <section>
                <h2 className="text-xl font-semibold mb-3">{locale === "zh" ? "功能特性" : "Features"}</h2>
                {renderFeatures(features)}
              </section>
            )}

            {/* Pricing */}
            {pricingTiers && (
              <section>
                <h2 className="text-xl font-semibold mb-3">{locale === "zh" ? "价格方案" : "Pricing"}</h2>
                {renderPricing(pricingTiers)}
              </section>
            )}

            {/* Use Cases */}
            {useCases && (
              <section>
                <h2 className="text-xl font-semibold mb-3">{locale === "zh" ? "使用场景" : "Use Cases"}</h2>
                {renderUseCases(useCases)}
              </section>
            )}

            {/* Pros & Cons */}
            <section>
              <h2 className="text-xl font-semibold mb-3">{locale === "zh" ? "优缺点" : "Pros & Cons"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-accent-success/20">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-accent-success mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> {locale === "zh" ? "优点" : "Pros"}
                    </h3>
                    <ul className="space-y-2">
                      {pros.map((pro: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-accent-success mt-1 shrink-0">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-destructive/20">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-destructive mb-3 flex items-center gap-2">
                      <XCircle className="h-4 w-4" /> {locale === "zh" ? "缺点" : "Cons"}
                    </h3>
                    <ul className="space-y-2">
                      {cons.map((con: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-destructive mt-1 shrink-0">-</span>
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
              <h2 className="text-xl font-semibold mb-3">{locale === "zh" ? "常见问题" : "FAQ"}</h2>
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

            {/* Alternatives */}
            {alternatives && alternatives.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">{locale === "zh" ? "替代工具" : "Alternatives"}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {alternatives.map((alt: any) => (
                    <ToolCard
                      key={alt.slug}
                      slug={alt.slug}
                      name={alt.name}
                      tagline={alt.tagline}
                      logoUrl={alt.logo_url}
                      pricingModel={alt.pricing_model}
                      avgRating={alt.avg_rating}
                      reviewCount={alt.review_count}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold">
                  {locale === "zh" ? "快速概览" : "Quick Summary"}
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{locale === "zh" ? "定价模式" : "Pricing"}</dt>
                    <dd className="font-medium">{PRICING_LABEL[tool.pricing_model] || tool.pricing_model}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">API</dt>
                    <dd className="font-medium">{tool.api_available ? "Available" : "N/A"}</dd>
                  </div>
                  {tool.founded_year && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{locale === "zh" ? "成立年份" : "Founded"}</dt>
                      <dd className="font-medium">{tool.founded_year}</dd>
                    </div>
                  )}
                  {category && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{locale === "zh" ? "分类" : "Category"}</dt>
                      <dd className="font-medium">
                        <Link href={lhref(`/categories/${category.slug}`)} className="no-style text-primary hover:text-accent-secondary">
                          {category.name}
                        </Link>
                      </dd>
                    </div>
                  )}
                </dl>

                <Separator />

                <AffiliateCTA
                  toolName={tool.name}
                  affiliateUrl={tool.affiliate_url || tool.website_url}
                  toolId={tool.id}
                  pageSlug={`tools/${tool.slug}`}
                  variant="default"
                />

                <a href={tool.website_url} target="_blank" rel="nofollow" className="no-style">
                  <Button variant="outline" className="w-full" size="sm">
                    <Globe className="mr-2 h-4 w-4" />
                    {locale === "zh" ? "访问官网" : "Visit Website"}
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
