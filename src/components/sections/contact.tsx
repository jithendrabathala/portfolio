"use client";

import { Container } from "@/components/layout/container";
import { KineticText } from "@/components/motion/kinetic-text";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/scroll/section";
import { profile, socials } from "@/content/site";

export function Contact() {
  return (
    <Section
      id="contact"
      className="flex min-h-svh flex-col justify-center py-32"
    >
      <Container>
        <Reveal>
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Contact
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-8 text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-balance">
            <KineticText text="Let's build something." />
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <Magnetic className="mt-12">
            <a
              href={`mailto:${profile.email}`}
              className="cursor-target inline-flex items-center gap-3 rounded-full bg-fg px-7 py-4 text-base font-medium text-bg transition-colors hover:bg-accent"
            >
              {profile.email}
            </a>
          </Magnetic>
        </Reveal>

        <Reveal delay={0.18}>
          <ul className="mt-16 flex flex-wrap gap-8 border-t border-line pt-8">
            {socials.map((social) => (
              <li key={social.label}>
                <Magnetic strength={0.25}>
                  <a
                    href={social.href}
                    target={
                      social.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      social.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="cursor-target font-mono text-sm uppercase tracking-widest text-muted transition-colors hover:text-fg"
                  >
                    {social.label}
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mt-16 font-mono text-xs text-muted/60">
            {profile.location} · Press{" "}
            <kbd className="rounded border border-line px-1.5 py-0.5">C</kbd>{" "}
            for chaos
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
