"use client";

import { useReducedMotion } from "framer-motion";
import { useUIStore } from "@/lib/store";

/**
 * The single motion gate. Every animated component multiplies its displacement
 * by this, so honouring `prefers-reduced-motion` is one number rather than a
 * conditional in each component.
 *
 *   0    — reduced motion: no displacement at all
 *   1    — normal
 *   1.75 — chaos mode
 *
 * Note this scales *displacement*, not opacity. Fades survive reduced motion on
 * purpose: removing positional movement is the accessibility requirement, and
 * killing every transition tends to make an interface feel broken rather than
 * calm.
 */
export function useMotionScale(): number {
  // framer-motion returns null until it has measured the media query, which
  // avoids a hydration mismatch. Treat "unknown" as "not reduced".
  const prefersReduced = useReducedMotion() ?? false;
  const chaos = useUIStore((s) => s.chaos);

  if (prefersReduced) return 0;
  return chaos ? 1.75 : 1;
}

/** Boolean form, for cases that need a branch rather than a multiplier. */
export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}
