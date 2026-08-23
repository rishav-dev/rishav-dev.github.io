/**
 * Offline knowledge base.
 *
 * No model, no network. Questions are scored against each entry's keywords and
 * the best match above a threshold is returned verbatim, which means the
 * offline assistant can only ever say things written here by hand.
 *
 * This is the floor, not the fallback of last resort. It runs when the Worker
 * is not configured, unreachable, rate-limited, or slow, and on a site whose
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
      "He came in through psychology. A B.S. from Virginia Tech, then clinical work delivering Applied Behaviour Analysis, which is why he starts from the behaviour rather than the metric. He is also co-founder of Kinnovation, a venture studio.",
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
      "Three things sit together in his record that usually do not. Four years of behavioural research and clinical data collection, including hands-on ABA work under HIPAA. Formal quantitative training across UT Austin and the UMass DACSS programme. And a habit of finishing: the analysis, the dashboard, the app, whatever it takes for the finding to reach someone who acts on it.",
      "He also puts his work where people can check it. Six public repositories, including one with 25,886 Reddit records, three sentiment methods and three classifiers, raw data included so you can re-run it yourself.",
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
      "DACSS is the unusual one. It takes the social science as seriously as the computation, so the coursework runs through network analysis, experimental design and causal inference as well as the modelling.",
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
      "Start with the two you can read the code for. He pulled 25,886 posts and comments out of three mental health subreddits, scored them three ways, and put logistic regression, a linear SVM and a random forest against each other. The topic clusters that came out are mostly about money and housing rather than mental health, which is the finding he would defend in a room.",
      "The other is a D3 and Three.js scrollytelling piece on how the Billboard Hot 100 changed between 2000 and 2023, built on chart data joined to Spotify audio features.",
      "Then two more, also public. A scraper that builds one comparable dataset out of ten universities that each publish campus safety alerts differently, 519 documents across HTML and PDF with provenance on every row. And an adversarial search agent for misere Nim: iterative-deepening minimax with alpha-beta pruning and transposition caching, inside a one second per move budget.",
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
      "Supervised and unsupervised, applied rather than research-track. The clearest example is public: TF-IDF features into logistic regression, a linear SVM and a random forest over 25,886 Reddit records, with three separate sentiment methods underneath. Logistic regression and the random forest tied at 91.25 percent accuracy and 0.871 F1. Every figure is in the repository.",
      "Beyond that: ERGMs for network data, ANOVA against designed experiments, clustering on financial time series, and classical adversarial search in the Nim agent. He tends to run more than one method and report where they disagree.",
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
      "Kinnovation is a venture studio Rishav co-founded with Kinjal Pandey. Not an incubator and not a consultancy. They build the things themselves and keep the ones that survive a room full of judges.",
      "Six ventures, all joint work: Karnah (traceable in-kind donation matching), Trendify AI (finds the clip in your camera roll that fits what is trending), CalendAI (a calendar that reschedules itself), MeAsmi (ML for neurodivergent support), NutriNavigator (nutrition guidance in Flutter), and Witness (a sealed evidence vault). Three of them have won pitch competitions.",
      "All are in development or at concept stage. None is a launched commercial product, none has disclosed revenue or users, and none is fundraising.",
    ],
  },
  {
    id: "pitches",
    question: "What has he won?",
    suggest: true,
    keywords: [
      "award", "won", "win", "honor", "honour", "prize", "prizes", "recognition",
      "grant", "competition", "pitch", "pitches", "upitch", "minute", "money",
      "cash", "funding", "total", "berthiaume", "apex",
    ],
    answer: [
      "Three pitch competitions, $1,550 in prize money, all of it won with Kinjal Pandey. They pitch together, never separately.",
      "$750 and second place for Karnah at UPitch Spring 2026, run by the UMass Amherst Entrepreneurship Club. $300 for Trendify AI at Minute Pitch, from the Berthiaume Center for Entrepreneurship at UMass. And $500 for CalendAI from the Apex Center for Entrepreneurs at Virginia Tech.",
      "Separately, he holds The Action Taker Award from LISC Massachusetts and the IXL Center, for the digital upgrades he led during their Digital Growth Accelerator, and was selected for the Franklin County CDC Entrepreneurs Accelerator in 2026.",
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
      "When your dataset is a child's afternoon you stop treating measurement as paperwork. You learn what a noisy signal costs, why the instrument changes the reading, and how fast a model falls apart when conditions shift. That is the habit he brings to analytics work.",
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
      "He was Data and Behavioural Insights Associate there from May 2025 to April 2026. He rebuilt the firm's website around how people actually arrive at a lawyer, which is anxious, mid-problem and scanning fast for relevance, rather than around the firm's org chart.",
      "The quieter half mattered more. He automated the intake, the scheduling and the recurring reporting, which gave a small team back a serious amount of their week. Underneath both: statistical analysis of client engagement data, KPI dashboards for the partners, and predictive models to flag matters likely to need attention early.",
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
