"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";

/**
 * `ssr: false` is only legal inside a Client Component in Next 16 — calling it
 * from a Server Component is a build error. That is the entire reason this
 * wrapper exists separately from the scene itself.
 *
 * The scene is also the heaviest thing on the page (three + R3F + drei), so
 * keeping it behind a dynamic import means it never blocks first paint.
 */
const Scene = dynamic(() => import("./scene").then((mod) => mod.Scene), {
  ssr: false,
});

/**
 * The canvas is decoration. If WebGL is unavailable, blocked, or the chunk
 * fails to load, the site must look intentional rather than broken — so every
 * failure path here renders nothing and lets the CSS background stand.
 */
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Not re-thrown: a dead background is not worth taking the page down for.
    console.warn("[scene] disabled after error:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Cheap capability probe — cheaper than mounting three and finding out. */
function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function SceneRoot() {
  const [enabled, setEnabled] = useState(false);

  // Mount-gated so the server and first client render agree on "nothing here",
  // which keeps hydration clean.
  useEffect(() => {
    setEnabled(hasWebGL());
  }, []);

  if (!enabled) return null;

  return (
    <SceneBoundary>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <Scene />
      </div>
    </SceneBoundary>
  );
}
