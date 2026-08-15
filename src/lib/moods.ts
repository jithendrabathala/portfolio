import type { SectionId } from "@/content/site";

/**
 * Background mood per section. The shader lerps between these as you scroll, so
 * the backdrop drifts rather than cutting at section boundaries.
 *
 * Placeholder values, deliberately low-chroma. This is the main lever for art
 * direction — swapping these re-moods the whole site without touching GLSL.
 */
export const sectionMoods: Record<SectionId, { a: string; b: string }> = {
  hero: { a: "#181822", b: "#2b2338" },
  work: { a: "#121a20", b: "#1e2f38" },
  architecture: { a: "#101a19", b: "#1b3230" },
  experience: { a: "#15191c", b: "#26333a" },
  stack: { a: "#15171e", b: "#232937" },
  about: { a: "#1c1a15", b: "#332a1f" },
  journey: { a: "#191520", b: "#2e2440" },
  oss: { a: "#121a16", b: "#1e3327" },
  contact: { a: "#1f1317", b: "#3a1f27" },
};
