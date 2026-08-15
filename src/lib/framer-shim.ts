/**
 * Minimal stand-in for Framer's canvas runtime.
 *
 * `src/vendor/orbit-project.js` is a component published from Framer, and it
 * imports four things from the bare specifier `"framer"`. The npm package of
 * that name ships only type definitions ("Type definitions from the Framer code
 * editor") — there is no runtime to install — so outside Framer's canvas the
 * import cannot resolve and the module fails to load.
 *
 * Everything it actually needs at runtime is trivial:
 *
 *   addPropertyControls  editor metadata; a no-op outside the Framer canvas
 *   ControlType          string enum, only ever read inside those controls
 *   RenderTarget         asked once, to detect thumbnail renders
 *   useIsStaticRenderer  true only during Framer's static export
 *
 * `next.config.ts` aliases `framer` to this file so the vendored component
 * resolves against it. Nothing else in the codebase imports `framer`.
 */

/**
 * Returns the property name as its own value, which is all the vendored module
 * does with these — it reads `ControlType.Array`, `ControlType.Color`, etc. and
 * passes them straight into control metadata we discard.
 */
export const ControlType: Record<string, string> = new Proxy(
  {},
  { get: (_target, key) => String(key) },
);

/** Editor-only registration. Discarded outside the Framer canvas. */
export function addPropertyControls(..._args: unknown[]): void {
  // Intentionally empty.
}

export const RenderTarget = {
  canvas: "CANVAS",
  export: "EXPORT",
  preview: "PREVIEW",
  thumbnail: "THUMBNAIL",
  /**
   * The component compares this against `RenderTarget.thumbnail` to decide
   * whether to skip animation for a still. We are always a live preview.
   */
  current: () => "PREVIEW",
} as const;

/** True only inside Framer's static renderer, which we never are. */
export function useIsStaticRenderer(): boolean {
  return false;
}
