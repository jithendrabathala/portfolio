"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store";
import { usePrefersReducedMotion } from "@/lib/use-motion-scale";
import { ShaderField } from "./shader-field";

/**
 * Persistent full-viewport canvas. Mounted once in the root layout and never
 * unmounted, so the background is continuous across the whole page rather than
 * restarting per section.
 */
export function Scene() {
  const prefersReduced = usePrefersReducedMotion();
  const setSceneReady = useUIStore((s) => s.setSceneReady);
  const [visible, setVisible] = useState(true);

  // A backgrounded tab still runs rAF in some browsers. Suspending the loop on
  // hidden keeps a parked tab from burning battery on an invisible shader.
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    setSceneReady(true);
    return () => setSceneReady(false);
  }, [setSceneReady]);

  // Under reduced motion the shader renders exactly one frame and then stops:
  // the colour wash still provides depth, but nothing moves.
  const frameloop = prefersReduced || !visible ? "demand" : "always";

  return (
    <Canvas
      // Capping DPR matters more than any shader optimisation here — a 3x
      // retina display is 9x the fragment work for a full-screen effect.
      dpr={[1, 1.75]}
      frameloop={frameloop}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "low-power",
        // The page background shows through; no need to pay for a depth buffer
        // on a single fullscreen quad.
        depth: false,
        stencil: false,
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ShaderField />
    </Canvas>
  );
}
