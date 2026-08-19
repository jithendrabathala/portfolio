import type { MetadataRoute } from "next";
import { siteMeta } from "@/content/site";

/**
 * Generates /sitemap.xml at build time.
 *
 * One entry, because the site is one page — the sections are anchors, and
 * listing `#work` or `#contact` here would be noise a crawler discards. It
 * exists so robots.txt has something real to point at and so the root is
 * submittable to Search Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteMeta.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
