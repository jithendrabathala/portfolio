"use client";

import { AnimatePresence, useSpring } from "framer-motion";
import * as m from "framer-motion/m";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile, type SectionId, sections, socials } from "@/content/site";
import { DESKTOP } from "@/lib/breakpoints";
import { scrollSignals } from "@/lib/scroll-signals";
import { useUIStore } from "@/lib/store";
import { useDialogFocus } from "@/lib/use-dialog-focus";
import { useMotionScale } from "@/lib/use-motion-scale";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { cn } from "@/lib/utils";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * The Rail's counterpart below `md`.
 *
 * The rail is a hover interface — dots the size of a full stop, with labels
 * that only appear on hover — so it is hidden on touch rather than shrunk to
 * fit. This gives the same navigation a shape a thumb can use: a transport
 * pinned opposite the audio controls, and a full-screen sheet behind it.
 *
 * Both surfaces read `sections` from content/site.ts, so the page has one set
 * of destinations rather than one per breakpoint.
 */
export function MobileNav() {
  const activeSection = useUIStore((s) => s.activeSection);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<SectionId | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useScrollLock(open);

  // Same spring as the rail's bar, so the two readouts move identically.
  const scaleX = useSpring(scrollSignals.progress, {
    stiffness: 260,
    damping: 40,
    mass: 0.3,
  });

  /**
   * Anchor navigation is deferred rather than left to the browser: the sheet
   * scroll-locks the document, and a fragment jump fired against a locked root
   * either does nothing or lands halfway through the unlock. Closing first and
   * scrolling after is deterministic.
   *
   * React runs every cleanup in a commit before any effect, and useScrollLock
   * is called above this one — so by the time this runs, overflow is restored.
   */
  useEffect(() => {
    if (open || !pending) return;
    setPending(null);

    // No `behavior` argument on purpose: scroll-behavior in globals.css already
    // picks smooth, and the reduced-motion block there already turns it off.
    document.getElementById(pending)?.scrollIntoView();
    // replaceState rather than assigning location.hash: the URL should say
    // where you are without stacking a history entry per tap.
    history.replaceState(null, "", `#${pending}`);
  }, [open, pending]);

  // Rotating a tablet past `md` hides the sheet by CSS but would leave the
  // scroll lock applied to a page that no longer has any way to release it.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia(DESKTOP);
    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [open]);

  // Falls back to "Menu" for the sections that have no dot on the rail
  // (architecture, stack, oss). Claiming the last one you passed would be a
  // lie; the progress bar beside it still tracks position.
  const label = sections.find((s) => s.id === activeSection)?.label ?? "Menu";

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          // The visible label reports position, which is not what pressing this
          // does — so the button is named for its action and the label is
          // hidden from assistive tech, exactly as the rail's dots are.
          aria-label="Open section navigation"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex items-center gap-2.5 border border-line bg-bg/70 px-3 py-2 backdrop-blur-sm"
        >
          {/* The rail's progress bar, laid on its side. */}
          <span
            aria-hidden="true"
            className="relative h-px w-6 overflow-hidden bg-line"
          >
            <m.span
              className="absolute inset-0 origin-left bg-accent"
              style={{ scaleX }}
            />
          </span>

          <span
            aria-hidden="true"
            className="font-mono text-[0.65rem] uppercase tracking-widest text-muted"
          >
            {label}
          </span>

          <Menu aria-hidden="true" className="size-3.5 text-muted" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <Sheet
            activeSection={activeSection}
            onClose={close}
            onNavigate={(id) => {
              setPending(id);
              setOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Sheet({
  activeSection,
  onClose,
  onNavigate,
}: {
  activeSection: SectionId;
  onClose: () => void;
  onNavigate: (id: SectionId) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const motionScale = useMotionScale();

  useDialogFocus({ panelRef, initialFocusRef: closeRef, onClose });

  return (
    // overscroll-contain stops a flick inside the sheet from chaining to the
    // page underneath on iOS, where the scroll lock alone is not enough.
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain md:hidden">
      <m.button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 h-full w-full cursor-default bg-bg/85 backdrop-blur-md"
      />

      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        initial={{ opacity: 0, y: 24 * motionScale }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 * motionScale }}
        transition={{ duration: 0.35, ease: EXPO_OUT }}
        // pb-24 clears the transport row the sheet was opened from, so the last
        // link is never sitting under the button covering it.
        className="relative flex min-h-full flex-col px-6 pb-24 pt-8"
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted/60">
            {profile.name}
          </p>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 border border-line px-3 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted transition-colors hover:text-fg"
          >
            <X aria-hidden="true" className="size-3" />
            Close
          </button>
        </div>

        <nav aria-label="Sections" className="mt-10 flex-1">
          <ul className="flex flex-col">
            {sections.map((section, index) => {
              const isActive = activeSection === section.id;
              return (
                <m.li
                  key={section.id}
                  initial={{ opacity: 0, y: 12 * motionScale }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 + index * 0.05,
                    duration: 0.4,
                    ease: EXPO_OUT,
                  }}
                  className="border-b border-line first:border-t"
                >
                  {/* A real href, so the link is still a link — long-press,
                      copy, and no-JS all behave. The handler takes over only to
                      sequence the close against the scroll (see MobileNav). */}
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(section.id);
                    }}
                    className={cn(
                      "flex items-center gap-4 py-5 transition-colors",
                      isActive ? "text-accent" : "text-fg",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="font-mono text-[0.6rem] tracking-widest text-muted/60"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="font-mono text-2xl uppercase tracking-tight">
                      {section.label}
                    </span>

                    <span
                      aria-hidden="true"
                      className={cn(
                        "ml-auto size-1.5 rounded-full bg-accent transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </a>
                </m.li>
              );
            })}
          </ul>
        </nav>

        {/* Contact routes live at the very bottom of a long page, so the sheet
            carries them too — the menu is the shortest path to them on a
            phone. */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 + sections.length * 0.05, duration: 0.4 }}
          className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6"
        >
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              onClick={onClose}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={
                social.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="font-mono text-[0.65rem] uppercase tracking-widest text-muted transition-colors hover:text-fg"
            >
              {social.label}
            </a>
          ))}
          <a
            href={profile.resume}
            download
            onClick={onClose}
            className="font-mono text-[0.65rem] uppercase tracking-widest text-muted transition-colors hover:text-fg"
          >
            Résumé
          </a>
        </m.div>
      </m.div>
    </div>
  );
}
