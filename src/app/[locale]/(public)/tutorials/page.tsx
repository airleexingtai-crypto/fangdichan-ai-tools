import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Clock, Signal } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return generatePageMeta({
    title: t("tutorials_title"),
    description: "Learn how to use AI tools in real estate with step-by-step tutorials.",
    path: locale === "en" ? "/tutorials" : `/${locale}/tutorials`,
  });
}

export default async function TutorialsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  const lhref = (path: string) => locale === "en" ? path : `/${locale}${path}`;
  const { data: tutorials } = await supabase.from("Tutorial").select("*").eq("status", "PUBLISHED").order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: t("breadcrumb_tutorials"), href: "/tutorials" }]} />
      <h1 className="text-3xl font-bold mt-4 mb-6">{t("tutorials_title")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorials?.map((tut: any) => (
          <Link key={tut.slug} href={lhref(`/tutorials/${tut.slug}`)} className="no-style">
            <div className="card-hover rounded-lg border border-border/50 bg-card p-5 h-full">
              <h3 className="font-semibold mb-2">{tut.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tut.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {tut.estimated_minutes && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tut.estimated_minutes} min</span>}
                {tut.difficulty && <span className="flex items-center gap-1"><Signal className="h-3 w-3" />{tut.difficulty}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
