"use client";

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ParticlesBackground from '@/components/ParticlesBackground';
import { GraduationCap, Award, Calendar, MapPin, ExternalLink } from 'lucide-react';

const education = [
  {
    degree: "Master of Science - MS",
    field: "Data Analytics and Computational Social Science (DACSS)",
    school: "University of Massachusetts Amherst",
    location: "Amherst, Massachusetts",
    period: "Jun 2025 - May 2027",
    description: "Currently pursuing my MS in DACSS at UMass Amherst, combining my psychology undergraduate background with advanced analytics expertise from my Postgraduate Diploma in Data Analytics from the University of Texas at Austin. I'm focused on leveraging computational methods to analyze and interpret human behaviors, societal dynamics, and psychological phenomena through rigorous data-driven frameworks. My studies blend statistical modeling, data engineering, and spatial analytics, enabling me to deliver actionable insights in interdisciplinary research and real-world applications.",
    color: "from-purple-500 to-pink-500",
    skills: ["Statistical Modeling", "Data Engineering", "Spatial Analytics", "Computational Methods"]
  },
  {
    degree: "Postgraduate Diploma",
    field: "Data Science and Business Analytics",
    school: "The University of Texas at Austin",
    location: "Austin, Texas",
    period: "Jan 2024 - Sep 2024",
    grade: "3.76",
    description: "I completed a Postgraduate Diploma in Data Science and Business Analytics from UT Austin, where I developed advanced skills in data analytics, predictive modeling, and strategic decision-making. The program provided a comprehensive foundation in machine learning, statistical analysis, and data visualization, focusing on real-world business applications.",
    color: "from-orange-500 to-red-500",
    skills: ["Machine Learning", "Predictive Modeling", "Data Visualization", "Business Analytics", "Python", "R", "MongoDB", "Deep Learning"],
    certificate: "UTAusinCert.pdf"
  },
  {
    degree: "Bachelor of Science - BS",
    field: "Psychology (Minor: Computer Science)",
    school: "Virginia Tech",
    location: "Blacksburg, Virginia",
    period: "Aug 2020 - Aug 2024",
    grade: "3.0",
    description: "Developed a strong foundation in human behavior, cognitive processes, and data-driven inquiry through a psychology major, complemented by practical programming and computational thinking gained via a computer science minor. Participated in cross-disciplinary projects combining tech and behavioral science, such as applying statistical analysis and scripting to explore decision-making and user-interface studies.",
    color: "from-cyan-500 to-blue-500",
    skills: ["JavaScript", "Git", "SQL", "C++", "Java", "Python", "React.js", "Node.js", "AWS", "MongoDB"],
    award: "KickStart VT Award Winner - Designed an innovative early-stage venture that merged behavioral insights with a tech solution. Competed in the Apex Center's pitch event and earned an equity-free seed grant ($500)"
  }
];

export default function Education() {
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
              Education Journey
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A continuous pursuit of knowledge at the intersection of data science, psychology, and technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-teal-500 to-transparent"></div>

            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50 z-10">
                  <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-75"></div>
                </div>

                {/* Card */}
                <div className={`ml-20 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'} md:w-5/12`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${edu.color} rounded-lg`}>
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {edu.period}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1">{edu.degree}</h3>
                    <p className="text-cyan-400 mb-2">{edu.field}</p>
                    <p className="text-gray-300 font-medium mb-1">{edu.school}</p>
                    <p className="text-gray-400 text-sm flex items-center gap-1 mb-4">
                      <MapPin className="w-3 h-3" />
                      {edu.location}
                    </p>

                    {edu.grade && (
                      <div className="inline-block px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-400 text-sm mb-4">
                        GPA: {edu.grade}
                      </div>
                    )}

                    <p className="text-gray-400 text-sm mb-4">{edu.description}</p>

                    {edu.award && (
                      <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30 mb-4">
                        <div className="flex items-start gap-2">
                          <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-300">{edu.award}</p>
                        </div>
                      </div>
                    )}

                    {edu.skills && (
                      <div className="flex flex-wrap gap-2">
                        {edu.skills.slice(0, 4).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded-md bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30"
                          >
                            {skill}
                          </span>
                        ))}
                        {edu.skills.length > 4 && (
                          <span className="px-2 py-1 text-xs rounded-md text-gray-400">
                            +{edu.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gradient">Certifications</h2>
            <p className="mt-4 text-gray-400">Continuous learning and skill development</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    IBM Z Xplore Course
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Expanding Knowledge of Mainframes and Exploring Machine Learning
                  </p>
                  <p className="text-cyan-400 text-sm">IBM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Data Science & Business Analytics
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Postgraduate Diploma with 3.76 GPA
                  </p>
                  <p className="text-cyan-400 text-sm">UT Austin</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
