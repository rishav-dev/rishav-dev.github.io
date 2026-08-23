import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Detail from "@/components/detail/Detail";
import { ROLES } from "@/data/profile";

/* Newest first, so "previous" and "next" walk the career in the same order the
   index lists it. */
const ordered = [...ROLES].sort((a, b) => b.order - a.order);

/* One hue per role, walked along the site's spectrum. */
const HUES = ["--cyan", "--indigo", "--violet", "--lime", "--amber", "--magenta"];

export function generateStaticParams() {
  return ROLES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = ROLES.find((r) => r.slug === slug);
  if (!role) return { title: "Not found" };

  return {
    title: `${role.title} at ${role.org}`,
    description: role.summary,
    openGraph: { title: `${role.title} at ${role.org}`, description: role.summary },
  };
}

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = ordered.findIndex((r) => r.slug === slug);
  if (index === -1) notFound();

  const role = ordered[index];
  const prev = ordered[index - 1];
  const next = ordered[index + 1];

  return (
    <Detail
      hue={HUES[index % HUES.length]}
      eyebrow={role.kind === "speaking" ? "Speaking" : "Experience"}
      title={role.org}
      subtitle={role.summary}
      backHref="/#work"
      backLabel="All work"
      meta={[
        { label: "Role", value: role.title },
        { label: "Dates", value: `${role.start} – ${role.end}` },
        { label: "Location", value: role.place },
      ]}
      did={role.did}
      body={role.detail}
      stack={role.stack}
      links={
        role.orgHref
          ? [{ label: role.org, href: role.orgHref, kind: "site" as const }]
          : []
      }
      siblings={[
        ...(prev ? [{ href: `/work/${prev.slug}`, label: prev.org, dir: "prev" as const }] : []),
        ...(next ? [{ href: `/work/${next.slug}`, label: next.org, dir: "next" as const }] : []),
      ]}
    />
  );
}
