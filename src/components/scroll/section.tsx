"use client";

import { type ReactNode, useEffect, useRef } from "react";
import type { SectionId } from "@/content/site";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Wraps a page section and reports when it owns the viewport, which drives the
 * scroll rail and the shader's mood target.
 *
 * Uses IntersectionObserver rather than scroll math: it fires only on crossings
 * instead of every frame, and the store write is deduped, so a long section
 * costs exactly one render on entry.
 */
export function Section({
  id,
  children,
  className,
}: {
  id: SectionId;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const setActiveSection = useUIStore((s) => s.setActiveSection);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The band is the middle 20% of the viewport, so "active" means the section
    // crossing the centre line — not merely visible at an edge. Without this,
    // two sections are both "in view" for most of a scroll and the rail flickers
    // between them.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveSection(id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setActiveSection]);

  return (
    <section ref={ref} id={id} className={cn("relative", className)}>
      {children}
    </section>
  );
}
