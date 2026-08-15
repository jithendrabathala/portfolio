"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/scroll/section";
import { experience } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Roles held, as an expanding ledger.
 *
 * Rows rather than a timeline on purpose — the Journey section owns the
 * timeline treatment, and running two spines on one page makes the second read
 * as a repeat rather than a new idea.
 *
 * The first row is open by default so the section never reads as a bare list
 * of headings.
 */
export function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="experience" className="py-32 sm:py-40">
      <Container>
        <div className="mb-14 flex items-end justify-between gap-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Experience
          </h2>
          <span className="font-mono text-xs tabular-nums text-muted/60">
            {String(experience.length).padStart(2, "0")} roles
          </span>
        </div>

        <ol className="border-t border-line">
          {experience.map((entry, i) => {
            const isOpen = openIndex === i;

            return (
              <li key={`${entry.company}-${entry.period}`}>
                <Reveal delay={i * 0.05}>
                  <div className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="cursor-target group flex w-full flex-wrap items-baseline gap-x-6 gap-y-2 py-7 text-left"
                    >
                      <span className="font-mono text-xs tabular-nums text-muted/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="flex-1">
                        <span
                          className={cn(
                            "block font-mono text-lg font-bold uppercase tracking-wider transition-colors sm:text-xl",
                            isOpen
                              ? "text-accent"
                              : "text-fg group-hover:text-accent",
                          )}
                        >
                          {entry.role}
                        </span>
                        <span className="mt-1 block font-mono text-xs uppercase tracking-widest text-muted">
                          {entry.company}
                        </span>
                      </span>

                      <span className="font-mono text-xs tabular-nums text-muted">
                        {entry.period}
                      </span>

                      {/* Rotating cross doubles as the open/closed affordance. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "relative size-3 transition-transform duration-300",
                          isOpen && "rotate-45",
                        )}
                      >
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-muted" />
                        <span
                          className={cn(
                            "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-muted transition-opacity duration-300",
                            isOpen && "opacity-0",
                          )}
                        />
                      </span>
                    </button>

                    {/* grid-rows 0fr→1fr animates to auto height, which a
                        max-height transition cannot do without a magic number
                        that clips longer summaries. */}
                    <div
                      className={cn(
                        "grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-8 pl-10 leading-relaxed text-muted text-pretty">
                          {entry.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
