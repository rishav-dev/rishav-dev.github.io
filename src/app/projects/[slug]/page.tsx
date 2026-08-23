import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Detail from "@/components/detail/Detail";
import { PROJECTS } from "@/data/profile";

/* Same hue order as the project grid on the index, so a card and its page are
   the same colour. */
const HUES = ["--cyan", "--amber", "--indigo", "--lime"];

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Not found" };

  return {
    title: project.name,
    description: project.summary,
    openGraph: { title: project.name, description: project.summary },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = PROJECTS[index];
  const prev = PROJECTS[index - 1];
  const next = PROJECTS[index + 1];

  return (
    <Detail
      hue={HUES[index % HUES.length]}
      eyebrow={`${project.context} · ${project.year}`}
      title={project.name}
      subtitle={project.summary}
      backHref="/#projects"
      backLabel="All projects"
      meta={[
        { label: "Context", value: project.context },
        { label: "Year", value: project.year },
        { label: "Method", value: project.stack[0] ?? "n/a" },
      ]}
      metrics={project.result ? [project.result] : []}
      body={project.detail}
      table={project.table}
      stack={project.stack}
      /* Repo first. It is the thing that makes everything above it checkable. */
      links={[
        ...(project.repo
          ? [{ label: "View the code on GitHub", href: project.repo, kind: "repo" as const }]
          : []),
        ...(project.source
          ? [{ label: project.source.label, href: project.source.href, kind: "data" as const }]
          : []),
      ]}
      siblings={[
        ...(prev ? [{ href: `/projects/${prev.slug}`, label: prev.name, dir: "prev" as const }] : []),
        ...(next ? [{ href: `/projects/${next.slug}`, label: next.name, dir: "next" as const }] : []),
      ]}
    />
  );
}
