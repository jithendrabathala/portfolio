"use client";

import { type MotionValue, useTransform } from "framer-motion";
import * as m from "framer-motion/m";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pin } from "@/components/scroll/pin";
import { Section } from "@/components/scroll/section";
import { type Project, projects } from "@/content/site";
import { useUIStore } from "@/lib/store";
import { clamp, cn } from "@/lib/utils";

/**
 * Orbit layout: cards ride an arc through the viewport rather than a flat
 * track. Scroll advances the focus point; each card derives its position,
 * curve offset, tilt, scale, and opacity from its signed distance to that
 * focus, which is what produces the depth falloff toward the edges.
 */

/** Peak dip of the arc, in px, at the clamped edge of the curve. */
const CURVE_HEIGHT = 90;
/** Cards further than this from focus stop curving (keeps the parabola sane). */
const CURVE_CLAMP = 2.4;
/** Degrees of tilt per unit of distance from focus. */
const TILT_PER_UNIT = 5;
/** Scale and opacity lost per unit of distance from focus. */
const DEPTH_SCALE = 0.14;
const DEPTH_OPACITY = 0.42;

export function Work() {
  return (
    <Section id="work">
      <Pin length={projects.length} reducedFallback={<WorkGrid />}>
        {(progress) => <OrbitTrack progress={progress} />}
      </Pin>
    </Section>
  );
}

function OrbitTrack({ progress }: { progress: MotionValue<number> }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [spacing, setSpacing] = useState(360);

  // Horizontal gap between adjacent cards, sized to the viewport so the arc
  // reads the same on a laptop and an ultrawide.
  useEffect(() => {
    const measure = () => setSpacing(clamp(window.innerWidth * 0.44, 240, 460));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Continuous focus index: 0 → first card centred, n-1 → last card centred.
  const focus = useTransform(progress, [0, 1], [0, projects.length - 1]);

  /**
   * Keyboard users can reach a card that is currently orbited off-screen. Map
   * its index back to the scroll offset that centres it so focus and the
   * visible viewport agree.
   */
  const onCardFocus = useCallback((index: number) => {
    const pin = trackRef.current?.closest<HTMLElement>("[data-pin]");
    if (!pin) return;

    const pinnedDistance = pin.offsetHeight - window.innerHeight;
    if (pinnedDistance <= 0) return;

    const ratio = projects.length > 1 ? index / (projects.length - 1) : 0;
    window.scrollTo({ top: pin.offsetTop + ratio * pinnedDistance });
  }, []);

  return (
    <div ref={trackRef} className="relative h-svh overflow-hidden">
      <div className="absolute inset-x-0 top-[18%] z-20 px-[8vw]">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Selected work
        </h2>
      </div>

      {projects.map((project, i) => (
        <OrbitCard
          key={project.slug}
          project={project}
          index={i}
          focus={focus}
          spacing={spacing}
          onFocus={() => onCardFocus(i)}
        />
      ))}

      <OrbitCounter focus={focus} />
    </div>
  );
}

function OrbitCard({
  project,
  index,
  focus,
  spacing,
  onFocus,
}: {
  project: Project;
  index: number;
  focus: MotionValue<number>;
  spacing: number;
  onFocus: () => void;
}) {
  const setOpenProject = useUIStore((s) => s.setOpenProject);
  const setCursorVariant = useUIStore((s) => s.setCursorVariant);

  // Signed distance from the focus point. Everything below is a function of it.
  const distance = useTransform(focus, (f) => index - f);

  const x = useTransform(distance, (d) => d * spacing);
  const y = useTransform(distance, (d) => {
    const c = clamp(d, -CURVE_CLAMP, CURVE_CLAMP);
    return c * c * (CURVE_HEIGHT / (CURVE_CLAMP * CURVE_CLAMP));
  });
  const rotate = useTransform(distance, (d) => {
    return clamp(d, -CURVE_CLAMP, CURVE_CLAMP) * TILT_PER_UNIT;
  });
  const scale = useTransform(distance, (d) =>
    Math.max(0.62, 1 - Math.abs(d) * DEPTH_SCALE),
  );
  const opacity = useTransform(distance, (d) =>
    Math.max(0, 1 - Math.abs(d) * DEPTH_OPACITY),
  );
  // Nearest card paints on top; ties never happen because distance is continuous.
  const zIndex = useTransform(distance, (d) =>
    Math.round(10 - Math.abs(d) * 2),
  );

  return (
    // Every card is centred in the viewport and then displaced by `x`. Using a
    // flex-centred wrapper instead of a -50% translate avoids fighting framer
    // over the transform, which maps `x` onto translateX.
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <m.div
        style={{ x, y, rotate, scale, opacity, zIndex }}
        className="pointer-events-auto w-[min(78vw,26rem)] will-change-transform"
      >
        <button
          type="button"
          onFocus={onFocus}
          onClick={() => setOpenProject(project.slug)}
          onPointerEnter={() => setCursorVariant("hover")}
          onPointerLeave={() => setCursorVariant("default")}
          aria-label={`Open case study: ${project.title}`}
          className="cursor-target group block w-full text-left"
        >
          <m.div
            // Pairs with the detail overlay so the card grows into it.
            // Requires domMax in MotionProvider for layout projection.
            layoutId={`project-card-${project.slug}`}
            className="flex h-[24rem] flex-col justify-between border border-line bg-surface/70 p-7 backdrop-blur-sm transition-colors group-hover:border-accent/60"
          >
            <div className="flex items-start justify-between gap-4 font-mono text-xs text-muted">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{project.year}</span>
            </div>

            <div>
              <m.h3
                layoutId={`project-title-${project.slug}`}
                className="font-mono text-xl font-bold uppercase tracking-wider text-balance"
              >
                {project.title}
              </m.h3>
              <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
                {project.blurb}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="border border-line px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        </button>
      </m.div>
    </div>
  );
}

/** HUD-style readout of which card is centred. */
function OrbitCounter({ focus }: { focus: MotionValue<number> }) {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    return focus.on("change", (f) => {
      setCurrent(clamp(Math.round(f) + 1, 1, projects.length));
    });
  }, [focus]);

  return (
    <div className="absolute inset-x-0 bottom-[14%] z-20 flex justify-center">
      <div className="flex items-center gap-3 border border-line bg-bg/50 px-4 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted backdrop-blur-sm">
        <span className="tabular-nums text-fg">
          {String(current).padStart(2, "0")}
        </span>
        <div className="h-3 w-px bg-line" />
        <span className="tabular-nums">
          {String(projects.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

/** Static layout used when the user prefers reduced motion. */
function WorkGrid() {
  const setOpenProject = useUIStore((s) => s.setOpenProject);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h2 className="mb-10 font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Selected work
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => setOpenProject(project.slug)}
            aria-label={`Open case study: ${project.title}`}
            className="flex h-full flex-col justify-between border border-line bg-surface/70 p-7 text-left"
          >
            <div className="flex items-start justify-between gap-4 font-mono text-xs text-muted">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{project.year}</span>
            </div>
            <div className="mt-8">
              <h3 className="font-mono text-xl font-bold uppercase tracking-wider">
                {project.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {project.blurb}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Shared by the card and the overlay so the stat row cannot drift apart. */
export function MetricRow({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  if (!project.metrics?.length) return null;

  return (
    <dl className={cn("grid grid-cols-3 gap-4", className)}>
      {project.metrics.map((metric) => (
        <div key={metric.label}>
          <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            {metric.label}
          </dt>
          <dd className="mt-1 text-lg font-medium tabular-nums">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
