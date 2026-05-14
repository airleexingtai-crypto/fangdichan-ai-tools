"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type ComparisonData = {
  features: string[];
  tools: {
    name: string;
    slug: string;
    values: (string | boolean | null)[];
    winner?: boolean;
  }[];
  winnerNotes?: Record<string, string>;
};

type Props = {
  data: ComparisonData;
  className?: string;
};

export function ComparisonTable({ data, className }: Props) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[180px] bg-card/50">Feature</TableHead>
            {data.tools.map((tool, i) => (
              <TableHead
                key={tool.slug}
                className={cn(
                  "text-center min-w-[140px] bg-card/50",
                  tool.winner && "text-primary"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <a
                    href={`/en/tools/${tool.slug}`}
                    className="no-style font-semibold hover:text-primary transition-colors"
                  >
                    {tool.name}
                  </a>
                  {tool.winner && (
                    <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                      Our Pick
                    </Badge>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.features.map((feature, rowIdx) => (
            <TableRow key={feature} className={rowIdx % 2 === 0 ? "bg-card/20" : ""}>
              <TableCell className="font-medium text-sm">{feature}</TableCell>
              {data.tools.map((tool) => {
                const value = tool.values[rowIdx];
                return (
                  <TableCell key={tool.slug} className="text-center">
                    {renderValue(value)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.winnerNotes && Object.keys(data.winnerNotes).length > 0 && (
        <div className="p-4 border-t border-border bg-card/30">
          <p className="font-semibold text-sm mb-2">
            <span className="inline-block w-3 h-3 rounded-full bg-primary mr-2" />
            Quick Summary
          </p>
          <dl className="space-y-2">
            {Object.entries(data.winnerNotes).map(([toolName, note]) => (
              <div key={toolName} className="text-sm">
                <dt className="font-medium text-foreground inline">{toolName}:</dt>{" "}
                <dd className="text-muted-foreground inline">{note}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

function renderValue(value: string | boolean | null) {
  if (value === true) return <Check className="h-4 w-4 text-accent-success mx-auto" />;
  if (value === false) return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  if (value === null || value === "") return <Minus className="h-4 w-4 text-muted-foreground/30 mx-auto" />;
  if (value === "Free") return <Badge variant="secondary" className="bg-accent-success/10 text-accent-success">Free</Badge>;
  return <span className="text-sm">{value}</span>;
}
