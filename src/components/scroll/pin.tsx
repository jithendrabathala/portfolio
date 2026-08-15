"use client";

import { type MotionValue, useScroll } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-motion-scale";
import { cn } from "@/lib/utils";

type PinProps = {
  /**
   * Receives a 0→1 MotionValue for this scene's own scroll span. Use it with
   * `useTransform` to scrub the scene's internals.
   */
  children: (progress: MotionValue<number>) => ReactNode;

  /**
   * Extra viewport heights of scroll the scene consumes while pinned. `2` means
   * the sticky panel holds for two screens of scrolling before releasing.
   */
  length?: number;

  /**
   * What to render instead when the user prefers reduced motion. Pinning is
   * inherently motion — there is no "gentler pin" — so scenes supply a plain
   * static layout here rather than degrading the scrub.
   */
  reducedFallback?: ReactNode;

  className?: string;
};

/**
 * Sticky-pin primitive: a tall outer spacer sets the scroll distance while an
 * inner viewport-height panel stays fixed in place.
 *
 * Deliberately uses native scroll and `position: sticky` rather than hijacking
 * the wheel — the scrollbar, keyboard paging, and trackpad momentum all keep
 * working, which is what usually breaks on sites that do this.
 *
 * Note an ancestor with `overflow: hidden` silently disables sticky; `body` is
 * set to `overflow-x: clip` in globals.css for exactly this reason.
 */
export function Pin({
  children,
  length = 2,
  reducedFallback,
  className,
}: PinProps) {
  const ref = useRef<HTMLDivElement>(null);

  // "start start" → "end end" maps progress across the span where the sticky
  // child is actually pinned, so 0 is the moment it sticks and 1 the moment it
  // releases.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced && reducedFallback !== undefined) {
    return <div className={className}>{reducedFallback}</div>;
  }

  return (
    <div
      ref={ref}
      // Marks the scroll span so scenes can map an element back to a scroll
      // offset — the horizontal gallery uses this to bring focused cards into
      // view for keyboard users.
      data-pin=""
      className={cn("relative", className)}
      style={{ height: `${(length + 1) * 100}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {children(scrollYProgress)}
      </div>
    </div>
  );
}
