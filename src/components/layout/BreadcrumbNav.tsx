"use client";

import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

type Crumb = {
  label: string;
  href: string;
};

type Props = {
  items: Crumb[];
  className?: string;
};

export function BreadcrumbNav({ items, className }: Props) {
  const pt = useTranslations("pages");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: pt("breadcrumb_home"), item: baseUrl },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        item: `${baseUrl}${item.href}`,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li className="flex items-center">
            <Link href="/" className="no-style text-sm text-muted-foreground hover:text-foreground transition-colors">
              {pt("breadcrumb_home")}
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
              {i === items.length - 1 ? (
                <span className="text-sm text-foreground font-medium" aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href} className="no-style text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
