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
  Globe,
  Briefcase,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { ComponentType } from "react";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";

type SubmitState = "idle" | "success" | "error";
type IconType = ComponentType<{ className?: string }>;

type ContactCard = {
  label: string;
  value: string;
  href?: string;
  detail: string;
  icon: IconType;
  gradient: string;
};

const frostedCard =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(2,6,23,0.45)]";

const frostedOverlay =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/10 before:via-white/[0.03] before:to-cyan-500/10 before:opacity-80";

const contactCards: ContactCard[] = [
  {
    label: "Email",
    value: "rishavchakra@umass.edu",
    href: "mailto:rishavchakra@umass.edu",
    detail: "Best for professional inquiries, collaborations, and recruiting.",
    icon: Mail,
    gradient: "from-cyan-400 via-teal-400 to-emerald-400",
  },
  {
    label: "Location",
    value: "Amherst, Massachusetts",
    detail: "Currently based near UMass Amherst.",
    icon: MapPin,
    gradient: "from-violet-400 via-fuchsia-400 to-pink-400",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/rishav-dsc",
    href: "https://www.linkedin.com/in/rishav-dsc",
    detail: "Professional profile, experience, and updates.",
    icon: Linkedin,
    gradient: "from-sky-400 via-blue-400 to-indigo-400",
  },
  {
    label: "GitHub",
    value: "github.com/rishav-dev",
    href: "https://github.com/rishav-dev",
    detail: "Projects, code, and technical work.",
    icon: Github,
    gradient: "from-slate-300 via-slate-400 to-slate-500",
  },
  {
    label: "Website",
    value: "rishavchakravarty.com",
    href: "https://www.rishavchakravarty.com",
    detail: "Portfolio, resume, and project work.",
    icon: Globe,
    gradient: "from-amber-300 via-orange-400 to-rose-400",
  },
];

const focusAreas = [
  "Data Science",
  "Machine Learning",
  "Digital Strategy",
  "Behavioral Analytics",
  "Technical Consulting",
  "Data Visualization",
  "Predictive Modeling",
  "Product Strategy",
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitState>("idle");
  const [configOK, setConfigOK] = useState(true);

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
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      company: "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!configOK) {
      setSubmitStatus("error");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setSubmitStatus("error");
      return;
    }

    if (formData.company.trim().length > 0) {
      setSubmitStatus("success");
      resetForm();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: formData.name,
        email: formData.email,
        title: formData.subject,
        message: formData.message,
      });

      setSubmitStatus("success");
      resetForm();
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_34%),#020617] text-white">
      <Navigation />

      <div className="pointer-events-none absolute inset-0 data-grid opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

      {/* Header */}
      <section className="relative px-4 pb-16 pt-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className={`${frostedCard} ${frostedOverlay} px-6 py-10 text-center md:px-12 md:py-14`}
          >
            <div className="relative z-10">
              <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
                <MessageSquare className="h-4 w-4" />
                Contact
              </div>

              <h1 className="bg-gradient-to-r from-cyan-200 via-white to-teal-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
                Let&apos;s Connect
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Open to conversations around data science, machine learning,
                behavioral analytics, digital strategy, and technical consulting
                work.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Cards */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-5 lg:col-span-1"
            >
              {contactCards.map((card, index) => {
                const Icon = card.icon;

                const content = (
                  <div
                    className={`${frostedCard} ${frostedOverlay} group p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35`}
                  >
                    <div className="relative z-10 flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg shadow-cyan-950/25`}
                      >
                        <Icon className="h-5 w-5 text-slate-950" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">
                            {card.label}
                          </h3>
                          {card.href && (
                            <ExternalLink className="h-3.5 w-3.5 text-slate-500 transition group-hover:text-cyan-300" />
                          )}
                        </div>

                        <p className="mt-1 break-words text-sm text-cyan-200">
                          {card.value}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {card.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2 + index * 0.06 }}
                  >
                    {card.href ? (
                      <a
                        href={card.href}
                        target={
                          card.href.startsWith("mailto:") ? undefined : "_blank"
                        }
                        rel={
                          card.href.startsWith("mailto:")
                            ? undefined
                            : "noopener noreferrer"
                        }
                        aria-label={card.label}
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="lg:col-span-2"
            >
              <div className={`${frostedCard} ${frostedOverlay} p-6 md:p-8`}>
                <div className="relative z-10">
                  <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                        Send a Message
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                        Use this form for consulting inquiries, project
                        collaborations, research opportunities, or data-focused
                        roles.
                      </p>
                    </div>

                    <div className="w-fit rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                      <Send className="h-6 w-6" />
                    </div>
                  </div>

                  {!configOK && (
                    <div className="mb-6 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-4 text-sm leading-7 text-yellow-100">
                      EmailJS environment variables are missing. Add{" "}
                      <code className="rounded bg-slate-950/50 px-1.5 py-0.5 text-white">
                        NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
                      </code>
                      ,{" "}
                      <code className="rounded bg-slate-950/50 px-1.5 py-0.5 text-white">
                        NEXT_PUBLIC_EMAILJS_SERVICE_ID
                      </code>
                      , and{" "}
                      <code className="rounded bg-slate-950/50 px-1.5 py-0.5 text-white">
                        NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
                      </code>{" "}
                      to{" "}
                      <code className="rounded bg-slate-950/50 px-1.5 py-0.5 text-white">
                        .env.local
                      </code>
                      , then restart the dev server.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium text-slate-300"
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
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white placeholder-slate-500 outline-none backdrop-blur-xl transition duration-300 focus:border-cyan-300/50 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
                          placeholder="Jane Doe"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium text-slate-300"
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
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white placeholder-slate-500 outline-none backdrop-blur-xl transition duration-300 focus:border-cyan-300/50 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-sm font-medium text-slate-300"
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
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white placeholder-slate-500 outline-none backdrop-blur-xl transition duration-300 focus:border-cyan-300/50 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
                        placeholder="Project collaboration, consulting, or opportunity"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium text-slate-300"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={7}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-white placeholder-slate-500 outline-none backdrop-blur-xl transition duration-300 focus:border-cyan-300/50 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/10"
                        placeholder="Tell me about the role, project, collaboration, or problem you want to solve..."
                      />
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <button
                        type="submit"
                        disabled={isSubmitting || !configOK}
                        className={`inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 px-7 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/20 ${
                          isSubmitting || !configOK
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </button>

                      {submitStatus === "success" && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-sm text-emerald-300"
                        >
                          <CheckCircle className="h-5 w-5" />
                          Message sent successfully.
                        </motion.div>
                      )}

                      {submitStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-sm text-red-300"
                        >
                          <AlertCircle className="h-5 w-5" />
                          Failed to send. Check the form and EmailJS config.
                        </motion.div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Opportunity Areas */}
      <section className="relative px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className={`${frostedCard} ${frostedOverlay} p-8 text-center md:p-12`}
          >
            <div className="relative z-10">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                <Briefcase className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Open to Opportunities
              </h2>

              <p className="mx-auto mt-4 max-w-3xl leading-8 text-slate-400">
                I am interested in work that connects data, behavior, and
                technology, especially projects involving analytics,
                user-centered strategy, machine learning, and measurable
                digital growth.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {focusAreas.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-sm shadow-cyan-950/20 backdrop-blur-xl"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}