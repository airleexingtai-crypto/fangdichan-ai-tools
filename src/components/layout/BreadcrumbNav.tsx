"use client";

import { Link } from "@/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <Breadcrumb className={className}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" className="no-style text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
          </BreadcrumbItem>
          {items.map((item, i) => (
            <BreadcrumbItem key={item.href} className="flex items-center gap-1.5">
              <BreadcrumbSeparator>
                <ChevronRight className="h-3 w-3" />
              </BreadcrumbSeparator>
              {i === items.length - 1 ? (
                <span className="text-sm text-foreground font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="no-style text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
