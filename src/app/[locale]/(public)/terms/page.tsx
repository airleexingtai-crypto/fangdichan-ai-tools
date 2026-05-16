import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return generatePageMeta({
    title: t("terms_title"),
    description: t("terms_intro"),
    path: locale === "en" ? "/terms" : `/${locale}/terms`,
    locale,
    noIndex: true,
  });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });

  const sections = [
    { title: t("terms_use_title"), body: t("terms_use_body") },
    { title: t("terms_affiliate_title"), body: t("terms_affiliate_body") },
    { title: t("terms_ip_title"), body: t("terms_ip_body") },
    { title: t("terms_liability_title"), body: t("terms_liability_body") },
    { title: t("terms_changes_title"), body: t("terms_changes_body") },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[{ label: t("terms_title"), href: "/terms" }]}
      />

      <h1 className="text-3xl font-bold mb-4">{t("terms_title")}</h1>
      <p className="text-muted-foreground text-lg mb-10">{t("terms_intro")}</p>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-12">
        Last updated: May 2026
      </p>
    </div>
  );
}
