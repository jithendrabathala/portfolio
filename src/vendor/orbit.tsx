import type { ComponentType, CSSProperties } from "react";
import OrbitProjectsRaw from "./orbit-project.js";

/**
 * Typed wrapper around the vendored Framer component.
 *
 * `orbit-project.js` is published from Framer and carries no types, so the
 * import is cast once here rather than at each call site. The shape below is
 * transcribed from the module's own `addPropertyControls` definition, which is
 * the only contract it publishes.
 *
 * Every field is optional: the module ships DEFAULT_ITEMS and DEFAULT_CONTENT
 * and renders standalone.
 */

export type OrbitItem = {
  /** Plain image URL. */
  image?: string;
  label?: string;
  link?: string;
};

export type OrbitFont = {
  fontFamily?: string;
  fontSize?: number;
  variant?: string;
  lineHeight?: number;
  letterSpacing?: string;
  textAlign?: string;
};

export type OrbitContent = {
  showCopy?: boolean;
  textColor?: string;
  leftTitle?: string;
  rightTitle?: string;
  centerText?: string;
  centerTextWidth?: number;
  titleCenterGap?: number;
  compactTextGap?: number;
  desktopTitleFont?: OrbitFont;
  compactTitleFont?: OrbitFont;
  desktopCenterFont?: OrbitFont;
  tabletCenterFont?: OrbitFont;
  mobileCenterFont?: OrbitFont;
};

/**
 * Scroll and arc geometry. The component builds its own pin from these — an
 * outer section `scrollLength` viewport-heights tall wrapping a sticky 100svh
 * stage — so `scrollLength` is what decides how long the scene holds before
 * releasing to the next section.
 */
export type OrbitMotion = {
  /** Height of the pinned span, in vh. Floors at 120. Default 460. */
  scrollLength?: number;
  startOffset?: number;
  smoothness?: number;
  perspective?: number;
  curveWidth?: number;
  curveHeight?: number;
  depth?: number;
  rotation?: number;
  cardWidth?: number;
  offsetY?: number;
};

export type OrbitProjectsProps = {
  items?: OrbitItem[];
  background?: string;
  content?: OrbitContent;
  motion?: OrbitMotion;
  style?: CSSProperties;
};

const OrbitProjects =
  OrbitProjectsRaw as unknown as ComponentType<OrbitProjectsProps>;

export default OrbitProjects;
