"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

export function Footer() {
  const t = useTranslations("footer");

  const sections = [
    {
      title: t("resources"),
      links: [
        { href: "/tools", label: t("all_tools") },
        { href: "/categories", label: t("categories") },
        { href: "/tutorials", label: t("tutorials") },
        { href: "/glossary", label: t("glossary") },
      ],
    },
    {
      title: t("top_categories"),
      links: [
        { href: "/categories/crm", label: t("ai_crm") },
        { href: "/categories/search", label: t("ai_property_search") },
        { href: "/categories/analytics", label: t("ai_analytics") },
        { href: "/categories/marketing", label: t("ai_marketing") },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: "/privacy", label: t("privacy_policy") },
        { href: "/terms", label: t("terms") },
        { href: "/disclosure", label: t("disclosure") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="no-style text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[10px]">AI</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {t("copyright")} &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md text-center sm:text-right">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
