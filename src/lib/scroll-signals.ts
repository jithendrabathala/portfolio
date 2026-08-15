import { motionValue } from "framer-motion";

/**
 * Per-frame scroll state lives at module scope rather than in React context.
 *
 * The R3F <Canvas> mounts its own reconciler root, so context from the DOM tree
 * does not reach components inside it without a bridge. A module singleton is
 * readable from both trees and from inside useFrame, and there is exactly one
 * scrolling document, so a singleton is the honest model here.
 *
 * These are MotionValues, not React state: writing to them at scroll frequency
 * does not re-render anything. Read them with useTransform in the DOM tree, or
 * with `.get()` inside useFrame.
 *
 * `ScrollDriver` is the only writer. Everything else reads.
 */
export const scrollSignals = {
  /** Document scroll progress, 0 at top to 1 at bottom. */
  progress: motionValue(0),

  /** Raw scroll velocity in px/s. Signed: negative when scrolling up. */
  velocity: motionValue(0),

  /**
   * Velocity normalised to roughly [-1, 1] and spring-smoothed. This is what
   * visuals should couple to — raw velocity is far too spiky to drive a skew
   * or a shader uniform directly.
   */
  intensity: motionValue(0),
};

/** Velocity (px/s) that maps to an intensity of 1. Tuned by feel. */
export const VELOCITY_CEILING = 2500;
