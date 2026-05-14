import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMeta({
    title: "AI Tool Comparisons for Real Estate — Side-by-Side Reviews",
    description: "Compare AI tools for real estate side by side.",
    path: locale === "en" ? "/compare" : `/${locale}/compare`,
  });
}

export default async function ComparePage({ params }: Props) {
  const { locale } = await params;
  const lhref = (path: string) => locale === "en" ? path : `/${locale}${path}`;
  const { data: comparisons } = await supabase.from("Comparison").select("*").eq("status", "PUBLISHED").order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: "Compare", href: "/compare" }]} />
      <h1 className="text-3xl font-bold mt-4 mb-2">AI Tool Comparisons</h1>
      <p className="text-muted-foreground mb-8">Side-by-side comparisons to help you choose</p>
      {comparisons && comparisons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisons.map((c: any) => (
            <Link key={c.slug} href={lhref(`/compare/${c.slug}`)} className="no-style">
              <div className="card-hover rounded-lg border border-border/50 bg-card p-5">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>No comparisons yet.</p>
        </div>
      )}
    </div>
  );
}
