"use client";

import { ScreenQuad } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, type ShaderMaterial, Vector2 } from "three";
import { sectionMoods } from "@/lib/moods";
import { scrollSignals } from "@/lib/scroll-signals";
import { useUIStore } from "@/lib/store";
import { damp } from "@/lib/utils";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // ScreenQuad's positions are already in clip space, so this is a pass-through.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uProgress;   // 0..1 document scroll
  uniform float uIntensity;  // -1..1 smoothed scroll velocity
  uniform float uAspect;
  uniform vec2  uPointer;    // -1..1, y up
  uniform vec3  uColorA;
  uniform vec3  uColorB;

  varying vec2 vUv;

  // Cheap value noise. Not the prettiest, but it costs a fraction of simplex
  // and the result is heavily blurred by fbm anyway.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      total += noise(p) * amplitude;
      p *= 2.02;          // non-integer to avoid axis-aligned repetition
      amplitude *= 0.5;
    }
    return total;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);

    float t = uTime * 0.045;

    // Domain warp: fbm sampling itself, which turns bland noise into something
    // that reads as flow rather than static.
    vec2 warp = vec2(
      fbm(p * 1.4 + vec2(t, 0.0)),
      fbm(p * 1.4 + vec2(0.0, t) + 5.2)
    );

    // Scrolling shifts the field vertically; velocity stretches it. Fast
    // scrolling visibly smears the background and settles when you stop.
    vec2 q = p + (warp - 0.5) * (0.85 + uIntensity * 0.5);
    q.y += uProgress * 1.6;
    q.y *= 1.0 + abs(uIntensity) * 0.35;

    float field = fbm(q * 1.9 + t * 0.5);

    // Pointer bloom — a soft lift that follows the cursor.
    vec2 pointer = uPointer * vec2(uAspect, 1.0) * 0.5;
    float dist = length(p - pointer);
    float bloom = smoothstep(0.55, 0.0, dist) * 0.12;

    vec3 color = mix(uColorA, uColorB, smoothstep(0.25, 0.85, field));
    color += bloom;

    // Vignette keeps the edges from competing with the content.
    float vignette = smoothstep(1.15, 0.25, length(p));
    color *= 0.55 + vignette * 0.45;

    // Dither. Without this, a dark low-contrast gradient bands badly on 8-bit
    // displays, which is exactly the palette this site uses.
    float grain = (hash(uv * 900.0 + fract(uTime)) - 0.5) * 0.016;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function ShaderField() {
  const materialRef = useRef<ShaderMaterial>(null);
  const { size, invalidate } = useThree();
  const activeSection = useUIStore((s) => s.activeSection);

  // Targets the uniforms chase. Kept outside the uniform object so the shader
  // never jumps to a new mood — it always eases there.
  const targets = useMemo(
    () => ({
      colorA: new Color(sectionMoods.hero.a),
      colorB: new Color(sectionMoods.hero.b),
      pointer: new Vector2(0, 0),
    }),
    [],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uIntensity: { value: 0 },
      uAspect: { value: 1 },
      uPointer: { value: new Vector2(0, 0) },
      uColorA: { value: new Color(sectionMoods.hero.a) },
      uColorB: { value: new Color(sectionMoods.hero.b) },
    }),
    [],
  );

  useEffect(() => {
    const mood = sectionMoods[activeSection];
    targets.colorA.set(mood.a);
    targets.colorB.set(mood.b);
    // Nudge the loop so the mood still resolves when frameloop is "demand".
    invalidate();
  }, [activeSection, targets, invalidate]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      targets.pointer.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [targets]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;

    // Guard against tab-switch delta spikes, which would snap every eased value.
    const dt = Math.min(delta, 0.1);
    const u = material.uniforms;

    u.uTime.value += dt;
    u.uAspect.value = size.width / Math.max(size.height, 1);

    // damp() rather than a fixed-alpha lerp so the feel is identical at 60Hz
    // and 144Hz.
    u.uProgress.value = damp(
      u.uProgress.value,
      scrollSignals.progress.get(),
      0.001,
      dt,
    );
    u.uIntensity.value = damp(
      u.uIntensity.value,
      scrollSignals.intensity.get(),
      0.0005,
      dt,
    );

    u.uPointer.value.x = damp(u.uPointer.value.x, targets.pointer.x, 0.002, dt);
    u.uPointer.value.y = damp(u.uPointer.value.y, targets.pointer.y, 0.002, dt);

    u.uColorA.value.lerp(targets.colorA, 1 - 0.05 ** dt);
    u.uColorB.value.lerp(targets.colorB, 1 - 0.05 ** dt);
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}
