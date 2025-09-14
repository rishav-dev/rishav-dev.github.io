"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import {
  Code,
  Database,
  Brain,
  BarChart,
  ExternalLink,
  Github,
  Calendar,
  Users,
  Award,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Project = {
  title: string;
  category: string;
  description: string;
  highlights: string[];
  tech: string[];
  color: string; // Tailwind gradient, e.g. "from-cyan-500 to-blue-500"
  icon: LucideIcon;
  github?: string;
  org?: string;
  period?: string;
  certificateHref?: string;
};

const projects: Project[] = [
  {
    title: "LISC Digital Growth Accelerator",
    category: "Business Consulting",
    period: "Mar 2025 - May 2025",
    org: "Simple Coaching Inc.",
    description:
      "Selected for LISC Massachusetts & IXL Center program to support small-business digital growth in wellness and mental health sectors.",
    highlights: [
      "Client assessments to refine offerings & CX",
      "Guided digital optimization and engagement",
      "Built intern roles (design & social) to expand reach",
      "Impact-first support for underserved communities",
    ],
    tech: ["Digital Strategy", "UX", "SEO", "Analytics"],
    color: "from-cyan-500 to-teal-500",
    icon: Users,
    certificateHref: "/certificate.jpg",
  },
  {
    title: "Chatter Box – Intelligent Chatbot",
    category: "AI/ML",
    description:
      "Personal chatbot using fuzzy matching for intent detection with a JSON knowledge base, contextual responses, and dynamic features (e.g., exact age calc).",
    highlights: [
      "Fuzzy string matching for queries",
      "JSON-driven response system & context",
      "Playful UX and guardrails",
      "Easily extensible skills",
    ],
    tech: ["Python", "JSON", "Algorithms", "UX"],
    color: "from-cyan-500 to-blue-500",
    icon: Brain,
    github: "https://github.com/rishavchakra/chatterbox",
  },
  {
    title: "Dynamic Pricing Model for ReCell",
    category: "Data Science",
    org: "The University of Texas at Austin",
    description:
      "Analyzed used/refurb device data to find price drivers and built a predictive model for dynamic pricing and profitability.",
    highlights: [
      "EDA across device attributes",
      "Linear regression & diagnostics",
      "Price elasticity insights",
      "Actionable pricing rules",
    ],
    tech: ["Python", "Linear Regression", "Statistical Modeling", "Data Analytics"],
    color: "from-green-500 to-teal-500",
    icon: BarChart,
  },
  {
    title: "E-news Express Landing Page Effectiveness",
    category: "A/B Testing",
    org: "The University of Texas at Austin",
    description:
      "Measured the impact of a new landing page on subscription conversions and engagement. Assessed language-preference effects.",
    highlights: [
      "A/B test design & evaluation",
      "Conversion & dwell-time analysis",
      "Segmented insights (language)",
      "Visualization for stakeholders",
    ],
    tech: ["A/B Testing", "Stats", "Viz", "Python"],
    color: "from-sky-500 to-cyan-500",
    icon: BarChart,
  },
  {
    title: "Extended Euclidean Algorithm",
    category: "Algorithms",
    description:
      "Python tool to compute GCD and Bézout coefficients with a generated PDF report of step-by-step calculations (ReportLab).",
    highlights: [
      "Iterative extended GCD",
      "Formatted PDF reporting",
      "Clear intermediate steps",
      "Reusable utility module",
    ],
    tech: ["Python", "ReportLab", "Number Theory"],
    color: "from-indigo-500 to-purple-500",
    icon: Code,
  },
  {
    title: "Face Recognition Software",
    category: "Computer Vision",
    description:
      "Deep learning pipeline in Python/TensorFlow for accurate face detection and recognition across images and real-time feeds.",
    highlights: [
      "End-to-end CV pipeline",
      "Preprocessing & model tuning",
      "High-accuracy inference",
      "Real-time or batch support",
    ],
    tech: ["TensorFlow", "Deep Learning", "Computer Vision", "Python"],
    color: "from-orange-500 to-red-500",
    icon: Brain,
  },
  {
    title: "FoodHub Order Analysis",
    category: "Data Analytics",
    org: "The University of Texas at Austin",
    description:
      "Explored aggregator order data to uncover trends and provide operations recommendations with uni/bivariate analysis.",
    highlights: [
      "Variable ID & cleaning",
      "Univariate / bivariate EDA",
      "Ops recommendations",
      "Story-first visuals",
    ],
    tech: ["Python", "EDA", "Visualization", "Business Analytics"],
    color: "from-emerald-500 to-teal-500",
    icon: Database,
  },
  {
    title: "Predicting Booking Cancellations – INN Hotels",
    category: "Predictive Analytics",
    org: "The University of Texas at Austin",
    description:
      "Classification model to forecast cancellations and inform policy design for refunds and overbooking.",
    highlights: [
      "Feature engineering & selection",
      "Threshold tuning for ops targets",
      "Explainability for stakeholders",
      "Policy scenario testing",
    ],
    tech: ["Python", "Classification", "Modeling", "Data Science"],
    color: "from-yellow-500 to-amber-500",
    icon: Database,
  },
  {
    title: "Visa Approval Predictive Model",
    category: "Classification",
    org: "The University of Texas at Austin",
    description:
      "Analyzed applicant data and built ensemble models to predict approvals and optimize applicant profiles.",
    highlights: [
      "EDA & preprocessing pipeline",
      "Ensemble techniques",
      "Feature importance insights",
      "Recommendations for profiling",
    ],
    tech: ["Python", "Ensembles", "EDA", "Processing"],
    color: "from-teal-500 to-cyan-500",
    icon: Brain,
  },
  {
    title: "Self-Driving Game Exploration",
    category: "Reinforcement Learning",
    description:
      "Explored autonomous control in a game environment using PyAutoGUI, NumPy, and PIL to prototype self-driving behaviors.",
    highlights: [
      "Programmatic game control",
      "State extraction via images",
      "Reward-driven learning loop",
      "Rapid prototyping",
    ],
    tech: ["PyAutoGUI", "NumPy", "PIL", "ML"],
    color: "from-indigo-500 to-purple-500",
    icon: Code,
  },
  {
    title: "Stock Data Analysis & Clustering",
    category: "Machine Learning",
    org: "The University of Texas at Austin",
    description:
      "Grouped stocks by attributes using clustering and profiled segments to surface portfolio patterns.",
    highlights: [
      "K-means & hierarchical clustering",
      "Cluster profiling",
      "Interpretability for finance users",
      "Recommendations",
    ],
    tech: ["Python", "K-means", "Hierarchical", "EDA"],
    color: "from-rose-500 to-pink-500",
    icon: Database,
  },
  {
    title: "Tic Tac Toe with AI",
    category: "AI/Algorithms",
    description:
      "Tkinter desktop app with PvP and PvAI modes. Minimax AI ensures optimal play and challenging experience.",
    highlights: [
      "GUI with Tkinter",
      "Minimax with pruning",
      "Game state engine",
      "Smooth UX",
    ],
    tech: ["Python", "Tkinter", "AI", "Debugging"],
    color: "from-fuchsia-500 to-violet-500",
    icon: Code,
  },
  {
    title: "Vigenère Cipher Decryption",
    category: "Cryptography",
    description:
      "Implemented decryption using Index of Coincidence and χ² tests to infer key length and key; generates a polished PDF report.",
    highlights: [
      "IC & chi-square analysis",
      "Key inference workflow",
      "Automated PDF explanation",
      "Reproducible results",
    ],
    tech: ["Python", "Cryptography", "Visualization", "ReportLab"],
    color: "from-sky-500 to-blue-500",
    icon: Code,
  },
];

export default function Projects() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))].sort((a, b) =>
      a === "All" ? -1 : a.localeCompare(b)
    ),
    []
  );

  const [active, setActive] = useState<string>("All");
  const filtered = useMemo(
    () => projects.filter((p) => active === "All" || p.category === active),
    [active]
  );

  // Helper to center the last single card on md (2-up) and lg (3-up)
  const cardPosClass = (index: number, total: number) => {
    const isLast = index === total - 1;
    let extra = "";
    if (isLast) {
      // md: 2 columns (8-grid → span 4, start 3 centers)
      if (total % 2 === 1) extra += " md:col-start-3";
      // lg: 3 columns (12-grid → span 4, start 5 centers)
      if (total % 3 === 1) extra += " lg:col-start-5";
    }
    return `md:col-span-4 lg:col-span-4${extra}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />

      {/* Grid Background */}
      <div className="absolute inset-0 data-grid opacity-20" />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gradient mb-6">
              Featured Projects
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Innovative solutions at the intersection of data science, AI, and human behavior
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="relative pb-8 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((label) => {
              const isActive = active === label;
              return (
                <button
                  key={label}
                  onClick={() => setActive(label)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow shadow-cyan-500/30"
                      : "glass text-gray-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid (8/12-col grid so we can center the last card cleanly) */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6">
            {filtered.map((project, index) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={`${project.title}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.04 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className={`group relative ${cardPosClass(index, filtered.length)}`}
                >
                  {/* Glow */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${project.color} rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                  />

                  <div className="relative glass rounded-xl p-6 h-full border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${project.color} rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {project.certificateHref && (
                          <a
                            href={project.certificateHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-white/5 border border-white/10 text-cyan-300 hover:text-cyan-200"
                            title="View certificate"
                          >
                            <Award className="w-3.5 h-3.5" />
                            Certificate
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                            title="Open GitHub"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Title + category */}
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-block px-2 py-1 text-xs rounded-md bg-cyan-500/20 text-cyan-300">
                        {project.category}
                      </span>
                      {project.org && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                          <Users className="w-3.5 h-3.5" />
                          Associated with {project.org}
                        </span>
                      )}
                      {project.period && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {project.period}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                    {/* Highlights */}
                    <ul className="space-y-1 mb-4">
                      {project.highlights.slice(0, 2).map((hl) => (
                        <li key={hl} className="text-xs text-gray-500 flex items-start">
                          <span className="text-cyan-500 mr-1">•</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tech */}
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {project.tech.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 text-xs rounded bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-300 border border-cyan-500/20"
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Interested in Collaboration?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              I’m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
            >
              Let’s Connect
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
