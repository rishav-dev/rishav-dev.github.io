import type { MetadataRoute } from "next";
import { PERSON, PROJECTS, ROLES } from "@/data/profile";

/**
 * Generated at build time into out/sitemap.xml.
 *
 * Every detail page is listed, because those are the pages that rank for
 * specific queries — someone searching "Copenhagen networks ERGM" or a company
 * name plus his, rather than for him by name.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${PERSON.site}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${PERSON.site}/resume/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...ROLES.map((r) => ({
      url: `${PERSON.site}/work/${r.slug}/`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...PROJECTS.map((p) => ({
      url: `${PERSON.site}/projects/${p.slug}/`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
