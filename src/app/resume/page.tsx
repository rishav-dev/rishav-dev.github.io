"use client";

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ParticlesBackground from '@/components/ParticlesBackground';
import { Download, FileText, Eye, Share2, Printer, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Resume() {
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
              Professional Resume
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive overview of my professional journey, skills, and accomplishments
            </p>
          </motion.div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="relative pb-10 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="/resume.pdf"
              download="Rishav_Chakravarty_Resume.pdf"
              className="group px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 glass rounded-lg font-medium text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print Resume
            </button>
            <Link
              href="/contact"
              className="px-6 py-3 glass rounded-lg font-medium text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Me
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Resume Content */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-2xl p-8 md:p-12 border border-white/10"
          >
            {/* Header Section */}
            <div className="border-b border-gray-700 pb-8 mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Rishav Chakravarty</h2>
              <p className="text-cyan-400 text-lg mb-4">
                Client Experience & Digital Strategy Consultant | MS in DACSS @ UMass Amherst
              </p>
              <div className="flex flex-wrap gap-4 text-gray-400">
                <span>📍 Amherst, Massachusetts</span>
                <span>📧 rishav.chakravarty@gmail.com</span>
                <span>🔗 linkedin.com/in/rishavchakravarty</span>
                <span>💻 github.com/rishavchakra</span>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gradient mb-4">Professional Summary</h3>
              <p className="text-gray-400 leading-relaxed">
                Currently pursuing an M.S. in Data Analytics & Computational Social Science (DACSS) at UMass Amherst,
                where I focus on the intersection of data, behavior, and technology. I drive digital strategy at Simple
                Coaching Inc., leveraging journey analytics, SEO, and content optimization to boost engagement. Previously,
                as a Behavioral Data Analyst at CalendAI, I applied behavioral-psychology frameworks and predictive modeling
                to design smart-calendar features that increased user adoption. A KickStart VT Seed Grant winner, I'm
                passionate about translating data and AI into user-focused, evidence-based innovations.
              </p>
            </div>

            {/* Core Skills */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gradient mb-4">Core Competencies</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-2">Data Science</h4>
                  <ul className="space-y-1 text-gray-400 text-sm">
                    <li>• Machine Learning & Deep Learning</li>
                    <li>• Statistical Modeling</li>
                    <li>• Predictive Analytics</li>
                    <li>• Data Visualization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-2">Technologies</h4>
                  <ul className="space-y-1 text-gray-400 text-sm">
                    <li>• Python, R, SQL</li>
                    <li>• TensorFlow, PyTorch</li>
                    <li>• AWS, MongoDB</li>
                    <li>• React.js, Node.js</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-2">Business</h4>
                  <ul className="space-y-1 text-gray-400 text-sm">
                    <li>• Digital Strategy</li>
                    <li>• Client Analytics</li>
                    <li>• SEO & Marketing</li>
                    <li>• Team Leadership</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Experience Summary */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gradient mb-4">Professional Experience</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-cyan-500 pl-4">
                  <h4 className="text-white font-semibold">Client Experience & Digital Strategy Consultant</h4>
                  <p className="text-cyan-400 text-sm">Simple Coaching Inc. | Mar 2025 - Present</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Leading digital transformation initiatives, optimizing customer journeys, and implementing
                    data-driven strategies to enhance engagement and conversion rates.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-500 pl-4">
                  <h4 className="text-white font-semibold">Behavioral Data Analyst</h4>
                  <p className="text-cyan-400 text-sm">CalendAI | May 2024 - Present</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Designing AI-powered productivity solutions using behavioral psychology frameworks and
                    predictive modeling to personalize user experiences.
                  </p>
                </div>
                <div className="border-l-2 border-cyan-500 pl-4">
                  <h4 className="text-white font-semibold">Cognitive Systems Engineer</h4>
                  <p className="text-cyan-400 text-sm">MeAsmi | Mar 2024 - Present</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Leading ML initiatives for neurodivergent support platform, implementing clustering and
                    supervised learning algorithms for therapy efficacy insights.
                  </p>
                </div>
              </div>
            </div>

            {/* Education Summary */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gradient mb-4">Education</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-semibold">MS in Data Analytics & Computational Social Science</h4>
                  <p className="text-cyan-400 text-sm">University of Massachusetts Amherst | 2025 - 2027</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Postgraduate Diploma in Data Science & Business Analytics</h4>
                  <p className="text-cyan-400 text-sm">University of Texas at Austin | 2024 | GPA: 3.76</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold">BS in Psychology (Minor: Computer Science)</h4>
                  <p className="text-cyan-400 text-sm">Virginia Tech | 2020 - 2024 | GPA: 3.0</p>
                </div>
              </div>
            </div>

            {/* Awards */}
            <div>
              <h3 className="text-2xl font-bold text-gradient mb-4">Key Achievements</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">🏆</span>
                  <span>The Action Taker Award - LISC Digital Growth Accelerator (2025)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">🚀</span>
                  <span>KickStart VT Seed Grant Winner - $500 for CalendAI (2024)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">🎤</span>
                  <span>Featured Presenter - Google Developer Student Clubs (2023)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">📜</span>
                  <span>IBM Z Xplore Course Certification - Machine Learning & Mainframes</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-12 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Connect?
            </h2>
            <p className="text-gray-400 mb-6">
              I'm always interested in discussing new opportunities and innovative projects
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Get In Touch
              </Link>
              <a
                href="https://linkedin.com/in/rishavchakravarty"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass rounded-lg font-medium text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300"
              >
                Connect on LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
