/**
 * Offline knowledge base.
 *
 * No model, no network. Questions are scored against each entry's keywords and
 * the best match above a threshold is returned verbatim, which means the
 * offline assistant can only ever say things written here by hand.
 *
 * This is the floor, not the fallback of last resort. It runs when the Worker
 * is not configured, unreachable, rate-limited, or slow — and on a site whose
 * whole point is that it works, an assistant that degrades to *worse but still
 * correct* answers beats one that degrades to a spinner.
 *
 * To teach it something: add an entry. To change what it says: edit `answer`.
 */

export interface Entry {
  id: string;
  /** Terms that pull a question toward this entry. Lowercase, singular. */
  keywords: string[];
  /** Shown as a suggested prompt when `suggest` is true. */
  question: string;
  suggest?: boolean;
  /** Each string renders as its own paragraph. */
  answer: string[];
}

export const ENTRIES: Entry[] = [
  {
    id: "who",
    question: "Who is Rishav?",
    suggest: true,
    keywords: [
      "who", "about", "summary", "bio", "intro", "introduce", "rishav",
      "chakravarty", "background", "yourself", "himself",
    ],
    answer: [
      "Rishav Chakravarty is a data scientist and ML engineer based in Amherst, Massachusetts. He is finishing an M.S. in Data Analytics & Computational Social Science at UMass Amherst in May 2027.",
      "He came to data science from psychology — a B.S. from Virginia Tech, and clinical work delivering Applied Behaviour Analysis — which is why his work tends to start from the behaviour rather than the metric. He is also co-founder of Kinnovation, a venture studio.",
    ],
  },
  {
    id: "why-hire",
    question: "Why should we hire him?",
    suggest: true,
    keywords: [
      "why", "hire", "hiring", "recruit", "strength", "fit", "unique",
      "different", "stand", "value", "candidate", "best", "good", "suited",
    ],
    answer: [
      "Three things sit together in his record that usually do not. Four years of behavioural research and clinical data collection; formal quantitative training across UT Austin and the UMass DACSS programme; and a track record of shipping — 37% more client enquiries and 43% less administrative load at Steve Fisher Consulting, 40% revenue growth at Simple Coaching.",
      "The practical version: he can design the study, build the model, and then build the thing that acts on it. Most candidates do one of those three.",
    ],
  },
  {
    id: "education",
    question: "What did he study?",
    suggest: true,
    keywords: [
      "education", "degree", "school", "university", "college", "study",
      "studied", "master", "bachelor", "umass", "amherst", "dacss", "virginia",
      "tech", "texas", "austin", "psychology", "coursework", "graduate",
    ],
    answer: [
      "Three, in order. B.S. in Psychology with a Computer Science minor from Virginia Tech (2021–2024). Postgraduate Diploma in Data Science & Business Analytics from UT Austin (2024). M.S. in Data Analytics & Computational Social Science from UMass Amherst (2025–2027).",
      "DACSS is the unusual one — it takes the social science as seriously as the computation, so the coursework runs through network analysis, experimental design and causal inference as well as the modelling.",
    ],
  },
  {
    id: "experience",
    question: "Where has he worked?",
    suggest: true,
    keywords: [
      "experience", "work", "worked", "job", "role", "career", "employer",
      "history", "where", "position", "company",
    ],
    answer: [
      "Most recently: Data & Behavioural Insights Associate at Steve Fisher Consulting (2025–2026), and Client Experience & Digital Strategy Consultant at Simple Coaching Inc. (2025).",
      "Before that: Behavioural Health Technician at Intercare Therapy, featured speaker for Google Developer Student Clubs, and data analytics internships at Zad Holding Company and Ooredoo in Doha, Qatar. He was also selected for the Franklin County CDC Entrepreneurs Accelerator in 2026.",
      "Ask about any one of them by name and I will go deeper.",
    ],
  },
  {
    id: "projects",
    question: "What has he built?",
    suggest: true,
    keywords: [
      "project", "built", "build", "portfolio", "made", "github", "code",
      "sample", "work sample",
    ],
    answer: [
      "Five worth naming. A TensorFlow face recognition system at 93% accuracy with a 25% cut in inference time. ERGM modelling over 6,429 friendship ties from the Copenhagen Networks Study. A survey experiment on when people take advice from an AI rather than a person, 250 observations, analysed with ANOVA.",
      "Plus a regression pricing model over 20,000+ refurbished device sales for ReCell, and k-means and hierarchical clustering across S&P 500 time series.",
    ],
  },
  {
    id: "ml",
    question: "What's his machine learning experience?",
    suggest: true,
    keywords: [
      "machine", "learning", "ml", "model", "modelling", "modeling", "ai",
      "tensorflow", "deep", "neural", "predictive", "algorithm",
    ],
    answer: [
      "Supervised and unsupervised, applied rather than research-track. Computer vision in TensorFlow — the face recognition system reached 93% after hyperparameter tuning, and GPU acceleration took 25% off inference time. Regression and predictive modelling for pricing and for forecasting client outcomes. k-means and hierarchical clustering on financial time series.",
      "On the statistical side: ERGMs for network data, ANOVA against designed experiments, and the model tuning and validation coursework behind both.",
    ],
  },
  {
    id: "kinnovation",
    question: "What is Kinnovation?",
    suggest: true,
    keywords: [
      "kinnovation", "studio", "venture", "startup", "founder", "cofounder",
      "co-founder", "entrepreneur", "company", "kinjal", "pandey",
    ],
    answer: [
      "Kinnovation is a venture studio Rishav co-founded with Kinjal Pandey. Not an incubator or a consultancy — they build the things themselves and keep the ones that survive contact with a room full of judges.",
      "The ventures Rishav works on are Karnah (in-kind donation matching, second place and $750 at UMass UPitch 2026), CalendAI (self-rescheduling calendar, KickStart VT seed grant), MeAsmi (ML for neurodivergent support), and NutriNavigator (nutrition guidance in Flutter). All are in development; none is a launched commercial product.",
    ],
  },
  {
    id: "awards",
    question: "What has he won?",
    keywords: [
      "award", "won", "win", "honor", "honour", "prize", "recognition", "grant",
      "competition", "pitch", "upitch", "kickstart", "scholarship",
    ],
    answer: [
      "Second place and $750 at UMass UPitch Spring 2026 for Karnah. The Action Taker Award from LISC Massachusetts and the IXL Center, for leading the digital upgrades in their Digital Growth Accelerator. The KickStart VT Seed Grant at Virginia Tech for CalendAI. And the Future Founder Startup Award at the Minute Pitch Competition.",
    ],
  },
  {
    id: "stack",
    question: "What's his technical stack?",
    suggest: true,
    keywords: [
      "stack", "skill", "tool", "technology", "language", "python", "sql", "r",
      "javascript", "docker", "react", "power", "bi", "know", "proficient",
      "framework",
    ],
    answer: [
      "Languages: Python, R, SQL, JavaScript, Java, MATLAB, Bash. ML and analysis: TensorFlow, Pandas, NumPy, scikit-learn, Matplotlib, ERGM, time series methods.",
      "Data platforms: Power BI, MongoDB, Microsoft SQL Server, Google Cloud. Engineering: React, Node.js, Docker, Git, JUnit.",
      "Strongest in Python and SQL for the analysis, TensorFlow for the modelling, Power BI for getting it in front of people who make decisions.",
    ],
  },
  {
    id: "psychology",
    question: "Why does the psychology background matter?",
    suggest: true,
    keywords: [
      "psychology", "psych", "behaviour", "behavior", "behavioural", "behavioral",
      "aba", "intercare", "therapy", "clinical", "autism", "neurodivergent",
      "matter", "relevant",
    ],
    answer: [
      "Because it changes what he does when a number moves. Applied Behaviour Analysis work at Intercare meant collecting data on every trial of a session with an autistic child, under HIPAA, and adjusting the intervention from that data in real time.",
      "When your dataset is a child's afternoon, you stop treating measurement as a formality — you learn what a noisy signal costs, why the instrument changes the reading, and how quickly a model degrades when conditions shift. That is the habit he brings to analytics work.",
    ],
  },
  {
    id: "contact",
    question: "How do I get in touch?",
    suggest: true,
    keywords: [
      "contact", "email", "reach", "hire", "available", "availability",
      "linkedin", "github", "resume", "cv", "opportunity", "internship",
      "looking", "connect", "message",
    ],
    answer: [
      "Email rishavchakra@umass.edu. He is on LinkedIn at linkedin.com/in/rishav-dsc and GitHub at github.com/rishav-dev, and his resume is downloadable from the bottom of this page.",
      "He finishes the DACSS master's in May 2027 and is open to data science, ML and analytics roles and internships in the meantime.",
    ],
  },
  {
    id: "location",
    question: "Where is he based?",
    keywords: ["location", "based", "live", "city", "state", "relocate", "remote", "amherst"],
    answer: [
      "Amherst, Massachusetts, where he is doing the DACSS master's at UMass. He has previously worked in San Diego, Blacksburg, remotely for a California firm, and in Doha, Qatar.",
    ],
  },
  {
    id: "consulting",
    question: "What did he do at Steve Fisher Consulting?",
    keywords: ["steve", "fisher", "consulting", "legal", "law", "menifee", "37", "43"],
    answer: [
      "He was Data & Behavioural Insights Associate there from May 2025 to April 2026. He rebuilt the firm's website around how people actually arrive at a lawyer — anxious, mid-problem, scanning for relevance — rather than around the firm's org chart. New client enquiries rose 37%.",
      "The quieter half mattered more: automating intake, scheduling and recurring reporting removed roughly 43% of the administrative workload. Underneath both, statistical analysis of client data, KPI dashboards, and predictive models to flag matters likely to need early intervention.",
    ],
  },
];

/* ==========================================================================
   Matching
   ========================================================================== */

const SYNONYMS: Record<string, string[]> = {
  ml: ["machine", "learning"],
  ai: ["artificial", "intelligence"],
  cv: ["computer", "vision"],
  uni: ["university", "school"],
  grad: ["graduate", "master"],
  psych: ["psychology", "behavioural"],
  vt: ["virginia", "tech"],
  umass: ["massachusetts", "amherst"],
  job: ["work", "role", "experience"],
  jobs: ["work", "role", "experience"],
};

export interface Match {
  entry: Entry;
  score: number;
}

/**
 * Best entry for a query, or null when nothing clears the bar.
 *
 * The threshold matters more than the scoring. Returning a weak match reads as
 * the assistant misunderstanding the question, which is worse than it saying
 * plainly that the answer is not in its notes.
 */
export function retrieve(query: string): Match | null {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const terms = new Set(words);
  for (const w of words) {
    for (const s of SYNONYMS[w] ?? []) terms.add(s);
    if (w.endsWith("s") && w.length > 3) terms.add(w.slice(0, -1));
  }

  let best: Match | null = null;

  for (const entry of ENTRIES) {
    let score = 0;
    for (const t of terms) {
      if (entry.keywords.includes(t)) score += 3;
      else if (entry.keywords.some((k) => k.startsWith(t) && t.length > 3)) score += 1;
      if (entry.question.toLowerCase().includes(t) && t.length > 3) score += 1;
    }
    if (!best || score > best.score) best = { entry, score };
  }

  return best && best.score >= 3 ? best : null;
}

export const SUGGESTIONS = ENTRIES.filter((e) => e.suggest);
