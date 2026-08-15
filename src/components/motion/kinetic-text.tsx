"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import * as m from "framer-motion/m";
import { useEffect, useRef, useState } from "react";
import { useMotionScale } from "@/lib/use-motion-scale";
import { cn } from "@/lib/utils";

const REPEL_RADIUS = 120;
const REPEL_STRENGTH = 34;

/**
 * Per-character text that scatters away from the pointer and springs back.
 *
 * Accessibility: the split text is `aria-hidden` and the real string is exposed
 * once via an sr-only span, so assistive tech reads "Jithendra Bathala" rather
 * than eighteen separate letters.
 */
export function KineticText({
  text,
  className,
  charClassName,
}: {
  text: string;
  className?: string;
  charClassName?: string;
}) {
  const motionScale = useMotionScale();

  // Shared pointer position. Each character derives its own displacement from
  // these two values, so there is one listener rather than one per letter.
  const pointerX = useMotionValue(Number.NEGATIVE_INFINITY);
  const pointerY = useMotionValue(Number.NEGATIVE_INFINITY);

  useEffect(() => {
    if (motionScale === 0) return;

    const onMove = (e: PointerEvent) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    };
    const onLeave = () => {
      pointerX.set(Number.NEGATIVE_INFINITY);
      pointerY.set(Number.NEGATIVE_INFINITY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [pointerX, pointerY, motionScale]);

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {text.split("").map((char, i) => (
          <KineticChar
            // Characters repeat, so index is genuinely the identity here.
            // biome-ignore lint/suspicious/noArrayIndexKey: position is the identity
            key={i}
            char={char}
            pointerX={pointerX}
            pointerY={pointerY}
            motionScale={motionScale}
            className={charClassName}
          />
        ))}
      </span>
    </span>
  );
}

function KineticChar({
  char,
  pointerX,
  pointerY,
  motionScale,
  className,
}: {
  char: string;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerY: ReturnType<typeof useMotionValue<number>>;
  motionScale: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  // Measure once and on resize rather than per pointer move — calling
  // getBoundingClientRect for every letter on every mousemove is what makes
  // effects like this janky.
  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    // Scrolling moves the letters relative to the viewport too.
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, []);

  const displacement = useTransform<number, number[]>(
    [pointerX, pointerY],
    ([px, py]: number[]) => {
      if (motionScale === 0 || !Number.isFinite(px)) return [0, 0];

      const dx = center.x - px;
      const dy = center.y - py;
      const dist = Math.hypot(dx, dy);
      if (dist > REPEL_RADIUS || dist === 0) return [0, 0];

      // Falls off toward the edge of the radius so letters ease out of the
      // effect instead of snapping back at the boundary.
      const force =
        (1 - dist / REPEL_RADIUS) ** 2 * REPEL_STRENGTH * motionScale;
      return [(dx / dist) * force, (dy / dist) * force];
    },
  );

  const x = useSpring(
    useTransform(displacement, (d) => d[0]),
    { stiffness: 260, damping: 18, mass: 0.35 },
  );
  const y = useSpring(
    useTransform(displacement, (d) => d[1]),
    { stiffness: 260, damping: 18, mass: 0.35 },
  );

  // Preserve runs of spaces, which would otherwise collapse.
  if (char === " ") {
    return <span className="inline-block">&nbsp;</span>;
  }

  return (
    <m.span
      ref={ref}
      className={cn("inline-block will-change-transform", className)}
      style={{ x, y }}
    >
      {char}
    </m.span>
  );
}
