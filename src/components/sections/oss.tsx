"use client";

import { ExternalLink, GitFork, Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/scroll/section";
import { oss } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Open source.
 *
 * Everything renders from static content rather than the GitHub API, so the
 * page stays fully prerendered, never rate-limits, and cannot show a spinner
 * to a recruiter on a bad connection. Refresh the numbers when you care to.
 */

/** Language dot colours, matching GitHub's convention closely enough to read. */
const LANGUAGE_COLOR: Record<string, string> = {
  TypeScript: "#3178c6",
  Go: "#00add8",
  Rust: "#dea584",
  Python: "#3572a5",
  JavaScript: "#f1e05a",
  Lua: "#000080",
};

export function Oss() {
  return (
    <Section id="oss" className="py-32 sm:py-40">
      <Container>
        <div className="mb-4 flex items-end justify-between gap-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Open source
          </h2>
          <a
            href={oss.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted transition-colors hover:text-fg"
          >
            @{oss.username}
            <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        </div>

        <p className="mb-12 max-w-2xl leading-relaxed text-muted text-pretty">
          {oss.blurb}
        </p>

        {/* Stats */}
        <dl className="mb-12 grid grid-cols-2 border-y border-line sm:grid-cols-4">
          {oss.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "px-5 py-6 first:pl-0",
                // Interior rules only, so the row does not end with a stray edge.
                i > 0 && "border-l border-line",
                i === 2 && "sm:border-l",
              )}
            >
              <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-muted/60">
                {stat.label}
              </dt>
              <dd className="mt-2 font-mono text-2xl font-bold tabular-nums sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Repositories */}
        <ul className="grid gap-4 sm:grid-cols-2">
          {oss.repositories.map((repo, i) => (
            <li key={repo.name}>
              <Reveal delay={i * 0.06}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-target group flex h-full flex-col border border-line bg-surface/40 p-6 backdrop-blur-sm transition-colors hover:border-accent/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-mono text-base font-bold tracking-wider text-fg transition-colors group-hover:text-accent">
                      {repo.name}
                    </h3>
                    <ExternalLink
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-muted/50 transition-colors group-hover:text-accent"
                    />
                  </div>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted text-pretty">
                    {repo.description}
                  </p>

                  <div className="mt-6 flex items-center gap-5 font-mono text-[0.65rem] text-muted">
                    <span className="flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full"
                        style={{
                          backgroundColor:
                            LANGUAGE_COLOR[repo.language] ?? "#8b8b96",
                        }}
                      />
                      {repo.language}
                    </span>
                    {/* Counts are opt-in. A repo with none renders its
                        language alone rather than a row of zeroes. */}
                    {Boolean(repo.stars) && (
                      <span className="flex items-center gap-1.5 tabular-nums">
                        <Star aria-hidden="true" className="size-3" />
                        {repo.stars}
                        <span className="sr-only">stars</span>
                      </span>
                    )}
                    {Boolean(repo.forks) && (
                      <span className="flex items-center gap-1.5 tabular-nums">
                        <GitFork aria-hidden="true" className="size-3" />
                        {repo.forks}
                        <span className="sr-only">forks</span>
                      </span>
                    )}
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Magnetic>
            <a
              href={oss.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target inline-flex items-center gap-2 border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-fg hover:text-fg"
            >
              All repositories
              <ExternalLink aria-hidden="true" className="size-3.5" />
            </a>
          </Magnetic>
        </div>
      </Container>
    </Section>
  );
}
