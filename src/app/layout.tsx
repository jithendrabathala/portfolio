import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AudioPlayer } from "@/components/audio/audio-player";
import { SceneRoot } from "@/components/canvas/scene-root";
import { ViewportFrame } from "@/components/layout/viewport-frame";
import { Splash } from "@/components/loading/splash";
import { Cursor } from "@/components/motion/cursor";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ChaosShortcut, Rail } from "@/components/scroll/rail";
import { ScrollDriver } from "@/components/scroll/scroll-driver";
import { siteMeta } from "@/content/site";
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
  // Required for the generated OG image to resolve to an absolute URL.
  // Update siteMeta.url in content/site.ts once the domain is real.
  metadataBase: new URL(siteMeta.url),
  title: siteMeta.title,
  description: siteMeta.description,
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    type: "website",
  },
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
          <ChaosShortcut />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
