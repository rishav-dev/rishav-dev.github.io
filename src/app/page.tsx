"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DataScienceBackground from "@/components/DataScienceBackground";
import Navigation from "@/components/Navigation";
import {
  ArrowRight,
  Database,
  Brain,
  BarChart,
  Github,
  Linkedin,
  Mail,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  LineChart,
  Network,
  Sparkles,
  ExternalLink,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Expertise = {
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
};

type Metric = {
  value: string;
  label: string;
  context: string;
  icon: LucideIcon;
};

type SummaryCardData = {
  title: string;
  eyebrow: string;
  bullets: string[];
  href: string;
  linkLabel: string;
  icon: LucideIcon;
};

const frostedCard =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(2,6,23,0.45)]";

const frostedOverlay =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/10 before:via-white/[0.03] before:to-cyan-500/10 before:opacity-80";

const expertise: Expertise[] = [
  {
    icon: Database,
    label: "Data Analytics",
    description:
      "Applied statistics, SQL, exploratory analysis, dashboards, and decision-focused reporting.",
    color: "from-cyan-300 via-teal-300 to-emerald-300",
  },
  {
    icon: Brain,
    label: "Machine Learning",
    description:
      "Predictive modeling, clustering, classification, model tuning, and computer vision pipelines.",
    color: "from-violet-300 via-fuchsia-400 to-pink-400",
  },
  {
    icon: BarChart,
    label: "Digital Strategy",
    description:
      "Website optimization, analytics dashboards, workflow automation, client-experience design, and growth strategy.",
    color: "from-amber-300 via-orange-400 to-rose-400",
  },
];

const metrics: Metric[] = [
  {
    value: "37%",
    label: "Increase in new client inquiries",
    context: "Steve Fisher Consulting",
    icon: LineChart,
  },
  {
    value: "43%",
    label: "Administrative workload reduction",
    context: "Workflow automation",
    icon: Briefcase,
  },
  {
    value: "48%",
    label: "Engagement boost",
    context: "Simple Coaching analytics dashboards",
    icon: BarChart,
  },
  {
    value: "93%",
    label: "Face-recognition model accuracy",
    context: "Independent TensorFlow project",
    icon: Brain,
  },
  {
    value: "250",
    label: "Survey observations analyzed",
    context: "AI advice-seeking experiment",
    icon: Database,
  },
  {
    value: "6,429",
    label: "Facebook friendship ties modeled",
    context: "Copenhagen Networks Study",
    icon: Network,
  },
];

const summaryCards: SummaryCardData[] = [
  {
    title: "Education",
    eyebrow: "Academic foundation",
    icon: GraduationCap,
    bullets: [
      "M.S. in Data Analytics & Computational Social Science at UMass Amherst.",
      "Postgraduate Diploma in Data Science & Business Analytics from UT Austin.",
      "B.S. in Psychology with a Computer Science minor from Virginia Tech.",
    ],
    href: "/education",
    linkLabel: "View education",
  },
  {
    title: "Experience",
    eyebrow: "Applied consulting",
    icon: Briefcase,
    bullets: [
      "Digital Strategy & Tech Consultant at Steve Fisher Consulting.",
      "Technical Consultant for Simple Coaching Inc.",
      "Data Analytics Intern at Zad Holding Company Q.P.S.C.",
    ],
    href: "/experience",
    linkLabel: "View experience",
  },
  {
    title: "Projects",
    eyebrow: "Research and technical work",
    icon: Code,
    bullets: [
      "Face recognition software with 93% model accuracy.",
      "Dynamic pricing model for 20k+ refurbished-device records.",
      "Network analysis of co-presence, SMS, and Facebook friendship.",
    ],
    href: "/projects",
    linkLabel: "View projects",
  },
  {
    title: "Recognition",
    eyebrow: "Awards and honors",
    icon: Award,
    bullets: [
      "UPitch Spring 2026 Second Place Winner for Karnah.",
      "KickStart VT Seed Grant Winner for CalendAI.",
      "The Action Taker Award from LISC Massachusetts & the IXL Center.",
    ],
    href: "/achievements",
    linkLabel: "View achievements",
  },
];

const technicalStack = [
  "Python",
  "R",
  "JavaScript",
  "SQL",
  "Power BI",
  "React.js",
  "Node.js",
  "MongoDB",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Docker",
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_34%),#020617] text-white">
      {mounted && <DataScienceBackground />}
      <Navigation />

      <div className="pointer-events-none absolute inset-0 data-grid opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center px-4 pb-20 pt-32">
        <div className="container mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75 }}
              className={`${frostedCard} ${frostedOverlay} p-6 md:p-10`}
            >
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200"
                >
                  <GraduationCap className="h-4 w-4" />
                  MS in DACSS @ UMass Amherst
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-6 text-5xl font-bold tracking-tight md:text-7xl"
                >
                  <span className="block text-white">Rishav</span>
                  <span className="block bg-gradient-to-r from-cyan-200 via-white to-teal-200 bg-clip-text text-transparent">
                    Chakravarty
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl"
                >
                  Data analytics and computational social science graduate
                  student focused on machine learning, behavioral analytics,
                  digital strategy, and evidence-based product systems.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                    <MapPin className="h-4 w-4 text-cyan-300" />
                    Amherst, Massachusetts
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                    <Database className="h-4 w-4 text-cyan-300" />
                    Data · Behavior · Technology
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="mt-8 flex flex-wrap gap-4"
                >
                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-teal-300 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition duration-300 hover:-translate-y-0.5"
                  >
                    View Projects
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/resume"
                    className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-6 py-3 font-medium text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/15"
                  >
                    View Resume
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10"
                  >
                    Contact
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  className="mt-8 flex gap-3"
                >
                  <a
                    href="https://github.com/rishav-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-400 transition hover:border-cyan-300/30 hover:text-cyan-200"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/rishav-dsc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-400 transition hover:border-cyan-300/30 hover:text-cyan-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>

                  <a
                    href="mailto:rishavchakra@umass.edu"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-400 transition hover:border-cyan-300/30 hover:text-cyan-200"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className={`${frostedCard} ${frostedOverlay} p-6`}>
                <div className="relative z-10">
                  <div className="relative mx-auto h-72 w-72 overflow-hidden rounded-full border border-white/10 bg-slate-950/50 shadow-2xl md:h-80 md:w-80">
                    <Image
                      src="/rishav.jpg"
                      alt="Rishav Chakravarty"
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-center">
                    <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">
                      Portfolio
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Building data systems that connect technical analysis with
                      human behavior and practical decisions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Core Expertise
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Data, Behavior, and Strategy
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              A technical and behavioral-science foundation applied across
              analytics, machine learning, and client-facing digital systems.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {expertise.map((skill, index) => {
              const Icon = skill.icon;

              return (
                <motion.article
                  key={skill.label}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative"
                >
                  <div
                    className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r ${skill.color} opacity-0 blur-xl transition duration-300 group-hover:opacity-25`}
                  />

                  <div
                    className={`${frostedCard} ${frostedOverlay} h-full p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35`}
                  >
                    <div className="relative z-10">
                      <div
                        className={`mb-5 inline-flex rounded-3xl bg-gradient-to-br ${skill.color} p-4 shadow-lg shadow-cyan-950/30`}
                      >
                        <Icon className="h-7 w-7 text-slate-950" />
                      </div>

                      <h3 className="text-xl font-semibold text-white">
                        {skill.label}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Metrics */}
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
              Evidence Snapshot
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Selected measurable outcomes from consulting work, machine
              learning projects, and research analysis.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;

              return (
                <motion.div
                  key={`${metric.value}-${metric.label}`}
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
                      {metric.value}
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-200">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                      {metric.context}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Site Snapshot */}
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
              Portfolio Map
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Explore the portfolio by academic background, professional work,
              technical projects, and recognition.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {summaryCards.map((card, index) => (
              <SummaryCard key={card.title} card={card} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Technical Stack + CTA */}
      <section className="relative px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className={`${frostedCard} ${frostedOverlay} p-8 md:p-12`}
          >
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
                  <Code className="h-4 w-4" />
                  Technical Stack
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Built for applied analytics work
                </h2>

                <p className="mt-4 max-w-2xl leading-8 text-slate-400">
                  My resume emphasizes a practical technical stack across
                  programming, analytics, dashboarding, web development, and
                  data-science libraries.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {technicalStack.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-sm text-cyan-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white">
                  Open to data-focused opportunities
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Interested in roles and collaborations involving data science,
                  machine learning, behavioral analytics, digital strategy,
                  dashboards, and applied AI systems.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-teal-300 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5"
                  >
                    Let&apos;s Connect
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/resume"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10"
                  >
                    Resume
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  card,
  index,
}: {
  card: SummaryCardData;
  index: number;
}) {
  const Icon = card.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={`${frostedCard} ${frostedOverlay} group p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35`}
    >
      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">
              {card.eyebrow}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              {card.title}
            </h3>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
            <Icon className="h-6 w-6" />
          </div>
        </div>

        <div className="space-y-3">
          {card.bullets.map((bullet) => (
            <div
              key={bullet}
              className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm leading-7 text-slate-300 backdrop-blur-xl"
            >
              {bullet}
            </div>
          ))}
        </div>

        <Link
          href={card.href}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-white"
        >
          {card.linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}