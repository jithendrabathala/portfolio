"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import * as m from "framer-motion/m";
import { type ReactNode, useCallback, useRef } from "react";
import { useUIStore } from "@/lib/store";
import { useMotionScale } from "@/lib/use-motion-scale";
import { cn } from "@/lib/utils";

/**
 * Pointer-tracked 3D tilt with a glare highlight that follows the cursor.
 *
 * NOTE: currently unused. The work section moved to the orbit layout, which
 * applies its own scale and rotation per card, and stacking a 3D tilt on top of
 * that fights the `layoutId` projection used for the detail morph. Kept because
 * it is a self-contained primitive worth having for any non-morphing surface.
 *
 * The tilt lives on an inner element so the outer wrapper stays untransformed,
 * which is what makes it safe to combine with layout animation elsewhere.
 */
export function TiltCard({
  children,
  maxTilt = 9,
  className,
  onClick,
}: {
  children: ReactNode;
  /** Peak rotation in degrees at the card's corners. */
  maxTilt?: number;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionScale = useMotionScale();
  const setCursorVariant = useUIStore((s) => s.setCursorVariant);

  // Normalised pointer position within the card, -0.5 to 0.5 on both axes.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 260, damping: 26, mass: 0.4 };
  const rotateX = useSpring(
    useTransform(py, (v) => -v * maxTilt * 2 * motionScale),
    spring,
  );
  const rotateY = useSpring(
    useTransform(px, (v) => v * maxTilt * 2 * motionScale),
    spring,
  );

  const glareBackground = useTransform([px, py], ([gx, gy]: number[]) => {
    const left = (gx + 0.5) * 100;
    const top = (gy + 0.5) * 100;
    return `radial-gradient(circle at ${left}% ${top}%, rgba(255,255,255,0.10), transparent 55%)`;
  });

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      px.set((e.clientX - rect.left) / rect.width - 0.5);
      py.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [px, py],
  );

  const onPointerLeave = useCallback(() => {
    px.set(0);
    py.set(0);
    setCursorVariant("default");
  }, [px, py, setCursorVariant]);

  return (
    <div
      ref={ref}
      className={cn("[perspective:1200px]", className)}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setCursorVariant("hover")}
      onPointerLeave={onPointerLeave}
    >
      <m.div
        className="relative size-full [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
        onClick={onClick}
      >
        {children}
        {/* Glare sits above the content but must not eat pointer events. */}
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      </m.div>
    </div>
  );
}
