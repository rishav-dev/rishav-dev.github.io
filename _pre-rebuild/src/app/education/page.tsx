"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import {
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  BookOpen,
  BarChart,
  Brain,
  Database,
  Code,
  Sparkles,
} from "lucide-react";
import type { ComponentType } from "react";

type IconType = ComponentType<{ className?: string }>;

type EducationItem = {
  degree: string;
  field: string;
  school: string;
  location: string;
  period: string;
  status?: string;
  description: string;
  color: string;
  skills: string[];
  highlights: string[];
};

type CourseworkGroup = {
  title: string;
  icon: IconType;
  items: string[];
};

type AcademicHighlight = {
  title: string;
  description: string;
  icon: IconType;
  color: string;
};

const frostedCard =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(2,6,23,0.45)]";

const frostedOverlay =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/10 before:via-white/[0.03] before:to-cyan-500/10 before:opacity-80";

const education: EducationItem[] = [
  {
    degree: "Master of Science",
    field: "Data Analytics & Computational Social Science (DACSS)",
    school: "University of Massachusetts Amherst",
    location: "Amherst, MA",
    period: "Sep. 2025 – May 2027",
    status: "Expected",
    description:
      "Graduate study focused on the intersection of data analytics, computational methods, and social science. The program strengthens my ability to analyze behavioral and social patterns through applied statistics, predictive modeling, visualization, and data-driven research design.",
    color: "from-cyan-300 via-teal-300 to-emerald-300",
    skills: [
      "Applied Statistics",
      "Data Visualization",
      "Regression",
      "Predictive Modeling",
      "Computational Social Science",
      "Python for Data Science",
    ],
    highlights: [
      "Building advanced analytical foundations for behavioral and social data.",
      "Focused on translating complex data into interpretable, decision-ready insights.",
    ],
  },
  {
    degree: "Postgraduate Diploma",
    field: "Data Science & Business Analytics",
    school: "The University of Texas at Austin",
    location: "Austin, TX",
    period: "Jan. 2024 – Aug. 2024",
    description:
      "Completed postgraduate training in data science and business analytics with applied work across machine learning, exploratory data analysis, model validation, and business-facing analytics. The program strengthened my ability to connect statistical modeling with practical decision-making.",
    color: "from-amber-300 via-orange-400 to-rose-400",
    skills: [
      "Machine Learning",
      "Exploratory Data Analysis",
      "Model Tuning",
      "Model Validation",
      "Business Analytics",
      "Time Series Forecasting",
    ],
    highlights: [
      "Developed applied project experience in regression, clustering, and pricing analytics.",
      "Strengthened business analytics skills through practical, data-driven case work.",
    ],
  },
  {
    degree: "Bachelor of Science",
    field: "Psychology, Minor in Computer Science",
    school: "Virginia Tech",
    location: "Blacksburg, VA",
    period: "Aug. 2021 – May 2024",
    description:
      "Completed undergraduate study in psychology with a computer science minor, combining behavioral science, research thinking, programming, and computational problem-solving. This background shaped my focus on data, behavior, mental health technology, and user-centered systems.",
    color: "from-violet-300 via-fuchsia-400 to-pink-400",
    skills: [
      "Psychology",
      "Computer Science",
      "Java",
      "JavaScript",
      "SQL",
      "Research Methods",
      "Behavioral Science",
    ],
    highlights: [
      "Built an interdisciplinary foundation across human behavior and technical systems.",
      "Developed early venture and AI-for-mental-health interests through campus innovation work.",
    ],
  },
];

const courseworkGroups: CourseworkGroup[] = [
  {
    title: "Statistics & Modeling",
    icon: BarChart,
    items: [
      "Applied Statistics",
      "Regression & Predictive Modeling",
      "Time Series Forecasting",
      "Model Tuning & Validation",
    ],
  },
  {
    title: "Data Science Workflow",
    icon: Database,
    items: [
      "Exploratory Data Analysis",
      "Data Visualization",
      "SQL & Database Management",
      "Python for Data Science",
    ],
  },
  {
    title: "Machine Learning",
    icon: Brain,
    items: [
      "Machine Learning",
      "Unsupervised Learning",
      "Clustering",
      "Predictive Analytics",
    ],
  },
  {
    title: "Technical Foundation",
    icon: Code,
    items: [
      "Python",
      "R",
      "Java",
      "JavaScript",
      "MATLAB",
      "SQL",
      "Bash",
    ],
  },
];

const academicHighlights: AcademicHighlight[] = [
  {
    title: "Behavior + Data Foundation",
    description:
      "Academic path combines psychology, computer science, data analytics, and computational social science.",
    icon: Brain,
    color: "from-cyan-300 to-teal-300",
  },
  {
    title: "Applied Analytics Training",
    description:
      "Coursework emphasizes statistics, visualization, machine learning, SQL, and predictive modeling.",
    icon: BarChart,
    color: "from-amber-300 to-orange-400",
  },
  {
    title: "Technical Project Readiness",
    description:
      "Education supports applied projects across ML, dashboards, pricing models, and data-driven strategy.",
    icon: Sparkles,
    color: "from-violet-300 to-pink-400",
  },
];

export default function EducationPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_34%),#020617] text-white">
      <Navigation />

      <div className="pointer-events-none absolute inset-0 data-grid opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

      {/* Header */}
      <section className="relative px-4 pb-16 pt-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className={`${frostedCard} ${frostedOverlay} px-6 py-10 text-center md:px-12 md:py-14`}
          >
            <div className="relative z-10">
              <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
                <GraduationCap className="h-4 w-4" />
                Academic Background
              </div>

              <h1 className="bg-gradient-to-r from-cyan-200 via-white to-teal-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
                Education
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                A path connecting psychology, computer science, data science,
                business analytics, and computational social science.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Academic Highlights */}
      <section className="relative px-4 pb-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-3">
            {academicHighlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className={`${frostedCard} ${frostedOverlay} p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35`}
                >
                  <div className="relative z-10">
                    <div
                      className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${item.color} p-3 shadow-lg shadow-cyan-950/30`}
                    >
                      <Icon className="h-6 w-6 text-slate-950" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Education Timeline */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="relative">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-cyan-300 via-teal-300 to-transparent md:left-8" />

            <div className="space-y-8 md:space-y-10">
              {education.map((edu, index) => (
                <motion.article
                  key={edu.school}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                  className="relative pl-14 md:pl-24"
                >
                  <div className="absolute left-5 top-7 -translate-x-1/2 md:left-8">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${edu.color} shadow-[0_0_28px_rgba(34,211,238,0.35)]`}
                    >
                      <div className="h-3 w-3 rounded-full bg-slate-950" />
                    </div>
                  </div>

                  <div
                    className={`${frostedCard} ${frostedOverlay} p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 md:p-8`}
                  >
                    <div className="relative z-10">
                      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                        <div>
                          <div className="mb-3 flex flex-wrap gap-2">
                            <span
                              className={`rounded-full border border-white/10 bg-gradient-to-r ${edu.color} px-3 py-1 text-xs font-semibold text-slate-950`}
                            >
                              {edu.degree}
                            </span>

                            {edu.status && (
                              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
                                {edu.status}
                              </span>
                            )}
                          </div>

                          <h2
                            className={`bg-gradient-to-r ${edu.color} bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl`}
                          >
                            {edu.school}
                          </h2>

                          <p className="mt-2 text-lg font-medium text-white">
                            {edu.field}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100 backdrop-blur-xl lg:text-right">
                          <div className="flex items-center gap-2 lg:justify-end">
                            <Calendar className="h-4 w-4" />
                            <span>{edu.period}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-2 lg:justify-end">
                            <MapPin className="h-4 w-4" />
                            <span>{edu.location}</span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-6 max-w-4xl leading-8 text-slate-300">
                        {edu.description}
                      </p>

                      <div className="mt-6 grid gap-3 md:grid-cols-2">
                        {edu.highlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm leading-7 text-slate-300 backdrop-blur-xl"
                          >
                            <div className="mb-2 flex items-center gap-2 text-cyan-200">
                              <Award className="h-4 w-4" />
                              <span className="text-xs uppercase tracking-[0.18em]">
                                Academic Focus
                              </span>
                            </div>
                            {highlight}
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {edu.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm text-cyan-100 shadow-sm shadow-cyan-950/20 backdrop-blur-xl"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Relevant Coursework */}
      <section className="relative px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
              <BookOpen className="h-4 w-4" />
              Relevant Coursework
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Technical Learning Areas
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Coursework and technical foundations listed on the resume,
              organized by theme.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {courseworkGroups.map((group, index) => {
              const Icon = group.icon;

              return (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className={`${frostedCard} ${frostedOverlay} p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35`}
                >
                  <div className="relative z-10">
                    <div className="mb-5 flex items-center gap-4">
                      <div className="rounded-2xl border border-teal-300/20 bg-teal-300/10 p-3 text-teal-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {group.title}
                      </h3>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}