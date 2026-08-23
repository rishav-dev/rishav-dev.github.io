"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import {
  Activity,
  Award,
  BarChart,
  BookOpen,
  Brain,
  Calendar,
  Code,
  Database,
  ExternalLink,
  Filter,
  Github,
  LineChart,
  Network,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Metric = {
  label: string;
  value: string;
  note?: string;
};

type Project = {
  title: string;
  category: string;
  org?: string;
  period?: string;
  description: string;
  researchQuestion?: string;
  methods: string[];
  findings: string[];
  metrics: Metric[];
  tech: string[];
  color: string;
  icon: LucideIcon;
  github?: string;
  caveat?: string;
};

type LearningMilestone = {
  title: string;
  course: string;
  objective: string;
  methods: string[];
  value: string;
  color: string;
  icon: LucideIcon;
};

type EvidenceMetric = {
  value: string;
  label: string;
  source: string;
  icon: LucideIcon;
};

type BarDatum = {
  label: string;
  value: number;
  display: string;
  note?: string;
};

type WaveDatum = {
  wave: string;
  bluetooth: number;
  sms: number;
};

const frostedCard =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(2,6,23,0.45)]";

const frostedOverlay =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/10 before:via-white/[0.03] before:to-cyan-500/10 before:opacity-80";

const projects: Project[] = [
  {
    title: "Physical Co-Presence, Communication, and Facebook Friendship",
    category: "Network Analysis",
    org: "DACSS Research Project",
    period: "2026",
    description:
      "A network-inference analysis of the Copenhagen Networks Study examining how Bluetooth co-presence, SMS communication, gender, triadic closure, and Facebook friendship are related.",
    researchQuestion:
      "Do physical co-presence and deliberate communication independently predict explicit Facebook friendship ties after accounting for network structure?",
    methods: ["Descriptive network analysis", "ERGM", "Louvain communities", "Scaffolded SAOM framework"],
    findings: [
      "Facebook friendship was sparse but structurally clustered, with clustering far above random-graph expectation.",
      "Bluetooth co-presence and SMS communication both showed positive associations with Facebook friendship in the ERGM.",
      "The SAOM portion is framed as a design scaffold because Facebook friendship was observed once, not as a true longitudinal panel.",
    ],
    metrics: [
      { label: "Facebook nodes", value: "834" },
      { label: "Facebook ties", value: "6,429" },
      { label: "Global clustering", value: "0.244", note: "vs. random mean 0.018" },
      { label: "FB–Bluetooth overlap", value: "40.8%" },
      { label: "Bluetooth ERGM OR", value: "3.25×" },
      { label: "SMS ERGM OR", value: "111.8×", note: "large; interpret cautiously" },
    ],
    tech: ["R", "ERGM", "RSiena", "Network statistics", "Community detection"],
    color: "from-cyan-300 via-teal-300 to-emerald-300",
    icon: Network,
    caveat:
      "The gender term in the ERGM coefficient table is statistically significant but reported with a negative coefficient, so the direction should be described carefully rather than overstated as positive homophily.",
  },
  {
    title: "AI Advice-Seeking Experiment",
    category: "Experimental Analysis",
    org: "DACSS 602",
    description:
      "A randomized survey experiment testing whether people judge advice-seeking differently when the advisor is an AI chatbot, a friend, or a therapist in an interpersonal conflict scenario.",
    researchQuestion:
      "Does advisor source change perceived appropriateness of seeking relationship-conflict advice?",
    methods: ["Survey experiment", "Data cleaning", "Ordinal recoding", "One-way ANOVA"],
    findings: [
      "Advisor source significantly affected appropriateness ratings.",
      "Friends and therapists received higher mean appropriateness ratings than the AI chatbot condition.",
      "The ordinal outcome was treated numerically for a simple difference-in-means analysis; ordinal models would be a stronger extension.",
    ],
    metrics: [
      { label: "Sample size", value: "250" },
      { label: "AI chatbot n", value: "84" },
      { label: "Friend n", value: "85" },
      { label: "Therapist n", value: "81" },
      { label: "ANOVA", value: "F = 14.64" },
      { label: "p-value", value: "9.8e-07" },
    ],
    tech: ["R", "tidyverse", "ANOVA", "Survey design", "Data visualization"],
    color: "from-sky-300 via-blue-400 to-indigo-400",
    icon: LineChart,
  },
  {
    title: "Scheduling Structure and Task Completion Time",
    category: "Regression Analysis",
    org: "Cloud Task Scheduling Dataset",
    period: "May 2026",
    description:
      "A regression study of whether load imbalance and deadline pressure jointly shape task completion time in a cloud task scheduling system.",
    researchQuestion:
      "Does the effect of load imbalance on completion time depend on deadline pressure?",
    methods: ["Five linear models", "Interaction model", "HC3 robust standard errors", "Residual diagnostics"],
    findings: [
      "Main effects for load imbalance and deadline pressure were weak when evaluated in isolation.",
      "The primary M5 interaction model produced suggestive evidence at the 90% confidence level that the imbalance effect depends on deadline context.",
      "Very small adjusted R² values indicate that scheduling structure explains only a small fraction of completion-time variance in the linear specification.",
    ],
    metrics: [
      { label: "Models estimated", value: "5" },
      { label: "Primary model", value: "M5" },
      { label: "Interaction p", value: "≈ 0.074", note: "standard SE; HC3 table is primary" },
      { label: "Adjusted R² range", value: "~0.001–0.002" },
      { label: "Inference", value: "HC3" },
    ],
    tech: ["R", "Linear regression", "Moderation", "HC3 robust SE", "Diagnostics"],
    color: "from-violet-300 via-fuchsia-400 to-pink-400",
    icon: Activity,
    caveat:
      "The result is exploratory and conditional, not evidence that imbalance or deadlines independently drive completion time.",
  },
  {
    title: "Face Recognition Software",
    category: "Computer Vision",
    period: "Independent",
    description:
      "A deep-learning system for real-time and static face detection, tuned for accuracy and faster inference.",
    methods: ["Computer vision pipeline", "Hyperparameter tuning", "TensorFlow GPU acceleration"],
    findings: [
      "Model tuning improved classification performance.",
      "GPU acceleration reduced inference time for deployment-oriented use cases.",
    ],
    metrics: [
      { label: "Accuracy", value: "93%" },
      { label: "Inference improvement", value: "25%" },
    ],
    tech: ["Python", "TensorFlow", "Computer Vision", "Deep Learning"],
    color: "from-emerald-300 via-teal-300 to-cyan-300",
    icon: Brain,
  },
  {
    title: "Dynamic Pricing Model for ReCell",
    category: "Supervised Learning",
    org: "UT Austin / Great Learning",
    description:
      "A regression-based pricing analysis of used and refurbished devices, focused on resale-value drivers and dynamic pricing strategy.",
    researchQuestion:
      "Which device attributes meaningfully influence resale price, and how can they support dynamic pricing?",
    methods: ["EDA", "Linear regression", "Assumption checks", "Business recommendations"],
    findings: [
      "The project linked predictive modeling to pricing-policy decisions rather than treating accuracy as the only output.",
      "Feature interpretation was used to identify factors that materially influence refurbished-device value.",
    ],
    metrics: [
      { label: "Dataset scale", value: "20k+", note: "refurbished-device sales records" },
      { label: "Model family", value: "Linear regression" },
      { label: "Output", value: "Pricing rules" },
    ],
    tech: ["Python", "EDA", "Linear Regression", "Business Analytics"],
    color: "from-amber-300 via-orange-400 to-rose-400",
    icon: BarChart,
  },
  {
    title: "Stock Data Clustering / Trade&Ahead",
    category: "Unsupervised Learning",
    org: "UT Austin / Great Learning",
    description:
      "An unsupervised analysis grouping stocks by provided attributes and surfacing cluster-level investment patterns.",
    researchQuestion:
      "Can stocks be segmented into interpretable groups that support portfolio diversification decisions?",
    methods: ["EDA", "K-means clustering", "Hierarchical clustering", "Cluster profiling"],
    findings: [
      "Cluster profiling translated unsupervised model output into interpretable investment segments.",
      "The project emphasized portfolio insight rather than only algorithmic separation.",
    ],
    metrics: [
      { label: "Algorithms", value: "2", note: "K-means + hierarchical" },
      { label: "Use case", value: "Diversification" },
    ],
    tech: ["Python", "K-means", "Hierarchical Clustering", "EDA"],
    color: "from-purple-300 via-violet-400 to-indigo-400",
    icon: Database,
  },
  {
    title: "ReneWind Generator Failure Prediction",
    category: "Model Tuning",
    org: "Great Learning",
    description:
      "A turbine-generator failure prediction project using sensor data to identify failures before breakdown and reduce maintenance cost.",
    researchQuestion:
      "Which tuned classification model can best identify generator failure risk early enough to support preventive maintenance?",
    methods: ["Classification models", "Up/down sampling", "Regularization", "Hyperparameter tuning"],
    findings: [
      "The project focused on cost-sensitive operational value: identifying failures before generator breakdown.",
      "Sampling and tuning were central because failure prediction often involves imbalance and asymmetric costs.",
    ],
    metrics: [
      { label: "Modeling task", value: "Failure classification" },
      { label: "Operational target", value: "Preventive maintenance" },
    ],
    tech: ["Python", "Classification", "Regularization", "Hyperparameter Tuning"],
    color: "from-fuchsia-300 via-pink-400 to-rose-400",
    icon: Target,
  },
  {
    title: "EasyVisa Approval Predictive Model",
    category: "Ensemble Learning",
    org: "Great Learning",
    description:
      "A classification project predicting visa certification outcomes and identifying applicant-profile factors associated with approval decisions.",
    researchQuestion:
      "Which applicant profiles are most suitable for certification or denial based on predictive model evidence?",
    methods: ["EDA", "Data preprocessing", "Bagging", "Boosting", "Stacking", "GridSearchCV"],
    findings: [
      "The analysis used ensemble methods to compare predictive performance and identify influential applicant features.",
      "The business output was a profile recommendation framework, not just a binary prediction.",
    ],
    metrics: [
      { label: "Ensemble families", value: "3", note: "bagging, boosting, stacking" },
      { label: "Tuning method", value: "GridSearchCV" },
    ],
    tech: ["Python", "Random Forest", "AdaBoost", "Gradient Boosting", "XGBoost"],
    color: "from-teal-300 via-cyan-400 to-blue-400",
    icon: Brain,
  },
  {
    title: "INN Hotels Booking Cancellation Model",
    category: "Classification",
    org: "Great Learning",
    description:
      "A predictive classification analysis of hotel booking cancellations designed to support refund and cancellation-policy decisions.",
    researchQuestion:
      "Which booking characteristics most strongly signal cancellation risk before arrival?",
    methods: ["EDA", "Data preprocessing", "Logistic regression", "Decision tree", "AUC-ROC"],
    findings: [
      "The project connected classification outputs to policy decisions around overbooking, refunds, and cancellation management.",
      "Decision-tree pruning and AUC-ROC evaluation supported model selection and interpretability.",
    ],
    metrics: [
      { label: "Models", value: "Logit + Tree" },
      { label: "Evaluation", value: "AUC-ROC" },
    ],
    tech: ["Python", "Classification", "Logistic Regression", "Decision Tree"],
    color: "from-yellow-300 via-amber-400 to-orange-400",
    icon: Database,
  },
  {
    title: "E-news Express Landing Page Effectiveness",
    category: "A/B Testing",
    org: "Great Learning",
    description:
      "A statistical testing project evaluating whether a new landing page improved subscriber conversion and whether conversion depended on language preference.",
    researchQuestion:
      "Is the new landing page effective enough to gather new subscribers, and does language preference matter?",
    methods: ["A/B testing", "Hypothesis testing", "Statistical inference", "Data visualization"],
    findings: [
      "The project used conversion status and time-on-page as decision metrics for product evaluation.",
      "Segmentation by preferred language connected the experiment to user-experience decisions.",
    ],
    metrics: [
      { label: "Design", value: "A/B test" },
      { label: "Core outcomes", value: "Conversion + dwell time" },
    ],
    tech: ["Python", "A/B Testing", "Hypothesis Testing", "Visualization"],
    color: "from-blue-300 via-cyan-400 to-teal-400",
    icon: BarChart,
  },
  {
    title: "FoodHub Order Analysis",
    category: "Data Analytics",
    org: "Great Learning",
    description:
      "An exploratory analytics project using food-order data from an aggregator platform to answer operational business questions.",
    researchQuestion:
      "What order, customer, and operational patterns can inform business improvement?",
    methods: ["Variable identification", "Univariate analysis", "Bivariate analysis", "Business recommendations"],
    findings: [
      "The project emphasized actionable insights for improving food-aggregator operations.",
      "Exploratory analysis was used as a decision-support workflow rather than as a purely descriptive exercise.",
    ],
    metrics: [
      { label: "Analysis type", value: "EDA" },
      { label: "Business output", value: "Ops insights" },
    ],
    tech: ["Python", "EDA", "Visualization", "Business Analytics"],
    color: "from-lime-300 via-emerald-400 to-teal-400",
    icon: Database,
  },
];

const learningMilestones: LearningMilestone[] = [
  {
    title: "ReCell",
    course: "Supervised Learning — Foundations",
    objective:
      "Analyze a used-device dataset, build a model for dynamic pricing, and identify price-driving factors.",
    methods: ["EDA", "Linear Regression", "Assumption Checks", "Business Recommendations"],
    value: "Turns model coefficients into pricing strategy.",
    color: "from-amber-300 via-orange-400 to-rose-400",
    icon: BarChart,
  },
  {
    title: "Trade&Ahead",
    course: "Unsupervised Learning",
    objective:
      "Group stocks based on attributes and explain the characteristics of each group.",
    methods: ["K-means", "Hierarchical Clustering", "Cluster Profiling"],
    value: "Supports portfolio segmentation and diversification thinking.",
    color: "from-purple-300 via-violet-400 to-indigo-400",
    icon: Database,
  },
  {
    title: "ReneWind",
    course: "Model Tuning",
    objective:
      "Use sensor data to predict wind-turbine generator failure before breakdown.",
    methods: ["Sampling", "Regularization", "Hyperparameter Tuning"],
    value: "Links classification to preventive maintenance and cost reduction.",
    color: "from-fuchsia-300 via-pink-400 to-rose-400",
    icon: Target,
  },
  {
    title: "EasyVisa",
    course: "Ensemble Techniques",
    objective:
      "Predict visa approval status and identify applicant profiles suitable for certification or denial.",
    methods: ["Bagging", "Random Forest", "Boosting", "Stacking", "GridSearchCV"],
    value: "Uses ensemble learning for applicant-profile recommendations.",
    color: "from-teal-300 via-cyan-400 to-blue-400",
    icon: Brain,
  },
  {
    title: "INN Hotels",
    course: "Supervised Learning — Classification",
    objective:
      "Predict booking cancellations and identify factors influencing cancellation risk.",
    methods: ["Logistic Regression", "Decision Tree", "Pruning", "AUC-ROC"],
    value: "Connects prediction to refund and cancellation-policy design.",
    color: "from-yellow-300 via-amber-400 to-orange-400",
    icon: Database,
  },
  {
    title: "E-news Express",
    course: "Business Statistics",
    objective:
      "Evaluate whether a new landing page improves subscriber conversion using experimental evidence.",
    methods: ["Hypothesis Testing", "A/B Testing", "Visualization", "Statistical Inference"],
    value: "Turns simulated product data into a launch decision.",
    color: "from-blue-300 via-cyan-400 to-teal-400",
    icon: BarChart,
  },
  {
    title: "FoodHub Order Analysis",
    course: "Python — Foundations",
    objective:
      "Analyze food aggregator order data to answer operational business questions.",
    methods: ["Python", "Univariate Analysis", "Bivariate Analysis", "EDA"],
    value: "Creates actionable operations recommendations from order data.",
    color: "from-lime-300 via-emerald-400 to-teal-400",
    icon: Database,
  },
];

const evidenceMetrics: EvidenceMetric[] = [
  {
    value: "6,429",
    label: "Facebook friendship ties modeled",
    source: "Copenhagen network analysis",
    icon: Network,
  },
  {
    value: "40.8%",
    label: "Facebook ties overlapping Bluetooth co-presence",
    source: "Copenhagen network analysis",
    icon: Activity,
  },
  {
    value: "F = 14.64",
    label: "Advisor-source ANOVA statistic",
    source: "AI advice experiment",
    icon: LineChart,
  },
  {
    value: "93%",
    label: "Face-recognition accuracy after tuning",
    source: "Independent CV project",
    icon: Brain,
  },
  {
    value: "20k+",
    label: "Refurbished-device sales records analyzed",
    source: "ReCell pricing model",
    icon: BarChart,
  },
  {
    value: "p ≈ .074",
    label: "Scheduling interaction signal",
    source: "Cloud scheduling regression",
    icon: Target,
  },
];

const advisorMeans: BarDatum[] = [
  { label: "AI Chatbot", value: 2.25, display: "2.25", note: "n = 84" },
  { label: "Friend", value: 2.88, display: "2.88", note: "n = 85" },
  { label: "Therapist", value: 2.9, display: "2.90", note: "n = 81" },
];

const ergmOddsRatios: BarDatum[] = [
  { label: "Bluetooth co-presence", value: 3.253, display: "3.25×" },
  { label: "Triadic closure", value: 16.323, display: "16.32×" },
  { label: "SMS communication", value: 111.816, display: "111.82×" },
];

const waveData: WaveDatum[] = [
  { wave: "Wave 1", bluetooth: 13242, sms: 6366 },
  { wave: "Wave 2", bluetooth: 20336, sms: 7071 },
  { wave: "Wave 3", bluetooth: 16485, sms: 5595 },
  { wave: "Wave 4", bluetooth: 16378, sms: 5301 },
];

function MetricPill({ metric }: { metric: Metric }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3 backdrop-blur-xl">
      <div className="bg-gradient-to-r from-cyan-200 to-teal-200 bg-clip-text text-xl font-bold text-transparent">
        {metric.value}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        {metric.label}
      </div>
      {metric.note && <div className="mt-2 text-xs leading-5 text-slate-400">{metric.note}</div>}
    </div>
  );
}

function HorizontalBarChart({
  title,
  subtitle,
  data,
  max,
  footnote,
}: {
  title: string;
  subtitle: string;
  data: BarDatum[];
  max: number;
  footnote?: string;
}) {
  return (
    <div className={`${frostedCard} ${frostedOverlay} p-6`}>
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>

        <div className="mt-6 space-y-4">
          {data.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-end justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-200">{item.label}</div>
                  {item.note && <div className="text-xs text-slate-500">{item.note}</div>}
                </div>
                <div className="text-sm font-semibold text-cyan-200">{item.display}</div>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-slate-950/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-teal-300"
                  style={{ width: `${Math.min((item.value / max) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {footnote && <p className="mt-5 text-xs leading-6 text-slate-500">{footnote}</p>}
      </div>
    </div>
  );
}

function WaveActivityCard() {
  const maxBluetooth = Math.max(...waveData.map((item) => item.bluetooth));
  const maxSms = Math.max(...waveData.map((item) => item.sms));

  return (
    <div className={`${frostedCard} ${frostedOverlay} p-6`}>
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white">Behavioral Network Activity by Wave</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Bluetooth co-presence and SMS volume both peaked in Wave 2, making it a useful diagnostic point for network activity rather than a decorative trend.
        </p>

        <div className="mt-6 space-y-4">
          {waveData.map((item) => (
            <div key={item.wave} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{item.wave}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-slate-500">dyadic logs</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-cyan-200">Bluetooth ties</span>
                    <span className="text-slate-400">{item.bluetooth.toLocaleString()}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-300"
                      style={{ width: `${Math.min((item.bluetooth / maxBluetooth) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-teal-200">SMS messages</span>
                    <span className="text-slate-400">{item.sms.toLocaleString()}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-300 to-emerald-300"
                      style={{ width: `${Math.min((item.sms / maxSms) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))].sort((a, b) => (a === "All" ? -1 : a.localeCompare(b))),
    []
  );

  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () => projects.filter((project) => active === "All" || project.category === active),
    [active]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_34%),#020617] text-white">
      <Navigation />

      <div className="pointer-events-none absolute inset-0 data-grid opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

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
                <BookOpen className="h-4 w-4" />
                Academic project portfolio
              </div>

              <h1 className="bg-gradient-to-r from-cyan-200 via-white to-teal-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
                Featured Projects
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Applied research and analytics work across network science, experimental analysis, regression modeling, supervised learning, unsupervised learning, computer vision, and business analytics.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 pb-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {evidenceMetrics.map((metric, index) => {
              const Icon = metric.icon;

              return (
                <motion.div
                  key={`${metric.value}-${metric.label}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className={`${frostedCard} ${frostedOverlay} p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35`}
                >
                  <div className="relative z-10">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-cyan-300/30 to-transparent" />
                    </div>

                    <div className="bg-gradient-to-r from-cyan-200 to-teal-200 bg-clip-text text-4xl font-bold text-transparent">
                      {metric.value}
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-200">{metric.label}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{metric.source}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`${frostedCard} ${frostedOverlay} p-4`}
          >
            <div className="relative z-10 flex flex-wrap justify-center gap-3">
              <div className="mr-1 hidden items-center gap-2 text-sm text-slate-400 md:flex">
                <Filter className="h-4 w-4 text-cyan-300" />
                Filter
              </div>

              {categories.map((label) => {
                const isActive = active === label;

                return (
                  <button
                    key={label}
                    onClick={() => setActive(label)}
                    aria-pressed={isActive}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-300 to-teal-300 text-slate-950 shadow-lg shadow-cyan-950/30"
                        : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/30 hover:text-cyan-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">
            {filtered.map((project, index) => {
              const Icon = project.icon;

              return (
                <motion.article
                  key={`${project.title}-${index}`}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r ${project.color} opacity-0 blur-xl transition duration-300 group-hover:opacity-25`} />

                  <div className={`${frostedCard} ${frostedOverlay} h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 md:p-7`}>
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`rounded-3xl bg-gradient-to-br ${project.color} p-4 shadow-lg shadow-cyan-950/30`}>
                            <Icon className="h-7 w-7 text-slate-950" />
                          </div>
                          <div>
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                                {project.category}
                              </span>
                              {project.period && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                                  <Calendar className="h-3.5 w-3.5 text-cyan-300" />
                                  {project.period}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:border-cyan-300/30 hover:text-cyan-200"
                            title="Open GitHub"
                          >
                            <Github className="h-5 w-5" />
                          </a>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold tracking-tight text-white">{project.title}</h3>

                      {project.org && (
                        <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
                          <Users className="h-4 w-4 text-cyan-300" />
                          {project.org}
                        </p>
                      )}

                      <p className="mt-4 text-sm leading-7 text-slate-400">{project.description}</p>

                      {project.researchQuestion && (
                        <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-7 text-cyan-50">
                          <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                            Research Question
                          </div>
                          {project.researchQuestion}
                        </div>
                      )}

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {project.metrics.map((metric) => (
                          <MetricPill key={`${project.title}-${metric.label}`} metric={metric} />
                        ))}
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 backdrop-blur-xl">
                          <div className="mb-3 flex items-center gap-2 text-cyan-200">
                            <Code className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Methods</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.methods.map((method) => (
                              <span key={method} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                                {method}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 backdrop-blur-xl">
                          <div className="mb-3 flex items-center gap-2 text-cyan-200">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Findings</span>
                          </div>
                          <ul className="space-y-2 text-sm leading-6 text-slate-300">
                            {project.findings.slice(0, 2).map((finding) => (
                              <li key={finding} className="flex gap-2">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {project.caveat && (
                        <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
                          <span className="font-semibold">Interpretation note: </span>
                          {project.caveat}
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span key={tech} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
              <LineChart className="h-4 w-4" />
              Results dashboard
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Selected Quantitative Results</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              These visuals summarize interpretable results from the uploaded research reports rather than adding decorative charts.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            <HorizontalBarChart
              title="Advisor Appropriateness Means"
              subtitle="Mean appropriateness rating by advisor source on a 1–4 scale in the AI advice-seeking experiment."
              data={advisorMeans}
              max={4}
              footnote="ANOVA result: F(2, 247) = 14.64, p = 9.8e-07."
            />

            <HorizontalBarChart
              title="Facebook Friendship ERGM Odds Ratios"
              subtitle="Selected positive ERGM effects from the Copenhagen network analysis. Larger odds ratios indicate stronger conditional association with Facebook friendship ties."
              data={ergmOddsRatios}
              max={111.816}
              footnote="The SMS odds ratio is very large and should be read as evidence of strong association, not a causal effect."
            />

            <WaveActivityCard />
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200">
              <Award className="h-4 w-4" />
              Great Learning Journey
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">PGP-BABI-INTL Project Milestones</h2>
            <p className="mx-auto mt-3 max-w-3xl text-slate-400">
              A structured view of completed Great Learning projects, emphasizing objective, method, and applied value.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {learningMilestones.map((milestone, index) => {
              const Icon = milestone.icon;

              return (
                <motion.article
                  key={milestone.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className={`${frostedCard} ${frostedOverlay} p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35`}
                >
                  <div className="relative z-10">
                    <div className="mb-5 flex items-start gap-4">
                      <div className={`rounded-2xl bg-gradient-to-br ${milestone.color} p-3 shadow-lg shadow-cyan-950/30`}>
                        <Icon className="h-6 w-6 text-slate-950" />
                      </div>

                      <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
                          <Award className="h-3.5 w-3.5" />
                          Project completed
                        </div>
                        <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                        <p className="mt-1 text-sm text-cyan-200">{milestone.course}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm leading-7 text-slate-300">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Objective</div>
                      {milestone.objective}
                    </div>

                    <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-7 text-cyan-50">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Applied value</div>
                      {milestone.value}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {milestone.methods.map((method) => (
                        <span key={method} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                          #{method.replace(/\s+/g, "")}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

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
                <ExternalLink className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Interested in Collaboration?</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-400">
                Open to projects involving data science, machine learning, behavioral analytics, network analysis, experimental design, and applied AI.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-teal-300 px-7 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/20"
              >
                Let&apos;s Connect
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
