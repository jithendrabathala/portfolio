"use client";

import {
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import * as m from "framer-motion/m";
import { type ReactNode, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-motion-scale";
import { cn } from "@/lib/utils";

/**
 * Cursor-tracked spotlight mask, from the Aceternity registry
 * (`@aceternity/svg-mask-effect`). The public API — MaskContainer with
 * children / revealText / size / revealSize / className — is unchanged, so a
 * future `shadcn add` diff still lines up. The body is rewritten:
 *
 *  - `motion/react` -> `framer-motion/m`. MotionProvider wraps the app in
 *    LazyMotion `strict`, which throws on any `motion.*` component. The shipped
 *    version crashes on mount here rather than rendering.
 *  - Pointer position drives motion values rather than useState. The original
 *    re-rendered this subtree on every single mousemove event.
 *  - The mask starts parked off-canvas. The original interpolated from
 *    `{x: null, y: null}`, emitting `NaNpx` until the first pointer event.
 *  - `pointermove` rather than `mousemove`, so pen and touch drive it too.
 *  - The listener binds the element once instead of reading `ref.current` in
 *    cleanup, which is not guaranteed to be the node that was subscribed.
 *  - `var(--slate-900)` / `var(--white)` are not defined in this theme; the
 *    spotlight uses the project's fg/bg tokens.
 *
 * ACCESSIBILITY CONTRACT: `children` is the spotlight layer. It cannot be
 * reached without a pointer and is dropped entirely under reduced motion, so it
 * must never carry information unavailable elsewhere. `revealText` is the layer
 * that always renders, and is the one screen readers get.
 */
export function MaskContainer({
  children,
  revealText,
  size = 10,
  revealSize = 600,
  className,
  revealClassName,
  contentClassName,
}: {
  children?: ReactNode;
  revealText?: ReactNode;
  /** Mask diameter at rest, px. */
  size?: number;
  /** Mask diameter while the spotlight content is hovered, px. */
  revealSize?: number;
  className?: string;
  /**
   * Additive props beyond the registry's API. Both layers are hard-centred
   * upstream, which is wrong in any left-aligned layout — the hero headline
   * would jump to centre the moment it was wrapped. Defaults preserve the
   * registry's centring; twMerge lets a caller override it.
   */
  revealClassName?: string;
  contentClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const target = useMotionValue(size);

  // Springing the diameter is what makes the reveal feel like it opens rather
  // than snaps. Position is deliberately not sprung — lag between the cursor
  // and the spotlight reads as broken.
  const diameter = useSpring(target, {
    stiffness: 180,
    damping: 26,
    mass: 0.4,
  });

  const offsetX = useTransform(() => x.get() - diameter.get() / 2);
  const offsetY = useTransform(() => y.get() - diameter.get() / 2);

  const maskPosition = useMotionTemplate`${offsetX}px ${offsetY}px`;
  const maskSize = useMotionTemplate`${diameter}px`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReduced) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };

    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [prefersReduced, x, y]);

  // No pointer tracking to reduce — the whole effect is cursor displacement, so
  // it degrades to the base layer rather than to a slower version of itself.
  if (prefersReduced) {
    return (
      <div className={cn("relative", className)}>
        <div
          className={cn(
            "flex h-full w-full items-center justify-center",
            revealClassName,
          )}
        >
          {revealText}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex h-full w-full items-center justify-center",
          revealClassName,
        )}
      >
        {revealText}
      </div>

      {/* aria-hidden matches the contract above: this layer is pointer-only, so
          it is presentational as far as assistive tech is concerned. */}
      <m.div
        aria-hidden="true"
        style={{
          maskPosition,
          maskSize,
          WebkitMaskPosition: maskPosition,
          WebkitMaskSize: maskSize,
          willChange: "mask-position, mask-size",
        }}
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "bg-fg text-bg",
          "[mask-image:url(/mask.svg)] [mask-repeat:no-repeat]",
          "[-webkit-mask-image:url(/mask.svg)] [-webkit-mask-repeat:no-repeat]",
        )}
      >
        <div
          onPointerEnter={() => target.set(revealSize)}
          onPointerLeave={() => target.set(size)}
          className={cn(
            "relative z-20 mx-auto max-w-4xl text-center",
            contentClassName,
          )}
        >
          {children}
        </div>
      </m.div>
    </div>
  );
}
