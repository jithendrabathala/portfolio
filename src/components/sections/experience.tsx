"use client";

import { useInView, useScroll, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { useRef } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/scroll/section";
import { type ExperienceEntry, experience } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/use-motion-scale";
import { cn } from "@/lib/utils";

/**
 * Roles held, as a timeline.
 *
 * A spine fills as you scroll and each node lights when its role reaches the
 * reading band, so the line doubles as a position indicator.
 */
export function Experience() {
  const spineRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ["start 0.75", "end 0.75"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 38,
    mass: 0.35,
  });

  return (
    <Section id="experience" className="py-32 sm:py-40">
      <Container>
        <div className="mb-16 flex items-end justify-between gap-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Experience
          </h2>
          <span className="font-mono text-xs tabular-nums text-muted/60">
            {String(experience.length).padStart(2, "0")} roles
          </span>
        </div>

        <div ref={spineRef} className="relative">
          {/* Spine: hard left on mobile, centred once roles alternate. */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2"
          >
            <m.div
              className="h-full w-full origin-top bg-accent"
              style={{ scaleY: prefersReduced ? 1 : scaleY }}
            />
          </div>

          <ol>
            {experience.map((entry, i) => (
              <Role
                key={`${entry.company}-${entry.period}`}
                entry={entry}
                side={i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

function Role({
  entry,
  side,
}: {
  entry: ExperienceEntry;
  side: "left" | "right";
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: false, margin: "-45% 0px -45% 0px" });

  return (
    <li
      ref={ref}
      className={cn(
        "group relative pl-10 md:w-1/2 md:pl-0",
        side === "left"
          ? "md:pr-12 md:text-right"
          : "md:ml-auto md:pl-12 md:text-left",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1.5 flex size-4 items-center justify-center rounded-full border transition-colors duration-500",
          "left-0 md:left-auto",
          side === "left"
            ? "md:right-0 md:translate-x-1/2"
            : "md:left-0 md:-translate-x-1/2",
          inView ? "border-accent bg-bg" : "border-line bg-bg",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full transition-colors duration-500",
            inView ? "bg-accent" : "bg-line",
          )}
        />
      </span>

      <div className="pb-12 md:pb-16">
        <span
          className={cn(
            "font-mono text-xs tabular-nums transition-colors duration-500",
            inView ? "text-accent" : "text-muted",
          )}
        >
          {entry.period}
        </span>

        <h3 className="mt-2 font-mono text-lg font-bold uppercase tracking-wider">
          {entry.role}
        </h3>

        <span className="mt-1 block font-mono text-xs uppercase tracking-widest text-muted">
          {entry.company}
        </span>

        <p
          className={cn(
            "mt-3 max-w-md leading-relaxed text-muted text-pretty",
            side === "left" && "md:ml-auto",
          )}
        >
          {entry.summary}
        </p>
      </div>
    </li>
  );
}
