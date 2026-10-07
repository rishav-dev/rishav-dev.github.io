import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResumeDoc from "@/components/resume/ResumeDoc";
import { PERSON } from "@/data/profile";
import { RESUMES, resumeBySlug } from "@/data/resumes";

export function generateStaticParams() {
  return RESUMES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resume = resumeBySlug(slug);
  if (!resume) return { title: "Not found" };

  return {
    title: `${resume.title} resume`,
    description: `${PERSON.name} resume, ${resume.title}. ${resume.description}`,
    alternates: { canonical: `${PERSON.site}/resume/${resume.slug}` },
  };
}

export default async function ResumeVariantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resume = resumeBySlug(slug);
  if (!resume) notFound();
  return <ResumeDoc variant={resume} />;
}
