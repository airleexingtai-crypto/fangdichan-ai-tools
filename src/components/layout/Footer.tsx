"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

export function Footer() {
  const locale = useLocale();

  const footerLinks: Record<string, { href: string; label: string }[]> = {
    Resources: [
      { href: `/${locale}/tools`, label: "All Tools" },
      { href: `/${locale}/categories`, label: "Categories" },
      { href: `/${locale}/tutorials`, label: "Tutorials" },
      { href: `/${locale}/glossary`, label: "Glossary" },
    ],
    Categories: [
      { href: `/${locale}/categories/crm`, label: "AI CRM" },
      { href: `/${locale}/categories/search`, label: "AI Property Search" },
      { href: `/${locale}/categories/analytics`, label: "AI Analytics" },
      { href: `/${locale}/categories/marketing`, label: "AI Marketing" },
    ],
    Legal: [
      { href: `/${locale}/privacy`, label: "Privacy Policy" },
      { href: `/${locale}/terms`, label: "Terms of Service" },
      { href: `/${locale}/disclosure`, label: "Affiliate Disclosure" },
    ],
  };
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4 text-foreground">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
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
              AITools.RealEstate &copy; {new Date().getFullYear()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md text-center sm:text-right">
            We may earn commissions from qualifying purchases made through links on this site.
            This does not affect our rankings, reviews, or recommendations.
          </p>
        </div>
      </div>
    </footer>
  );
}
