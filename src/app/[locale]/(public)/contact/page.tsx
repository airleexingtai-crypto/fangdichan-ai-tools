import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo/metadata";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return generatePageMeta({
    title: locale === "zh" ? "联系我们" : "Contact Us",
    description: locale === "zh"
      ? "联系我们获取关于AI工具导航的任何问题、建议或合作意向。"
      : "Get in touch with any questions, suggestions, or partnership inquiries about AI Tools for Real Estate.",
    path: locale === "en" ? "/contact" : `/${locale}/contact`,
    locale,
    noIndex: true,
  });
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbNav
        className="mb-6"
        items={[{ label: "Contact", href: "/contact" }]}
      />

      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-muted-foreground text-lg mb-10">
        Have a question, suggestion, or want to list your AI tool? We'd love to hear from you.
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">General Inquiries</h2>
          <p className="text-muted-foreground leading-relaxed">
            For general questions about AI Tools for Real Estate, tool recommendations, or partnership opportunities,
            please email us at <a href="mailto:hello@airealtools.com" className="text-primary hover:underline">hello@airealtools.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">List Your AI Tool</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you've built an AI tool for the real estate industry and would like it listed in our directory,
            reach out at <a href="mailto:listings@airealtools.com" className="text-primary hover:underline">listings@airealtools.com</a>.
            Please include a brief description, pricing model, and any relevant documentation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Report an Issue</h2>
          <p className="text-muted-foreground leading-relaxed">
            Found outdated information, a broken link, or a factual error? Let us know at{" "}
            <a href="mailto:corrections@airealtools.com" className="text-primary hover:underline">corrections@airealtools.com</a>.
            We review and correct issues within 48 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
