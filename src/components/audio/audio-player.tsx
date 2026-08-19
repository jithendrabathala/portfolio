"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { audio } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/use-motion-scale";
import { clamp, cn } from "@/lib/utils";

const STORAGE_KEY = "portfolio:audio";

type StoredState = { enabled: boolean; volume: number };

/**
 * Background audio with a HUD-style transport.
 *
 * Deliberately does not autoplay. Every current browser blocks audio without a
 * user gesture, so autoplay would fail silently anyway — and unsolicited sound
 * is hostile even where it succeeds. The visitor opts in, and the choice is
 * remembered.
 *
 * `preload="none"` keeps the ~385KB loop off the critical path entirely; it is
 * fetched only once someone presses play.
 */
export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const [playing, setPlaying] = useState(false);
  // Explicit `number`: the config is `as const`, so inference would pin this
  // to the literal 0.35 and reject every other level.
  const [volume, setVolume] = useState<number>(audio.defaultVolume);
  const [expanded, setExpanded] = useState(false);
  const [blocked, setBlocked] = useState(false);

  // Restore the previous choice. Volume is reapplied immediately; playback is
  // not resumed, because a fresh page load has no gesture to authorise it.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as Partial<StoredState>;
      if (typeof stored.volume === "number") {
        setVolume(clamp(stored.volume, 0, 1));
      }
    } catch {
      // Private mode, disabled storage, or corrupt JSON — defaults are fine.
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const persist = useCallback((next: Partial<StoredState>) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const current = raw ? (JSON.parse(raw) as Partial<StoredState>) : {};
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...current, ...next }),
      );
    } catch {
      // Non-fatal.
    }
  }, []);

  const toggle = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;

    if (el.paused) {
      try {
        await el.play();
        setPlaying(true);
        setBlocked(false);
        persist({ enabled: true });
      } catch {
        // Autoplay policy, or the file failed to decode. Surface it rather
        // than leaving a button that appears to do nothing.
        setBlocked(true);
        setPlaying(false);
      }
    } else {
      el.pause();
      setPlaying(false);
      persist({ enabled: false });
    }
  }, [persist]);

  // "M" toggles music. Typing is excluded so the shortcut cannot fire from a
  // field, and modified keys are left to the browser.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.matches("input, textarea, [contenteditable]")) return;
      if (e.key.toLowerCase() === "m") void toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center">
      {/* Two sources so Safari and Chrome each get a format they decode
          natively. loop is a plain attribute — no JS timer to drift. */}
      {/* No `controls`, so this is neither focusable nor announced — the
          buttons below are the entire interface. Two sources so Safari and
          Chrome each get a format they decode natively. `loop` is a plain
          attribute rather than a JS timer, so the seam never drifts. */}
      {/* biome-ignore lint/a11y/useMediaCaption: instrumental ambience, no speech to caption */}
      <audio ref={audioRef} loop preload="none">
        <source src={audio.ogg} type="audio/ogg" />
        <source src={audio.mp3} type="audio/mpeg" />
      </audio>

      <div
        className="flex items-center gap-2 border border-line bg-bg/70 p-1.5 backdrop-blur-sm"
        onPointerEnter={() => setExpanded(true)}
        onPointerLeave={() => setExpanded(false)}
      >
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={
            playing ? "Pause background music" : "Play background music"
          }
          className="cursor-target flex items-center gap-2 px-2 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted transition-colors hover:text-fg"
        >
          {playing ? (
            <Pause aria-hidden="true" className="size-3.5" />
          ) : (
            <Play aria-hidden="true" className="size-3.5" />
          )}

          <Equalizer active={playing && !prefersReduced} />
        </button>

        {/* Volume reveals on hover, but stays reachable by keyboard at all
            times — hiding it behind pointer-only interaction would strand
            keyboard users with no level control. */}
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden transition-all duration-300",
            expanded
              ? "w-28 opacity-100"
              : "w-0 opacity-0 focus-within:w-28 focus-within:opacity-100",
          )}
        >
          <button
            type="button"
            onClick={() => {
              const next = volume > 0 ? 0 : audio.defaultVolume;
              setVolume(next);
              persist({ volume: next });
            }}
            aria-label={volume > 0 ? "Mute" : "Unmute"}
            className="cursor-target text-muted transition-colors hover:text-fg"
          >
            {volume > 0 ? (
              <VolumeX aria-hidden="true" className="size-3.5" />
            ) : (
              <Volume2 aria-hidden="true" className="size-3.5" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              const next = Number(e.target.value);
              setVolume(next);
              persist({ volume: next });
            }}
            aria-label="Volume"
            className="h-1 w-16 cursor-pointer appearance-none bg-line accent-accent"
          />
        </div>
      </div>

      {/* <output> is the semantic status element, so it carries the live
          region implicitly without an explicit role. */}
      {blocked && (
        <output className="ml-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted/70">
          Tap to allow audio
        </output>
      )}
    </div>
  );
}

/** Five bars that animate only while audio is actually playing. */
function Equalizer({ active }: { active: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "w-[2px] origin-bottom bg-current",
            active ? "animate-eq" : "h-[3px]",
          )}
          style={
            active
              ? { height: "100%", animationDelay: `${i * 110}ms` }
              : undefined
          }
        />
      ))}
    </span>
  );
}
