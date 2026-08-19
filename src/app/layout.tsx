import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AudioPlayer } from "@/components/audio/audio-player";
import { SceneRoot } from "@/components/canvas/scene-root";
import { ViewportFrame } from "@/components/layout/viewport-frame";
import { Splash } from "@/components/loading/splash";
import { Cursor } from "@/components/motion/cursor";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Rail } from "@/components/scroll/rail";
import { ScrollDriver } from "@/components/scroll/scroll-driver";
import { profile, siteMeta, socials } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Required for the generated OG image and the canonical URL to resolve to
  // absolute URLs. Every absolute URL on the site derives from siteMeta.url in
  // content/site.ts, so a domain change is one line there.
  metadataBase: new URL(siteMeta.url),
  title: siteMeta.title,
  description: siteMeta.description,
  keywords: [...siteMeta.keywords],
  authors: [{ name: profile.name, url: siteMeta.url }],
  creator: profile.name,
  // Single page, so the canonical is simply the root. Without it, any URL
  // carrying a tracking or anchor query string can be indexed as a duplicate.
  alternates: { canonical: "/" },
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    url: siteMeta.url,
    siteName: profile.name,
    locale: "en_US",
    type: "profile",
    // Images are supplied by app/opengraph-image.tsx, which Next discovers by
    // file convention — listing them here as well would emit them twice.
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // The icon files (app/icon.svg, app/favicon.ico) are picked up by file
  // convention; declaring them here would duplicate the link tags.
};

/**
 * Structured data. This is the part of the SEO work that actually earns
 * something: it tells a crawler the page is a person rather than guessing from
 * prose, and it is what feeds name-search results and knowledge panels.
 *
 * Kept in sync with content/site.ts by construction rather than by hand.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.tagline,
  url: siteMeta.url,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  address: { "@type": "PostalAddress", addressCountry: profile.location },
  sameAs: socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  knowsAbout: [...siteMeta.keywords],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Next 16 stopped overriding scroll-behavior during navigation. This
      // attribute opts back into the snap-to-top behaviour, so the smooth
      // scrolling set in globals.css applies to anchors without also making
      // future route changes animate. See docs: upgrading/version-16.
      data-scroll-behavior="smooth"
      // `dark` is static, not toggled: the site has no light mode (see the
      // colorScheme in viewport). shadcn's tokens live behind a `.dark` variant,
      // so without this class its components render their light palette against
      // this dark page.
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-fg">
        {/* Emitted server-side so a crawler sees it in the initial HTML. The
            JSON is generated from the same content the page renders, so the
            two cannot drift apart. */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: the documented way to emit JSON-LD; the payload is our own static content, never user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        {/* The splash is dismissed by JS, so without JS nothing would ever
            remove it. Hide it outright in that case rather than trapping the
            visitor behind a loading screen that never finishes. */}
        <noscript>
          <style>{"[data-splash]{display:none !important}"}</style>
        </noscript>

        <MotionProvider>
          <Splash />
          {/* Mounted once, outside the page tree, so the background and the
              scroll timeline are continuous for the life of the document. */}
          <ScrollDriver />
          <SceneRoot />
          <Cursor />
          <Rail />
          <ViewportFrame />
          <AudioPlayer />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
