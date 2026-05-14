import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMeta({
    title: "AI in Real Estate Statistics — Key Data & Trends",
    description: "Key statistics and data about AI adoption in real estate.",
    path: locale === "en" ? "/stats" : `/${locale}/stats`,
  });
}

export default async function StatsPage({ params }: Props) {
  const { locale } = await params;
  const lhref = (path: string) => locale === "en" ? path : `/${locale}${path}`;
  const { data: stats } = await supabase.from("StatPage").select("*").eq("status", "PUBLISHED").order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: "Statistics", href: "/stats" }]} />
      <h1 className="text-3xl font-bold mt-4 mb-6">AI in Real Estate — Statistics & Data</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats?.map((s: any) => (
          <Link key={s.slug} href={lhref(`/stats/${s.slug}`)} className="no-style">
            <div className="card-hover rounded-lg border border-border/50 bg-card p-5 h-full">
              {s.hero_stat && <div className="text-3xl font-bold text-gradient mb-2">{s.hero_stat}</div>}
              {s.hero_label && <p className="text-sm text-muted-foreground mb-2">{s.hero_label}</p>}
              <h3 className="font-semibold">{s.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
