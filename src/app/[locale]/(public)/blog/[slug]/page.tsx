import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return generatePageMeta({
    title: `${title} — AI Real Estate Blog`,
    description: "Latest news and analysis about AI tools for real estate.",
    path: locale === "en" ? `/blog/${slug}` : `/${locale}/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[
          { label: t("breadcrumb_blog"), href: "/blog" },
          { label: slug.replace(/-/g, " "), href: `/blog/${slug}` },
        ]}
      />

      <article>
        <h1 className="text-3xl font-bold mb-4">
          {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
        <div className="prose prose-invert max-w-none">
          <p>{t("blog_coming_soon")}</p>
        </div>
      </article>
    </div>
  );
}
