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
      "Rishav Chakravarty is a master's student in Data Analytics & Computational Social Science at UMass Amherst, graduating in December 2027. He is based in Amherst, Massachusetts, and works on data analytics, business and product analytics, and applied data science.",
      "His background combines data analytics, psychology, computer science and business. He has consulting experience in analytics and digital strategy, worked with behavioral data at Intercare Therapy, and is product manager for ProDose, a smart medication dispenser in development. He is also co-founder of Kinnovation Group, a venture studio.",
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
      "A few things stand out. He has formal quantitative training from UT Austin and the UMass DACSS program, and consulting experience analyzing customer and operational data, building KPI dashboards and supporting digital strategy at Steve Fisher Consulting and Simple Coaching.",
      "He also has a behavioral background: a psychology degree with a computer science minor, and behavioral data work at Intercare Therapy under HIPAA. He works in Python, SQL, R and Power BI.",
      "His projects are public, so you can check them. He has five public repositories, including an NLP analysis of 25,886 Reddit posts and comments with raw data included so you can re-run it.",
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
      "Three, in order. B.S. in Psychology with a Minor in Computer Science from Virginia Tech (August 2021 to May 2024). Postgraduate Diploma in Data Science & Business Analytics from UT Austin (January to September 2024). M.S. in Data Analytics & Computational Social Science from UMass Amherst (September 2025 to December 2027, expected).",
      "The DACSS program combines data analytics with social science methods, including network analysis, experimental design and causal inference.",
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
      "Currently: Product Manager for ProDose, a smart medication dispenser in development, with a UMass Amherst senior capstone team (since September 2026). Before that: Data Analytics & Strategy Consultant at Steve Fisher Consulting (May 2025 to April 2026) and Digital Strategy & Analytics Consultant at Simple Coaching Inc. (March to August 2025).",
      "Earlier: Behavioral Health Technician at Intercare Therapy, featured speaker for Google Developer Student Clubs, Dietrick Student Manager at Virginia Tech Dining Services (August 2021 to April 2024), and a data analytics internship at Zad Holding Company in Doha, Qatar (March to August 2021), which included a client analytics project for Ooredoo Qatar.",
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
      "The one to start with is his Reddit analysis. He collected 25,886 posts and comments from three mental health subreddits, scored them with three sentiment methods, and compared logistic regression, a linear SVM and a random forest. The topics that came out were mostly about money and housing, not mental health directly.",
      "He also built an interactive scroll story with D3 and Three.js on how the Billboard Hot 100 changed between 2000 and 2023, using chart data joined to Spotify audio features.",
      "Two more are public too: a set of scrapers that combines campus safety alerts from ten universities into one dataset (519 documents, with the source recorded for every row), and a misere Nim agent that uses minimax with alpha-beta pruning and stays inside a one-second move limit.",
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
    question: "What is Kinnovation Group?",
    suggest: true,
    keywords: [
      "kinnovation", "studio", "venture", "startup", "founder", "cofounder",
      "co-founder", "entrepreneur", "company", "kinjal", "pandey",
    ],
    answer: [
      "Kinnovation Group is a venture studio Rishav co-founded with Kinjal Pandey. It is not an incubator or a consultancy.",
      "Seven ventures, none of them a launched product. Karnah (an in-kind donation platform in development), CalendAI (a scheduling app in development), MeAsmi (a machine learning platform for neurodivergent support in development), ProDose (a smart medication dispenser in development), NutriNavigator (a nutrition app prototype in Flutter), Trendify AI (a concept) and Witness (a concept). Three of the ventures have won pitch competitions.",
      "None has disclosed revenue or users, and none is fundraising.",
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
      "Analytics: data analysis, business analytics, product analytics, customer analytics and A/B testing. Statistics and modeling: statistical analysis, predictive modeling, causal inference, NLP, regression, clustering and time series.",
      "Languages and BI: Python, SQL, R and Power BI, plus JavaScript, Java, MATLAB and Bash. Libraries: Pandas, NumPy, scikit-learn, TensorFlow, Transformers, NLTK, Matplotlib, Plotly Dash and D3.js. Data and engineering: Microsoft SQL Server, MongoDB, Google Cloud, React, Node.js, Docker and Git.",
    ],
  },
  {
    id: "psychology",
    question: "Why does the psychology background matter?",
    suggest: true,
    keywords: [
      "psychology", "psych", "behavior", "behaviour", "behavioral", "behavioural",
      "aba", "intercare", "therapy", "clinical", "autism", "neurodivergent",
      "matter", "relevant",
    ],
    answer: [
      "It gives him experience collecting and interpreting behavioral data. At Intercare Therapy he collected and analyzed behavioral data during Applied Behavior Analysis sessions and used client progress to inform session-level adjustments under clinical supervision and HIPAA.",
      "He brings that attention to how data is collected, and what it can and cannot show, to his analytics work.",
    ],
  },
  {
    id: "contact",
    question: "How do I get in touch?",
    suggest: true,
    keywords: [
      "contact", "email", "reach", "hire", "available", "availability",
      "linkedin", "github", "resume", "cv", "opportunity", "internship",
      "looking", "connect", "message", "touch",
    ],
    answer: [
      "Email rishavchakravarty18@gmail.com. He is on LinkedIn at linkedin.com/in/rishav-dsc and GitHub at github.com/rishav-dev, and his resume is downloadable from the bottom of this page.",
      "He is currently interested in internships and co-ops during his master's program, as well as future full-time opportunities in data analytics, business analytics, product analytics, applied data science, research, BI and analytics consulting. He graduates in December 2027.",
    ],
  },
  {
    id: "location",
    question: "Where is he based?",
    keywords: ["location", "based", "live", "city", "state", "relocate", "remote", "amherst"],
    answer: [
      "Amherst, Massachusetts, where he is doing the DACSS master's at UMass. He has previously worked in San Diego, Boston, Blacksburg, for a firm in Menifee, California, and in Doha, Qatar.",
    ],
  },
  {
    id: "consulting",
    question: "What did he do at Steve Fisher Consulting?",
    keywords: ["steve", "fisher", "consulting", "legal", "law", "menifee"],
    answer: [
      "He was Data Analytics & Strategy Consultant there from May 2025 to April 2026. He analyzed client engagement, retention and conversion data to identify patterns and support business and digital strategy decisions.",
      "He built KPI dashboards for marketing, operations and customer behavior, developed predictive models to identify patterns and opportunities for targeted interventions, applied statistical and behavioral analysis to improve workflows and outreach, and evaluated AI-enabled tools with an emphasis on transparency, trust and user needs.",
    ],
  },
  {
    id: "prodose",
    question: "What is ProDose?",
    keywords: ["prodose", "dispenser", "medication", "pill", "capstone", "simulation", "simulator", "product", "manager"],
    answer: [
      "ProDose is a smart medication dispensing system in development, designed to automate scheduled dispensing of tablets and capsules. Rishav is the product manager, working with a five-person UMass Amherst Mechanical & Industrial Engineering senior capstone team on CAD, 3D-printed prototypes, testing and design refinement.",
      "This site includes a design lab for it: a physics simulation of eight dispensing concepts, with a test bench, a sensing lab, a design comparison and a research page.",
    ],
  },
  {
    id: "zad",
    question: "What did he do at Zad Holding?",
    keywords: ["zad", "holding", "ooredoo", "qatar", "doha", "intern", "internship", "telecom", "data", "plan"],
    answer: [
      "He was a Data Analytics Intern at Zad Holding Company in Doha, Qatar, from March to August 2021. He built datasets, database structures and Power BI reporting workflows to support operational analysis, automated parts of the reporting process, and used statistical and cost-benefit analysis to compare business scenarios.",
      "As part of the internship he completed a client analytics project for Ooredoo Qatar, using customer usage data, statistical inference and Power BI to develop a mobile data-plan recommendation.",
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
  psych: ["psychology", "behavioral", "behavioural"],
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
