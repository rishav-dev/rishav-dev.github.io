"use client";

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ParticlesBackground from '@/components/ParticlesBackground';
import { Code, Database, Brain, BarChart, ExternalLink, Github, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

const projects = [
  {
    title: "LISC Digital Growth Accelerator",
    category: "Business Consulting",
    period: "Mar 2025 - May 2025",
    description: "Selected for competitive program by LISC Massachusetts and IXL Center, focused on supporting small business growth and digital transformation in the wellness and mental health sectors.",
    highlights: [
      "Conducted in-depth client assessments to optimize service offerings",
      "Guided digital platform leverage for enhanced user engagement",
      "Established unpaid intern roles for expanding digital reach",
      "Strengthened social impact in underserved communities"
    ],
    tech: ["Digital Strategy", "UX Design", "SEO", "Analytics"],
    color: "from-purple-500 to-pink-500",
    icon: Users
  },
  {
    title: "Chatter Box - Intelligent Chatbot",
    category: "AI/ML",
    description: "Designed and developed an intelligent chatbot using fuzzy string matching for query detection with dynamic features like calculating precise age and engaging contextual responses.",
    highlights: [
      "Implemented fuzzy string matching algorithms",
      "Structured JSON-based response system",
      "Dynamic contextual response generation",
      "User experience optimization"
    ],
    tech: ["Python", "JSON", "Algorithm Development", "UX"],
    color: "from-cyan-500 to-blue-500",
    icon: Brain,
    github: "https://github.com/rishavchakra/chatterbox"
  },
  {
    title: "Dynamic Pricing Model for ReCell",
    category: "Data Science",
    description: "Analyzed dataset of used and refurbished devices to identify key factors influencing pricing and built predictive model for dynamic pricing strategy.",
    highlights: [
      "Exploratory data analysis on device pricing",
      "Linear regression modeling",
      "Statistical modeling for price optimization",
      "Actionable business insights generation"
    ],
    tech: ["Python", "Linear Regression", "Statistical Modeling", "Data Analytics"],
    color: "from-green-500 to-teal-500",
    icon: BarChart
  },
  {
    title: "Face Recognition Software",
    category: "Computer Vision",
    description: "Developed face recognition software using Python and TensorFlow, leveraging deep learning for accurate and efficient facial recognition in real-time or static images.",
    highlights: [
      "Real-time face detection and recognition",
      "Deep learning model implementation",
      "High accuracy optimization",
      "Adaptable to various use cases"
    ],
    tech: ["TensorFlow", "Computer Vision", "Deep Learning", "Python"],
    color: "from-orange-500 to-red-500",
    icon: Brain
  },
  {
    title: "Predicting Booking Cancellations - INN Hotels",
    category: "Predictive Analytics",
    description: "Analyzed booking data to identify key factors influencing cancellations and built predictive model to forecast cancellations in advance.",
    highlights: [
      "Predictive modeling for cancellation forecasting",
      "Data-driven policy recommendations",
      "Statistical analysis of booking patterns",
      "Business strategy optimization"
    ],
    tech: ["Predictive Analytics", "Data Modeling", "Python", "Statistical Analysis"],
    color: "from-yellow-500 to-orange-500",
    icon: Database
  },
  {
    title: "E-news Express Landing Page Analysis",
    category: "A/B Testing",
    description: "Analyzed effectiveness of new landing page for online news portal using statistical methods, A/B testing, and data visualization to evaluate user engagement metrics.",
    highlights: [
      "A/B testing implementation",
      "Conversion rate analysis",
      "User engagement metrics evaluation",
      "Language preference impact assessment"
    ],
    tech: ["A/B Testing", "Statistical Analysis", "Data Visualization", "Python"],
    color: "from-purple-500 to-indigo-500",
    icon: BarChart
  },
  {
    title: "Stock Data Analysis and Clustering",
    category: "Machine Learning",
    description: "Grouped stocks based on attributes using clustering techniques and derived insights about characteristics of each group.",
    highlights: [
      "Hierarchical clustering implementation",
      "K-means clustering analysis",
      "Cluster characteristic analysis",
      "Investment strategy insights"
    ],
    tech: ["K-means", "Hierarchical Clustering", "Python", "Data Science"],
    color: "from-red-500 to-pink-500",
    icon: Database
  },
  {
    title: "Visa Approval Predictive Model",
    category: "Classification",
    description: "Analyzed visa applicant data to identify key factors influencing approval outcomes using ensemble techniques.",
    highlights: [
      "Ensemble modeling techniques",
      "Feature importance analysis",
      "Applicant profile optimization",
      "Process streamlining recommendations"
    ],
    tech: ["Ensemble Methods", "Classification", "Python", "Data Processing"],
    color: "from-teal-500 to-cyan-500",
    icon: Brain
  },
  {
    title: "Self-Driving Game Exploration",
    category: "Reinforcement Learning",
    description: "Developed ML program leveraging PyAutoGUI, numpy, and PIL to explore AI-driven self-driving models through video game environments.",
    highlights: [
      "Autonomous vehicle simulation",
      "Game environment interfacing",
      "Real-world driving challenge simulation",
      "Decision-making enhancement"
    ],
    tech: ["PyAutoGUI", "NumPy", "PIL", "Machine Learning"],
    color: "from-indigo-500 to-purple-500",
    icon: Code
  }
];

export default function Projects() {
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
              Featured Projects
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Innovative solutions at the intersection of data science, AI, and human behavior
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Pills */}
      <section className="relative pb-10 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {["All", "AI/ML", "Data Science", "Computer Vision", "Analytics"].map((filter, index) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  index === 0
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white"
                    : "glass text-gray-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30"
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${project.color} rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>

                  <div className="relative glass rounded-xl p-6 h-full border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${project.color} rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <span className="inline-block px-2 py-1 text-xs rounded-md bg-cyan-500/20 text-cyan-400 mb-3">
                      {project.category}
                    </span>

                    <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                    {/* Highlights */}
                    <div className="mb-4">
                      <ul className="space-y-1">
                        {project.highlights.slice(0, 2).map((highlight, i) => (
                          <li key={i} className="text-xs text-gray-500 flex items-start">
                            <span className="text-cyan-500 mr-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {project.tech.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-400 border border-cyan-500/20"
                        >
                          {tech}
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

      {/* CTA Section */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Interested in Collaboration?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
            >
              Let's Connect
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
