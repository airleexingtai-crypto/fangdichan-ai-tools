import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return generatePageMeta({
    title: t("disclosure_title"),
    description: t("disclosure_intro"),
    path: locale === "en" ? "/disclosure" : `/${locale}/disclosure`,
    locale,
  });
}

export default async function DisclosurePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });

  const sections = [
    { title: t("disclosure_how_title"), body: t("disclosure_how_body") },
    { title: t("disclosure_editorial_title"), body: t("disclosure_editorial_body") },
    { title: t("disclosure_identify_title"), body: t("disclosure_identify_body") },
    { title: t("disclosure_commitment_title"), body: t("disclosure_commitment_body") },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[{ label: t("disclosure_title"), href: "/disclosure" }]}
      />

      <h1 className="text-3xl font-bold mb-4">{t("disclosure_title")}</h1>
      <p className="text-muted-foreground text-lg mb-10">{t("disclosure_intro")}</p>

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
