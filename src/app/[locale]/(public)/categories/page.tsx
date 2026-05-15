import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { supabase } from "@/lib/supabase";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return generatePageMeta({
    title: t("categories_title"),
    description: "Browse AI tools for real estate by category. CRM, Property Search, Analytics, Marketing, and more.",
    path: locale === "en" ? "/categories" : `/${locale}/categories`,
  });
}

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  const { data: categories } = await supabase.from("Category").select("*").order("sort_order");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: t("breadcrumb_categories"), href: "/categories" }]} />
      <h1 className="text-3xl font-bold mt-4 mb-6">{t("categories_title")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories?.map((cat: any) => (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="no-style">
            <div className="card-hover rounded-lg border border-border/50 bg-card p-5 text-center">
              <div className="text-2xl mb-2">{cat.icon || "📂"}</div>
              <h3 className="font-medium">{cat.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
