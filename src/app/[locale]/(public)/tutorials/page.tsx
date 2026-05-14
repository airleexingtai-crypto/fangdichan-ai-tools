import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { Clock, Signal } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMeta({
    title: "AI Tutorials for Real Estate — Step-by-Step Guides",
    description: "Learn how to use AI tools in real estate with step-by-step tutorials.",
    path: locale === "en" ? "/tutorials" : `/${locale}/tutorials`,
  });
}

export default async function TutorialsPage({ params }: Props) {
  const { locale } = await params;
  const lhref = (path: string) => locale === "en" ? path : `/${locale}${path}`;
  const { data: tutorials } = await supabase.from("Tutorial").select("*").eq("status", "PUBLISHED").order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: "Tutorials", href: "/tutorials" }]} />
      <h1 className="text-3xl font-bold mt-4 mb-6">AI Tutorials for Real Estate</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorials?.map((t: any) => (
          <Link key={t.slug} href={lhref(`/tutorials/${t.slug}`)} className="no-style">
            <div className="card-hover rounded-lg border border-border/50 bg-card p-5 h-full">
              <h3 className="font-semibold mb-2">{t.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{t.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {t.estimated_minutes && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.estimated_minutes} min</span>}
                {t.difficulty && <span className="flex items-center gap-1"><Signal className="h-3 w-3" />{t.difficulty}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
