"use client";

import { useAnimationFrame, useMotionValue } from "framer-motion";
import * as m from "framer-motion/m";
import { type ReactNode, useRef } from "react";
import { scrollSignals } from "@/lib/scroll-signals";
import { useMotionScale } from "@/lib/use-motion-scale";
import { cn } from "@/lib/utils";

/**
 * Infinite ticker whose speed and direction are coupled to scroll velocity:
 * it drifts on its own, accelerates when you scroll, and reverses when you
 * scroll back up.
 *
 * The content is rendered twice and the track wraps at the width of one copy,
 * which gives a seamless loop without measuring anything per frame.
 */
export function Marquee({
  children,
  baseSpeed = 40,
  direction = 1,
  className,
}: {
  children: ReactNode;
  /** Idle speed in px/s. */
  baseSpeed?: number;
  /** 1 travels left, -1 travels right. */
  direction?: 1 | -1;
  className?: string;
}) {
  const x = useMotionValue(0);
  const copyRef = useRef<HTMLDivElement>(null);
  const motionScale = useMotionScale();

  useAnimationFrame((_, delta) => {
    const copyWidth = copyRef.current?.offsetWidth ?? 0;
    if (copyWidth === 0) return;

    // Reduced motion parks the ticker rather than freezing it mid-word.
    if (motionScale === 0) {
      x.set(0);
      return;
    }

    // Clamp the frame delta so a tab-switch stall doesn't teleport the track.
    const dt = Math.min(delta, 50) / 1000;
    const velocityBoost = scrollSignals.intensity.get() * 420;
    const speed = (baseSpeed + velocityBoost) * direction * motionScale;

    let next = x.get() - speed * dt;

    // Wrap into (-copyWidth, 0]. Modulo both ways so it survives a reversal.
    next = ((next % copyWidth) + copyWidth) % copyWidth;
    if (next > 0) next -= copyWidth;

    x.set(next);
  });

  return (
    <div className={cn("overflow-hidden", className)}>
      <m.div className="flex w-max will-change-transform" style={{ x }}>
        <div ref={copyRef} className="flex shrink-0">
          {children}
        </div>
        {/* Second copy fills the gap as the first scrolls out. */}
        <div aria-hidden="true" className="flex shrink-0">
          {children}
        </div>
      </m.div>
    </div>
  );
}
