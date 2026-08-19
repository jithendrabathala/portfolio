/**
 * Breakpoints that JavaScript has to agree with CSS about.
 *
 * Tailwind v4 keeps its breakpoints in CSS, so there is nothing to read at
 * runtime — anything gating behaviour on width has to restate the value. Doing
 * it once here means the mobile nav and the custom cursor cannot disagree about
 * where "mobile" ends.
 *
 * `48rem` is Tailwind's `md`. The matching media queries in globals.css are
 * hand-kept; grep for 48rem before changing this.
 */

/** Tailwind's `md` and up — where the rail replaces the mobile nav sheet. */
export const DESKTOP = "(min-width: 48rem)";

/**
 * A real mouse on a desktop-width viewport: the only place the custom cursor
 * earns its keep. `hover` and `pointer` together rule out touch and stylus,
 * where a lagging ring has nothing to follow.
 *
 * globals.css scopes `.cursor-target` to the same conditions, so the native
 * cursor is only ever taken away where the replacement actually renders.
 */
export const FINE_POINTER = `${DESKTOP} and (hover: hover) and (pointer: fine)`;
