"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { Code2, ExternalLink } from "lucide-react";
import { useCallback, useRef } from "react";
import { LinkChip, MetricRow } from "@/components/sections/work";
import { projects } from "@/content/site";
import { useUIStore } from "@/lib/store";
import { useDialogFocus } from "@/lib/use-dialog-focus";
import { useScrollLock } from "@/lib/use-scroll-lock";

/**
 * Full-screen case study that grows out of its work card via shared `layoutId`.
 *
 * Mounted once at the root rather than inside the gallery: the card lives on a
 * transformed, overflow-hidden track, and a fixed overlay nested inside that
 * would be clipped and mispositioned.
 */
export function ProjectDetail() {
  const openProject = useUIStore((s) => s.openProject);
  const setOpenProject = useUIStore((s) => s.setOpenProject);

  const project = projects.find((p) => p.slug === openProject) ?? null;
  const close = useCallback(() => setOpenProject(null), [setOpenProject]);

  useScrollLock(Boolean(project));

  return (
    <AnimatePresence>
      {project && (
        <Overlay key={project.slug} onClose={close}>
          <m.div
            layoutId={`project-card-${project.slug}`}
            className="relative mx-auto w-full max-w-3xl rounded-2xl border border-line bg-surface p-8 sm:p-12"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <m.h2
                  layoutId={`project-title-${project.slug}`}
                  id="project-detail-title"
                  className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
                >
                  {project.title}
                </m.h2>
                <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
                  {project.year
                    ? `${project.role} · ${project.year}`
                    : project.role}
                </p>
              </div>
            </div>

            {/* Content fades in after the box has finished morphing, so the
                two animations do not fight for attention. */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
            >
              <MetricRow
                project={project}
                className="mt-10 border-y border-line py-6"
              />

              <div className="mt-8 space-y-5">
                {project.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="leading-relaxed text-muted text-pretty"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <ul className="mt-8 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              {/* Both optional and independent. A project with neither simply
                  renders no row rather than an empty container. */}
              {(project.repo || project.live) && (
                <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-8">
                  {project.repo && (
                    <LinkChip
                      href={project.repo}
                      label={`${project.title} repository`}
                    >
                      <Code2 aria-hidden="true" className="size-3.5" />
                      View repo
                    </LinkChip>
                  )}
                  {project.live && (
                    <LinkChip
                      href={project.live}
                      label={`${project.title} live site`}
                    >
                      <ExternalLink aria-hidden="true" className="size-3.5" />
                      Go live
                    </LinkChip>
                  )}
                </div>
              )}
            </m.div>
          </m.div>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape, the Tab trap, and focus restoration — shared with the mobile nav
  // sheet so both modals answer the keyboard the same way.
  useDialogFocus({ panelRef, initialFocusRef: closeRef, onClose });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
      <m.button
        type="button"
        aria-label="Close case study"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 h-full w-full cursor-default bg-bg/85 backdrop-blur-md"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        className="relative min-h-full px-4 py-16 sm:py-24"
      >
        {children}

        <m.button
          ref={closeRef}
          type="button"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.15 }}
          className="cursor-target fixed right-5 top-5 rounded-full border border-line bg-surface px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-fg"
        >
          Close
        </m.button>
      </div>
    </div>
  );
}
