import type { Metadata } from "next";
import LabShell from "@/components/lab/LabShell";
import { labHtml } from "@/lab/html";
import { labPage } from "@/lab/pages";

const page = labPage("physics-check");

export const metadata: Metadata = { title: page.title, description: page.description };

export default function Page() {
  return <LabShell page={page} html={labHtml(page.slug)} />;
}
