import { About } from "@/components/sections/about";
import { Architecture } from "@/components/sections/architecture";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
// import { Journey } from "@/components/sections/journey";
import { Oss } from "@/components/sections/oss";
import { ProjectDetail } from "@/components/sections/project-detail";
import { Stack } from "@/components/sections/stack";
import { Work } from "@/components/sections/work";

/**
 * Server Component. Every section below is a client leaf — the page itself
 * ships no JavaScript of its own.
 *
 * Order is deliberate: proof first (work, then the architecture behind it),
 * then credentials, then the person, then the code. Section ids and their
 * order also live in content/site.ts, which drives the scroll rail.
 *
 * Journey is parked: Experience now carries the timeline treatment, and two
 * spines on one page read as a repeat rather than a new idea.
 */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Work />
        <Architecture />
        <Experience />
        <Stack />
        <About />
        {/* <Journey /> */}
        <Oss />
        <Contact />
        <ProjectDetail />
      </main>
      {/* Outside <main>: it is the document's footer, not page content. */}
      <Footer />
    </>
  );
}
