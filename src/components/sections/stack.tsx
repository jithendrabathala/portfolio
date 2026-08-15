"use client";

import { Container } from "@/components/layout/container";
import { Marquee } from "@/components/motion/marquee";
import { Section } from "@/components/scroll/section";
import { stack } from "@/content/site";

/**
 * Velocity-coupled marquee rows. Alternating direction gives the section a
 * counter-scrolling texture, and scroll velocity accelerates every row at once.
 */
export function Stack() {
  return (
    <Section id="stack" className="py-32">
      <Container className="mb-14">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Stack
        </h2>
      </Container>

      <div className="flex flex-col gap-5">
        {stack.map((row, i) => (
          <div key={row.group}>
            <Container className="mb-3">
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted/60">
                {row.group}
              </p>
            </Container>
            <Marquee
              baseSpeed={26 + i * 9}
              direction={i % 2 === 0 ? 1 : -1}
              className="border-y border-line py-4"
            >
              {row.items.map((item) => (
                <span
                  key={item}
                  className="mx-5 whitespace-nowrap text-2xl font-medium tracking-tight text-muted sm:text-3xl"
                >
                  {item}
                  <span aria-hidden="true" className="ml-5 text-accent">
                    /
                  </span>
                </span>
              ))}
            </Marquee>
          </div>
        ))}
      </div>
    </Section>
  );
}
