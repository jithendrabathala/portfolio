"use client";

import { useMotionValue, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store";
import { usePrefersReducedMotion } from "@/lib/use-motion-scale";

/**
 * Custom cursor: a fast dot and a lagging ring.
 *
 * Strictly additive. The native cursor is only hidden on elements that opt in
 * via `.cursor-target`, and focus rings are untouched — a keyboard user should
 * never notice this exists.
 *
 * Renders nothing on coarse pointers (touch) and under reduced motion, where a
 * lagging ring is exactly the kind of thing that causes trouble.
 */
export function Cursor() {
  const prefersReduced = usePrefersReducedMotion();
  const variant = useUIStore((s) => s.cursorVariant);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Two different spring tunings is what sells it: the dot is nearly attached
  // to the pointer, the ring trails and overshoots slightly.
  const dotX = useSpring(x, { stiffness: 1400, damping: 70, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 1400, damping: 70, mass: 0.2 });
  const ringX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.5 });

  useEffect(() => {
    // A mouse, not a finger. Touch devices get nothing.
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);

  if (!enabled || prefersReduced || variant === "hidden") return null;

  const isHovering = variant === "hover";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <m.div
        className="absolute size-1.5 rounded-full bg-fg"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />
      <m.div
        // mix-blend-difference keeps the ring legible over both the dark
        // backdrop and any light surface without knowing what it is over.
        className="absolute rounded-full border border-fg mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHovering ? 56 : 28,
          height: isHovering ? 56 : 28,
          opacity: isHovering ? 0.9 : 0.45,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    </div>
  );
}
