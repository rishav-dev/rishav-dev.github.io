"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import Navigation from "@/components/Navigation";
import {
  Mail,
  MapPin,
  Linkedin,
  Github,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

/** Read EmailJS config from env (must start with NEXT_PUBLIC_) */
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";
const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";

type SubmitState = "idle" | "success" | "error";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    // simple honeypot
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitState>("idle");
  const [configOK, setConfigOK] = useState(true);

  /** Init EmailJS once on mount */
  useEffect(() => {
    const ok = Boolean(PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID);
    setConfigOK(ok);
    if (!ok) return;
    try {
      emailjs.init(PUBLIC_KEY);
    } catch {
      setConfigOK(false);
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!configOK) {
      setSubmitStatus("error");
      return;
    }

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus("error");
      return;
    }

    // Honeypot filled => silently succeed
    if (formData.company.trim().length > 0) {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", company: "" });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: formData.name,          // matches {{name}}
        email: formData.email,        // matches {{email}}
        title: formData.subject,      // matches {{title}} (your Subject field)
        message: formData.message,    // matches {{message}}
      });

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", company: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (_err: unknown) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Let&apos;s Connect
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              I&apos;m always interested in discussing new opportunities,
              innovative projects, and ways to create impact through data and technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Email Card */}
              <div className="glass p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:rishav.chakravarty@gmail.com"
                      className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      rishav.chakravarty@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="glass p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Location</h3>
                    <p className="text-gray-400 text-sm">
                      Amherst, Massachusetts
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="glass p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <Linkedin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">LinkedIn</h3>
                    <a
                      href="https://linkedin.com/in/rishavchakravarty"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      /in/rishavchakravarty
                    </a>
                  </div>
                </div>
              </div>

              {/* GitHub Card */}
              <div className="glass p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">GitHub</h3>
                    <a
                      href="https://github.com/rishavchakra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      /rishavchakra
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="glass p-8 rounded-xl border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>

                {!configOK && (
                  <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm">
                    Env vars missing. Add{" "}
                    <code className="text-white">
                      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY / NEXT_PUBLIC_EMAILJS_SERVICE_ID / NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
                    </code>{" "}
                    to <code className="text-white">.env.local</code> (project root) and restart the dev server.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot (hidden) */}
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-400 mb-2"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-400 mb-2"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
                      placeholder="Project Collaboration"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 resize-none"
                      placeholder="Tell me about your project or opportunity..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={isSubmitting || !configOK}
                      className={`px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-2 ${
                        isSubmitting || !configOK ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>

                    {/* Status Messages */}
                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-green-400"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Message sent successfully!</span>
                      </motion.div>
                    )}

                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-red-400"
                      >
                        <AlertCircle className="w-5 h-5" />
                        <span>Failed to send. Please check the form & config.</span>
                      </motion.div>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="relative pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-12 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Open to Opportunities</h2>
            <p className="text-gray-400 mb-6">
              I&apos;m currently available for consulting projects, research collaborations, and
              full-time opportunities in data science, behavioral analytics, and digital strategy.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Data Science",
                "Machine Learning",
                "Digital Strategy",
                "Behavioral Analytics",
                "Consulting",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-full text-cyan-400 text-sm border border-cyan-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
