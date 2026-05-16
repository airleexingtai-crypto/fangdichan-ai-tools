import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { generateOrganizationSchema } from "@/lib/seo/schema";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return generatePageMeta({
    title: t("title"),
    description: t("desc"),
    path: locale === "en" ? "/about" : `/${locale}/about`,
    locale,
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  const sections = [
    { title: t("mission_title"), body: t("mission_body") },
    { title: t("how_title"), body: t("how_body") },
    { title: t("editorial_title"), body: t("editorial_body") },
    { title: t("team_title"), body: t("team_body") },
    { title: t("update_title"), body: t("update_body") },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[{ label: t("title"), href: "/about" }]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationSchema()),
        }}
      />

      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p className="text-muted-foreground text-lg mb-10">{t("desc")}</p>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
