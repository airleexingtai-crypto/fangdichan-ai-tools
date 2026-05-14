import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return generatePageMeta({
    title: t("blog_title"),
    description: t("blog_desc"),
    path: locale === "en" ? "/blog" : `/${locale}/blog`,
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav items={[{ label: t("breadcrumb_blog"), href: "/blog" }]} />
      <h1 className="text-3xl font-bold mt-4 mb-2">{t("blog_title")}</h1>
      <p className="text-muted-foreground mb-8">{t("blog_desc")}</p>
      <div className="text-center py-12 text-muted-foreground">
        <p>{t("blog_placeholder")}</p>
      </div>
    </div>
  );
}
