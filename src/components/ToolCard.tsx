"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  slug: string;
  name: string;
  tagline: string;
  logoUrl?: string | null;
  pricingModel: string;
  avgRating?: number | null;
  reviewCount?: number;
  categoryName?: string;
  locale?: string;
  className?: string;
};

export function ToolCard({
  slug,
  name,
  tagline,
  logoUrl,
  pricingModel,
  avgRating,
  reviewCount = 0,
  categoryName,
  locale: propLocale,
  className,
}: ToolCardProps) {
  const hookLocale = useLocale();
  const locale = propLocale ?? hookLocale;
  const pricingLabel =
    pricingModel === "FREE"
      ? "Free"
      : pricingModel === "FREEMIUM"
      ? "Freemium"
      : pricingModel === "FREE_TRIAL"
      ? "Free Trial"
      : "Paid";

  return (
    <Link href={`/${locale}/tools/${slug}`} className="no-style block group">
      <Card className={cn("card-hover h-full border-border/50", className)}>
        <CardContent className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={name} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-primary font-bold text-sm">{name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                {name}
              </h3>
              {categoryName && (
                <span className="text-xs text-muted-foreground">{categoryName}</span>
              )}
            </div>
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {tagline}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Badge variant={pricingModel === "FREE" ? "secondary" : "outline"} className="text-xs">
                {pricingLabel}
              </Badge>
              {avgRating && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-accent-warm text-accent-warm" />
                  {avgRating.toFixed(1)}
                </span>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
