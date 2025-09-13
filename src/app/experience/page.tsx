"use client";

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ParticlesBackground from '@/components/ParticlesBackground';
import { Briefcase, Calendar, MapPin, Building, Code, Brain, Users, TrendingUp } from 'lucide-react';

const experiences = [
  {
    title: "Client Experience and Digital Strategy Consultant",
    company: "Simple Coaching Inc.",
    location: "Remote",
    period: "Mar 2025 - Present",
    current: true,
    type: "Consulting",
    description: "Selected to provide consulting support for Simple Coaching Inc., a wellness and mental health business, with a focus on understanding client needs, enhancing customer journeys, and supporting the launch of new service models.",
    responsibilities: [
      "Conducting client behavior analysis to inform digital strategy and optimize service pages",
      "Collaborating with leadership to develop new workshop models based on emerging mental health trends",
      "Leading website design, including event galleries and testimonial sections",
      "Implementing SEO and performance analytics to increase site traffic and conversion rates",
      "Conducting digital audits to refine client engagement strategies"
    ],
    skills: ["Digital Strategy", "SEO", "Client Analysis", "Web Design", "Analytics"],
    color: "from-green-500 to-teal-500",
    icon: TrendingUp
  },
  {
    title: "Behavioral Data Analyst",
    company: "CalendAI",
    location: "Blacksburg, Virginia (Hybrid)",
    period: "May 2024 - Present",
    current: true,
    type: "Part-time",
    description: "Bringing together expertise in computer science and psychology to design innovative solutions that enhance user productivity and engagement through AI-powered calendar optimization.",
    responsibilities: [
      "Analyzing user interaction patterns and developing predictive models",
      "Designing A/B tests and conducting behavioral analyses",
      "Collaborating with cross-functional teams including data scientists and UX designers",
      "Implementing smart scheduling algorithms based on individual needs",
      "Prioritizing transparency and privacy in data management"
    ],
    skills: ["Python", "AWS", "MongoDB", "Node.js", "React.js", "Statistical Modeling", "Deep Learning"],
    color: "from-purple-500 to-pink-500",
    icon: Brain
  },
  {
    title: "Cognitive Systems Engineer",
    company: "MeAsmi",
    location: "Blacksburg, Virginia (Hybrid)",
    period: "Mar 2024 - Present",
    current: true,
    type: "Part-time",
    description: "Leading a groundbreaking initiative in community psychology, focusing on neurodivergent individuals, their families, and therapists through machine learning and data analysis.",
    responsibilities: [
      "Gathering and analyzing data on diagnoses, symptoms, and therapy efficacy",
      "Employing ML algorithms including clustering and supervised learning",
      "Leading a diverse team of three professors and five therapists",
      "Designing an interactive platform for neurodivergent families",
      "Maintaining and updating ML models with new data"
    ],
    skills: ["Machine Learning", "Data Analytics", "Team Leadership", "Python", "React.js"],
    color: "from-cyan-500 to-blue-500",
    icon: Users
  },
  {
    title: "Behavioral Health Technician",
    company: "Intercare Therapy, Inc.",
    location: "San Diego, California",
    period: "Jan 2025 - Jun 2025",
    type: "Full-time",
    description: "Delivered evidence-based Applied Behavior Analysis interventions to individuals with developmental disorders, including Autism Spectrum Disorder.",
    responsibilities: [
      "Implementing targeted ABA strategies including reinforcement scheduling and task analysis",
      "Collecting and analyzing real-time data on client progress",
      "Partnering with caregivers to provide practical training",
      "Managing challenging behaviors through de-escalation techniques",
      "Upholding HIPAA and organizational standards"
    ],
    skills: ["Applied Behavior Analysis", "Data Collection", "Crisis Management", "HIPAA Compliance"],
    color: "from-orange-500 to-red-500",
    icon: Users
  },
  {
    title: "Student Manager",
    company: "Dietrick",
    location: "Blacksburg, Virginia",
    period: "Aug 2018 - Apr 2024",
    type: "Part-time",
    description: "Led and directed a diverse team at D2/DX fast-paced dining establishment, managing multiple operations and ensuring exceptional service standards.",
    responsibilities: [
      "Overseeing daily operations and team management",
      "Training and mentoring staff",
      "Maintaining exceptional customer service standards",
      "Enforcing food safety laws and guidelines"
    ],
    skills: ["Team Leadership", "Business Analytics", "Operations Management"],
    color: "from-yellow-500 to-orange-500",
    icon: Building
  }
];

export default function Experience() {
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
              Professional Experience
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Bridging data science, behavioral psychology, and digital strategy to drive innovation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience Cards */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Glowing background on hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${exp.color} rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>

                  <div className="relative glass rounded-xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 bg-gradient-to-r ${exp.color} p-4 rounded-xl shadow-lg`}>
                          <Icon className="w-full h-full text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-gray-400">
                              <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {exp.company}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {exp.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {exp.period}
                              </span>
                            </div>
                          </div>
                          {exp.current && (
                            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-full text-cyan-400 text-sm border border-cyan-500/30">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="text-gray-400 mb-4">{exp.description}</p>

                        {/* Key Responsibilities */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Key Contributions:</h4>
                          <ul className="space-y-1">
                            {exp.responsibilities.slice(0, 3).map((resp, i) => (
                              <li key={i} className="text-sm text-gray-400 flex items-start">
                                <span className="text-cyan-500 mr-2">▸</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs rounded-md bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-400 border border-cyan-500/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Career Stats */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gradient">Career Impact</h2>
            <p className="mt-4 text-gray-400">Numbers that tell the story</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Years of Experience", value: "5+", icon: Calendar },
              { label: "Companies Worked With", value: "7", icon: Building },
              { label: "Teams Led", value: "20+", icon: Users }
            ].map((stat, index) => (
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
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
