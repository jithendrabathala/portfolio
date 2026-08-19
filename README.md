# Portfolio — Jithendra Bathala

A single-page personal portfolio built as a scroll-driven experience: a WebGL
backdrop, a pinned orbit gallery of project work, a timeline that fills as you
read it, and a boot-sequence splash on first load.

**Live:** https://jithendra.dpdns.org
**Source:** https://github.com/jithendrabathala/portfolio

---

## What's in it

| Section          | What it does                                                                     |
| ---------------- | -------------------------------------------------------------------------------- |
| **Hero**         | Per-character kinetic type that scatters away from the pointer, over a HUD frame |
| **Work**         | Six projects on a 3D orbit that flattens into a grid as you scroll               |
| **Architecture** | An interactive system diagram — click a node to read what it does                |
| **Experience**   | A timeline whose spine fills with scroll, with roles alternating either side     |
| **Stack**        | Counter-scrolling marquee rows of tools                                          |
| **About**        | Bio, with an SVG mask reveal effect                                              |
| **Open source**  | Repository cards with profile stats; star and fork counts show only when non-zero |
| **Contact**      | Links, résumé download, and a sign-off                                           |

Plus, throughout: a custom cursor, an ambient audio transport (`M` toggles it),
a section rail that doubles as navigation, and a case-study overlay that grows
out of the card you clicked via shared-layout animation.

## Built with

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) + **React 19**
- **TypeScript**
- **[Tailwind CSS v4](https://tailwindcss.com)** — configured in CSS, not a JS config file
- **[Framer Motion 13](https://motion.dev)** — scroll timelines, shared layout, springs
- **[React Three Fiber](https://r3f.docs.pmnd.rs)** + **three.js** — the background scene
- **[Zustand](https://zustand.docs.pmnd.rs)** — UI state (active section, open project, scene readiness)
- **[shadcn/ui](https://ui.shadcn.com)** + **Radix** — primitives
- **[Biome](https://biomejs.dev)** — lint and format

## Getting started

Requires **Node 22+** and **pnpm 11+** (the repo pins `pnpm@11.13.0` via
`packageManager`).

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

### Scripts

| Command       | What it does                                |
| ------------- | ------------------------------------------- |
| `pnpm dev`    | Dev server with Turbopack                   |
| `pnpm build`  | Production build (also runs the type check) |
| `pnpm start`  | Serve the production build                  |
| `pnpm lint`   | Biome check                                 |
| `pnpm format` | Biome format, writing in place              |

## Editing the content

**Everything you'd want to change lives in [`src/content/site.ts`](src/content/site.ts).**
No component contains hardcoded copy. That one file holds the profile, projects,
experience, stack, open-source list, architecture diagram nodes, section/nav
config, SEO keywords, and the audio settings — edit the strings and keep the
shapes.

A few of its conventions:

- `projects[].year`, `.metrics`, `.live`, and `.repo` are all optional. Omit a
  field entirely and its UI disappears rather than rendering empty.
- `sections` is the rail's dots — a deliberate subset of the page, not all of it.
- Project images go in `public/projects/`. Screenshots are 2560×1440; the orbit
  crops to a 1.48 aspect ratio.

## Project structure

```
src/
├── app/              # Layout, page, metadata, OG image, robots, sitemap, icon
├── components/
│   ├── sections/     # One file per page section
│   ├── scroll/       # Section tracking, scroll driver, progress rail
│   ├── motion/       # Reveal, magnetic, kinetic text, cursor
│   ├── canvas/       # React Three Fiber scene
│   ├── audio/        # Ambient player + transport
│   ├── loading/      # Boot-sequence splash
│   ├── layout/       # Container, viewport frame
│   └── ui/           # shadcn primitives
├── content/site.ts   # ← all copy and data
├── lib/              # Store, hooks, scroll signals, utils
└── vendor/           # Vendored Framer orbit component (see its header)
```

## Accessibility & motion

- `prefers-reduced-motion` is honoured through a single gate,
  [`useMotionScale()`](src/lib/use-motion-scale.ts), which components multiply
  their displacement by — so it's one number rather than a branch in every file.
  Fades survive; positional movement doesn't.
- The pinned orbit has a static grid fallback under reduced motion.
- The case-study overlay traps focus, restores it on close, and closes on Escape.
- Kinetic text exposes the real string to assistive tech rather than a per-letter
  soup.
- The splash renders content underneath it the whole time, has a hard 4s ceiling,
  and hides itself entirely without JavaScript.

## SEO

Metadata, Open Graph, Twitter cards, canonical URL, and `robots`/`sitemap`
routes are set up in [`src/app/layout.tsx`](src/app/layout.tsx),
[`robots.ts`](src/app/robots.ts), and [`sitemap.ts`](src/app/sitemap.ts).
JSON-LD `Person` structured data is emitted server-side and generated from
`site.ts`, so it can't drift from what the page shows. The OG image is generated
at build time by [`opengraph-image.tsx`](src/app/opengraph-image.tsx).

## Deployment

Deploys to [Vercel](https://vercel.com) with no configuration — it's a static
prerender, so any Node host works too.

The origin is set once, as `siteMeta.url` in
[`src/content/site.ts`](src/content/site.ts). It feeds `metadataBase`, the
canonical tag, the OG image URL, `robots.txt`, and `sitemap.xml` — so moving the
site to a different domain is that one line.

## Licence

No licence — all rights reserved. The content, copy, and imagery are personal.
