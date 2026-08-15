import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp `n` into [min, max]. */
export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/** Linear interpolation. */
export function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

/**
 * Frame-rate independent lerp. `smoothing` is the fraction remaining after 1s,
 * so the result is identical at 60fps and 144fps. Use this in useFrame, never
 * a bare `lerp(a, b, 0.1)`, which drifts with refresh rate.
 */
export function damp(from: number, to: number, smoothing: number, dt: number) {
  return lerp(from, to, 1 - smoothing ** dt);
}
