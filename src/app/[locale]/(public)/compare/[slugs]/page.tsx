import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMeta } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { ComparisonTable } from "@/components/ComparisonTable";
import { AffiliateCTA } from "@/components/AffiliateCTA";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ slugs: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs, locale } = await params;
  const names = slugs.split("-vs-").map((s: string) => s.replace(/-/g, " "));
  return generatePageMeta({
    title: `${names.join(" vs ")} — Which AI Tool Wins?`,
    description: `Side-by-side comparison of ${names.join(" and ")}. Compare pricing, features, pros & cons, and find the best AI tool for your real estate needs.`,
    path: locale === "en" ? `/compare/${slugs}` : `/${locale}/compare/${slugs}`,
  });
}

export default async function ComparisonPage({ params }: Props) {
  const { slugs } = await params;
  const toolSlugs = slugs.split("-vs-");

  if (toolSlugs.length < 2 || toolSlugs.length > 5) notFound();

  const { data: tools } = await supabase
    .from("Tool")
    .select("*")
    .in("slug", toolSlugs)
    .eq("status", "PUBLISHED");

  if (!tools || tools.length < 2) notFound();

  // Build comparison data from tool JSON fields
  const allFeatures = tools.flatMap((t: any) =>
    ((t.features_json as any[]) || []).map((f: any) => f.name)
  );
  const uniqueFeatures = [...new Set(allFeatures)];

  const comparisonData = {
    features: ["Pricing Model", "API Available", ...uniqueFeatures],
    tools: tools.map((t: any) => ({
      name: t.name,
      slug: t.slug,
      values: [
        t.pricing_model,
        t.api_available,
        ...uniqueFeatures.map((f) => {
          const feat = ((t.features_json as any[]) || []).find((x: any) => x.name === f);
          return feat ? true : false;
        }),
      ],
      winner: false,
    })),
    winnerNotes: {
      [tools[0].name]: `Best for: ${tools[0].tagline?.slice(0, 100)}`,
      [tools[1].name]: `Best for: ${tools[1].tagline?.slice(0, 100)}`,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[
          { label: "Compare", href: "/compare" },
          { label: `${tools[0].name} vs ${tools[1].name}`, href: `/compare/${slugs}` },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {tools.map((t: any, i: number) => (
            <span key={t.slug}>
              {i > 0 && (i === tools.length - 1 ? " vs " : ", ")}
              <span className="text-gradient">{t.name}</span>
            </span>
          ))}
        </h1>
        <p className="text-muted-foreground mt-2">
          Side-by-side comparison to help you choose the right AI tool for your real estate needs.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Comparison Table */}
      <ComparisonTable data={comparisonData} className="mb-10" />

      {/* Tool Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {tools.map((tool: any) => (
          <Card key={tool.slug}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">{tool.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tool.description?.slice(0, 200)}</p>
              <div className="flex items-center gap-3">
                <Badge>{tool.pricing_model}</Badge>
                {tool.avg_rating && (
                  <span className="text-sm text-muted-foreground">
                    ★ {Number(tool.avg_rating).toFixed(1)}
                  </span>
                )}
              </div>
              <AffiliateCTA
                toolName={tool.name}
                affiliateUrl={tool.affiliate_url || tool.website_url}
                toolId={tool.id}
                pageSlug={`compare/${slugs}`}
                variant="banner"
                className="mt-4"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
