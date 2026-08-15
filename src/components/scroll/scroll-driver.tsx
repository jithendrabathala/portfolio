"use client";

import {
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { scrollSignals, VELOCITY_CEILING } from "@/lib/scroll-signals";
import { useMotionScale } from "@/lib/use-motion-scale";
import { clamp } from "@/lib/utils";

/**
 * The only component that listens to document scroll. Mounted once in the root
 * layout; renders nothing.
 *
 * Everything else in the site reads `scrollSignals` instead of attaching its
 * own listener, so there is one source of truth and one place to tune feel.
 */
export function ScrollDriver() {
  const motionScale = useMotionScale();
  const { scrollY, scrollYProgress } = useScroll();

  // Raw velocity is in px/s and extremely spiky — a trackpad flick can spike to
  // five figures for a single frame. Spring it before anything renders from it.
  const rawVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 180,
    damping: 46,
    mass: 0.4,
  });

  // Normalised, gated, and clamped. This is what visuals couple to.
  const intensity = useTransform(
    smoothVelocity,
    (v) => clamp(v / VELOCITY_CEILING, -1, 1) * motionScale,
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollSignals.progress.set(v);
  });

  useMotionValueEvent(rawVelocity, "change", (v) => {
    scrollSignals.velocity.set(v);
  });

  useMotionValueEvent(intensity, "change", (v) => {
    scrollSignals.intensity.set(v);
  });

  return null;
}
