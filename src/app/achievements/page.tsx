"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import {
  Trophy,
  Award,
  Star,
  Medal,
  Target,
  Zap,
  Calendar,
  Building,
  BarChart,
  Code,
  Database,
  Brain,
} from "lucide-react";
import type { ComponentType } from "react";

type IconType = ComponentType<{ className?: string }>;

type Achievement = {
  title: string;
  organization: string;
  date: string;
  type: string;
  summary: string;
  details: string[];
  metric?: string;
  icon: IconType;
  gradient: string;
  featured?: boolean;
};

type ImpactHighlight = {
  value: string;
  label: string;
  context: string;
  icon: IconType;
};

type SkillGroup = {
  title: string;
  subtitle: string;
  icon: IconType;
  items: string[];
};

const frostedCard =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(2,6,23,0.45)]";

const frostedOverlay =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/10 before:via-white/[0.03] before:to-cyan-500/10 before:opacity-80";

const achievements: Achievement[] = [
  {
    title: "UPitch Spring 2026 Second Place Winner",
    organization: "Karnah",
    date: "Spring 2026",
    type: "Startup Competition",
    summary:
      "Awarded second place for Karnah, an AI-powered in-kind donation platform designed to improve nonprofit matching, transparency, and waste reduction.",
    details: [
      "Recognized for building a practical AI venture around nonprofit resource allocation.",
      "Positioned Karnah around matching efficiency, donation transparency, and reduced organizational waste.",
    ],
    metric: "$750 Prize",
    icon: Medal,
    gradient: "from-cyan-400 via-teal-400 to-emerald-400",
    featured: true,
  },
  {
    title: "The Action Taker Award",
    organization: "LISC Massachusetts & the IXL Center",
    date: "2025",
    type: "Digital Growth",
    summary:
      "Recognized for leading and executing impactful digital upgrades during the LISC Digital Growth Accelerator.",
    details: [
      "Supported improvements to business systems, client engagement, and digital operations.",
      "Connected strategy with execution through measurable upgrades to online presence and workflow design.",
    ],
    icon: Zap,
    gradient: "from-amber-300 via-orange-400 to-rose-400",
    featured: true,
  },
  {
    title: "KickStart VT Seed Grant Winner",
    organization: "CalendAI",
    date: "2024",
    type: "Entrepreneurship",
    summary:
      "Founded and developed CalendAI, an AI-powered calendar app for intelligent scheduling.",
    details: [
      "Recognized by Virginia Tech for early-stage venture promise and innovation.",
      "Advanced the concept through entrepreneurial networks and product-development groundwork.",
    ],
    icon: Trophy,
    gradient: "from-violet-400 via-fuchsia-400 to-pink-400",
    featured: true,
  },
  {
    title: "Future Founder Startup Award",
    organization: "Minute Pitch Competition",
    date: "2024",
    type: "Venture Recognition",
    summary:
      "Honored for creativity, confidence, and the promise of the venture during a startup pitch competition.",
    details: [
      "Recognized as a standout founder with a venture positioned around future entrepreneurship.",
      "Award highlighted communication, concept clarity, and early-stage founder potential.",
    ],
    icon: Award,
    gradient: "from-blue-400 via-cyan-400 to-teal-400",
  },
  {
    title: "Featured Speaker — AI for Mental Health",
    organization: "Google Developer Student Club",
    date: "Aug 2023 – Nov 2023",
    type: "Speaking",
    summary:
      "Presented machine learning applications for personalized mental health interventions to an audience of 150+ participants.",
    details: [
      "Discussed how AI and behavioral science can support personalized therapeutic outcomes.",
      "Translated technical machine-learning concepts into accessible, interdisciplinary insights.",
    ],
    metric: "150+ Participants",
    icon: Star,
    gradient: "from-sky-400 via-blue-400 to-indigo-400",
  },
];

const impactHighlights: ImpactHighlight[] = [
  {
    value: "37%",
    label: "increase in new client inquiries",
    context: "Steve Fisher Consulting",
    icon: BarChart,
  },
  {
    value: "43%",
    label: "reduction in administrative workload",
    context: "Steve Fisher Consulting",
    icon: Target,
  },
  {
    value: "40%",
    label: "increase in revenue",
    context: "Simple Coaching Inc.",
    icon: Trophy,
  },
  {
    value: "48%",
    label: "boost in engagement",
    context: "Simple Coaching Inc.",
    icon: Zap,
  },
  {
    value: "93%",
    label: "face-recognition model accuracy",
    context: "Independent ML project",
    icon: Brain,
  },
  {
    value: "35%",
    label: "reduction in manual reporting workload",
    context: "Zad Holding Company Q.P.S.C.",
    icon: Database,
  },
];

const skillGroups: SkillGroup[] = [
  {
    title: "Analytics & Modeling",
    subtitle: "Coursework and applied project foundation",
    icon: BarChart,
    items: [
      "Applied Statistics",
      "Exploratory Data Analysis",
      "Regression & Predictive Modeling",
      "Machine Learning",
      "Time Series Forecasting",
      "Model Tuning & Validation",
    ],
  },
  {
    title: "Languages",
    subtitle: "Programming and technical communication",
    icon: Code,
    items: ["Python", "R", "Java", "JavaScript", "MATLAB", "SQL", "Bash"],
  },
  {
    title: "Developer Tools",
    subtitle: "Data, cloud, and workflow platforms",
    icon: Database,
    items: [
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
    title: "Frameworks & Libraries",
    subtitle: "Tools used across analytics and web projects",
    icon: Brain,
    items: [
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

export default function Achievements() {
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
                <Trophy className="h-4 w-4" />
                Resume-backed awards, impact, and technical strengths
              </div>

              <h1 className="bg-gradient-to-r from-cyan-200 via-white to-teal-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
                Achievements & Recognition
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                A curated view of venture awards, digital-growth outcomes,
                technical project results, and the analytics toolkit behind my
                work.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Measurable Impact
              </h2>
              <p className="mt-3 max-w-2xl text-slate-400">
                Selected outcomes from consulting, analytics, and machine
                learning work.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {impactHighlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={`${item.value}-${item.context}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className={`${frostedCard} ${frostedOverlay} group p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30`}
                >
                  <div className="relative z-10">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-cyan-300/30 to-transparent" />
                    </div>

                    <div className="bg-gradient-to-r from-cyan-200 to-teal-200 bg-clip-text text-4xl font-bold text-transparent">
                      {item.value}
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-200">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                      {item.context}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Awards, Competitions & Recognition
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Recognition across entrepreneurship, digital execution, AI-enabled
              product ideas, and technical communication.
            </p>
          </motion.div>

          <div className="space-y-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;

              return (
                <motion.article
                  key={achievement.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="group relative"
                >
                  {achievement.featured && (
                    <div
                      className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r ${achievement.gradient} opacity-20 blur-xl transition duration-300 group-hover:opacity-35`}
                    />
                  )}

                  <div
                    className={`${frostedCard} ${frostedOverlay} relative p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 md:p-8`}
                  >
                    <div className="relative z-10 grid gap-6 lg:grid-cols-[220px_1fr]">
                      <div>
                        <div
                          className={`mb-5 inline-flex rounded-3xl bg-gradient-to-br ${achievement.gradient} p-4 shadow-lg shadow-cyan-950/30`}
                        >
                          <Icon className="h-8 w-8 text-slate-950" />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
                            {achievement.type}
                          </span>
                          {achievement.metric && (
                            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
                              {achievement.metric}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div>
                            <h3 className="text-2xl font-semibold tracking-tight text-white">
                              {achievement.title}
                            </h3>

                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                              <span className="inline-flex items-center gap-2">
                                <Building className="h-4 w-4 text-cyan-300" />
                                {achievement.organization}
                              </span>
                              <span className="inline-flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-cyan-300" />
                                {achievement.date}
                              </span>
                            </div>
                          </div>

                          {achievement.featured && (
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-3 py-1 text-xs font-medium text-yellow-200">
                              <Star className="h-3.5 w-3.5 fill-yellow-200" />
                              Featured
                            </div>
                          )}
                        </div>

                        <p className="mt-5 leading-8 text-slate-300">
                          {achievement.summary}
                        </p>

                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          {achievement.details.map((detail) => (
                            <div
                              key={detail}
                              className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm leading-7 text-slate-300 backdrop-blur-xl"
                            >
                              <div className="mb-2 flex items-center gap-2 text-cyan-200">
                                <Star className="h-4 w-4" />
                                <span className="text-xs uppercase tracking-[0.18em]">
                                  Highlight
                                </span>
                              </div>
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Competencies */}
      <section className="relative px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Core Competencies
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Technical strengths drawn from coursework, project work, and
              professional experience.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {skillGroups.map((group, index) => {
              const Icon = group.icon;

              return (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className={`${frostedCard} ${frostedOverlay} p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30`}
                >
                  <div className="relative z-10">
                    <div className="mb-5 flex items-start gap-4">
                      <div className="rounded-2xl border border-teal-300/20 bg-teal-300/10 p-3 text-teal-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {group.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {group.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm text-cyan-100 shadow-sm shadow-cyan-950/20 backdrop-blur-xl"
                        >
                          {item}
                        </span>
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