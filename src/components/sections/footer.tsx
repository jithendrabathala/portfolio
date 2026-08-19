import { Container } from "@/components/layout/container";
import { Magnetic } from "@/components/motion/magnetic";
import { profile, socials } from "@/content/site";

/**
 * Page sign-off. Deliberately NOT a `Section` and not in SECTION_IDS: the rail
 * tracks navigable content, and a footer that steals the active dot from
 * Contact makes the rail look stuck at the bottom.
 *
 * Server component — the only interactive parts are client leaves of their own.
 * `getFullYear` therefore resolves at build, so there is no hydration mismatch
 * to guard against.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <footer className="border-t border-line">
      <Container className="flex items-end justify-between gap-6 py-16 sm:py-24">
        <p
          aria-hidden="true"
          className="font-mono text-[clamp(3.5rem,16vw,11rem)] font-bold uppercase leading-[0.85] tracking-tighter text-fg/12"
        >
          {initials}
        </p>
        {profile.available && (
          <p className="pb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted/60">
            {profile.availabilityNote}
          </p>
        )}
      </Container>

      <Container className="flex flex-col gap-6 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted/60">
          © {year} {profile.name}
        </p>

        <ul className="flex flex-wrap items-center gap-6">
          {socials.map((social) => (
            <li key={social.label}>
              <Magnetic strength={0.25}>
                <a
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="cursor-target font-mono text-[0.65rem] uppercase tracking-widest text-muted transition-colors hover:text-fg"
                >
                  {social.label}
                </a>
              </Magnetic>
            </li>
          ))}
          <li>
            <Magnetic strength={0.25}>
              <a
                href={profile.resume}
                download
                className="cursor-target font-mono text-[0.65rem] uppercase tracking-widest text-muted transition-colors hover:text-fg"
              >
                Résumé
              </a>
            </Magnetic>
          </li>
        </ul>

        <a
          href="#hero"
          className="cursor-target group flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted transition-colors hover:text-accent"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          >
            ↑
          </span>
          Top
        </a>
      </Container>
    </footer>
  );
}
