import type { Metadata } from "next";
import ResumeIndex from "@/components/resume/ResumeIndex";
import { PERSON } from "@/data/profile";
import { RESUMES } from "@/data/resumes";

export const metadata: Metadata = {
  title: "Resume",
  description:
    `${PERSON.name} resume, in ${RESUMES.length} versions by focus area: data analytics, applied ML, ` +
    "product, research, consulting and more. PDF and Word downloads.",
  alternates: { canonical: `${PERSON.site}/resume` },
};

export default function ResumePage() {
  return <ResumeIndex />;
}
