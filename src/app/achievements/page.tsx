"use client";

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ParticlesBackground from '@/components/ParticlesBackground';
import { Trophy, Award, Star, Medal, Target, Zap, Calendar, Building } from 'lucide-react';

const achievements = [
  {
    title: "The Action Taker Award",
    organization: "LISC Massachusetts & the IXL Center",
    date: "May 2025",
    description: "Recognized as one of the standout participants in the competitive LISC Digital Growth Accelerator. This award was presented for demonstrating exceptional initiative, execution, and impact in digitally transforming Simple Coaching Inc. Through hands-on strategy, digital upgrades, and consistent implementation, I helped position the business for sustainable growth and improved client engagement.",
    type: "Leadership",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    highlight: true
  },
  {
    title: "KickStart VT Seed Grant Winner",
    organization: "Apex Systems Center for Innovation and Entrepreneurship",
    date: "Nov 2024",
    description: "Honored to be selected as a KickStart VT Seed Grant Winner for CalendAI, an AI-powered calendar app designed to transform productivity through intelligent scheduling. KickStart VT recognizes promising student-led ventures in the early stages, and this award underscores the innovative potential of CalendAI. With this support, I am taking significant steps forward in development, joining a network of fellow entrepreneurs.",
    type: "Innovation",
    icon: Trophy,
    color: "from-purple-500 to-pink-500",
    highlight: true,
    amount: "$500 Seed Grant"
  },
  {
    title: "Featured Presenter",
    organization: "Google Developer Student Clubs",
    date: "Aug 2023 - Nov 2023",
    description: "I had the opportunity to speak at the Google Developer Student Clubs event, where I shared insights on the role of interdisciplinary collaboration in advancing AI-driven healthcare innovations. I explored how machine learning can be applied to analyze large-scale data and provide meaningful, personalized therapeutic outcomes.",
    type: "Speaking",
    icon: Star,
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "IBM Z Xplore Course Certification",
    organization: "IBM",
    date: "2024",
    description: "Successfully completed the IBM Z Xplore Course, expanding knowledge of mainframes and exploring machine learning applications in enterprise computing environments.",
    type: "Certification",
    icon: Award,
    color: "from-blue-500 to-indigo-500"
  },
  {
    title: "Data Science Excellence",
    organization: "University of Texas at Austin",
    date: "2024",
    description: "Achieved 3.76 GPA in Postgraduate Diploma in Data Science and Business Analytics, demonstrating excellence in advanced analytics, machine learning, and business intelligence.",
    type: "Academic",
    icon: Medal,
    color: "from-green-500 to-teal-500"
  }
];

const stats = [
  { value: "3", label: "Major Awards", icon: Trophy },
  { value: "2", label: "Seed Grants", icon: Target },
  { value: "5+", label: "Certifications", icon: Award },
  { value: "10+", label: "Speaking Events", icon: Star }
];

export default function Achievements() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
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
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {achievement.highlight && (
                    <div className={`absolute -inset-1 bg-gradient-to-r ${achievement.color} rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  )}

                  <div className={`relative glass rounded-xl p-8 border ${
                    achievement.highlight ? 'border-cyan-500/30' : 'border-white/10'
                  } hover:border-cyan-500/50 transition-all duration-300`}>
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-20 h-20 bg-gradient-to-r ${achievement.color} p-5 rounded-xl shadow-lg`}>
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

                        <p className="text-gray-400 leading-relaxed">{achievement.description}</p>

                        {achievement.highlight && (
                          <div className="mt-4 flex items-center gap-2">
                            <div className="flex -space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
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

      {/* Skills & Competencies */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gradient">Core Competencies</h2>
            <p className="mt-4 text-gray-400">Skills recognized through achievements</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { skill: "Innovation & Entrepreneurship", level: 95, color: "from-purple-500 to-pink-500" },
              { skill: "Data Science & Analytics", level: 90, color: "from-cyan-500 to-blue-500" },
              { skill: "Leadership & Team Management", level: 85, color: "from-green-500 to-teal-500" },
              { skill: "Public Speaking & Presentation", level: 80, color: "from-yellow-500 to-orange-500" },
              { skill: "Digital Strategy & Consulting", level: 88, color: "from-red-500 to-pink-500" },
              { skill: "Research & Development", level: 82, color: "from-indigo-500 to-purple-500" }
            ].map((skill, index) => (
              <motion.div
                key={skill.skill}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass p-4 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">{skill.skill}</span>
                  <span className="text-xs text-cyan-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
