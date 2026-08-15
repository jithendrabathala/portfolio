/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ALL SITE COPY LIVES HERE. This is the only file you need to edit to make the
 * site yours — no component contains hardcoded content.
 *
 * Everything below is PLACEHOLDER. Replace the strings, keep the shapes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Ordered section ids. Drives the scroll rail, the nav, and section tracking. */
export const SECTION_IDS = [
  "hero",
  "work",
  "architecture",
  "experience",
  "stack",
  "about",
  "journey",
  "oss",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const sections: { id: SectionId; label: string }[] = [
  { id: "hero", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "architecture", label: "Architecture" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "oss", label: "Open source" },
  { id: "contact", label: "Contact" },
];

export const profile = {
  name: "Jithendra Bathala",
  /** Short role line under the name. */
  role: "Software Engineer",
  /** One sentence. Shows in the hero and in metadata. */
  tagline: "I build systems that stay fast when they get big.",
  /** 2–3 sentences for the About section. */
  bio: [
    "I'm a software engineer focused on backend systems and the infrastructure around them. Most of my work lives where correctness and latency argue with each other — queues, caches, data pipelines, and the APIs on top.",
    "I care about the unglamorous parts: observability that tells you the truth, migrations that don't need a maintenance window, and code the next person can delete safely.",
  ],
  location: "India",
  /** Set to false to hide the availability pill. */
  available: true,
  availabilityNote: "Open to new work",
  email: "you@example.com",
} as const;

export type Project = {
  slug: string;
  title: string;
  /**
   * Card artwork. Placeholder SVGs live in public/projects/ — swap these for
   * real screenshots (any web image format works).
   */
  image: string;
  /** One line, shown on the card. */
  blurb: string;
  year: string;
  role: string;
  stack: string[];
  /** Headline outcomes. Keep to 2–3; they render as a small stat row. */
  metrics: { label: string; value: string }[];
  /** Paragraphs for the expanded detail overlay. */
  body: string[];
  /**
   * Both optional and independent — a project may have a live site, a public
   * repo, both, or neither. Omit the field entirely rather than passing "".
   */
  live?: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: "ledger-pipeline",
    image: "/projects/ledger-pipeline.svg",
    title: "Realtime Ledger Pipeline",
    blurb:
      "Rebuilt a nightly batch reconciliation into a streaming pipeline with exactly-once semantics.",
    year: "2025",
    role: "Lead engineer",
    stack: ["Go", "Kafka", "Postgres", "Kubernetes"],
    metrics: [
      { label: "Reconciliation lag", value: "6h → 900ms" },
      { label: "Throughput", value: "40k events/s" },
      { label: "Manual interventions", value: "−94%" },
    ],
    body: [
      "The existing system reconciled ledger entries in a nightly batch. Any mismatch surfaced the next morning, which meant a full day of downstream corrections and a standing rota to babysit it.",
      "I replaced it with a streaming pipeline built on Kafka, using a transactional outbox on the write path and idempotent consumers keyed on entry id. Exactly-once was the hard requirement — double-applying a ledger entry is not a bug you get to fix quietly.",
      "The migration ran both systems in parallel for six weeks, diffing outputs continuously until the streaming path matched the batch path on every entry. We cut over without a maintenance window.",
    ],
    live: "https://example.com",
    repo: "https://github.com/",
  },
  {
    slug: "edge-cache",
    image: "/projects/edge-cache.svg",
    title: "Multi-Region Edge Cache",
    blurb:
      "A read-through cache layer with per-tenant invalidation across five regions.",
    year: "2024",
    role: "Backend engineer",
    stack: ["Rust", "Redis", "gRPC", "Terraform"],
    metrics: [
      { label: "p99 read latency", value: "180ms → 12ms" },
      { label: "Origin load", value: "−87%" },
      { label: "Regions", value: "5" },
    ],
    body: [
      "Read traffic was hitting the primary database from every region, and the p99 was dominated by cross-ocean round trips rather than by query time.",
      "I built a read-through cache in Rust sitting in front of the data layer, with tag-based invalidation so a single tenant's write could evict precisely the affected keys without flushing a shared namespace.",
      "The interesting problem was invalidation ordering under partition: a naive design could resurrect stale data when a region rejoined. Versioned tags and a monotonic write clock made stale resurrection impossible rather than unlikely.",
    ],
    repo: "https://github.com/",
  },
  {
    slug: "schema-migrator",
    image: "/projects/schema-migrator.svg",
    title: "Zero-Downtime Schema Migrator",
    blurb:
      "An internal tool that plans and executes online Postgres migrations with automatic rollback.",
    year: "2024",
    role: "Creator",
    stack: ["TypeScript", "Postgres", "GitHub Actions"],
    metrics: [
      { label: "Migrations shipped", value: "300+" },
      { label: "Downtime incidents", value: "0" },
      { label: "Median review time", value: "−60%" },
    ],
    body: [
      "Schema changes were the single most common cause of incidents on the team — usually a lock taken on a large table during peak traffic.",
      "The tool parses a proposed migration, classifies each statement by the lock it will take, and rejects or rewrites the dangerous ones into safe multi-step equivalents. Adding a NOT NULL column becomes add-nullable, backfill in batches, add constraint NOT VALID, validate.",
      "It runs in CI, so unsafe migrations fail review rather than production. Three hundred migrations later, the downtime count is still zero.",
    ],
    live: "https://example.com",
  },
  {
    slug: "trace-explorer",
    image: "/projects/trace-explorer.svg",
    title: "Distributed Trace Explorer",
    blurb:
      "A query interface over sampled traces that makes tail latency legible.",
    year: "2023",
    role: "Backend engineer",
    stack: ["Python", "ClickHouse", "OpenTelemetry"],
    metrics: [
      { label: "Query p95", value: "8s → 400ms" },
      { label: "Traces indexed", value: "2B" },
      { label: "Teams onboarded", value: "12" },
    ],
    body: [
      "We had traces but no practical way to ask questions of them. Finding why the p99 moved meant scrolling through individual spans and guessing.",
      "I moved trace storage to ClickHouse with a schema designed around the queries people actually asked — group by endpoint, filter by duration percentile, compare against last week.",
      "The win was less about storage and more about the query vocabulary. Once 'show me what's different about the slow requests' became one query, teams started answering their own latency questions.",
    ],
  },
];

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  summary: string;
};

export const experience: ExperienceEntry[] = [
  {
    company: "Placeholder Systems",
    role: "Senior Software Engineer",
    period: "2024 — Present",
    summary:
      "Lead the data platform team. Own the streaming infrastructure and the reliability targets that hang off it.",
  },
  {
    company: "Example Labs",
    role: "Software Engineer",
    period: "2022 — 2024",
    summary:
      "Built backend services for a multi-tenant product. Took the API from a single region to five.",
  },
  {
    company: "Sample Co",
    role: "Junior Engineer",
    period: "2021 — 2022",
    summary:
      "Worked across the stack on internal tooling. Learned what production actually means.",
  },
];

/** Grouped for the marquee rows in the Stack section. */
export const stack: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Go", "Rust", "TypeScript", "Python", "SQL"],
  },
  {
    group: "Infrastructure",
    items: [
      "Kubernetes",
      "Terraform",
      "Kafka",
      "Postgres",
      "Redis",
      "ClickHouse",
    ],
  },
  {
    group: "Practice",
    items: [
      "Distributed systems",
      "Observability",
      "Performance",
      "API design",
      "Incident response",
    ],
  },
];

export const socials: { label: string; href: string }[] = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/in/" },
  { label: "Email", href: `mailto:${profile.email}` },
];

/**
 * Background audio. Swap these files for your own — keep both formats so
 * Safari and Chrome are each served something they decode natively.
 *
 * The bundled loop is generated, not licensed: layered sine partials whose
 * frequencies all complete whole cycles across its 32s length, which is why it
 * loops without a seam. Replace freely.
 */
export const audio = {
  mp3: "/audio/ambient.mp3",
  ogg: "/audio/ambient.ogg",
  title: "Ambient loop",
  /** Starting volume, 0–1. Users can change it; the choice is remembered. */
  defaultVolume: 0.3,
} as const;

/* ── Architecture playground ──────────────────────────────────────────────
 * An interactive system diagram. Nodes sit on a coarse grid (col/row) and the
 * component draws the edges, so moving a box is a number change, not a path
 * rewrite. Swap this for a system you actually built.
 */

export type ArchNodeKind =
  | "client"
  | "edge"
  | "service"
  | "queue"
  | "store"
  | "worker";

export type ArchNode = {
  id: string;
  label: string;
  kind: ArchNodeKind;
  /** Shown when the node is selected. */
  detail: string;
  /** Grid position, 0-indexed. */
  col: number;
  row: number;
};

export type ArchEdge = {
  from: string;
  to: string;
  label?: string;
};

export const architecture: {
  title: string;
  blurb: string;
  columns: number;
  rows: number;
  nodes: ArchNode[];
  edges: ArchEdge[];
} = {
  title: "Event-driven ledger",
  blurb:
    "Click any node. This is the shape most of my work takes — a write path that must never lose an event, and a read path that must never block on one.",
  columns: 4,
  rows: 3,
  nodes: [
    {
      id: "client",
      label: "Clients",
      kind: "client",
      col: 0,
      row: 1,
      detail:
        "Web and mobile callers. Every mutation carries an idempotency key so a retry after a timeout can never double-apply.",
    },
    {
      id: "gateway",
      label: "API Gateway",
      kind: "edge",
      col: 1,
      row: 1,
      detail:
        "Terminates TLS, authenticates, and rate-limits per tenant. Sheds load here rather than letting it reach the services.",
    },
    {
      id: "api",
      label: "Ledger API",
      kind: "service",
      col: 2,
      row: 0,
      detail:
        "Validates and writes entries in a single transaction with the outbox row. If the transaction commits, the event will be published — there is no window where one exists without the other.",
    },
    {
      id: "outbox",
      label: "Outbox → Kafka",
      kind: "queue",
      col: 2,
      row: 1,
      detail:
        "A poller tails the outbox table and publishes to Kafka, partitioned by account id so entries for one account stay strictly ordered.",
    },
    {
      id: "postgres",
      label: "Postgres",
      kind: "store",
      col: 3,
      row: 0,
      detail:
        "Source of truth. Append-only entries, balances derived by fold. Migrations run online — no maintenance window in three years.",
    },
    {
      id: "worker",
      label: "Reconciler",
      kind: "worker",
      col: 3,
      row: 1,
      detail:
        "Consumes the stream and continuously reconciles against the ledger. Consumers are idempotent and keyed on entry id, so replay is always safe.",
    },
    {
      id: "cache",
      label: "Read Cache",
      kind: "store",
      col: 2,
      row: 2,
      detail:
        "Read-through cache with tag-based invalidation. A single tenant's write evicts exactly the affected keys instead of flushing a shared namespace.",
    },
    {
      id: "reads",
      label: "Query API",
      kind: "service",
      col: 1,
      row: 2,
      detail:
        "Serves balances and history. Never blocks on the write path — a slow reconcile degrades freshness, not availability.",
    },
  ],
  edges: [
    { from: "client", to: "gateway" },
    { from: "gateway", to: "api", label: "write" },
    { from: "gateway", to: "reads", label: "read" },
    { from: "api", to: "postgres" },
    { from: "api", to: "outbox" },
    { from: "outbox", to: "worker" },
    { from: "worker", to: "postgres" },
    { from: "reads", to: "cache" },
    { from: "cache", to: "postgres" },
  ],
};

/* ── Journey timeline ─────────────────────────────────────────────────────
 * The narrative arc, distinct from `experience` (which is roles held).
 */

export type JourneyMilestone = {
  year: string;
  title: string;
  detail: string;
};

export const journey: JourneyMilestone[] = [
  {
    year: "2019",
    title: "First line of production code",
    detail:
      "A CRUD admin panel nobody asked for. Learned that shipping is a different skill from building.",
  },
  {
    year: "2021",
    title: "First on-call rotation",
    detail:
      "Paged at 3am for a deadlock I had written. Started caring about observability the same week.",
  },
  {
    year: "2022",
    title: "Went distributed",
    detail:
      "Took an API from one region to five and discovered every assumption that a single clock had been hiding.",
  },
  {
    year: "2024",
    title: "Streaming over batch",
    detail:
      "Replaced a nightly reconciliation with an exactly-once pipeline. Six weeks of parallel running before cutover.",
  },
  {
    year: "2025",
    title: "Leading a platform team",
    detail:
      "Less code, more design review. The interesting problems moved from the keyboard to the whiteboard.",
  },
];

/* ── Open source ──────────────────────────────────────────────────────────
 * Static so the page stays fully prerendered and never depends on the GitHub
 * API at request time. Update the numbers when you care to.
 */

export type Repository = {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
};

export const oss: {
  username: string;
  profileUrl: string;
  blurb: string;
  stats: { label: string; value: string }[];
  repositories: Repository[];
} = {
  username: "jithendrabathala",
  profileUrl: "https://github.com/",
  blurb:
    "Tools I extracted from problems I hit at work, then cleaned up enough to hand to someone else.",
  stats: [
    { label: "Repositories", value: "24" },
    { label: "Contributions", value: "1.4k" },
    { label: "Stars earned", value: "820" },
    { label: "Years active", value: "6" },
  ],
  repositories: [
    {
      name: "pgshift",
      description:
        "Online Postgres migrations that refuse to take a lock they cannot afford.",
      language: "TypeScript",
      stars: 412,
      forks: 28,
      url: "https://github.com/",
    },
    {
      name: "outbox-go",
      description:
        "Transactional outbox for Go services. Exactly-once publishing without a distributed transaction.",
      language: "Go",
      stars: 236,
      forks: 19,
      url: "https://github.com/",
    },
    {
      name: "tagcache",
      description:
        "Read-through cache with tag-based invalidation and partition-safe ordering.",
      language: "Rust",
      stars: 118,
      forks: 11,
      url: "https://github.com/",
    },
    {
      name: "traceql-lite",
      description: "A small query vocabulary for asking why the p99 moved.",
      language: "Python",
      stars: 54,
      forks: 6,
      url: "https://github.com/",
    },
  ],
};

export const siteMeta = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
  /** Set this once you have a domain; used for OG tags. */
  url: "https://example.com",
} as const;
