"use client";
import Image from "next/image";
import DataScienceBackground from "@/components/DataScienceBackground";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Database,
  Brain,
  BarChart,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ---------- Skills ---------- */
  const skills = [
    { icon: Database, label: "Data Analytics", color: "from-cyan-500 to-blue-500" },
    { icon: Brain, label: "Machine Learning", color: "from-purple-500 to-pink-500" },
    { icon: BarChart, label: "Data Visualization", color: "from-green-500 to-teal-500" },
  ];

  /* ---------- Snapshot data ---------- */
  const snapshotStats = [
    { label: "Education", sub: "degrees", value: "2" },
    { label: "Certifications", sub: "licenses", value: "6" },
    { label: "Experience", sub: "roles", value: "6" },
    { label: "Projects", sub: "built", value: "6" },
    { label: "Awards", sub: "honors", value: "3" },
    { label: "Skills", sub: "core", value: "20+" },
  ];

  const educationBullets = [
    "MS in DACSS @ UMass Amherst — focus in analytics & computational social science",
    "Postgraduate Diploma in Data Science & Business Analytics — UT Austin",
    "BS Psychology (CS minor) — Virginia Tech",
    "+ certifications in AI/ML & systems",
  ];

  const experienceBullets = [
    "Technical/Client Experience & Digital Strategy — consulting",
    "Analytics & ML projects across research + business",
    "Behavioral insights applied to product strategy",
  ];

  const projectBullets = [
    "Interactive data products & dashboards",
    "Experimentation / evaluation pipelines",
    "End-to-end ML prototypes & demos",
  ];

  const achievementsBullets = [
    "KickStart VT seed grant (CalendAI)",
    "Leadership roles (clubs & ambassadorships)",
    "Dean’s List / distinctions & scholarships",
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <DataScienceBackground />
      <Navigation />

      {/* Grid Background */}
      <div className="absolute inset-0 data-grid opacity-20" />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="px-4 py-2 glass rounded-full text-sm text-cyan-400 border border-cyan-500/30">
                MS in DACSS @ UMass Amherst
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-5xl lg:text-7xl font-bold"
            >
              <span className="block text-white">Rishav</span>
              <span className="block text-gradient">Chakravarty</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-xl text-gray-400 leading-relaxed"
            >
              Client Experience & Digital Strategy Consultant specializing in
              <span className="text-cyan-400"> Data Analytics</span>,
              <span className="text-teal-400"> Computational Social Science</span>, and
              <span className="text-green-400"> Behavioral Psychology</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/projects"
                className="group px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-2"
              >
                View Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 glass rounded-lg font-medium text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300"
              >
                Get In Touch
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex gap-4"
            >
              <a
                href="https://github.com/rishavchakra"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/rishavchakravarty"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:rishav.chakravarty@gmail.com"
                className="p-3 glass rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[500px] lg:h-[600px] flex items-center justify-center"
          >
            <div className="relative">
              <Image
                src="/rishav.jpg"
                alt="Rishav Chakravarty"
                width={300}
                height={300}
                priority
                className="rounded-full object-cover shadow-2xl ring-1 ring-white/10"
              />
              {/* soft glow behind the avatar */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gradient">Core Expertise</h2>
            <p className="mt-4 text-gray-400">Bridging data science with human behavior</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                    style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                  />
                  <div className="relative glass p-8 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${skill.color} p-4 rounded-lg mb-4`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{skill.label}</h3>
                    <p className="text-gray-400">
                      Leveraging advanced techniques to extract meaningful insights from complex datasets
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================= SNAPSHOT SECTION ========================= */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              Snapshot
            </h2>
            <p className="mt-3 text-gray-400">A quick glance across my site</p>
          </motion.div>

          {/* Stat tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {snapshotStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.04 * i }}
                className="relative rounded-2xl border border-white/10 glass p-5 text-center"
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-sky-500/10 blur-xl" />
                <div className="relative">
                  <div className="text-3xl font-bold text-cyan-300">{s.value}</div>
                  <div className="mt-1 text-gray-300">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {/* Row 1 (3 cards, each 4 columns) */}
            <SummaryCard
              title="Education"
              bullets={educationBullets}
              link={{ href: "/education", label: "View timeline →" }}
              className="lg:col-span-4"
            />
            <SummaryCard
              title="Experience"
              bullets={experienceBullets}
              link={{ href: "/experience", label: "See all roles →" }}
              className="lg:col-span-4"
            />
            <SummaryCard
              title="Projects"
              bullets={projectBullets}
              link={{ href: "/projects", label: "Browse projects →" }}
              className="lg:col-span-4"
            />

            {/* Row 2 (2 cards centered): start at col 3 and 7 */}
            <SummaryCard
              title="Achievements & Leadership"
              bullets={achievementsBullets}
              link={{ href: "/achievements", label: "See full list →" }}
              className="lg:col-span-4 lg:col-start-3"
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="relative rounded-2xl border border-white/10 glass p-6 overflow-hidden lg:col-span-4 lg:col-start-7"
            >
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-sky-500/10 blur-xl" />
              <div className="relative">
                <h3 className="text-xl font-semibold text-white mb-3">Let’s Connect</h3>
                <p className="text-gray-300">
                  Open to AI/ML, software, and technical consulting roles. Based in Massachusetts.
                </p>
                <div className="mt-5 flex gap-3">
                  <Link
                    href="/resume"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:brightness-110 transition"
                  >
                    View Resume
                  </Link>
                  <Link
                    href="/contact"
                    className="px-4 py-2 rounded-lg glass border border-white/10 text-gray-200 hover:text-white transition"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- helper component ---------- */
function SummaryCard({
  title,
  bullets,
  link,
  className = "",
}: {
  title: string;
  bullets: string[];
  link: { href: string; label: string };
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className={
        "relative rounded-2xl border border-white/10 glass p-6 overflow-hidden " +
        className
      }
    >
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-sky-500/10 blur-xl" />
      <div className="relative">
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <ul className="space-y-2 text-gray-300">
          {bullets.map((b) => (
            <li key={b} className="leading-relaxed">• {b}</li>
          ))}
        </ul>
        <Link
          href={link.href}
          className="mt-3 inline-block text-sm text-cyan-300 hover:text-cyan-200"
        >
          {link.label}
        </Link>
      </div>
    </motion.div>
  );
}
