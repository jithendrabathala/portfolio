import { create } from "zustand";
import type { SectionId } from "@/content/site";

/**
 * Discrete UI state only.
 *
 * Nothing that changes at frame rate belongs here — subscribers re-render on
 * every change, so a per-frame write would thrash the tree. Scroll position and
 * velocity live in `scroll-signals.ts` as MotionValues instead.
 *
 * This store is a module singleton, so `useUIStore.getState()` works inside
 * useFrame and outside React entirely.
 */

export type CursorVariant = "default" | "hover" | "drag" | "hidden";

type UIState = {
  /** Section currently filling most of the viewport. Drives the rail + shader mood. */
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;

  /** Slug of the project open in the detail overlay, or null when closed. */
  openProject: string | null;
  setOpenProject: (slug: string | null) => void;

  cursorVariant: CursorVariant;
  setCursorVariant: (variant: CursorVariant) => void;

  /** True once the WebGL scene has mounted and rendered a frame. */
  sceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  activeSection: "hero",
  setActiveSection: (id) =>
    set((s) => (s.activeSection === id ? s : { activeSection: id })),

  openProject: null,
  setOpenProject: (slug) => set({ openProject: slug }),

  cursorVariant: "default",
  setCursorVariant: (variant) =>
    set((s) => (s.cursorVariant === variant ? s : { cursorVariant: variant })),

  sceneReady: false,
  setSceneReady: (ready) => set({ sceneReady: ready }),
}));
