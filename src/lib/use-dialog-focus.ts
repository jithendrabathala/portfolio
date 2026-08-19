"use client";

import { type RefObject, useEffect } from "react";

/**
 * The keyboard half of a modal: Escape closes, Tab cannot leave the panel, and
 * focus is handed back to whatever opened it.
 *
 * Runs on mount, so callers mount the panel only while the dialog is open —
 * which is what AnimatePresence already gives both call sites.
 *
 * Shared by the project detail overlay and the mobile nav sheet so the two
 * cannot drift apart on the parts only a keyboard user feels.
 */
export function useDialogFocus({
  panelRef,
  initialFocusRef,
  onClose,
}: {
  /** The dialog panel. Everything focusable inside it forms the trap. */
  panelRef: RefObject<HTMLElement | null>;
  /** Focused on open. Defaults to the first focusable element in the panel. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  useEffect(() => {
    // Remember what had focus so it can be handed back on close — otherwise
    // focus falls to the top of the document and a keyboard user loses place.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Queried on every Tab rather than cached: panel content animates in after
    // the box has settled, so a list taken at mount goes stale immediately.
    const focusables = () =>
      panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

    (initialFocusRef?.current ?? focusables()?.[0])?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const targets = focusables();
      if (!targets || targets.length === 0) return;

      const first = targets[0];
      const last = targets[targets.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [panelRef, initialFocusRef, onClose]);
}
