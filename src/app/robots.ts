import type { MetadataRoute } from "next";
import { siteMeta } from "@/content/site";

/**
 * Generates /robots.txt at build time.
 *
 * The sitemap line is the point of the file — the allow rule is what a crawler
 * assumes anyway. Both URLs are absolute because robots.txt is fetched outside
 * the context of any page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteMeta.url}/sitemap.xml`,
    host: siteMeta.url,
  };
}
