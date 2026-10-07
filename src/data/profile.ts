/**
 * Every fact on this site comes from this file.
 *
 * THE RULE: if a visitor cannot click through and check it, it does not go
 * here as a number.
 *
 * That rule is why the consulting percentages that used to be on this site are
 * gone. They were real, but they were internal figures from private companies
 * with no public record, and a portfolio full of numbers nobody can verify is
 * worth less than a portfolio of repositories anyone can open. What is
 * left is code you can read, datasets you can download, cheques that were
 * photographed, and degrees that can be confirmed.
 *
 * Voice: first person, plain, no em dashes. Write it the way he would say it out loud.
 */

/* ==========================================================================
   Identity
   ========================================================================== */

export const PERSON = {
  name: "Rishav Chakravarty",
  short: "Rishav",
  location: "Amherst, Massachusetts",
  email: "rishavchakravarty18@gmail.com",
  phone: "443-214-4881",
  linkedin: "https://www.linkedin.com/in/rishav-dsc",
  github: "https://github.com/rishav-dev",
  site: "https://www.rishavchakravarty.com",
  resume: "/Rishav_Chakravarty_Resume_DSA.pdf",
} as const;

export const THESIS = {
  line: "I use data to understand behavior and support better decisions.",
  body:
    "My background combines data analytics, psychology, computer science and business. I started in " +
    "psychology because I wanted to understand why people make the choices they do, then built the " +
    "quantitative skills to study it: a postgraduate diploma in data science and business analytics at " +
    "UT Austin, and now an M.S. in Data Analytics and Computational Social Science at UMass Amherst. " +
    "My experience spans data analysis, business and digital strategy, behavioral analysis and product " +
    "development.",
} as const;

export const HERO = {
  /* Two lines. The second takes the gradient. */
  lines: ["Data, behavior,", "and better decisions."],
  kicker:
    "I'm pursuing an M.S. in Data Analytics & Computational Social Science at UMass Amherst, graduating " +
    "in December 2027. My work spans analytics, research, product development, and behavioral data using " +
    "Python, SQL, R, Power BI, and statistical methods.",
  role: "Data Analytics · Business & Product Analytics · Applied Data Science",
  /**
   * The proof strip under the hero. Three claims, each one clickable through
   * to the thing that backs it. Nothing goes here that cannot be checked.
   */
  proof: [
    { value: "25,886", label: "posts and comments analyzed", href: "#projects" },
    { value: "519", label: "safety documents across 10 universities", href: "#projects" },
    { value: "$1,550", label: "in pitch competition awards", href: "#ventures" },
  ],
} as const;

/* ==========================================================================
   The pipeline
   ========================================================================== */

export interface Stage {
  id: string;
  index: string;
  title: string;
  verb: string;
  body: string;
  hue: string;
  tools: string[];
}

export const PIPELINE: Stage[] = [
  {
    id: "behavior",
    index: "01",
    title: "Behavior",
    verb: "Observe",
    body:
      "My first data work was behavioral. I recorded prompts and responses during Applied Behavior " +
      "Analysis sessions under clinical supervision and HIPAA. It showed me that data depends on how and " +
      "where it was collected, which I check at the start of every project.",
    hue: "--indigo",
    tools: ["ABA", "Experimental design", "Survey instruments"],
  },
  {
    id: "data",
    index: "02",
    title: "Data",
    verb: "Build",
    body:
      "Most of the work happens here. I collected 25,886 Reddit posts and comments through the API, " +
      "joined Billboard chart history to Spotify audio features, and built the datasets and Power BI " +
      "reporting at an internship in Doha. Everything downstream depends on this step.",
    hue: "--cyan",
    tools: ["Python", "SQL", "PRAW", "Pandas", "Power BI"],
  },
  {
    id: "model",
    index: "03",
    title: "Model",
    verb: "Test",
    body:
      "I've used regression, clustering, classification, NLP and exponential random graph models. I " +
      "usually compare a few methods on the same problem and look at where they disagree, which helps " +
      "show how much to trust a result.",
    hue: "--indigo",
    tools: ["scikit-learn", "TensorFlow", "R", "statnet", "Transformers"],
  },
  {
    id: "decision",
    index: "04",
    title: "Decision",
    verb: "Ship",
    body:
      "Analysis is only useful if the people making the decision can use it. I build dashboards, " +
      "interactive visualizations and prototypes so the results are clear to a non-technical audience.",
    hue: "--cyan",
    tools: ["Power BI", "D3.js", "Plotly Dash", "Three.js", "React"],
  },
];

/* ==========================================================================
   Work

   No performance percentages. See the note at the top of this file.
   ========================================================================== */

export interface Role {
  slug: string;
  org: string;
  orgHref?: string;
  title: string;
  start: string;
  end: string;
  order: number;
  place: string;
  /** One line, on the index. */
  summary: string;
  /** The detail, in his voice. */
  detail: string[];
  /** What he actually did. Checkable claims, not outcomes. */
  did: string[];
  stack: string[];
  kind: "work" | "speaking";
  /** Extra links on the detail page. "demo" is an on-site page. */
  links?: { label: string; href: string; kind: "repo" | "site" | "data" | "demo" }[];
}

export const ROLES: Role[] = [
  {
    slug: "prodose",
    org: "ProDose",
    title: "Product Manager",
    start: "Sep 2026",
    end: "Present",
    order: 202609,
    place: "Amherst, MA",
    summary:
      "Product manager for a smart medication dispenser in development, working with a five-person senior capstone team. There's a physics simulation of eight dispensing concepts you can try here.",
    detail: [
      "ProDose is a smart medication dispensing system in development, designed to automate scheduled " +
        "dispensing of tablets and capsules. I lead product development with a five-person UMass Amherst " +
        "Mechanical & Industrial Engineering senior capstone team.",
      "I translate product requirements into design and prototype decisions, and coordinate CAD, " +
        "3D-printed prototyping, testing, design refinement and manufacturability review. The site also " +
        "has a design lab you can try: a physics simulation of eight dispensing concepts, with a test " +
        "bench and a comparison of the concepts.",
    ],
    did: [
      "Lead product development for a smart medication dispenser",
      "Translate requirements into design and prototype decisions",
      "Coordinate CAD, 3D-printed prototyping, testing and design refinement",
      "Manufacturability review with a five-person capstone team",
    ],
    stack: ["CAD", "3D printing", "Prototyping", "Product management"],
    kind: "work",
    links: [
      { label: "Design lab", href: "/work/prodose/simulation/", kind: "demo" },
      { label: "Simulator", href: "/work/prodose/simulation/simulator/", kind: "demo" },
      { label: "Test bench", href: "/work/prodose/simulation/bench/", kind: "demo" },
      { label: "Sensing lab", href: "/work/prodose/simulation/sensing/", kind: "demo" },
      { label: "Bottle, chute and cleaning labs", href: "/work/prodose/simulation/labs/", kind: "demo" },
      { label: "Design decision", href: "/work/prodose/simulation/design/", kind: "demo" },
      { label: "Research", href: "/work/prodose/simulation/research/", kind: "demo" },
      { label: "Physics check", href: "/work/prodose/simulation/physics-check/", kind: "demo" },
    ],
  },
  {
    slug: "steve-fisher",
    org: "Steve Fisher Consulting",
    title: "Data Analytics & Strategy Consultant",
    start: "May 2025",
    end: "Apr 2026",
    order: 202505,
    place: "Menifee, CA",
    summary: "Analyzed client and operational data, built KPI dashboards and supported digital strategy for a legal services firm.",
    detail: [
      "I analyzed client engagement, retention and conversion data to identify patterns and support " +
        "business and digital strategy decisions.",
      "I built KPI dashboards for marketing, operations and customer behavior, and developed predictive " +
        "models to identify patterns and opportunities for targeted interventions.",
      "I applied statistical and behavioral analysis to improve workflows, outreach and client-facing " +
        "experiences, and evaluated the use of AI-enabled tools with an emphasis on transparency, trust " +
        "and user needs.",
    ],
    did: [
      "Analysis of client engagement, retention and conversion data",
      "KPI dashboards for marketing, operations and customer behavior",
      "Predictive models to identify patterns and opportunities",
      "Evaluation of AI-enabled tools for transparency and user needs",
    ],
    stack: ["Python", "SQL", "Power BI", "Statistical analysis", "Predictive modeling"],
    kind: "work",
  },
  {
    slug: "simple-coaching",
    org: "Simple Coaching Inc.",
    title: "Digital Strategy & Analytics Consultant",
    start: "Mar 2025",
    end: "Aug 2025",
    order: 202503,
    place: "Boston, MA",
    summary: "Used customer journey and performance data to support digital strategy for a wellness practice.",
    detail: [
      "I analyzed customer behavior and client journeys to improve service pages, digital strategy and " +
        "the customer experience, and used SEO and performance analytics to evaluate traffic, " +
        "engagement and conversion.",
      "I worked with leadership on new service offerings, including wellness workshops and other client " +
        "programs, and conducted digital audits that supported website improvements, content strategy " +
        "and digital outreach.",
      "I also helped develop internship roles for graphic design and social media support.",
    ],
    did: [
      "Customer behavior and client journey analysis",
      "SEO and performance analytics on traffic, engagement and conversion",
      "Digital audits, website and content improvements",
      "Input on new service offerings with leadership",
    ],
    stack: ["SEO", "Analytics", "Customer journey analysis", "Content strategy"],
    kind: "work",
  },
  {
    slug: "intercare",
    org: "Intercare Therapy",
    orgHref: "https://www.intercaretherapy.com/",
    title: "Behavioral Health Technician",
    start: "Jan 2025",
    end: "Jun 2025",
    order: 202501,
    place: "San Diego, CA",
    summary:
      "Collected and analyzed behavioral data during Applied Behavior Analysis sessions under clinical supervision.",
    detail: [
      "I collected and analyzed behavioral data during Applied Behavior Analysis sessions and used " +
        "client progress to inform session-level adjustments under clinical supervision.",
      "I implemented reinforcement schedules, prompt fading, task analysis and other evidence-based ABA " +
        "interventions, and worked with caregivers and clinical staff to support consistency across home " +
        "and community settings.",
      "I used de-escalation and crisis-management techniques when needed, while maintaining HIPAA and " +
        "organizational requirements.",
    ],
    did: [
      "Behavioral data collection and session-level adjustments",
      "Reinforcement schedules, prompt fading and task analysis",
      "Coordination with caregivers and clinical staff",
      "HIPAA compliance",
    ],
    stack: ["ABA", "HIPAA", "Behavioral data collection"],
    kind: "work",
  },
  {
    slug: "gdsc",
    org: "Google Developer Student Clubs",
    orgHref: "https://developers.google.com/community/gdsc",
    title: "Featured Speaker, AI for Mental Health",
    start: "Aug 2023",
    end: "Nov 2023",
    order: 202308,
    place: "Blacksburg, VA",
    summary: "Presented applications of machine learning for personalized mental health interventions to 150+ participants.",
    detail: [
      "I presented applications of machine learning for personalized mental health interventions to " +
        "150+ participants, and discussed how behavioral science, machine learning and data-driven " +
        "methods can be combined in health technology.",
      "I developed supporting Power BI visualizations to communicate the analytics concepts to the " +
        "audience.",
    ],
    did: [
      "Talk on machine learning for personalized mental health interventions",
      "Power BI visualizations to communicate analytics concepts",
    ],
    stack: ["Machine learning", "Power BI", "Public speaking"],
    kind: "speaking",
  },
  {
    slug: "dietrick",
    org: "Virginia Tech Dining Services",
    orgHref: "https://dining.vt.edu/",
    title: "Dietrick Student Manager",
    start: "Aug 2021",
    end: "Apr 2024",
    order: 202108,
    place: "Blacksburg, VA",
    summary: "Student manager in a high-volume Virginia Tech dining facility.",
    detail: [
      "I managed daily operations in a high-volume Virginia Tech dining facility, trained and " +
        "supervised staff, and provided performance feedback.",
      "I helped coordinate day-to-day operations and maintained customer-service, food-safety and " +
        "operational standards in a fast-paced environment.",
    ],
    did: [
      "Managed daily operations in a high-volume dining facility",
      "Trained and supervised staff and gave performance feedback",
      "Maintained customer-service and food-safety standards",
    ],
    stack: ["Team leadership", "Operations", "Training"],
    kind: "work",
  },
  {
    slug: "zad-holding",
    org: "Zad Holding Company Q.P.S.C.",
    orgHref: "https://www.zadholding.com/",
    title: "Data Analytics Intern",
    start: "Mar 2021",
    end: "Aug 2021",
    order: 202103,
    place: "Doha, Qatar",
    summary: "Built datasets and Power BI reporting, and completed a customer analytics project for Ooredoo Qatar.",
    detail: [
      "I built datasets, database structures and Power BI reporting workflows to support operational " +
        "analysis, and automated parts of the reporting process to reduce manual workload.",
      "I used statistical and cost-benefit analysis to compare business scenarios and support " +
        "recommendations.",
      "Completed a client analytics project for Ooredoo Qatar using customer usage data, statistical " +
        "inference, and Power BI to develop a mobile data-plan recommendation.",
    ],
    did: [
      "Built datasets, database structures and Power BI reporting",
      "Statistical and cost-benefit analysis of business scenarios",
      "Automated parts of the reporting process",
      "Ooredoo Qatar client project: mobile data-plan recommendation from customer usage data",
    ],
    stack: ["Power BI", "SQL", "Statistical analysis", "Statistical inference"],
    kind: "work",
  },
];

/* ==========================================================================
   Education
   ========================================================================== */

export interface Degree {
  school: string;
  href: string;
  credential: string;
  field: string;
  start: string;
  end: string;
  place: string;
  note: string;
  coursework: string[];
}

export const DEGREES: Degree[] = [
  {
    school: "University of Massachusetts Amherst",
    href: "https://www.umass.edu/social-science-computation/",
    credential: "M.S.",
    field: "Data Analytics & Computational Social Science",
    start: "Sep 2025",
    end: "Dec 2027 (expected)",
    place: "Amherst, MA",
    note:
      "A program that combines data analytics with social science methods, including network analysis, " +
      "experimental design and causal inference.",
    coursework: [
      "Network analysis",
      "Experimental design",
      "Causal inference",
      "Data visualization",
      "Data collection and web scraping",
    ],
  },
  {
    school: "The University of Texas at Austin",
    href: "https://www.utexas.edu/",
    credential: "Postgraduate Diploma",
    field: "Data Science & Business Analytics",
    start: "Jan 2024",
    end: "Sep 2024",
    place: "Austin, TX",
    note: "An applied data science and business analytics program, completed while finishing at Virginia Tech.",
    coursework: [
      "Python for Data Science",
      "Applied Statistics",
      "Exploratory Data Analysis",
      "Data Visualization",
      "Regression & Predictive Modeling",
      "Machine Learning",
      "Time Series Forecasting",
      "SQL & Database Management",
      "Model Tuning & Validation",
    ],
  },
  {
    school: "Virginia Tech",
    href: "https://www.vt.edu/",
    credential: "B.S.",
    field: "Psychology, Minor in Computer Science",
    start: "Aug 2021",
    end: "May 2024",
    place: "Blacksburg, VA",
    note: "A psychology degree with a computer science minor.",
    coursework: ["Programming in Java", "Software design and testing", "Data structures"],
  },
];

/* ==========================================================================
   Projects

   `repo` is what makes a project verifiable. Where there is no repo, the
   project is still listed, but it does not get a headline number, because
   there would be no way for anyone to check it.
   ========================================================================== */

export interface Project {
  slug: string;
  name: string;
  context: string;
  year: string;
  /** Only set where a public repository backs it. */
  result: { value: string; label: string } | null;
  summary: string;
  detail: string[];
  stack: string[];
  viz: "sentiment" | "series" | "corpus" | "tree";
  /** Public repository. Its presence is what allows a headline number. */
  repo?: string;
  /** Public dataset the work is built on, where there is one. */
  source?: { label: string; href: string };
  table?: { caption: string; head: string[]; rows: (string | number)[][] };
}

export const PROJECTS: Project[] = [
  {
    slug: "reddit-mental-health",
    name: "What People Say About Mental Health on Reddit",
    context: "UMass Amherst",
    year: "2026",
    result: { value: "25,886", label: "posts and comments analyzed" },
    summary:
      "I collected about 26,000 posts and comments from three mental health subreddits, then compared how three sentiment tools and three classifiers read them. The code and data are all in the repo.",
    detail: [
      "I built this to see what people actually talk about in online mental health communities. It's also " +
        "the easiest project to check: the repository has the collection script, the raw and scored data, " +
        "the model results and the dashboard.",
      "I used the Reddit API to collect 6,398 posts and 19,488 comments from r/Anxiety, r/depression and " +
        "r/mentalhealth, then scored every item with three sentiment methods: VADER, TextBlob and a " +
        "HuggingFace transformer. I used three because lexicon-based tools and fine-tuned models often " +
        "disagree on text this personal, and I wanted to see where.",
      "Then I trained three classifiers on TF-IDF features. Logistic regression and the random forest tied " +
        "at 91.25% accuracy (0.871 F1), and the linear SVM came in at 90.63% (0.868 F1). Those results are " +
        "close enough that which model you pick matters less than what the labels actually capture.",
      "The most interesting result came from the topic modeling. Most of the topics that came out weren't " +
        "about mental health directly. They were about money, housing, politics and social media.",
    ],
    stack: ["Python", "PRAW", "scikit-learn", "NLTK VADER", "Transformers", "Plotly Dash"],
    viz: "sentiment",
    repo: "https://github.com/rishav-dev/MentalHealthResearch-SocialMedia",
    table: {
      caption: "Classifier comparison, TF-IDF features. Figures are in ml_model_results.csv in the repo.",
      head: ["Model", "Accuracy", "Precision", "Recall", "F1"],
      rows: [
        ["Logistic Regression", "0.9125", "0.8327", "0.9125", "0.8708"],
        ["Random Forest", "0.9125", "0.8327", "0.9125", "0.8708"],
        ["Linear SVM", "0.9063", "0.8322", "0.9063", "0.8676"],
      ],
    },
  },
  {
    slug: "campus-safety-corpus",
    name: "Campus Safety Alerts Dataset",
    context: "UMass Amherst, DACSS 758",
    year: "2026",
    result: { value: "519", label: "safety documents from 10 universities" },
    summary:
      "Every university publishes its crime alerts differently, so I wrote a scraper for each of ten schools and combined the results into one dataset you can compare across campuses.",
    detail: [
      "Every university publishes safety notices in its own way, so a single crawler doesn't work. I wrote " +
        "a separate scraper for each of ten schools: ASU, Ohio State, Penn State, UC Berkeley, UMass " +
        "Amherst, UNC Chapel Hill, UT Austin, UW Madison, University of Florida and University of " +
        "Washington.",
      "The dataset has 519 documents: 473 individual alert notices, 32 from alert feeds, 11 annual " +
        "security reports and 3 crime logs. 506 came from web pages and 13 from PDFs. Some campuses don't " +
        "keep a public archive of alerts, so for those the scraper falls back to the annual security " +
        "report, and a record_family column marks which kind each row is so they can be analyzed separately.",
      "It also had to be dependable. The scraper retries failed requests, waits between pages so it " +
        "doesn't overload university servers, and uses cloudscraper for sites that block ordinary " +
        "requests. Every row stores the source URL, the archive URL, a content hash and a timestamp, so " +
        "any number taken from the dataset can be traced back to the page it came from.",
    ],
    stack: ["Python", "BeautifulSoup", "pdfminer.six", "cloudscraper", "requests"],
    viz: "corpus",
    repo: "https://github.com/rishav-dev/Project-DACSS-758",
    table: {
      caption: "What the scraper collected, by record family. Counts are from university_incident_reports.csv.",
      head: ["Record family", "Documents"],
      rows: [
        ["Alert notices", "473"],
        ["Alert feeds", "32"],
        ["Annual security reports", "11"],
        ["Crime logs", "3"],
      ],
    },
  },
  {
    slug: "billboard-hot-100",
    name: "How Pop Music Changed, 2000 to 2023",
    context: "UMass Amherst, DACSS 690S",
    year: "Fall 2025",
    result: { value: "24", label: "years of Billboard charts" },
    summary:
      "An interactive scroll-through of how the Billboard Hot 100 changed over 24 years, built from chart data joined to Spotify audio features, using D3 and Three.js.",
    detail: [
      "I built this as a guided scroll-through rather than a dashboard. As you scroll, it covers long-term trends in danceability, energy, acousticness and " +
        "valence, how what makes a song chart has shifted, and then a 3D view of the feature space for the " +
        "point where two dimensions stop being enough.",
      "The data is Billboard Hot 100 entries from 2000 to 2023, joined to Spotify audio features. I cleaned " +
        "it into three JSON layers (by track, by year and by artist) so the page can switch between levels " +
        "of detail without more network requests. Missing values are left out rather than estimated, so " +
        "the charts only show recorded data.",
      "D3 draws the 2D charts, an IntersectionObserver triggers the scroll steps, and Three.js handles the " +
        "multi-dimensional views. There are also artist pages for Taylor Swift, Drake and The Weeknd.",
    ],
    stack: ["D3.js", "Three.js", "JavaScript", "Python"],
    viz: "series",
    repo: "https://github.com/rishav-dev/690s-final",
    source: {
      label: "Billboard Hot 100 with audio features (Kaggle)",
      href: "https://www.kaggle.com/datasets/suparnabiswas/billboard-hot-1002000-2023-data-with-features",
    },
  },
  {
    slug: "nim-agent",
    name: "Misere Nim Game Agent",
    context: "UMass Amherst",
    year: "2026",
    result: { value: "0.82s", label: "search time per move" },
    summary:
      "A game-playing agent for misere Nim, where whoever takes the last stick loses. It searches ahead with minimax and alpha-beta pruning and always answers within the one-second move limit.",
    detail: [
      "In misere Nim you can take any number of sticks from one pile, and whoever takes the last stick " +
        "loses. That flips the standard strategy near the end of the game, which is why a proper search is " +
        "worth writing.",
      "The agent uses iterative-deepening minimax with alpha-beta pruning and a transposition table keyed " +
        "on the sorted pile sizes. Move ordering comes from an evaluation function I wrote for misere play, " +
        "and it does most of the pruning, since alpha-beta without good ordering is close to plain minimax.",
      "The server allows one second per move, so the agent stops searching at 0.82 seconds and checks the " +
        "clock as it goes. Before searching, it works out a safe fallback move, so if time runs out it " +
        "still returns a legal move instead of timing out.",
    ],
    stack: ["Python", "Minimax", "Alpha-beta pruning", "Memoization"],
    viz: "tree",
    repo: "https://github.com/rishav-dev/nim-agent",
  },
];

/* ==========================================================================
   Repositories

   Checked one by one. Every link resolves.
   ========================================================================== */

export interface Repo {
  name: string;
  href: string;
  language: string;
  blurb: string;
  project?: string;
}

export const REPOS: Repo[] = [
  {
    name: "MentalHealthResearch-SocialMedia",
    href: "https://github.com/rishav-dev/MentalHealthResearch-SocialMedia",
    language: "Python",
    blurb:
      "Reddit data collection, sentiment scoring, classifiers, topic modeling and a dashboard. The raw data is included so you can re-run everything.",
    project: "reddit-mental-health",
  },
  {
    name: "690s-final",
    href: "https://github.com/rishav-dev/690s-final",
    language: "JavaScript",
    blurb: "The Billboard Hot 100 scroll story, with D3 for the 2D charts and Three.js for the 3D feature space.",
    project: "billboard-hot-100",
  },
  {
    name: "Project-DACSS-758",
    href: "https://github.com/rishav-dev/Project-DACSS-758",
    language: "Python",
    blurb:
      "Scrapers for ten universities' campus safety alerts, combined into one dataset with the source recorded for every row.",
    project: "campus-safety-corpus",
  },
  {
    name: "nim-agent",
    href: "https://github.com/rishav-dev/nim-agent",
    language: "Python",
    blurb:
      "A misere Nim agent using minimax, alpha-beta pruning and caching, within a one-second move limit.",
    project: "nim-agent",
  },
  {
    name: "nutri-navigator-app",
    href: "https://github.com/rishav-dev/nutri-navigator-app",
    language: "Dart",
    blurb: "The Flutter client for NutriNavigator.",
  },
];

/* ==========================================================================
   Kinnovation
   ========================================================================== */

export const KINNOVATION = {
  name: "Kinnovation Group",
  role: "Co-founder",
  cofounder: { name: "Kinjal Pandey", href: "https://kinjalpandey.com/" },
  site: "https://kinnovationgroup.com",
  line: "Seven ventures, from concept to prototype, and three pitch prizes, built with my co-founder Kinjal Pandey.",
  body:
    "Kinnovation Group is what Kinjal Pandey and I work on outside our jobs and classes. We're not an " +
    "incubator or a consultancy. None of the ventures below is a launched product: each is labeled as a " +
    "concept, a prototype or in development. The three pitch prizes were all won together.",
} as const;

export interface Venture {
  slug: string;
  name: string;
  line: string;
  stage: string;
  award?: string;
  body: string;
  hue: string;
  /** Shown on the homepage; the rest sit behind "View all ventures". */
  featured?: boolean;
  href?: string;
  repo?: string;
  /** Pages on this site, for ventures without one on kinnovationgroup.com. */
  internal?: { label: string; href: string }[];
}

export const VENTURES: Venture[] = [
  {
    slug: "karnah",
    name: "Karnah",
    line: "An in-kind donation platform in development.",
    stage: "In development",
    award: "$750, second place at UPitch Spring 2026",
    featured: true,
    body:
      "Karnah is an in-kind donation platform in development. Planned features include AI-based checks " +
      "of an item's condition and fair market value from photos, matching items with charities that need " +
      "them, and an audit-ready tax receipt for donors. The goal is to reduce donations that charities " +
      "cannot use.",
    hue: "--indigo",
    href: "https://kinnovationgroup.com/karnah",
  },
  {
    slug: "calendai",
    name: "CalendAI",
    line: "A scheduling app in development that adapts to changes in your day.",
    stage: "In development",
    award: "$500, Apex Center for Entrepreneurs",
    featured: true,
    body:
      "CalendAI is a calendar app in development that aims to schedule based on behavioral modeling " +
      "instead of fixed rules. I worked on it as a behavioral data analyst, on predictive modeling and " +
      "A/B testing of prototype calendar features using AWS, MongoDB, Node and React.",
    hue: "--cyan",
    href: "https://kinnovationgroup.com/calendai",
  },
  {
    slug: "measmi",
    name: "MeAsmi",
    line: "A planned platform for finding which therapies worked for children with similar symptoms.",
    stage: "In development",
    featured: true,
    body:
      "MeAsmi is a machine learning platform for neurodivergent support that is still in development. I " +
      "co-led the interdisciplinary team exploring clustering and supervised methods to identify which " +
      "therapies worked for children with similar symptoms. It is a planned product and has not been " +
      "released.",
    hue: "--indigo",
    href: "https://kinnovationgroup.com/measmi",
  },
  {
    slug: "prodose",
    name: "ProDose",
    line: "A smart medication dispenser in development.",
    stage: "In development",
    featured: true,
    body:
      "ProDose is a smart medication dispensing system in development, designed to automate scheduled " +
      "dispensing of tablets and capsules. I'm the product manager, working with a five-person UMass " +
      "Amherst senior capstone team on the physical design, CAD and 3D-printed prototypes. The site has " +
      "a design lab that simulates eight dispensing concepts, which you can try.",
    hue: "--cyan",
    internal: [
      { label: "Read more", href: "/work/prodose/" },
      { label: "Try the simulation", href: "/work/prodose/simulation/simulator/" },
    ],
  },
  {
    slug: "trendify",
    name: "Trendify AI",
    line: "A concept for finding clips in your own photo and video library.",
    stage: "Concept",
    award: "$300, Minute Pitch winner",
    body:
      "Trendify AI is a concept with no working product yet. The idea is to track what is trending, " +
      "index a user's existing photo and video library, and match the two. The main technical challenge " +
      "would be finding the right few seconds inside tens of thousands of files.",
    hue: "--indigo",
    /* No href on purpose. Trendify is the one venture with no page on
       kinnovationgroup.com yet, and a "Read more" that lands on a 404 is worse
       than no link at all. Add the URL here once the page is published. */
  },
  {
    slug: "nutri-navigator",
    name: "NutriNavigator",
    line: "A nutrition app prototype that plans meals around your schedule and location.",
    stage: "Prototype",
    body:
      "NutriNavigator is a nutrition guidance app prototype built in Dart and Flutter. Planned features " +
      "focus on constraints rather than recommendations: what is healthy, open, affordable and close " +
      "enough to reach in the time you have.",
    hue: "--cyan",
    href: "https://kinnovationgroup.com/nutri-navigator",
    repo: "https://github.com/rishav-dev/nutri-navigator-app",
  },
  {
    slug: "witness-platform",
    name: "Witness",
    line: "A concept for a neutral record of eyewitness accounts, released only with consent.",
    stage: "Concept",
    body:
      "Witness is a concept and has not been built. The idea is to store witness accounts while they are " +
      "still fresh and release them only with consent from everyone involved, as a neutral evidence " +
      "vault rather than a reputation database.",
    hue: "--indigo",
    href: "https://kinnovationgroup.com/witness-platform",
  },
];

/* --------------------------------------------------------------------------
   Pitch wins

   Every figure is read off the presentation cheque in the photograph: the
   issuing centre, the amount, the date, and the competition name where the
   cheque states one. The CalendAI cheque names no competition, so none is
   claimed here.
   -------------------------------------------------------------------------- */

export interface Pitch {
  ventureSlug: string;
  venture: string;
  amount: string;
  placing?: string;
  competition?: string;
  center: string;
  school: string;
  institution: string;
  date: string;
  dateLabel: string;
  hue: string;
}

export const PITCHES: Pitch[] = [
  {
    ventureSlug: "karnah",
    venture: "Karnah",
    amount: "$750",
    placing: "Second place",
    competition: "UPitch Spring 2026",
    center: "UMass Amherst Entrepreneurship Club",
    school: "Sponsored by the Berthiaume Center for Entrepreneurship",
    institution: "UMass Amherst",
    date: "2026-04-24",
    dateLabel: "April 2026",
    hue: "--indigo",
  },
  {
    ventureSlug: "trendify",
    venture: "Trendify AI",
    amount: "$300",
    competition: "Minute Pitch",
    center: "Berthiaume Center for Entrepreneurship",
    school: "Isenberg School of Management",
    institution: "UMass Amherst",
    date: "2025-10-16",
    dateLabel: "October 2025",
    hue: "--cyan",
  },
  {
    ventureSlug: "calendai",
    venture: "CalendAI",
    amount: "$500",
    center: "Apex Center for Entrepreneurs",
    school: "Pamplin College of Business",
    institution: "Virginia Tech",
    date: "2024-11-06",
    dateLabel: "November 2024",
    hue: "--indigo",
  },
];

/** Computed, so it cannot fall out of step with the list. */
export const PITCH_TOTAL = `$${PITCHES.reduce(
  (sum, p) => sum + Number(p.amount.replace(/[^0-9.]/g, "")),
  0,
).toLocaleString("en-US")}`;

/* ==========================================================================
   Recognition
   ========================================================================== */

export interface Honor {
  name: string;
  body: string;
  by: string;
  byHref?: string;
  year: string;
  prize?: string;
}

/** Individual recognition. The three pitch wins live in their own section. */
export const HONORS: Honor[] = [
  {
    name: "The Action Taker Award",
    body: "Awarded for leading the digital upgrades through the LISC Digital Growth Accelerator.",
    by: "LISC Massachusetts and the IXL Center",
    byHref: "https://www.lisc.org/massachusetts/",
    year: "2025",
  },
  {
    name: "Entrepreneurs Accelerator Program",
    body:
      "Selected for the Spring 2026 cohort (March to May 2026), a program of entrepreneurial training, " +
      "mentorship and feedback for early-stage ventures.",
    by: "Franklin County CDC",
    byHref: "https://www.fccdc.org/",
    year: "2026",
  },
];

export const CERTIFICATIONS = [
  {
    name: "IBM Z Xplore, Mainframes and Machine Learning",
    by: "IBM",
    href: "https://ibmzxplore.influitive.com/",
  },
];

/* ==========================================================================
   Stack
   ========================================================================== */

export interface SkillGroup {
  label: string;
  items: string[];
}

export const STACK: SkillGroup[] = [
  {
    label: "Analytics",
    items: ["Data Analysis", "Business Analytics", "Product Analytics", "Customer Analytics", "A/B Testing", "KPI dashboards"],
  },
  {
    label: "Statistics and modeling",
    items: [
      "Statistical Analysis",
      "Predictive Modeling",
      "Causal Inference",
      "NLP",
      "Regression",
      "Clustering",
      "Time series",
      "Experimental design",
    ],
  },
  {
    label: "Languages and BI",
    items: ["Python", "SQL", "R", "Power BI", "JavaScript", "Java", "MATLAB", "Bash"],
  },
  {
    label: "Libraries and visualization",
    items: ["Pandas", "NumPy", "scikit-learn", "TensorFlow", "Transformers", "NLTK", "Matplotlib", "Plotly Dash", "D3.js"],
  },
  {
    label: "Data and engineering",
    items: ["Microsoft SQL Server", "MongoDB", "Google Cloud", "React", "Node.js", "Docker", "Git"],
  },
];

/* ==========================================================================
   Availability
   ========================================================================== */

export const AVAILABILITY = {
  status:
    "I am currently interested in internships and co-ops during my master's program, as well as future " +
    "full-time opportunities in data analytics, business analytics, product analytics, applied data " +
    "science, research, BI, and analytics consulting.",
  interests: [
    "Data and business analytics",
    "Product analytics",
    "Applied data science and research",
    "BI and analytics consulting",
  ],
} as const;
