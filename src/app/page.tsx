"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Database, Brain, BarChart, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ParticlesBackground from '@/components/ParticlesBackground';
import DataVisualization3D from '@/components/DataVisualization3D';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const skills = [
    { icon: Database, label: "Data Analytics", color: "from-cyan-500 to-blue-500" },
    { icon: Brain, label: "Machine Learning", color: "from-purple-500 to-pink-500" },
    { icon: BarChart, label: "Data Visualization", color: "from-green-500 to-teal-500" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <Navigation />

      {/* Grid Background */}
      <div className="absolute inset-0 data-grid opacity-20" />

      {/* Hero Section */}
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

          {/* Right 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            {mounted && <DataVisualization3D />}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
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
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    }}
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

      {/* Quick Stats */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="glass rounded-2xl p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { label: "Years Experience", value: "5+", suffix: "" },
                { label: "Projects Completed", value: "20", suffix: "+" },
                { label: "Technologies", value: "15", suffix: "+" },
                { label: "Awards", value: "3", suffix: "" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl font-bold text-gradient">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="mt-2 text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
