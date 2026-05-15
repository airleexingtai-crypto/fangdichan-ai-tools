import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateHowToSchema } from "@/lib/seo/schema";
import { supabase } from "@/lib/supabase";
import { getTranslation, applyTranslation } from "@/lib/translate";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AffiliateCTA } from "@/components/AffiliateCTA";
import { Clock, Signal, Wrench } from "lucide-react";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const { data: tutorial } = await supabase.from("Tutorial").select("*").eq("slug", slug).single();
  if (!tutorial) return { title: "Tutorial Not Found" };
  return generatePageMeta({
    title: `${tutorial.title} — AI for Real Estate Tutorial`,
    description: tutorial.description?.slice(0, 160) || "",
    path: locale === "en" ? `/tutorials/${slug}` : `/${locale}/tutorials/${slug}`,
    type: "article",
  });
}

export default async function TutorialPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  const lhref = (path: string) => locale === "en" ? path : `/${locale}${path}`;
  const { data: tutorial } = await supabase
    .from("Tutorial")
    .select("*")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (!tutorial) notFound();

  const translation = await getTranslation("Tutorial", tutorial.id, locale);
  const displayTutorial = applyTranslation(tutorial, translation, ["title", "description", "content"]);

  // Fetch referenced tools via TutorialTool join table
  const { data: toolLinks } = await supabase
    .from("TutorialTool")
    .select("tool_id")
    .eq("tutorial_id", tutorial.id);

  const toolIds = (toolLinks || []).map((l: any) => l.tool_id);
  const { data: toolsData } = toolIds.length > 0
    ? await supabase.from("Tool").select("*").in("id", toolIds)
    : { data: [] };
  const referencedTools = toolsData || [];
  const steps = extractSteps(displayTutorial.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateHowToSchema({
              title: displayTutorial.title,
              description: displayTutorial.description,
              steps: steps.map((s) => ({ name: s.title || s.text.slice(0, 60), text: s.text })),
              estimatedMinutes: tutorial.estimated_minutes,
            })
          ),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BreadcrumbNav
          className="mb-6"
          items={[
            { label: t("breadcrumb_tutorials"), href: "/tutorials" },
            { label: displayTutorial.title, href: `/tutorials/${slug}` },
          ]}
        />

        {/* Header */}
        <article>
          <h1 className="text-3xl font-bold mb-3">{displayTutorial.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{displayTutorial.description}</p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8">
            {tutorial.estimated_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {tutorial.estimated_minutes} min
              </span>
            )}
            {tutorial.difficulty && (
              <span className="flex items-center gap-1">
                <Signal className="h-4 w-4" /> {tutorial.difficulty}
              </span>
            )}
            {referencedTools.length > 0 && (
              <span className="flex items-center gap-1">
                <Wrench className="h-4 w-4" />
                {referencedTools.map((t: any, i: number) => (
                  <span key={t.slug}>
                    <Link href={`/tools/${t.slug}`} className="no-style text-primary hover:text-accent-secondary">
                      {t.name}
                    </Link>
                    {i < referencedTools.length - 1 && ", "}
                  </span>
                ))}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-10">
            {displayTutorial.content ? (
              <div dangerouslySetInnerHTML={{ __html: displayTutorial.content }} />
            ) : (
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <Card key={i}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-primary-foreground font-bold text-sm">{i + 1}</span>
                        </div>
                        <div>
                          {step.title && (
                            <h3 className="font-semibold text-foreground">{step.title}</h3>
                          )}
                          <p className="text-muted-foreground text-sm">{step.text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Referenced Tools */}
        {referencedTools.length > 0 && (
          <section className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold mb-4">{t("tools_used")}</h2>
            <div className="space-y-3">
              {referencedTools.map((tool: any) => (
                <AffiliateCTA
                  key={tool.slug}
                  toolName={tool.name}
                  affiliateUrl={tool.affiliate_url || tool.website_url}
                  toolId={tool.id}
                  pageSlug={`tutorials/${slug}`}
                  variant="banner"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function extractSteps(content: string | null): { title?: string; text: string }[] {
  if (!content) return [];
  const steps: { title?: string; text: string }[] = [];
  const lines = content.split("\n");
  let currentStep: { title?: string; text: string } | null = null;
  for (const line of lines) {
    if (line.match(/^#{2,3}\s+Step\s+\d+/i) || line.match(/^#{2,3}\s+\d+\./)) {
      if (currentStep) steps.push(currentStep);
      currentStep = { title: line.replace(/^#+\s*/, ""), text: "" };
    } else if (currentStep) {
      currentStep.text += line + "\n";
    }
  }
  if (currentStep) steps.push(currentStep);
  return steps.length > 0 ? steps : [{ text: content.slice(0, 500) }];
}
