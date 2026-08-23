import type { MetadataRoute } from "next";
import { PERSON } from "@/data/profile";

/**
 * Generated at build time into out/robots.txt.
 *
 * Fully open. This is a portfolio during a job search, every crawler that
 * wants to index it, including the ones that feed AI search results, is doing
 * exactly what the site is for.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${PERSON.site}/sitemap.xml`,
    host: PERSON.site,
  };
}
