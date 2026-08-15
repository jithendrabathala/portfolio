"use client";

import { domMax, LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps the app so components use `m.*` from "framer-motion/m" instead of
 * `motion.*`. The `m` components ship without the feature set baked in;
 * LazyMotion supplies it once here, which keeps the per-component cost down on
 * a site that animates this much.
 *
 * `domMax` rather than the lighter `domAnimation` because the project detail
 * overlay morphs out of its card via `layoutId`, and shared-layout animation
 * needs the projection engine that only `domMax` includes. Dropping to
 * `domAnimation` silently disables the morph rather than erroring.
 *
 * `strict` turns any stray `motion.*` import into a runtime error, which is the
 * only thing that keeps the above true as the site grows.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
