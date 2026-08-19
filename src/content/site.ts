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

/**
 * The rail's dots — a deliberate subset, not the full page.
 *
 * Architecture, Stack, and Open source still render (see app/page.tsx); they
 * are simply not destinations worth a dot, and a rail with eight of them stops
 * reading as navigation. Scrolling through one leaves every dot inactive,
 * which is correct: the progress bar above them still tracks position.
 */
export const sections: { id: SectionId; label: string }[] = [
  { id: "hero", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
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
  /** Closing line under the contact links. Sits after the location. */
  signoff: "Happiest when the graph goes up and the latency doesn't",
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
  /**
   * Optional. Omit it entirely for work with no meaningful single date — the
   * card slot and the ` · ` separator in the detail header both disappear
   * rather than rendering a dangling divider.
   */
  year?: string;
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
  {
    slug: "file-storage-system",
    image: "/projects/file-storage-system.svg",
    title: "File Storage System",
    blurb:
      "A distributed, S3-compatible object store with automatic image and video transformation, deployable to Lambda, Azure, GCP, or your own servers from one codebase.",
    year: "2026",
    role: "Solo — design & build",
    stack: ["TypeScript", "Express", "RabbitMQ", "Terraform", "Docker", "AWS"],
    metrics: [
      { label: "API", value: "S3-compatible" },
      { label: "Deploy targets", value: "4" },
      { label: "Transforms", value: "Image + video" },
    ],
    body: [
      "Storage decisions tend to be one-way doors: pick a provider, and the SDK calls spread through the codebase until moving costs a rewrite. This is a storage layer that speaks the S3 API — buckets, objects, multipart upload, presigned URLs — so anything already written against S3 keeps working, while the thing underneath stays swappable.",
      "The same codebase deploys to AWS Lambda, Azure Functions, GCP Cloud Functions, or a physical server. Terraform provisions each target and Ansible handles the on-prem path; locally the whole system comes up under Docker Compose.",
      "Transformation is the part that can't be inline. Uploads return as soon as the object lands, and image work (Sharp) and video work (FFmpeg) go through RabbitMQ instead — which also gives bulk ingest of thousands of files and chunked uploads with automatic reassembly somewhere to run without holding a request open.",
      "Built solo, end to end. The source is on GitHub.",
    ],
    repo: "https://github.com/jithendrabathala/file-storage-system",
  },
  {
    slug: "visionicx",
    image: "/projects/visionicx.png",
    title: "VisionicX",
    blurb:
      "A campus management platform for schools and colleges — academics, fees, transport, hostel, HR and finance behind one login, wired to the attendance, CCTV and energy hardware already on site.",
    year: "2023 — 2025",
    role: "Full-stack developer",
    stack: ["React", "NestJS", "Postgres", "Android"],
    metrics: [
      { label: "Modules", value: "18+" },
      { label: "Platforms", value: "Web + Android" },
      { label: "Access", value: "Role-based" },
    ],
    body: [
      "Schools rarely run one system. They run a fee package, a separate attendance register, a transport sheet, a hostel ledger, and a WhatsApp group holding it together — and none of them agree with each other. VisionicX replaces that with a single platform where academics, fees, transport, library, hostel, HR, and finance are modules of one product rather than five procurement decisions.",
      "Every stakeholder gets one login and sees only their slice: an admin configures policies and permissions, a teacher works a class, a parent sees their own children's attendance, marks, fees, and announcements and nothing else. Permissions are role-based with audit logs, which matters when the data is minors' records and money.",
      "The part that isn't ordinary CRUD is the campus itself. The platform integrates with biometric, RFID, and face-recognition attendance devices, AI CCTV for safety alerts, and energy monitoring on single- and three-phase panels — so the dashboard reflects the building, not just what someone typed into it. A React front end sits on NestJS services over Postgres, with Android apps for staff and parents.",
      "Built with the team at VisionariesAI. Live at visionicx.com.",
    ],
    live: "https://visionicx.com",
  },
  {
    slug: "apnakartz-billing",
    image: "/projects/apnakartz-billing.png",
    title: "ApnaKartz Billing",
    blurb:
      "A multi-company billing and inventory platform for Indian businesses — quotation to invoice, stock that moves when documents convert, and GSTR-1 that falls out of the ledger instead of a spreadsheet.",
    year: "2024 — 2026",
    role: "Solo — design & build",
    stack: ["React", "Redux Toolkit", "Node.js", "Express", "Postgres", "GST"],
    metrics: [
      { label: "Tenancy", value: "Multi-company" },
      { label: "Filing", value: "GSTR-1 + HSN" },
      { label: "Roles", value: "3 tiers" },
    ],
    body: [
      "Small distributors run on documents that turn into other documents: a quotation becomes a pre-order, a pre-order becomes a purchase order, a purchase order becomes a delivery challan, and somewhere in there stock is supposed to move. Most billing software treats those as separate forms and leaves the arithmetic to the person at the counter. Here each conversion is a first-class action, and stock adjusts on the conversion that actually means goods changed hands.",
      "Compliance is the reason this class of software exists in India, so GST is built into the ledger rather than bolted on at filing time. Invoices carry GSTIN and HSN/SAC codes, and GSTR-1 — including the B2B and B2C HSN summaries — is generated from the same records that produced the invoices, so filing is a read rather than a reconciliation.",
      "One account can hold several companies, each with its own books, staff, and permissions across three role tiers. Invoices print through a template designer where the layout, visibility, and ordering of every block on the document is configurable on a live mockup — because no two businesses agree on what an invoice should look like, and a hardcoded template is a support ticket per customer.",
      "There's a second half for personal finance: loans with interest ledgers on both sides of a lend, insurance policies, rentals, vehicles, and construction projects tracked alongside the business books. Built solo — React and Redux Toolkit on the front, an Express API over Postgres behind it, Recharts for reporting, and client-side PDF generation for every document.",
    ],
    live: "https://billing.apnakartz.com",
  },
  {
    slug: "peptipharmarx",
    image: "/projects/peptipharmarx.png",
    title: "PeptiPharmaRX",
    blurb:
      "A B2B application site for a US peptide supplier — one scroll that qualifies a licensed practice and hands it to a form, rather than a storefront.",
    year: "2026",
    role: "Frontend developer",
    stack: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Vercel"],
    // No metrics: the numbers on the page are the client's business claims,
    // not outcomes I measured, so the stat row stays off.
    body: [
      "PeptiPharmaRX supplies peptides to licensed medical practices, not to patients — which makes this the rare landing page whose job is to turn most of its visitors away. The whole page is built around one question: does the reader run a registered practice? Everything else exists to get a qualified one to the application form.",
      "So the structure is a single scroll rather than a catalogue: the claim, the proof numbers, the compounds carried, the three things an applicant needs, and the supply-chain promise — then an embedded application form. The visual register is deliberately closer to a clinical brand than a consumer store, because the reader is a practitioner deciding whether to trust a supplier.",
      "Built in the Next.js App Router with Tailwind and Framer Motion, prerendered and served from Vercel so the first paint is static and the motion only starts once a section is actually in view.",
    ],
    live: "https://book.peptipharmarx.com",
  },
];

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  /** Optional. Rendered after the company, separated by a middot. */
  location?: string;
  /** One line framing the role. */
  summary: string;
  /**
   * Optional. The specifics worth quoting — rendered as unmarked lines rather
   * than a bulleted list, because the timeline alternates sides and markers on
   * right-aligned text read as debris.
   */
  highlights?: string[];
};

export const experience: ExperienceEntry[] = [
  {
    company: "Prismex Technologies Pvt Ltd",
    role: "Junior Fullstack Developer",
    period: "Oct 2025 — Mar 2026",
    location: "Hyderabad, India",
    summary:
      "Backend services in Java and Spring Boot, and the end-to-end build of Voisely.ai — system design through to the React front end.",
    highlights: [
      "Architected and built Voisely.ai end to end: system design, the scalable architecture under it, and a React front end over the backend APIs.",
      "Cut overall response times by 80% through query optimization, caching, and backend work.",
      "Held API latency under 40 ms, with database queries down to single-digit milliseconds.",
      "Moved the deployment from serverless to serverful on AWS EC2, which is where the reliability came from.",
    ],
  },
  {
    company: "Edurup School of Business",
    role: "Software Development Engineer Intern",
    period: "Jun 2025 — Aug 2025",
    location: "Remote, India",
    summary:
      "Built the backend architecture for a learning management system, and the React components sitting on top of it.",
    highlights: [
      "Designed a scalable LMS backend — REST APIs over modular services.",
      "Developed React components for the learner-facing app.",
      "Added caching and backend optimizations to bring response times down.",
      "Improved SEO and load performance across the landing pages.",
    ],
  },
  {
    company: "Imminity Pvt Ltd",
    role: "Front-End Developer Intern",
    period: "Jun 2024 — Jan 2025",
    location: "Remote, India",
    summary:
      "Front-end work across a live consumer app, an internal e-commerce platform, and the dashboards behind both.",
    highlights: [
      "Improved and productionized the ParentG app — features, fixes, and a stable live release.",
      "Built front-end modules for an internal e-commerce platform.",
      "Developed internal dashboards for analytics and operational use.",
    ],
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
      { name: "RabbitMQ", icon: "stream" },
      { name: "AWS", icon: "infra" },
      { name: "Terraform", icon: "infra" },
      { name: "Kubernetes", icon: "container" },
      { name: "Docker", icon: "container" },
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
  { label: "GitHub", href: "https://github.com/jithendrabathala" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jithendra-bathala/",
  },
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
  /**
   * Both optional. A repo with no traction yet renders its language and
   * nothing else — advertising a row of zeroes reads worse than omitting the
   * counts, and setting a number brings the chip back.
   */
  stars?: number;
  forks?: number;
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
  profileUrl: "https://github.com/jithendrabathala",
  blurb:
    "Tools I extracted from problems I hit at work, then cleaned up enough to hand to someone else.",
  stats: [
    { label: "Repositories", value: "58" },
    { label: "Followers", value: "18" },
    { label: "Languages", value: "5" },
    { label: "Since", value: "2020" },
  ],
  repositories: [
    {
      name: "file-storage-system",
      description:
        "A distributed, S3-compatible object store with queue-driven image and video transformation. One codebase, deployed to Lambda, Azure, GCP, or your own hardware.",
      language: "TypeScript",
      url: "https://github.com/jithendrabathala/file-storage-system",
    },
    {
      name: "express-ts-template",
      description:
        "An Express 5 and TypeScript starter carrying the parts you always end up adding anyway: Drizzle over Postgres, Zod schemas that generate their own OpenAPI reference, argon2, JWTs, and structured logging.",
      language: "TypeScript",
      url: "https://github.com/jithendrabathala/express-ts-template",
    },
    {
      name: "serverless-mailer-app",
      description:
        "A small Hono mail API built to deploy serverless — Zod-validated payloads, Nodemailer transport, nothing else in the way.",
      language: "TypeScript",
      url: "https://github.com/jithendrabathala/serverless-mailer-app",
    },
    {
      name: "snap-to-focus",
      description:
        "Fourteen lines of Hammerspoon that move the pointer to whichever window just took focus — so the scroll wheel finally hits the window you're actually working in.",
      language: "Lua",
      url: "https://github.com/jithendrabathala/snap-to-focus",
    },
    {
      name: "nvim-config",
      description:
        "My Neovim setup, written from scratch on lazy.nvim rather than forked from a distro — every plugin in it is one I went looking for.",
      language: "Lua",
      url: "https://github.com/jithendrabathala/nvim-config",
    },
    {
      name: "portfolio",
      description:
        "This site. Next.js with scroll-driven sections, and every line of copy in a single content file.",
      language: "TypeScript",
      url: "https://github.com/jithendrabathala/portfolio",
    },
  ],
};

export const siteMeta = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
  /**
   * The canonical origin. No trailing slash — it is concatenated in robots.ts
   * and used as the sitemap's single entry, and a double slash there is the
   * kind of thing a crawler quietly holds against you.
   */
  url: "https://jithendra.dpdns.org",
  /**
   * Search keywords. Worth setting straight: Google has ignored the keywords
   * meta tag for well over a decade, so this earns nothing there. It is still
   * read by some other engines and by link-preview scrapers, and it costs one
   * line — but the ranking work is done by the title, description, headings,
   * and the JSON-LD in app/layout.tsx, not by this array.
   */
  keywords: [
    "Jithendra Bathala",
    "software engineer",
    "full stack developer",
    "backend engineer",
    "TypeScript",
    "React",
    "Next.js",
    "NestJS",
    "Node.js",
    "Java",
    "Spring Boot",
    "Postgres",
    "AWS",
    "system design",
    "portfolio",
    "Hyderabad",
    "India",
  ],
} as const;
