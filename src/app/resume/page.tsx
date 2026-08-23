import type { Metadata } from "next";
import ResumeView from "@/components/resume/ResumeView";
import { PERSON } from "@/data/profile";

export const metadata: Metadata = {
  title: "Resume",
  description:
    `${PERSON.name}, data science and machine learning resume. ` +
    "Experience, projects, education, awards and stack, with a PDF download.",
  alternates: { canonical: `${PERSON.site}/resume` },
};

export default function ResumePage() {
  return <ResumeView />;
}
