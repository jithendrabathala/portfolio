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
  // Journey is not rendered (see app/page.tsx) but stays in the union so the
  // parked section and its mood keep type-checking.
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
  // { id: "journey", label: "Journey" },
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
  email: "jithendrabathala@gmail.com",
  phone: "+91 90520 46768",
  /** Served straight out of public/. Set to null to hide the download button. */
  resume: "/resume.pdf",
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
  /**
   * Headline outcomes. Keep to 2–3; they render as a small stat row. Omit the
   * field entirely for a project with no numbers worth quoting — the row (and
   * its rules) disappears rather than rendering empty.
   */
  metrics?: { label: string; value: string }[];
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
    slug: "voisely",
    image: "/projects/voisely.png",
    title: "Voisely.ai",
    blurb:
      "An AI calling agent that answers business calls in natural, multilingual speech — taking orders and bookings, and routing what it can't resolve to a human.",
    year: "2025 — 2026",
    role: "Team lead & developer",
    stack: ["React", "Express", "LangChain", "RAG", "Kubernetes", "Redis"],
    // No metrics: nothing measured is public yet. The stat row hides itself.
    body: [
      "Voisely picks up inbound calls for businesses that can't staff a phone line around the clock. It answers in natural, multilingual speech, handles orders and bookings end to end, and hands anything outside its remit to a person on the team rather than guessing.",
      "The agent is grounded rather than freewheeling: retrieval over each business's own catalogue, hours, and policies means the answers come from their documents instead of the model's general knowledge. LangChain orchestrates retrieval and tool calls; a React front end handles configuration and call review, with an Express API behind it.",
      "Call handling has to stay responsive while slower work — transcription, follow-ups, downstream syncs — happens off the critical path, so that work moves through Redis queues and the whole system runs on Kubernetes. Customer data stays inside the tenant's own boundary by design.",
      "I led the team and built across the stack. Launching at voisely.ai.",
    ],
  },
  {
    slug: "wisein",
    image: "/projects/wisein.png",
    title: "WiseIN",
    blurb:
      "An invite-only professional network where every member is government-verified, and conversations happen over video instead of cold DMs.",
    year: "2025 — 2026",
    role: "Team lead & developer",
    stack: ["Next.js", "NestJS", "Postgres", "AWS", "CircleCI"],
    metrics: [
      { label: "Verified members", value: "700+" },
      { label: "Countries", value: "9" },
      { label: "Access", value: "Invite-only" },
    ],
    body: [
      "Professional networks have an authenticity problem: anyone can claim anything, and the inbox fills with cold outreach from accounts nobody can vouch for. WiseIN starts from the opposite premise — you don't get in until you prove you're real.",
      "Verification runs through Aadhaar and DigiLocker for members in India, and Stripe Identity for everyone else. That single constraint changes the product downstream: because identity is settled at the door, the network can lead with video meetings between members rather than text-based outreach.",
      "The front end is Next.js, the services are NestJS over Postgres, and the whole thing runs on AWS with CircleCI shipping it. The verification flows were the demanding part — third-party identity providers fail in more interesting ways than they document, and a member half-verified is a state the system has to hold safely.",
      "I led the team and built across the stack. It's live at wisein.in with 700+ verified members across 9 countries.",
    ],
    live: "https://wisein.in",
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

/**
 * Icon vocabulary for the Stack section.
 *
 * Deliberately semantic ("cache") rather than per-vendor ("redis") — Lucide
 * ships no brand marks, and a concept vocabulary means swapping the items below
 * rarely needs a new icon. Keys map to components in sections/stack.tsx, which
 * is exhaustive over this union, so adding a key here is a type error until the
 * icon is picked there.
 */
export type StackIcon =
  | "code"
  | "types"
  | "systems"
  | "script"
  | "query"
  | "container"
  | "infra"
  | "stream"
  | "database"
  | "cache"
  | "analytics"
  | "network"
  | "observability"
  | "performance"
  | "api"
  | "incident";

export type StackItem = { name: string; icon: StackIcon };

/** Grouped for the marquee rows in the Stack section. */
export const stack: { group: string; items: StackItem[] }[] = [
  {
    group: "Languages & Frameworks",
    items: [
      { name: "TypeScript", icon: "types" },
      { name: "React", icon: "code" },
      { name: "Next.js", icon: "code" },
      { name: "Node.js", icon: "script" },
      { name: "NestJS", icon: "api" },
      { name: "Express", icon: "api" },
    ],
  },
  {
    group: "Data & Infrastructure",
    items: [
      { name: "Postgres", icon: "database" },
      { name: "Redis", icon: "cache" },
      { name: "AWS", icon: "infra" },
      { name: "Kubernetes", icon: "container" },
      { name: "CircleCI", icon: "stream" },
      { name: "SQL", icon: "query" },
    ],
  },
  {
    group: "AI & Practice",
    items: [
      { name: "LangChain", icon: "network" },
      { name: "RAG", icon: "analytics" },
      { name: "Voice agents", icon: "observability" },
      { name: "API design", icon: "performance" },
    ],
  },
];

export const socials: { label: string; href: string }[] = [
  // TODO: real profile URLs still needed.
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/in/" },
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "Phone", href: `tel:${profile.phone.replace(/\s/g, "")}` },
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
