"use client";

import { useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { sections } from "@/content/site";
import { scrollSignals } from "@/lib/scroll-signals";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Fixed progress rail: a scrubbing bar plus one dot per section, doubling as
 * anchor navigation.
 *
 * The dots are real links, so this is keyboard-navigable and works with smooth
 * scrolling from globals.css without any JS scroll handling.
 */
export function Rail() {
  const activeSection = useUIStore((s) => s.activeSection);

  // Spring the raw progress so the bar glides rather than tracking the wheel
  // step-for-step.
  const scaleY = useSpring(scrollSignals.progress, {
    stiffness: 260,
    damping: 40,
    mass: 0.3,
  });

  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 md:block"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-24 w-px overflow-hidden bg-line">
          <m.div
            className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
            style={{ scaleY }}
          />
        </div>

        <ul className="pointer-events-auto flex flex-col gap-3">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-label={section.label}
                  aria-current={isActive ? "true" : undefined}
                  // `relative` anchors the label; `justify-end` keeps the dot
                  // pinned right so the label grows leftward into open space
                  // rather than shifting the rail.
                  className="group relative flex items-center justify-end p-1.5"
                >
                  {/* Purely visual — the anchor's aria-label is the accessible
                      name, so this is hidden to avoid announcing it twice.
                      pointer-events-none means moving toward the label cannot
                      steal hover from the dot. Revealed on focus as well as
                      hover so a keyboard user tabbing the rail can read it. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute right-full mr-3 whitespace-nowrap",
                      "border border-line bg-bg/90 px-2.5 py-1 backdrop-blur-sm",
                      "font-mono text-[0.6rem] uppercase tracking-widest",
                      "translate-x-1 opacity-0 transition-all duration-200",
                      "group-hover:translate-x-0 group-hover:opacity-100",
                      "group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                      isActive ? "text-accent" : "text-muted",
                    )}
                  >
                    {section.label}
                  </span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 rounded-full transition-all duration-300",
                      isActive
                        ? "scale-150 bg-accent"
                        : "bg-muted/40 group-hover:scale-125 group-hover:bg-muted",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
