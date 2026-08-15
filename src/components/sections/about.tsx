"use client";

import { type MotionValue, useScroll, useTransform } from "framer-motion";
import * as m from "framer-motion/m";
import { useMemo, useRef } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/scroll/section";
import { profile } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/use-motion-scale";

/**
 * Bio copy that resolves word by word as the section moves through the
 * viewport — dim text sharpening into full contrast on a scroll-linked
 * timeline.
 *
 * Not pinned. The page already pins the work gallery, and a pin exists to buy
 * time for a scene that changes state; this one just needs the reader's scroll
 * to drive a single continuous effect, which native flow does more cheaply.
 */
export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Starts as the block enters the lower third, completes before it exits the
  // top, so the last word lands while the paragraph is still comfortably read.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  // Flatten to a single word timeline across all paragraphs so the reveal runs
  // continuously instead of restarting per paragraph.
  const paragraphs = useMemo(() => {
    let offset = 0;
    return profile.bio.map((text) => {
      const words = text.split(" ");
      const startIndex = offset;
      offset += words.length;
      return { text, words, startIndex };
    });
  }, []);

  const totalWords = useMemo(
    () => paragraphs.reduce((sum, p) => sum + p.words.length, 0),
    [paragraphs],
  );

  return (
    <Section id="about" className="py-32 sm:py-48">
      {/* Container, not a narrower wrapper: constraining the measure inside
          keeps the copy readable while its left edge stays flush with every
          other section. Shrinking the container itself re-centres the block
          and is what made this section look inset from the rest of the page. */}
      <Container>
        <div ref={ref} className="max-w-3xl">
          <h2 className="mb-12 font-mono text-xs uppercase tracking-[0.3em] text-muted">
            About
          </h2>

          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.text.slice(0, 32)}
              className="mb-8 text-2xl leading-relaxed text-pretty last:mb-0 sm:text-3xl"
            >
              {paragraph.words.map((word, i) => (
                <Word
                  // Words repeat within a paragraph, so position is the identity.
                  // biome-ignore lint/suspicious/noArrayIndexKey: position is the identity
                  key={i}
                  index={paragraph.startIndex + i}
                  total={totalWords}
                  progress={scrollYProgress}
                  disabled={prefersReduced}
                >
                  {word}
                </Word>
              ))}
            </p>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Word({
  children,
  index,
  total,
  progress,
  disabled,
}: {
  children: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  disabled: boolean;
}) {
  // Each word owns a slice of the timeline, overlapping slightly with the next
  // so the leading edge reads as a soft sweep rather than a hard cursor.
  const start = index / total;
  const end = Math.min((index + 1.8) / total, 1);
  const opacity = useTransform(progress, [start, end], [0.16, 1]);

  return (
    <m.span
      className="mr-[0.28em] inline-block"
      // Reduced motion gets the fully resolved text immediately — the effect is
      // scroll-coupled movement of contrast, which is exactly what to drop.
      style={{ opacity: disabled ? 1 : opacity }}
    >
      {children}
    </m.span>
  );
}
