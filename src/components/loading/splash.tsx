"use client";

import {
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import * as m from "framer-motion/m";
import { useEffect, useState } from "react";
import { profile } from "@/content/site";
import { useUIStore } from "@/lib/store";
import { usePrefersReducedMotion } from "@/lib/use-motion-scale";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { clamp, damp } from "@/lib/utils";

/** Splash never dismisses before this, so it reads as intentional, not a flash. */
const MIN_VISIBLE_MS = 900;
/** Hard ceiling. The splash always leaves, whatever fails to load. */
const MAX_VISIBLE_MS = 4000;
/** After this, stop waiting on the WebGL scene and count it as done. */
const SCENE_GRACE_MS = 2200;

/**
 * First-load splash.
 *
 * Rendered on the server as visible, so there is no flash of the page before it
 * appears. The three safeguards that matter:
 *
 *   1. A hard MAX_VISIBLE_MS timeout — no asset can strand a visitor here.
 *   2. A <noscript> rule in the root layout hides it entirely without JS,
 *      since nothing would ever dismiss it.
 *   3. Content renders underneath the whole time, so crawlers and readers are
 *      never blocked on it.
 */
export function Splash() {
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(0);
  const prefersReduced = usePrefersReducedMotion();
  const sceneReady = useUIStore((s) => s.sceneReady);

  const progress = useMotionValue(0);

  useScrollLock(visible);

  // Re-render only when the displayed integer actually changes — roughly 100
  // renders across the whole splash rather than one per frame.
  useMotionValueEvent(progress, "change", (v) => {
    setShown(Math.round(v * 100));
  });

  useEffect(() => {
    const startedAt = performance.now();
    let fontsReady = false;
    let raf = 0;

    // document.fonts is the honest signal for "text will not reflow again".
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    const tick = (now: number) => {
      const elapsed = now - startedAt;

      // Target is what we believe is loaded; progress eases toward it so the
      // counter never jumps.
      let target = 0.15;
      if (fontsReady) target += 0.35;
      if (sceneReady || elapsed > SCENE_GRACE_MS) target += 0.35;
      if (elapsed > MIN_VISIBLE_MS) target += 0.15;
      if (elapsed > MAX_VISIBLE_MS) target = 1;

      const dt = Math.min(1 / 60, 0.05);
      progress.set(damp(progress.get(), clamp(target, 0, 1), 0.008, dt));

      if (progress.get() > 0.995 && elapsed > MIN_VISIBLE_MS) {
        progress.set(1);
        setShown(100);
        setVisible(false);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, sceneReady]);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          data-splash=""
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className="fixed inset-0 z-100 flex flex-col justify-between bg-bg px-6 py-6"
          initial={{ opacity: 1 }}
          exit={
            prefersReduced
              ? { opacity: 0 }
              : // Wipe upward rather than fade — it hands the page over instead
                // of dissolving into it.
                {
                  y: "-100%",
                  transition: { duration: 0.8, ease: [0.83, 0, 0.17, 1] },
                }
          }
          transition={{ duration: 0.3 }}
        >
          {/* Corner frames, matching the hero's HUD language. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-0 top-0 size-8 border-l-2 border-t-2 border-fg/30 lg:size-12" />
            <div className="absolute right-0 top-0 size-8 border-r-2 border-t-2 border-fg/30 lg:size-12" />
            <div className="absolute bottom-0 left-0 size-8 border-b-2 border-l-2 border-fg/30 lg:size-12" />
            <div className="absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-fg/30 lg:size-12" />
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
            <span>{profile.name}</span>
            <span className="hidden sm:inline">{profile.role}</span>
          </div>

          <div className="flex flex-1 items-center">
            <div className="mx-auto w-full max-w-5xl">
              <div
                aria-hidden="true"
                className="font-mono text-[clamp(4rem,22vw,16rem)] font-bold leading-none tabular-nums tracking-tighter"
              >
                {String(shown).padStart(3, "0")}
              </div>

              {/* Determinate bar. scaleX is composited; width would not be. */}
              <div className="mt-6 h-px w-full bg-line">
                <m.div
                  className="h-full origin-left bg-accent"
                  style={{ scaleX: progress }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
            <span>Loading</span>
            <span>{profile.location}</span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
