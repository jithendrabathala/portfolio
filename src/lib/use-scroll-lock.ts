"use client";

import { useEffect } from "react";

/**
 * Locks background scrolling while `locked` is true.
 *
 * Uses `overflow: hidden` on the root element rather than `position: fixed` on
 * body: the latter resets scroll position and would break every sticky pin on
 * the page. Padding compensates for the vanished scrollbar so the layout does
 * not jump sideways on lock.
 *
 * Shared by the loading splash and the project detail overlay so the two cannot
 * disagree about how to restore the page.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
    };
  }, [locked]);
}
