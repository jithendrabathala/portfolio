"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { useCallback, useId, useMemo, useState } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/scroll/section";
import { type ArchNode, type ArchNodeKind, architecture } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/use-motion-scale";
import { cn } from "@/lib/utils";

/**
 * Interactive system diagram.
 *
 * The layout is computed from each node's grid coordinates rather than authored
 * as SVG paths, so repositioning a box in content is a number change and every
 * edge re-routes itself. Edges are drawn as elbow polylines in a viewBox that
 * scales with the container.
 */

/** viewBox units. Fixed so edge maths is resolution-independent. */
const CELL_W = 260;
const CELL_H = 150;
const NODE_W = 170;
const NODE_H = 66;

const KIND_LABEL: Record<ArchNodeKind, string> = {
  client: "client",
  edge: "edge",
  service: "service",
  queue: "stream",
  store: "storage",
  worker: "worker",
};

export function Architecture() {
  const [selected, setSelected] = useState<string>(architecture.nodes[0].id);
  const prefersReduced = usePrefersReducedMotion();
  // Gradients and markers live in <defs>; ids must be unique per instance.
  const uid = useId().replace(/:/g, "");

  const width = architecture.columns * CELL_W;
  const height = architecture.rows * CELL_H;

  const nodeById = useMemo(() => {
    const map = new Map<string, ArchNode>();
    for (const node of architecture.nodes) map.set(node.id, node);
    return map;
  }, []);

  /** Centre point of a node in viewBox units. */
  const centre = useCallback(
    (node: ArchNode) => ({
      x: node.col * CELL_W + CELL_W / 2,
      y: node.row * CELL_H + CELL_H / 2,
    }),
    [],
  );

  const selectedNode = nodeById.get(selected) ?? architecture.nodes[0];

  return (
    <Section id="architecture" className="py-32 sm:py-40">
      <Container>
        <div className="mb-4 flex items-end justify-between gap-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Architecture playground
          </h2>
          <span className="hidden font-mono text-[0.65rem] uppercase tracking-widest text-muted/60 sm:inline">
            {architecture.title}
          </span>
        </div>

        <p className="mb-10 max-w-2xl leading-relaxed text-muted text-pretty">
          {architecture.blurb}
        </p>

        <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          {/* Diagram */}
          <div className="relative border border-line bg-surface/40 p-3 backdrop-blur-sm sm:p-5">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-auto w-full overflow-visible"
              role="img"
              aria-label={`System diagram: ${architecture.title}`}
            >
              <title>{architecture.title}</title>

              <defs>
                <marker
                  id={`${uid}-arrow`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" className="fill-line" />
                </marker>
              </defs>

              {/* Edges first so nodes paint over their endpoints. */}
              {architecture.edges.map((edge) => {
                const from = nodeById.get(edge.from);
                const to = nodeById.get(edge.to);
                if (!from || !to) return null;

                const a = centre(from);
                const b = centre(to);
                // Elbow: travel horizontally to the midpoint, then vertically.
                const midX = (a.x + b.x) / 2;
                const points =
                  a.y === b.y
                    ? `${a.x},${a.y} ${b.x},${b.y}`
                    : `${a.x},${a.y} ${midX},${a.y} ${midX},${b.y} ${b.x},${b.y}`;

                const touchesSelected =
                  edge.from === selected || edge.to === selected;

                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <polyline
                      points={points}
                      fill="none"
                      strokeWidth={touchesSelected ? 2 : 1}
                      markerEnd={`url(#${uid}-arrow)`}
                      className={cn(
                        "transition-all duration-500",
                        touchesSelected ? "stroke-accent" : "stroke-line",
                      )}
                    />

                    {/* Packet travelling the edge. Pure SVG animation so it
                        costs no React renders and no rAF of ours. */}
                    {!prefersReduced && (
                      <circle
                        r={touchesSelected ? 4 : 2.5}
                        className={cn(
                          "transition-colors duration-500",
                          touchesSelected ? "fill-accent" : "fill-muted/50",
                        )}
                      >
                        <animateMotion
                          dur={touchesSelected ? "1.6s" : "3.2s"}
                          repeatCount="indefinite"
                          path={`M ${points.split(" ").join(" L ").replace(/,/g, " ")}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {architecture.nodes.map((node) => {
                const c = centre(node);
                const isSelected = node.id === selected;

                return (
                  /* Pointer-only enhancement: the "Components" buttons below are
                     the keyboard path to the same selection, so making these
                     groups focusable would add eight duplicate tab stops. */
                  // biome-ignore lint/a11y/noStaticElementInteractions: keyboard path is the button list below
                  <g
                    key={node.id}
                    transform={`translate(${c.x - NODE_W / 2}, ${c.y - NODE_H / 2})`}
                    className="cursor-pointer"
                    onClick={() => setSelected(node.id)}
                  >
                    <rect
                      width={NODE_W}
                      height={NODE_H}
                      rx={2}
                      className={cn(
                        "transition-all duration-300",
                        isSelected
                          ? "fill-accent/15 stroke-accent"
                          : "fill-bg/80 stroke-line hover:stroke-muted",
                      )}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    <text
                      x={NODE_W / 2}
                      y={NODE_H / 2 - 4}
                      textAnchor="middle"
                      className={cn(
                        "font-mono text-[15px] font-bold uppercase tracking-wider transition-colors",
                        isSelected ? "fill-fg" : "fill-muted",
                      )}
                    >
                      {node.label}
                    </text>
                    <text
                      x={NODE_W / 2}
                      y={NODE_H / 2 + 14}
                      textAnchor="middle"
                      className="fill-muted/60 font-mono text-[11px] uppercase tracking-widest"
                    >
                      {KIND_LABEL[node.kind]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Detail panel */}
          <div className="border border-line bg-surface/40 p-6 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <m.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-accent">
                  {KIND_LABEL[selectedNode.kind]}
                </span>
                <h3 className="mt-2 font-mono text-xl font-bold uppercase tracking-wider">
                  {selectedNode.label}
                </h3>
                <p className="mt-4 leading-relaxed text-muted text-pretty">
                  {selectedNode.detail}
                </p>
              </m.div>
            </AnimatePresence>

            {/* Real buttons, so the diagram is fully operable by keyboard —
                SVG <g> elements are not focusable and would strand keyboard
                users with a decorative picture. */}
            <div className="mt-8 border-t border-line pt-5">
              <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-widest text-muted/60">
                Components
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {architecture.nodes.map((node) => (
                  <li key={node.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(node.id)}
                      aria-pressed={node.id === selected}
                      className={cn(
                        "cursor-target border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest transition-colors",
                        node.id === selected
                          ? "border-accent text-fg"
                          : "border-line text-muted hover:border-muted hover:text-fg",
                      )}
                    >
                      {node.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
