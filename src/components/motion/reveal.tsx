"use client";

import { useInView } from "framer-motion";
import * as m from "framer-motion/m";
import { type ReactNode, useRef } from "react";
import { useMotionScale } from "@/lib/use-motion-scale";
import { cn } from "@/lib/utils";

/**
 * Fades and lifts children into view once.
 *
 * The lift distance is multiplied by the motion scale, so under reduced motion
 * this becomes a pure fade rather than disappearing entirely — content still
 * announces itself, it just stops moving.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionScale = useMotionScale();

  // `once` matters: re-animating on every scroll-by is the fastest way to make
  // a page feel restless.
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });

  return (
    <m.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y: distance * motionScale }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </m.div>
  );
}

/**
 * Staggered variant for lists. Children animate in sequence rather than as a
 * block, which reads as deliberate on a row of cards or stat tiles.
 */
export function RevealGroup({
  children,
  stagger = 0.08,
  distance = 24,
  className,
}: {
  children: ReactNode[];
  stagger?: number;
  distance?: number;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      {children.map((child, i) => (
        <Reveal
          // Positional stagger — the list is static content, not keyed data.
          // biome-ignore lint/suspicious/noArrayIndexKey: position is the identity
          key={i}
          delay={i * stagger}
          distance={distance}
        >
          {child}
        </Reveal>
      ))}
    </div>
  );
}
