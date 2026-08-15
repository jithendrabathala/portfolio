import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The single horizontal container for the whole site.
 *
 * Every section renders through this so they share one max width and one
 * gutter, which is what keeps left edges lined up down the page. Sections that
 * need a narrower measure (body copy, for instance) constrain a child inside
 * this rather than shrinking the container itself — otherwise the block
 * re-centres and its left edge drifts inward from everything above it.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-6", className)}>
      {children}
    </div>
  );
}
