"use client";

import { Code2, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/scroll/section";
import { projects } from "@/content/site";
import { useUIStore } from "@/lib/store";

/**
 * The orbit visual is the vendored Framer component (see src/vendor/orbit.tsx).
 * It reaches for `window` and ResizeObserver during render, and `ssr: false` is
 * only legal inside a Client Component in Next 16 — hence this wrapper.
 */
const OrbitProjects = dynamic(() => import("@/vendor/orbit"), {
  ssr: false,
  // Reserve one viewport so the sections below do not jump upward while the
  // chunk loads. Must not be taller, or it would push the orbit off-screen.
  loading: () => <div className="h-svh" />,
});

/**
 * Viewport heights the orbit occupies while pinned. The component builds its
 * own pin internally — an outer section this tall with a `sticky` 100svh child
 * — so this value is the scroll distance the scene gets before it releases and
 * the next section begins.
 */
const ORBIT_SCROLL_LENGTH = 420;

export function Work() {
  const items = useMemo(
    () =>
      projects.map((project) => ({
        image: project.image,
        label: project.title,
        // Deliberately no `link`: the component would navigate away on click,
        // and the case study lives in an in-page overlay instead. The index
        // below owns all navigation.
      })),
    [],
  );

  return (
    <Section id="work">
      {/* No height wrapper here on purpose. The component renders its own
          ORBIT_SCROLL_LENGTH-tall section containing a sticky viewport, so it
          must be free to size itself. Constraining it to h-svh made a ~420vh
          element overflow a 100vh box, which is what spilled the orbit over
          every section below it. */}
      <OrbitProjects
        items={items}
        background="transparent"
        motion={{ scrollLength: ORBIT_SCROLL_LENGTH }}
        content={{
          showCopy: true,
          textColor: "#f5f5f7",
          leftTitle: "SELECTED",
          rightTitle: "WORK",
          centerText:
            "Systems built where correctness and latency argue with each other.",
        }}
      />

      <ProjectIndex />
    </Section>
  );
}

/**
 * Text index beneath the orbit. This carries the real affordances — case study,
 * repo, live — because the orbit component owns its own pointer handling and
 * cannot host our overlay trigger.
 */
function ProjectIndex() {
  const setOpenProject = useUIStore((s) => s.setOpenProject);

  return (
    <Container className="pt-24 pb-32">
      <h2 className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Index
      </h2>

      <ol className="border-t border-line">
        {projects.map((project, i) => (
          <li key={project.slug} className="border-b border-line">
            <Reveal delay={i * 0.05}>
              <div className="group flex flex-wrap items-baseline gap-x-6 gap-y-3 py-6">
                <span className="font-mono text-xs tabular-nums text-muted/60">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <button
                  type="button"
                  onClick={() => setOpenProject(project.slug)}
                  className="cursor-target flex-1 text-left"
                >
                  <span className="font-mono text-lg font-bold uppercase tracking-wider transition-colors group-hover:text-accent sm:text-xl">
                    {project.title}
                  </span>
                  <span className="mt-1 block max-w-xl text-sm leading-relaxed text-muted text-pretty">
                    {project.blurb}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="mr-2 font-mono text-xs tabular-nums text-muted">
                    {project.year}
                  </span>

                  {project.repo && (
                    <LinkChip
                      href={project.repo}
                      label={`${project.title} repository`}
                    >
                      <Code2 aria-hidden="true" className="size-3.5" />
                      Repo
                    </LinkChip>
                  )}

                  {project.live && (
                    <LinkChip
                      href={project.live}
                      label={`${project.title} live site`}
                    >
                      <ExternalLink aria-hidden="true" className="size-3.5" />
                      Live
                    </LinkChip>
                  )}

                  <button
                    type="button"
                    onClick={() => setOpenProject(project.slug)}
                    aria-label={`Open case study: ${project.title}`}
                    className="cursor-target border border-line px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-fg"
                  >
                    Case study
                  </button>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Container>
  );
}

export function LinkChip({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="cursor-target inline-flex items-center gap-1.5 border border-line px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-fg"
    >
      {children}
    </a>
  );
}

/** Shared by the index and the overlay so the stat row cannot drift apart. */
export function MetricRow({
  project,
  className,
}: {
  project: (typeof projects)[number];
  className?: string;
}) {
  return (
    <dl className={className}>
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
