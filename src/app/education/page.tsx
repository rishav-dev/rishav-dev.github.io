"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import {
  GraduationCap,
  Award,
  Calendar,
  MapPin,
} from "lucide-react";

/* ---------- types ---------- */
type EducationItem = {
  degree: string;
  field: string;
  school: string;
  location: string;
  period: string;
  description: string;
  color: string;          // tailwind gradient e.g. "from-purple-500 to-pink-500"
  skills?: string[];
  grade?: string;
  award?: string;
  concentrations?: string;
};

type Certification = {
  title: string;
  org: string;
  blurb: string;
  gradient: string;
};

/* ---------- YOUR DATA (kept) ---------- */
const education: EducationItem[] = [
  {
    degree: "Master of Science - MS",
    field: "Data Analytics and Computational Social Science (DACSS)",
    school: "University of Massachusetts Amherst",
    location: "Amherst, Massachusetts",
    period: "Jun 2025 - May 2027",
    description:
      "Currently pursuing my MS in DACSS at UMass Amherst, combining my psychology undergraduate background with advanced analytics expertise from my Postgraduate Diploma in Data Analytics from the University of Texas at Austin. I'm focused on leveraging computational methods to analyze and interpret human behaviors, societal dynamics, and psychological phenomena through rigorous data-driven frameworks. My studies blend statistical modeling, data engineering, and spatial analytics, enabling me to deliver actionable insights in interdisciplinary research and real-world applications.",
    color: "from-purple-500 to-pink-500",
    skills: ["Statistical Modeling", "Data Engineering", "Spatial Analytics", "Computational Methods"],
  },
  {
    degree: "Postgraduate Diploma",
    field: "Data Science and Business Analytics",
    school: "The University of Texas at Austin",
    location: "Austin, Texas",
    period: "Jan 2024 - Sep 2024",
    grade: "3.76",
    description:
      "I completed a Postgraduate Diploma in Data Science and Business Analytics from UT Austin, where I developed advanced skills in data analytics, predictive modeling, and strategic decision-making. The program provided a comprehensive foundation in machine learning, statistical analysis, and data visualization, focusing on real-world business applications.",
    color: "from-orange-500 to-red-500",
    skills: [
      "Machine Learning",
      "Predictive Modeling",
      "Data Visualization",
      "Business Analytics",
      "Python",
      "R",
      "MongoDB",
      "Deep Learning",
    ],
  },
  {
    degree: "Bachelor of Science - BS",
    field: "Psychology (Minor: Computer Science)",
    school: "Virginia Tech",
    location: "Blacksburg, Virginia",
    period: "Aug 2020 - Aug 2024",
    grade: "3.0",
    description:
      "Developed a strong foundation in human behavior, cognitive processes, and data-driven inquiry through a psychology major, complemented by practical programming and computational thinking gained via a computer science minor. Participated in cross-disciplinary projects combining tech and behavioral science, such as applying statistical analysis and scripting to explore decision-making and user-interface studies.",
    color: "from-cyan-500 to-blue-500",
    skills: ["JavaScript", "Git", "SQL", "C++", "Java", "Python", "React.js", "Node.js", "AWS", "MongoDB"],
    award:
      "KickStart VT Award Winner — designed an innovative early-stage venture merging behavioral insights with a tech solution; earned equity-free seed grant ($500).",
  },
];

const certifications: Certification[] = [
  {
    title: "IBM Z Xplore Course",
    org: "IBM",
    blurb: "Expanding knowledge of mainframes and exploring machine learning.",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    title: "Data Science & Business Analytics",
    org: "UT Austin",
    blurb: "Postgraduate Diploma with 3.76 GPA.",
    gradient: "from-green-500 to-teal-500",
  },
];


export default function EducationPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />

      {/* Faint grid behind this page only */}
      <div className="absolute inset-0 data-grid opacity-15 -z-10" />

      {/* Header */}
      <section className="pt-24 pb-10 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-gradient"
          >
            Education
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 text-lg md:text-xl text-gray-400"
          >
            My academic journey and continuous learning path
          </motion.p>
        </div>
      </section>

      {/* Single-column Rail + Cards */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="relative">

            {/* Left vertical rail */}
            <div className="absolute left-4 sm:left-6 md:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500 via-teal-500 to-transparent" />

            {/* Entries */}
            <div className="space-y-8 md:space-y-10">
              {education.map((edu, i) => (
                <motion.article
                  key={`${edu.school}-${i}`}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="relative pl-12 sm:pl-14 md:pl-20"
                >
                  {/* Rail dot */}
                  <div className="absolute left-4 sm:left-6 md:left-8 top-6 -translate-x-1/2">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${edu.color} flex items-center justify-center shadow-[0_0_18px_rgba(34,211,238,0.35)]`}>
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="relative glass rounded-2xl border border-white/10 p-6 md:p-7 hover:shadow-[0_0_35px_rgba(34,211,238,0.12)] transition-shadow">
                    {/* top row */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${edu.color} bg-clip-text text-transparent`}>
                          {edu.school}
                        </h3>
                        <p className="mt-1 text-gray-300 text-lg">{edu.degree}</p>
                        <p className="text-cyan-300">{edu.field}</p>
                      </div>

                      <div className="text-right shrink-0">
                        {edu.grade && (
                          <div className="inline-flex items-center gap-2 text-cyan-300">
                            <GraduationCap className="w-4 h-4" />
                            <span className="font-semibold">GPA: {edu.grade}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* meta */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{edu.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{edu.location}</span>
                      </div>
                    </div>

                    {/* description */}
                    <p className="mt-4 text-gray-300">
                      {edu.description}
                    </p>

                    {/* award */}
                    {edu.award && (
                      <div className="mt-4 p-3 rounded-lg border border-yellow-500/30 bg-gradient-to-r from-yellow-500/15 to-orange-500/15 text-sm text-gray-200 flex gap-2">
                        <Award className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <span>{edu.award}</span>
                      </div>
                    )}

                    {/* skills (compact chips) */}
                    {!!edu.skills?.length && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {edu.skills.slice(0, 8).map((s) => (
                          <span
                            key={s}
                            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-200"
                          >
                            {s}
                          </span>
                        ))}
                        {edu.skills.length > 8 && (
                          <span className="text-xs text-gray-400">
                            +{edu.skills.length - 8} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-3xl md:text-4xl font-bold text-gradient text-center mb-8"
          >
            Licenses & Certifications
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {certifications.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 * i }}
                className="relative rounded-xl border border-white/10 bg-white/5 p-6 overflow-hidden"
              >
                <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${c.gradient} blur-xl opacity-20`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${c.gradient} text-white`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="mt-3 text-white font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-400">{c.org}</p>
                  <p className="mt-2 text-sm text-gray-300">{c.blurb}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
