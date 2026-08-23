"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import {
  Briefcase,
  Calendar,
  MapPin,
  Building,
  Code,
  Brain,
  Users,
  TrendingUp,
  BarChart,
  Database,
  Sparkles,
  Target,
  LineChart,
} from "lucide-react";
import type { ComponentType } from "react";

type IconType = ComponentType<{ className?: string }>;

type ExperienceItem = {
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string;
  achievements: string[];
  metrics: string[];
  skills: string[];
  color: string;
  icon: IconType;
};

type ImpactStat = {
  value: string;
  label: string;
  source: string;
  icon: IconType;
};

const frostedCard =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(2,6,23,0.45)]";

const frostedOverlay =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/10 before:via-white/[0.03] before:to-cyan-500/10 before:opacity-80";

const experiences: ExperienceItem[] = [
  {
    title: "Digital Strategy & Tech Consultant",
    company: "Steve Fisher Consulting",
    location: "Menifee, CA",
    period: "May 2025 – August 2025",
    type: "Consulting",
    description:
      "Engineered the firm’s website and improved digital infrastructure to support client acquisition across national and international markets.",
    achievements: [
      "Engineered the firm’s website, driving a 37% increase in new client inquiries across national and international markets.",
      "Automated workflows and streamlined infrastructure, reducing administrative workload by 43%.",
    ],
    metrics: ["37% inquiry increase", "43% workload reduction"],
    skills: [
      "Digital Strategy",
      "Website Engineering",
      "Workflow Automation",
      "Client Acquisition",
      "Technical Consulting",
    ],
    color: "from-cyan-300 via-teal-300 to-emerald-300",
    icon: TrendingUp,
  },
  {
    title: "Technical Consultant",
    company: "Simple Coaching Inc.",
    location: "Remote",
    period: "March 2025 – May 2025",
    type: "Consulting",
    description:
      "Designed and optimized digital experience systems for a wellness business, connecting service design, analytics dashboards, and customer engagement.",
    achievements: [
      "Designed and optimized service pages, event galleries, and testimonial platforms, increasing revenue by 40%.",
      "Deployed and monitored analytics dashboards, providing insights that boosted engagement by 48%.",
    ],
    metrics: ["40% revenue increase", "48% engagement boost"],
    skills: [
      "Service Page Design",
      "Analytics Dashboards",
      "Customer Experience",
      "Digital Optimization",
      "Revenue Growth",
    ],
    color: "from-amber-300 via-orange-400 to-rose-400",
    icon: LineChart,
  },
  {
    title: "Featured Speaker — AI for Mental Health",
    company: "Google Developer Student Club",
    location: "Remote",
    period: "August 2023 – November 2023",
    type: "Speaking",
    description:
      "Presented machine learning applications for personalized mental health interventions and translated interdisciplinary AI concepts for a technical audience.",
    achievements: [
      "Presented machine learning applications for personalized mental health interventions to 150+ participants.",
      "Created executive-ready dashboards in Power BI, synthesizing workforce analytics to guide decision-making.",
    ],
    metrics: ["150+ participants", "Power BI dashboards"],
    skills: [
      "Machine Learning",
      "AI for Mental Health",
      "Technical Speaking",
      "Power BI",
      "Workforce Analytics",
    ],
    color: "from-violet-300 via-fuchsia-400 to-pink-400",
    icon: Brain,
  },
  {
    title: "Data Analytics Intern",
    company: "Zad Holding Company Q.P.S.C.",
    location: "Doha, Qatar · Hybrid",
    period: "March 2021 – August 2021",
    type: "Internship",
    description:
      "Built datasets, automated reports, and designed customer-usage analytics to improve reporting efficiency and customer targeting.",
    achievements: [
      "Built datasets and automated reporting dashboards in Power BI, reducing manual workloads by 35%.",
      "Designed a customer usage-based data plan using statistical inference, improving customer targeting and usage by 40%.",
    ],
    metrics: ["35% workload reduction", "40% targeting improvement"],
    skills: [
      "Power BI",
      "Data Analytics",
      "Dashboards",
      "Statistical Inference",
      "Customer Usage Modeling",
    ],
    color: "from-sky-300 via-blue-400 to-indigo-400",
    icon: Database,
  },
];

const impactStats: ImpactStat[] = [
  {
    value: "4",
    label: "Resume-listed roles",
    source: "Consulting, speaking, and analytics",
    icon: Briefcase,
  },
  {
    value: "6",
    label: "Quantified outcomes",
    source: "Across digital strategy and analytics work",
    icon: Target,
  },
  {
    value: "150+",
    label: "Presentation audience",
    source: "Google Developer Student Club",
    icon: Users,
  },
  {
    value: "37–48%",
    label: "Measured improvement range",
    source: "Client inquiries, engagement, revenue, and targeting",
    icon: BarChart,
  },
];

const capabilityAreas = [
  "Digital Strategy",
  "Technical Consulting",
  "Machine Learning",
  "Behavioral Analytics",
  "Power BI",
  "Workflow Automation",
  "Customer Experience",
  "Data Visualization",
  "Statistical Inference",
  "Dashboard Development",
  "Website Engineering",
  "Client Acquisition",
];

export default function Experience() {
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
                <Briefcase className="h-4 w-4" />
                Professional Experience
              </div>

              <h1 className="bg-gradient-to-r from-cyan-200 via-white to-teal-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
                Experience
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Work across digital strategy, technical consulting, analytics
                dashboards, machine learning communication, and business-facing
                data systems.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="relative px-4 pb-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat, index) => {
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
                      {stat.source}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="relative">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-cyan-300 via-teal-300 to-transparent md:left-8" />

            <div className="space-y-8 md:space-y-10">
              {experiences.map((exp, index) => {
                const Icon = exp.icon;

                return (
                  <motion.article
                    key={`${exp.company}-${exp.title}`}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
                    transition={{ duration: 0.5, delay: index * 0.07 }}
                    className="relative pl-14 md:pl-24"
                  >
                    <div className="absolute left-5 top-7 -translate-x-1/2 md:left-8">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${exp.color} shadow-[0_0_28px_rgba(34,211,238,0.35)]`}
                      >
                        <div className="h-3 w-3 rounded-full bg-slate-950" />
                      </div>
                    </div>

                    <div
                      className={`${frostedCard} ${frostedOverlay} group p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 md:p-8`}
                    >
                      <div className="relative z-10">
                        <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
                          <div>
                            <div
                              className={`mb-5 inline-flex rounded-3xl bg-gradient-to-br ${exp.color} p-4 shadow-lg shadow-cyan-950/30`}
                            >
                              <Icon className="h-8 w-8 text-slate-950" />
                            </div>

                            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                              {exp.type}
                            </span>
                          </div>

                          <div>
                            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                              <div>
                                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                                  {exp.title}
                                </h2>

                                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                                  <span className="inline-flex items-center gap-2">
                                    <Building className="h-4 w-4 text-cyan-300" />
                                    {exp.company}
                                  </span>
                                  <span className="inline-flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-cyan-300" />
                                    {exp.location}
                                  </span>
                                  <span className="inline-flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-cyan-300" />
                                    {exp.period}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {exp.metrics.map((metric) => (
                                  <span
                                    key={metric}
                                    className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200"
                                  >
                                    {metric}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <p className="mt-5 max-w-4xl leading-8 text-slate-300">
                              {exp.description}
                            </p>

                            <div className="mt-6 grid gap-3 md:grid-cols-2">
                              {exp.achievements.map((achievement) => (
                                <div
                                  key={achievement}
                                  className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm leading-7 text-slate-300 backdrop-blur-xl"
                                >
                                  <div className="mb-2 flex items-center gap-2 text-cyan-200">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-[0.18em]">
                                      Key Contribution
                                    </span>
                                  </div>
                                  {achievement}
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                              {exp.skills.map((skill) => (
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
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className={`${frostedCard} ${frostedOverlay} p-8 text-center md:p-12`}
          >
            <div className="relative z-10">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                <Code className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Professional Capabilities
              </h2>

              <p className="mx-auto mt-4 max-w-3xl leading-8 text-slate-400">
                Experience-backed strengths across technical consulting,
                analytics, dashboards, AI communication, and digital growth.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {capabilityAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-sm shadow-cyan-950/20 backdrop-blur-xl"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}