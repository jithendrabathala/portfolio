"use client";

import {
  Activity,
  Braces,
  ChartColumn,
  Code2,
  Container as ContainerIcon,
  Cpu,
  Database,
  Gauge,
  Layers,
  type LucideIcon,
  Network,
  Siren,
  Table2,
  Terminal,
  Waves,
  Webhook,
  Zap,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/scroll/section";
import { Marquee } from "@/components/ui/marquee";
import { type StackIcon, type StackItem, stack } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Icon per semantic key from content/site.ts. Typed as a total Record, so a new
 * key in the StackIcon union fails the build here rather than rendering nothing.
 */
const ICONS: Record<StackIcon, LucideIcon> = {
  code: Code2,
  types: Braces,
  systems: Cpu,
  script: Terminal,
  query: Table2,
  container: ContainerIcon,
  infra: Layers,
  stream: Waves,
  database: Database,
  cache: Zap,
  analytics: ChartColumn,
  network: Network,
  observability: Activity,
  performance: Gauge,
  api: Webhook,
  incident: Siren,
};

/**
 * Per-row durations, seconds. MagicUI's marquee is timed, not paced: --duration
 * is how long one copy takes to travel its own width, so a row with more items
 * moves faster at the same duration. These are tuned per row to land at a
 * similar apparent speed while keeping the rows out of lockstep.
 */
const ROW_DURATIONS = ["58s", "69s", "38s"];

/**
 * Marquee rows, alternating direction for a counter-scrolling texture.
 *
 * Items are chips rather than running text: the icons need a container to read
 * as deliberate, and a bounded shape stays legible while the row is moving.
 */
export function Stack() {
  return (
    <Section id="stack" className="py-32">
      <Container className="mb-14 flex items-end justify-between gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          Stack
        </h2>
        <span className="font-mono text-xs tabular-nums text-muted/60">
          {String(stack.reduce((n, row) => n + row.items.length, 0)).padStart(
            2,
            "0",
          )}{" "}
          tools
        </span>
      </Container>

      <div className="flex flex-col gap-10">
        {stack.map((row, i) => (
          <div key={row.group}>
            <Container className="mb-3 flex items-center gap-3">
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted/60">
                {row.group}
              </p>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
            </Container>

            {/* Edge fade is a mask, not a gradient overlay: the sections have
                no background of their own, so painting a bg-coloured fade here
                would punch two opaque blocks over the WebGL backdrop. */}
            <Marquee
              reverse={i % 2 === 1}
              pauseOnHover
              className={cn(
                "py-1 [--gap:0.75rem]",
                "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
              )}
              style={{ "--duration": ROW_DURATIONS[i] } as CSSProperties}
            >
              {row.items.map((item) => (
                <Chip key={item.name} item={item} />
              ))}
            </Marquee>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Chip({ item }: { item: StackItem }) {
  const Icon = ICONS[item.icon];

  return (
    <span
      // Named group, not a bare `group`. Marquee puts `group` on its own
      // wrapper for pauseOnHover, and an unnamed `group-hover:` here would
      // match that ancestor too — hovering anywhere in the row would pop every
      // icon in it at once.
      className={cn(
        "group/chip flex shrink-0 items-center gap-3 whitespace-nowrap",
        "border border-line bg-surface/40 px-5 py-3 backdrop-blur-sm",
        "transition-colors duration-300 hover:border-accent/60 hover:bg-surface",
      )}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-5 shrink-0 text-accent transition-transform duration-300 group-hover/chip:scale-110"
      />
      <span className="font-mono text-sm uppercase tracking-wider text-fg sm:text-base">
        {item.name}
      </span>
    </span>
  );
}
