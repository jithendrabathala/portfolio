"use client";

import { useMotionValue, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { useEffect, useState } from "react";
import { FINE_POINTER } from "@/lib/breakpoints";
import { useUIStore } from "@/lib/store";
import { usePrefersReducedMotion } from "@/lib/use-motion-scale";

/**
 * Custom cursor: a fast dot and a lagging ring.
 *
 * Strictly additive. The native cursor is only hidden on elements that opt in
 * via `.cursor-target`, and focus rings are untouched — a keyboard user should
 * never notice this exists.
 *
 * Renders nothing on touch, on mobile-width viewports, or under reduced motion.
 * The `.cursor-target` rule in globals.css is scoped to exactly the same
 * conditions: the two have to agree, or an element gives up the native cursor
 * and gets nothing in its place.
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
    // A mouse on a desktop-width viewport — not a finger, and not the mobile
    // layout, where the pointer this is standing in for does not exist.
    //
    // Subscribed rather than read once: a phone rotating into landscape, a
    // window dragged narrow, or a mouse plugged into a tablet all cross this
    // line without a remount, and a cursor left running on the wrong side of it
    // is a dot parked in the corner of a touchscreen.
    const query = window.matchMedia(FINE_POINTER);
    const sync = () => setEnabled(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
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
    // Above everything, including the z-50 project overlay — which renders
    // after this in the layout tree and would otherwise win the tie and bury
    // the cursor. Elements inside the overlay opt into `cursor-target`, so a
    // buried cursor means no cursor at all there rather than just the native one.
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-60">
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
