"use client";

import { useMotionValue, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { type ReactNode, useCallback, useRef } from "react";
import { useUIStore } from "@/lib/store";
import { useMotionScale } from "@/lib/use-motion-scale";
import { cn } from "@/lib/utils";

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 *
 * Listens on the wrapper rather than the window, so the cost is bounded by how
 * many of these are actually being hovered — which is at most one.
 */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: ReactNode;
  /** Fraction of the pointer's offset from centre that the child follows. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionScale = useMotionScale();
  const setCursorVariant = useUIStore((s) => s.setCursorVariant);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 24, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 320, damping: 24, mass: 0.4 });

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el || motionScale === 0) return;

      const rect = el.getBoundingClientRect();
      const offsetX = e.clientX - (rect.left + rect.width / 2);
      const offsetY = e.clientY - (rect.top + rect.height / 2);

      x.set(offsetX * strength * motionScale);
      y.set(offsetY * strength * motionScale);
    },
    [strength, motionScale, x, y],
  );

  const onPointerLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setCursorVariant("default");
  }, [x, y, setCursorVariant]);

  return (
    <m.div
      ref={ref}
      className={cn("relative inline-flex", className)}
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setCursorVariant("hover")}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </m.div>
  );
}
