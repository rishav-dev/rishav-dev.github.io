"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Trophy, Award, Star, Medal, Target, Zap, Calendar, Building } from "lucide-react";

/* --------------------------- Achievements data --------------------------- */
const achievements = [
  {
    title: "The Action Taker Award",
    organization: "LISC Massachusetts & the IXL Center",
    date: "May 2025",
    description:
      "Recognized as one of the standout participants in the competitive LISC Digital Growth Accelerator. This award was presented for demonstrating exceptional initiative, execution, and impact in digitally transforming Simple Coaching Inc. Through hands-on strategy, digital upgrades, and consistent implementation, I helped position the business for sustainable growth and improved client engagement.",
    type: "Leadership",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    highlight: true,
  },
  {
    title: "KickStart VT Seed Grant Winner",
    organization: "Apex Systems Center for Innovation and Entrepreneurship",
    date: "Nov 2024",
    description:
      "Honored to be selected as a KickStart VT Seed Grant Winner for CalendAI, an AI-powered calendar app designed to transform productivity through intelligent scheduling. KickStart VT recognizes promising student-led ventures in the early stages, and this award underscores the innovative potential of CalendAI. With this support, I am taking significant steps forward in development, joining a network of fellow entrepreneurs.",
    type: "Innovation",
    icon: Trophy,
    color: "from-purple-500 to-pink-500",
    highlight: true,
    amount: "$500 Seed Grant",
  },
  {
    title: "Featured Presenter",
    organization: "Google Developer Student Clubs",
    date: "Aug 2023 - Nov 2023",
    description:
      "I had the opportunity to speak at the Google Developer Student Clubs event, where I shared insights on the role of interdisciplinary collaboration in advancing AI-driven healthcare innovations. I explored how machine learning can be applied to analyze large-scale data and provide meaningful, personalized therapeutic outcomes.",
    type: "Speaking",
    icon: Star,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "IBM Z Xplore Course Certification",
    organization: "IBM",
    date: "2024",
    description:
      "Successfully completed the IBM Z Xplore Course, expanding knowledge of mainframes and exploring machine learning applications in enterprise computing environments.",
    type: "Certification",
    icon: Award,
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Data Science Excellence",
    organization: "University of Texas at Austin",
    date: "2024",
    description:
      "Achieved 3.76 GPA in Postgraduate Diploma in Data Science and Business Analytics, demonstrating excellence in advanced analytics, machine learning, and business intelligence.",
    type: "Academic",
    icon: Medal,
    color: "from-green-500 to-teal-500",
  },
];

const stats = [
  { value: "3", label: "Major Awards", icon: Trophy },
  { value: "2", label: "Seed Grants", icon: Target },
  { value: "5+", label: "Certifications", icon: Award },
  { value: "10+", label: "Speaking Events", icon: Star },
];

/* ---------------------------- Radial skill card --------------------------- */
function RadialSkill({
  label,
  level,
  ring,
}: {
  label: string;
  level: number; // 0–100
  ring: string; // CSS color 
}) {
  const [val, setVal] = useState(0);
  const deg = (val / 100) * 360;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setVal(level)}
      transition={{ duration: 0.6 }}
      className="glass border border-white/10 rounded-2xl p-4 flex flex-col items-center"
    >
      <div className="relative w-28 h-28">
        {/* outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${ring} ${deg}deg, rgba(255,255,255,0.08) 0deg)`,
            filter: "drop-shadow(0 0 10px rgba(34,211,238,0.15))",
          }}
        />
        {/* inner cap */}
        <div className="absolute inset-2 rounded-full bg-[rgba(2,6,23,0.85)] border border-white/10 flex items-center justify-center">
          <span className="text-xl font-semibold text-cyan-300">{val}%</span>
        </div>
      </div>
      <div className="mt-3 text-center text-sm text-gray-300">{label}</div>
    </motion.div>
  );
}

/* --------------------------------- Page ---------------------------------- */
export default function Achievements() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />

      {/* Grid Background */}
      <div className="absolute inset-0 data-grid opacity-20" />

      {/* Header */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gradient mb-6">
              Achievements & Recognition
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Celebrating milestones in innovation, leadership, and academic excellence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 text-center"
              >
                <div className="inline-flex p-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {achievement.highlight && (
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${achievement.color} rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                    />
                  )}

                  <div
                    className={`relative glass rounded-xl p-8 border ${
                      achievement.highlight ? "border-cyan-500/30" : "border-white/10"
                    } hover:border-cyan-500/50 transition-all duration-300`}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-20 h-20 bg-gradient-to-r ${achievement.color} p-5 rounded-xl shadow-lg`}
                        >
                          <Icon className="w-full h-full text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {achievement.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {achievement.organization}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {achievement.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-full text-cyan-400 text-sm border border-cyan-500/30">
                              {achievement.type}
                            </span>
                            {achievement.amount && (
                              <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-green-400 text-sm border border-green-500/30">
                                {achievement.amount}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-400 leading-relaxed">
                          {achievement.description}
                        </p>

                        {achievement.highlight && (
                          <div className="mt-4 flex items-center gap-2">
                            <div className="flex -space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">Featured Achievement</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------- Core Competencies ---------------------- */}
      <section className="relative pb-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gradient">Core Competencies</h2>
            <p className="mt-4 text-gray-400">
              A balanced stack across analytics, ML, and strategy
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Radial meters */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
              <RadialSkill label="Innovation & Entrepreneurship" level={95} ring="rgb(34 211 238)" />
              <RadialSkill label="Data Science & Analytics" level={90} ring="rgb(20 184 166)" />
              <RadialSkill label="Leadership & Team Mgmt" level={85} ring="rgb(59 130 246)" />
              <RadialSkill label="Public Speaking" level={80} ring="rgb(6 182 212)" />
              <RadialSkill label="Digital Strategy & Consulting" level={88} ring="rgb(16 185 129)" />
              <RadialSkill label="Research & Development" level={82} ring="rgb(45 212 191)" />
            </div>

            {/* Toolbox chip cloud */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10 h-full"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Toolbox</h3>

              <div className="mb-3 text-sm text-gray-400">Languages</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Python", "SQL", "JavaScript", "R"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs rounded-md bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-300 border border-cyan-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mb-3 text-sm text-gray-400">Frameworks</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {["TensorFlow", "Scikit-learn", "React", "Node.js"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs rounded-md bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-300 border border-cyan-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mb-3 text-sm text-gray-400">Cloud & Data</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {["AWS", "MongoDB", "PostgreSQL", "Power BI"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs rounded-md bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-300 border border-cyan-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mb-3 text-sm text-gray-400">Consulting & Product</div>
              <div className="flex flex-wrap gap-2">
                {["A/B Testing", "UX Research", "SEO", "Experimentation"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs rounded-md bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-300 border border-cyan-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
