"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import {
  Download,
  ExternalLink,
  Printer,
  FileText,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  BarChart,
  Sparkles,
  Eye,
} from "lucide-react";

const RESUME_FILE = "/Rishav_Chakravarty_Resume_DSA.pdf";
const RESUME_DOWNLOAD_NAME = "Rishav_Chakravarty_Resume.pdf";

const frostedCard =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(2,6,23,0.45)]";

const frostedOverlay =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/10 before:via-white/[0.03] before:to-cyan-500/10 before:opacity-80";

const contactLinks = [
  {
    label: "Email",
    value: "rishavchakra@umass.edu",
    href: "mailto:rishavchakra@umass.edu",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/rishav-dsc",
    href: "https://www.linkedin.com/in/rishav-dsc",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    value: "github.com/rishav-dev",
    href: "https://github.com/rishav-dev",
    icon: Github,
  },
  {
    label: "Website",
    value: "rishavchakravarty.com",
    href: "https://www.rishavchakravarty.com",
    icon: Globe,
  },
];

const resumeStats = [
  {
    value: "37%",
    label: "Increase in client inquiries",
    context: "Steve Fisher Consulting",
    icon: BarChart,
  },
  {
    value: "43%",
    label: "Administrative workload reduction",
    context: "Steve Fisher Consulting",
    icon: Briefcase,
  },
  {
    value: "40%",
    label: "Revenue increase",
    context: "Simple Coaching Inc.",
    icon: Sparkles,
  },
  {
    value: "93%",
    label: "Face-recognition model accuracy",
    context: "Independent ML project",
    icon: Code,
  },
];

const education = [
  {
    school: "University of Massachusetts Amherst",
    degree: "M.S. in Data Analytics & Computational Social Science",
    period: "Sep. 2025 – May 2027",
    location: "Amherst, MA",
  },
  {
    school: "The University of Texas at Austin",
    degree: "Postgraduate Diploma in Data Science & Business Analytics",
    period: "Jan. 2024 – Aug. 2024",
    location: "Austin, TX",
  },
  {
    school: "Virginia Tech",
    degree: "B.S. in Psychology, Minor in Computer Science",
    period: "Aug. 2021 – May 2024",
    location: "Blacksburg, VA",
  },
];

const skillGroups = [
  {
    title: "Languages",
    skills: ["Python", "R", "Java", "JavaScript", "MATLAB", "SQL", "Bash"],
  },
  {
    title: "Developer Tools",
    skills: [
      "VS Code",
      "Eclipse",
      "Google Cloud Platform",
      "Power BI",
      "MongoDB",
      "Microsoft SQL Server",
      "GitHub",
    ],
  },
  {
    title: "Frameworks",
    skills: [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "React.js",
      "Node.js",
      "Docker",
      "JUnit",
    ],
  },
];

const awards = [
  "The Action Taker Award",
  "KickStart VT Seed Grant Winner — CalendAI",
  "Future Founder Startup Award",
  "UPitch Spring 2026 Second Place Winner — Karnah",
];

export default function Resume() {
  const [loadError, setLoadError] = useState(false);

  const viewerSrc = useMemo(
    () => `${RESUME_FILE}#view=FitH&zoom=page-fit`,
    []
  );

  const handlePrint = () => {
    window.open(RESUME_FILE, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_34%),#020617] text-white">
      <Navigation />

      <div className="pointer-events-none absolute inset-0 data-grid opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

      {/* Header */}
      <section className="relative px-4 pb-12 pt-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className={`${frostedCard} ${frostedOverlay} px-6 py-10 text-center md:px-12 md:py-14`}
          >
            <div className="relative z-10">
              <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
                <FileText className="h-4 w-4" />
                Resume
              </div>

              <h1 className="bg-gradient-to-r from-cyan-200 via-white to-teal-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
                Rishav Chakravarty
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Data Analytics & Computational Social Science graduate student
                focused on data science, behavioral analytics, machine learning,
                and digital strategy.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  Amherst, MA
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                  <GraduationCap className="h-4 w-4 text-cyan-300" />
                  MS DACSS @ UMass Amherst
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Actions */}
      <section className="relative px-4 pb-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className={`${frostedCard} ${frostedOverlay} p-4`}
          >
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={RESUME_FILE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Open PDF
              </a>

              <a
                href={RESUME_FILE}
                download={RESUME_DOWNLOAD_NAME}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-teal-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/15 hover:text-white"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resume Overview */}
      <section className="relative px-4 pb-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {resumeStats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className={`${frostedCard} ${frostedOverlay} p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35`}
                >
                  <div className="relative z-10">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-cyan-300/30 to-transparent" />
                    </div>

                    <div className="bg-gradient-to-r from-cyan-200 to-teal-200 bg-clip-text text-4xl font-bold text-transparent">
                      {stat.value}
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-200">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                      {stat.context}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact + Snapshot */}
      <section className="relative px-4 pb-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`${frostedCard} ${frostedOverlay} p-6 lg:col-span-1`}
            >
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-white">
                  Contact Details
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Public-facing contact links from the resume.
                </p>

                <div className="mt-5 space-y-3">
                  {contactLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target={
                          link.href.startsWith("mailto:") ? undefined : "_blank"
                        }
                        rel={
                          link.href.startsWith("mailto:")
                            ? undefined
                            : "noopener noreferrer"
                        }
                        className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-3 transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
                      >
                        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-200">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            {link.label}
                          </p>
                          <p className="mt-1 break-words text-sm text-slate-300 group-hover:text-cyan-100">
                            {link.value}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`${frostedCard} ${frostedOverlay} p-6 lg:col-span-2`}
            >
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-white">
                  Resume Snapshot
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  The resume emphasizes applied analytics, digital strategy,
                  machine learning projects, Power BI dashboards, and a
                  technical foundation across Python, SQL, JavaScript, React,
                  Node.js, and data-science libraries.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {education.map((item) => (
                    <div
                      key={item.school}
                      className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 backdrop-blur-xl"
                    >
                      <div className="mb-3 flex items-center gap-2 text-cyan-200">
                        <GraduationCap className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.18em]">
                          Education
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-white">
                        {item.school}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {item.degree}
                      </p>
                      <p className="mt-3 text-xs text-slate-500">
                        {item.period}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills + Awards */}
      <section className="relative px-4 pb-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {skillGroups.map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className={`${frostedCard} ${frostedOverlay} p-6`}
              >
                <div className="relative z-10">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                      <Code className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      {group.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className={`${frostedCard} ${frostedOverlay} mt-6 p-6`}
          >
            <div className="relative z-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-amber-200">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Honors & Awards
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Selected awards listed on the resume.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {awards.map((award) => (
                  <div
                    key={award}
                    className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-300 backdrop-blur-xl"
                  >
                    <div className="mb-2 flex items-center gap-2 text-amber-200">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-[0.18em]">
                        Recognition
                      </span>
                    </div>
                    {award}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preview */}
      <section className="relative px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-8 text-center"
          >
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
              <Eye className="h-4 w-4" />
              PDF Preview
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Latest Resume
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Preview the resume inline, or use the buttons above to download,
              print, or open it in a new tab.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="group relative"
          >
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-cyan-300 to-teal-300 opacity-20 blur-xl transition-opacity group-hover:opacity-30" />

            <div className={`${frostedCard} ${frostedOverlay} relative p-3 md:p-5`}>
              <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
                <div className="relative w-full" style={{ paddingTop: "129%" }}>
                  <object
                    key={viewerSrc}
                    data={viewerSrc}
                    type="application/pdf"
                    className="absolute inset-0 h-full w-full"
                    onLoad={() => setLoadError(false)}
                    onError={() => setLoadError(true)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 p-6 text-center">
                      <div>
                        <p className="mb-5 text-sm text-slate-300">
                          Inline preview is not available in this browser.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <a
                            href={RESUME_FILE}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open PDF
                          </a>

                          <a
                            href={RESUME_FILE}
                            download={RESUME_DOWNLOAD_NAME}
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-teal-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  </object>
                </div>
              </div>
            </div>
          </motion.div>

          {loadError && (
            <div className="mt-5 rounded-2xl border border-red-300/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100">
              Could not load{" "}
              <span className="font-semibold text-white">{RESUME_FILE}</span>.
              Make sure the PDF exists under{" "}
              <code className="rounded bg-slate-950/50 px-1.5 py-0.5 text-white">
                /public
              </code>{" "}
              and that the filename matches exactly.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}