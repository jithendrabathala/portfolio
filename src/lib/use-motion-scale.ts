"use client";

import { useReducedMotion } from "framer-motion";

/**
 * The single motion gate. Every animated component multiplies its displacement
 * by this, so honouring `prefers-reduced-motion` is one number rather than a
 * conditional in each component.
 *
 *   0 — reduced motion: no displacement at all
 *   1 — normal
 *
 * It stays a multiplier rather than a boolean so a component can be written
 * once and scale with it, which is what lets another gate be introduced here
 * without touching a single caller.
 *
 * Note this scales *displacement*, not opacity. Fades survive reduced motion on
 * purpose: removing positional movement is the accessibility requirement, and
 * killing every transition tends to make an interface feel broken rather than
 * calm.
 */
export function useMotionScale(): number {
  // framer-motion returns null until it has measured the media query, which
  // avoids a hydration mismatch. Treat "unknown" as "not reduced".
  return useReducedMotion() ? 0 : 1;
}

/** Boolean form, for cases that need a branch rather than a multiplier. */
export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}
