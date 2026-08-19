"use client";

import { useTransform } from "framer-motion";
import * as m from "framer-motion/m";
import { Container } from "@/components/layout/container";
import { KineticText } from "@/components/motion/kinetic-text";
import { Magnetic } from "@/components/motion/magnetic";
import { Section } from "@/components/scroll/section";
import { profile } from "@/content/site";
import { scrollSignals } from "@/lib/scroll-signals";

/** Deterministic bar heights. Math.random() here would desync SSR and hydration. */
const SIGNAL_BARS = [6, 11, 4, 14, 8, 5, 12, 7];

/**
 * Offsets for the telemetry dots. Evenly spaced across the 1200ms `blip` cycle
 * so the bright one walks the row; bunch them tighter and it reads as a blink.
 */
const RENDER_DOTS = ["0ms", "400ms", "800ms"];

export function Hero() {
  // The hero dissolves as it leaves rather than merely scrolling away.
  const opacity = useTransform(scrollSignals.progress, [0, 0.08], [1, 0]);
  const y = useTransform(scrollSignals.progress, [0, 0.08], [0, -60]);

  return (
    <Section id="hero" className="relative min-h-svh overflow-hidden">
      <HudHeader />

      <m.div
        style={{ opacity, y }}
        className="relative z-10 flex min-h-svh items-center"
      >
        <Container className="py-28">
          {/* Rule + infinity mark, lifted from the reference's notation style. */}
          <div className="mb-5 flex items-center gap-2 opacity-60">
            <div className="h-px w-8 bg-fg" />
            <span className="font-mono text-[10px] tracking-wider">∞</span>
            <div className="h-px flex-1 bg-fg/40" />
          </div>

          {profile.available && (
            <div className="mb-8 inline-flex items-center gap-2 border border-line px-3 py-1.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[0.7rem] uppercase tracking-widest text-muted">
                {profile.availabilityNote}
              </span>
            </div>
          )}

          <div className="relative">
            {/* Dither strip running alongside the title. */}
            <div
              aria-hidden="true"
              className="dither-pattern absolute -left-4 top-0 hidden h-full w-1 opacity-40 lg:block"
            />
            {/* One word per line. Splitting on the space rather than hard-coding
                two lines keeps this honest for any name; each word is its own
                KineticText so the per-character repel still works across the
                break. Ceiling is sized so the longest word clears the container
                at max width — raise it and "JITHENDRA" starts to overflow. */}
            <h1 className="font-mono text-[clamp(2.5rem,13vw,8rem)] font-bold uppercase leading-[0.9] tracking-[0.06em]">
              {profile.name.split(" ").map((word) => (
                <span key={word} className="block">
                  <KineticText text={word} />
                </span>
              ))}
            </h1>
          </div>

          <div
            aria-hidden="true"
            className="mt-4 hidden gap-1 opacity-40 lg:flex"
          >
            {Array.from({ length: 40 }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decoration
              <div key={i} className="size-0.5 rounded-full bg-fg" />
            ))}
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {profile.role}
          </p>

          <p className="mt-8 max-w-xl font-mono text-sm leading-relaxed text-muted text-pretty sm:text-base">
            {profile.tagline}
          </p>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Magnetic>
              <a
                href="#work"
                className="cursor-target group relative border border-fg px-6 py-3 font-mono text-xs uppercase tracking-widest text-fg transition-colors duration-200 hover:bg-fg hover:text-bg"
              >
                <span className="absolute -left-1 -top-1 hidden size-2 border-l border-t border-fg opacity-0 transition-opacity group-hover:opacity-100 lg:block" />
                <span className="absolute -bottom-1 -right-1 hidden size-2 border-b border-r border-fg opacity-0 transition-opacity group-hover:opacity-100 lg:block" />
                See the work
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="cursor-target border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted transition-colors duration-200 hover:border-fg hover:text-fg"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>

          <div
            aria-hidden="true"
            className="mt-10 hidden items-center gap-2 opacity-40 lg:flex"
          >
            <span className="font-mono text-[9px]">∞</span>
            <div className="h-px flex-1 bg-fg/40" />
            <span className="font-mono text-[9px] uppercase tracking-wider">
              {profile.location}
            </span>
          </div>
        </Container>
      </m.div>

      <HudFooter />
    </Section>
  );
}

function HudHeader() {
  return (
    <div className="absolute inset-x-0 top-0 z-20 border-b border-line">
      <Container className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold uppercase tracking-widest">
            {profile.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </span>
          <div className="h-3 w-px bg-line" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {profile.role}
          </span>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted lg:inline">
          {profile.location}
        </span>
      </Container>
    </div>
  );
}

function HudFooter() {
  const opacity = useTransform(scrollSignals.progress, [0, 0.04], [1, 0]);

  return (
    <m.div
      style={{ opacity }}
      className="absolute inset-x-0 bottom-0 z-20 border-t border-line bg-bg/40 backdrop-blur-sm"
    >
      <Container className="flex items-center justify-between py-2.5">
        <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-wider text-muted">
          <span>Scroll</span>
          <div aria-hidden="true" className="hidden items-end gap-1 lg:flex">
            {SIGNAL_BARS.map((height, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed decoration
                key={i}
                // Scaled from the base so the row reads as an equalizer rather
                // than bars growing out of their own middle. The stagger is
                // what keeps it from pumping as one block.
                className="animate-eq w-1 origin-bottom bg-fg/30"
                style={{ height, animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-wider text-muted">
          <span className="hidden lg:inline">Rendering</span>
          <div aria-hidden="true" className="flex items-center gap-1">
            {RENDER_DOTS.map((delay, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed decoration
                key={i}
                className="animate-blip size-1 rounded-full bg-fg"
                style={{ animationDelay: delay }}
              />
            ))}
          </div>
        </div>
      </Container>
    </m.div>
  );
}
