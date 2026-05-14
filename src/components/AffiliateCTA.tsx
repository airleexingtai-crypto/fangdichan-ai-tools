import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  toolName: string;
  affiliateUrl: string;
  toolId: string;
  pageSlug: string;
  variant?: "default" | "inline" | "banner";
  className?: string;
};

export function AffiliateCTA({
  toolName,
  affiliateUrl,
  toolId,
  pageSlug,
  variant = "default",
  className,
}: Props) {
  // Route through centralized /out/ endpoint for tracking
  const trackedUrl = `/out/${toolId}/?ref=${encodeURIComponent(pageSlug)}`;

  if (variant === "inline") {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        <a
          href={trackedUrl}
          target="_blank"
          rel="nofollow sponsored"
          className="no-style text-primary hover:text-accent-secondary text-sm font-medium inline-flex items-center gap-1"
        >
          Try {toolName} <ExternalLink className="h-3 w-3" />
        </a>
      </span>
    );
  }

  if (variant === "banner") {
    return (
      <div className={cn("rounded-lg border border-primary/20 bg-primary/5 p-4", className)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Ready to try {toolName}?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visit their website to learn more or start a free trial.
            </p>
          </div>
          <a
            href={trackedUrl}
            target="_blank"
            rel="nofollow sponsored"
            className="no-style"
          >
            <Button size="sm">
              Visit Site <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </a>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          When you click and make a purchase, we may earn a commission. This does not affect our rankings.
        </p>
      </div>
    );
  }

  // default: sidebar CTA button
  return (
    <div className={cn(className)}>
      <a
        href={trackedUrl}
        target="_blank"
        rel="nofollow sponsored"
        className="no-style"
      >
        <Button className="w-full" size="lg">
          Visit {toolName} <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </a>
      <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
        Affiliate link — we may earn a commission
      </p>
    </div>
  );
}
