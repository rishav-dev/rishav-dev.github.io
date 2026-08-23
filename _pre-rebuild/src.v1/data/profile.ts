/**
 * Every fact on this site comes from this file.
 *
 * One source, so nothing can drift out of sync between a section, a detail
 * page and the assistant's answers — which is exactly how the old site ended
 * up saying the same thing four different ways.
 *
 * Rule for editing: if it isn't on the resume or LinkedIn, it doesn't go here.
 * The assistant is grounded on this data and will happily repeat a number you
 * invented.
 */

/* ==========================================================================
   Identity
   ========================================================================== */

export const PERSON = {
  name: "Rishav Chakravarty",
  short: "Rishav",
  location: "Amherst, Massachusetts",
  email: "rishavchakra@umass.edu",
  emailAlt: "rishavchakravarty18@gmail.com",
  phone: "443-214-4881",
  linkedin: "https://www.linkedin.com/in/rishav-dsc",
  github: "https://github.com/rishav-dev",
  site: "https://www.rishavchakravarty.com",
  resume: "/Rishav_Chakravarty_Resume_DSA.pdf",
} as const;

/**
 * The one sentence the whole site is arguing for. Everything else is evidence.
 */
export const THESIS = {
  line: "Most models fail because nobody asked why people behave that way first.",
  body:
    "I came to data science from psychology, which is an unusual door to come through and the reason my " +
    "models tend to hold up. Four years of behavioural research before a line of production code — " +
    "so when a metric moves I look for the decision a person made, not just the feature that correlates. " +
    "Now I build the systems on the other side of that: pipelines, dashboards, predictive models, and " +
    "the occasional venture.",
} as const;

export const HERO = {
  /* Broken into lines so the boot sequence can hand each one off separately. */
  lines: ["Behaviour", "into systems"],
  kicker:
    "Data science and applied ML, built on four years of behavioural research. " +
    "Currently a DACSS master's candidate at UMass Amherst.",
  role: "Data Scientist · ML Engineer · Founder",
} as const;

/* ==========================================================================
   The pipeline — the spine of the index page
   --------------------------------------------------------------------------
   Not a skills list. This is the actual sequence his work moves through, and
   the index animates along it as you scroll.
   ========================================================================== */

export interface Stage {
  id: string;
  index: string;
  title: string;
  verb: string;
  body: string;
  /** CSS custom-property hue token this stage lights up in */
  hue: string;
  tools: string[];
}

export const PIPELINE: Stage[] = [
  {
    id: "behaviour",
    index: "01",
    title: "Behaviour",
    verb: "Observe",
    body:
      "Applied Behaviour Analysis with autistic children at Intercare, one session at a time, " +
      "recording every prompt and every response under HIPAA. It teaches you that the data you get " +
      "is downstream of the question you asked and the room you asked it in.",
    hue: "--violet",
    tools: ["ABA", "Experimental design", "Survey instruments"],
  },
  {
    id: "data",
    index: "02",
    title: "Data",
    verb: "Structure",
    body:
      "Building the datasets nobody wants to build. At Zad Holding in Doha that meant assembling the " +
      "source tables and automating the reporting that ran on top of them, which cut about 35% of the " +
      "manual work out of the month.",
    hue: "--cyan",
    tools: ["SQL", "Pandas", "Power BI", "MongoDB"],
  },
  {
    id: "model",
    index: "03",
    title: "Model",
    verb: "Predict",
    body:
      "Regression, clustering, classification, and a computer-vision system that hits 93% on face " +
      "detection after tuning. Inference time came down 25% once it was running on GPU — the part of " +
      "ML work that never makes it into the write-up.",
    hue: "--indigo",
    tools: ["TensorFlow", "scikit-learn", "R", "ERGM"],
  },
  {
    id: "decision",
    index: "04",
    title: "Decision",
    verb: "Ship",
    body:
      "A model that nobody acts on is a hobby. Dashboards leadership actually opens, a rebuilt site " +
      "that moved new client enquiries 37%, workflows that took 43% of the admin load off a small firm.",
    hue: "--lime",
    tools: ["Power BI", "React", "Node", "Docker"],
  },
];

/* ==========================================================================
   Work
   ========================================================================== */

export interface Role {
  slug: string;
  org: string;
  title: string;
  start: string;
  end: string;
  /** Sort key — YYYYMM of start */
  order: number;
  place: string;
  /** One line. This is what shows on the timeline before you open it. */
  summary: string;
  /** The real detail. Written as prose, not bullets, wherever possible. */
  detail: string[];
  metrics: { value: string; label: string }[];
  stack: string[];
  kind: "work" | "speaking";
}

export const ROLES: Role[] = [
  {
    slug: "steve-fisher",
    org: "Steve Fisher Consulting",
    title: "Data & Behavioural Insights Associate",
    start: "May 2025",
    end: "Apr 2026",
    order: 202505,
    place: "Menifee, CA",
    summary:
      "Rebuilt the firm's digital presence and the analytics under it — enquiries up 37%, admin load down 43%.",
    detail: [
      "A legal services firm with a website that was costing it work. I rebuilt it around how people " +
        "actually arrive at a lawyer — anxious, mid-problem, scanning for whether this person handles " +
        "their specific thing — rather than around the firm's org chart. New client enquiries rose 37%, " +
        "across both domestic and international markets.",
      "The other half was quieter and mattered more. I took the recurring admin — intake, scheduling, " +
        "the reporting nobody had time to run — and automated it, which removed roughly 43% of the " +
        "workload from a team that did not have the headcount to absorb it.",
      "Underneath both: statistical analysis of client data to find where engagement and conversion " +
        "actually broke, KPI dashboards so the partners could see it without asking me, and predictive " +
        "models to flag which matters were likely to need intervention early.",
    ],
    metrics: [
      { value: "37%", label: "more new client enquiries" },
      { value: "43%", label: "less administrative load" },
    ],
    stack: ["Python", "SQL", "Power BI", "React", "Analytics"],
    kind: "work",
  },
  {
    slug: "simple-coaching",
    org: "Simple Coaching Inc.",
    title: "Client Experience & Digital Strategy Consultant",
    start: "Mar 2025",
    end: "Aug 2025",
    order: 202503,
    place: "Remote",
    summary:
      "Wellness practice: rebuilt the service funnel and the analytics behind it. Revenue +40%, engagement +48%.",
    detail: [
      "A mental health and wellness business that was good at the work and bad at explaining it. " +
        "I reworked the service pages, the event galleries and the testimonial flow — the three places " +
        "a prospective client decides whether to trust you — and revenue rose about 40%.",
      "Then I instrumented it. Deploying and monitoring the analytics dashboards is what turned the " +
        "redesign from a guess into a feedback loop; engagement went up 48% once we could see which " +
        "workshops people were actually finishing.",
      "I also helped shape new workshop formats out of what the data and client feedback were saying, " +
        "and set up intern roles for design and social so the marketing did not depend on me staying.",
    ],
    metrics: [
      { value: "40%", label: "revenue increase" },
      { value: "48%", label: "engagement lift" },
    ],
    stack: ["SEO", "Analytics", "Journey mapping", "Content strategy"],
    kind: "work",
  },
  {
    slug: "intercare",
    org: "Intercare Therapy",
    title: "Behavioural Health Technician",
    start: "Jan 2025",
    end: "Jun 2025",
    order: 202501,
    place: "San Diego, CA",
    summary:
      "ABA intervention with autistic children, working from real-time data under HIPAA. The origin of everything else here.",
    detail: [
      "Delivering Applied Behaviour Analysis to children with developmental disorders, alongside Board " +
        "Certified Behaviour Analysts. Reinforcement scheduling, prompt fading, task analysis — and " +
        "collecting data on every trial, because the plan gets adjusted from that data or it doesn't " +
        "get adjusted at all.",
      "This is the job that shaped how I do analytics. When your dataset is a child's afternoon, you " +
        "stop treating measurement as a formality. You learn what a noisy signal costs, why the " +
        "instrument changes the reading, and how fast a model degrades when the conditions shift.",
      "Also: working with caregivers so strategies held up at home, de-escalation when they didn't, " +
        "and HIPAA compliance throughout.",
    ],
    metrics: [],
    stack: ["ABA", "HIPAA", "Real-time data collection"],
    kind: "work",
  },
  {
    slug: "franklin-county",
    org: "Franklin County CDC",
    title: "Entrepreneurs Accelerator Program",
    start: "Mar 2026",
    end: "May 2026",
    order: 202603,
    place: "Greenfield, MA",
    summary:
      "Selected for the Spring 2026 cohort. Ten weeks of pressure-testing the venture side of the work.",
    detail: [
      "Selected for the Spring 2026 accelerator supporting early-stage venture development. The value " +
        "was less the training than the mentorship — people who had already made the mistakes I was " +
        "about to make, telling me which ones were worth making.",
      "Came out of it with a sharper read on market positioning and a much shorter list of next steps.",
    ],
    metrics: [],
    stack: ["Venture strategy", "Market positioning"],
    kind: "work",
  },
  {
    slug: "gdsc",
    org: "Google Developer Student Clubs",
    title: "Featured Speaker — AI for Mental Health",
    start: "Aug 2023",
    end: "Nov 2023",
    order: 202308,
    place: "Blacksburg, VA",
    summary:
      "Talked to 150+ people about using ML for personalised mental health intervention.",
    detail: [
      "A talk on what machine learning can and cannot do for personalised therapeutic intervention, " +
        "to an audience of 150+. The argument was that the interesting problem is not the model, it is " +
        "that mental health data is small, personal, and collected under conditions that break most of " +
        "the assumptions you were taught.",
      "I built the supporting analytics in Power BI so the claims were something you could look at " +
        "rather than take on faith.",
    ],
    metrics: [{ value: "150+", label: "attendees" }],
    stack: ["ML", "Power BI", "Public speaking"],
    kind: "speaking",
  },
  {
    slug: "zad-holding",
    org: "Zad Holding Company Q.P.S.C.",
    title: "Data Analytics Intern",
    start: "Mar 2021",
    end: "Aug 2021",
    order: 202103,
    place: "Doha, Qatar",
    summary:
      "Built the datasets and the automated Power BI reporting on top of them. ~35% of manual work removed.",
    detail: [
      "Six months building datasets and database structures from scratch, then the Power BI reporting " +
        "that ran on them. Automating the reporting took roughly 35% of the manual workload out of the " +
        "process — the first time I saw analytics change how a week actually felt for the people doing it.",
      "Also ran a cost-benefit analysis on the final approach, which is how I learned that the " +
        "statistically best answer and the answer a business will adopt are not always the same one.",
    ],
    metrics: [{ value: "35%", label: "manual workload removed" }],
    stack: ["Power BI", "SQL", "Statistical analysis"],
    kind: "work",
  },
  {
    slug: "ooredoo",
    org: "Ooredoo Qatar",
    title: "Data Analytics Intern",
    start: "Mar 2021",
    end: "Aug 2021",
    order: 202102,
    place: "Doha, Qatar",
    summary:
      "Designed a usage-based mobile data plan from customer behaviour. Targeting and usage up 40%.",
    detail: [
      "Telecoms pricing is a behaviour problem wearing a spreadsheet. I built a model on real customer " +
        "usage and used statistical inference to design a data plan around what people actually did " +
        "with their phones rather than what the tier structure assumed.",
      "Customer targeting and usage improved by about 40% against the previous plan structure.",
    ],
    metrics: [{ value: "40%", label: "better targeting and usage" }],
    stack: ["Power BI", "Statistical inference", "Pricing"],
    kind: "work",
  },
];

/* ==========================================================================
   Education
   ========================================================================== */

export interface Degree {
  school: string;
  credential: string;
  field: string;
  start: string;
  end: string;
  place: string;
  note: string;
}

export const DEGREES: Degree[] = [
  {
    school: "University of Massachusetts Amherst",
    credential: "M.S.",
    field: "Data Analytics & Computational Social Science",
    start: "2025",
    end: "2027",
    place: "Amherst, MA",
    note:
      "DACSS is the rare programme that takes the social science as seriously as the computation — " +
      "network analysis, experimental design and causal inference alongside the modelling.",
  },
  {
    school: "The University of Texas at Austin",
    credential: "Postgraduate Diploma",
    field: "Data Science & Business Analytics",
    start: "2024",
    end: "2024",
    place: "Austin, TX",
    note:
      "Eight months, applied end to end. Most of the project work below started here.",
  },
  {
    school: "Virginia Tech",
    credential: "B.S.",
    field: "Psychology, minor in Computer Science",
    start: "2021",
    end: "2024",
    place: "Blacksburg, VA",
    note:
      "The combination was not a plan at first. It turned out to be the whole point.",
  },
];

/* ==========================================================================
   Projects
   ========================================================================== */

export interface Project {
  slug: string;
  name: string;
  context: string;
  year: string;
  /** The headline result — shown large. */
  result: { value: string; label: string } | null;
  summary: string;
  detail: string[];
  stack: string[];
  /** Drives the small generative visual on each card */
  viz: "cluster" | "regression" | "network" | "vision" | "series";
  href?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "face-recognition",
    name: "Face Recognition System",
    context: "Independent",
    year: "2024",
    result: { value: "93%", label: "detection accuracy" },
    summary:
      "Real-time and static face detection in TensorFlow. 93% after tuning, 25% faster once it ran on GPU.",
    detail: [
      "A deep learning system for face detection working on both live video and stills. The accuracy " +
        "number — 93% — came out of hyperparameter tuning rather than architecture cleverness, which is " +
        "usually where the gains actually are.",
      "The part I'd point at is the 25% cut in inference time from moving the pipeline onto TensorFlow " +
        "GPU acceleration. Real-time is a latency budget, not an accuracy target; a model that is right " +
        "and late is wrong.",
    ],
    stack: ["Python", "TensorFlow", "OpenCV", "CUDA"],
    viz: "vision",
  },
  {
    slug: "copenhagen-networks",
    name: "Copenhagen Networks Study",
    context: "UMass Amherst · DACSS",
    year: "2026",
    result: { value: "6,429", label: "friendship ties modelled" },
    summary:
      "ERGM on 6,429 Facebook friendship ties — what predicts a tie when you can see the whole population.",
    detail: [
      "Exponential random graph modelling over the Copenhagen Networks Study: 6,429 Facebook friendship " +
        "ties among a closed student population, with physical proximity and call records alongside.",
      "ERGMs are the right tool and an unforgiving one — the model is a statement about the process " +
        "generating the network, so a bad specification doesn't fit badly, it fits confidently and wrong. " +
        "Reported as odds ratios with the degeneracy checks that make them believable.",
    ],
    stack: ["R", "statnet", "ERGM", "Network analysis"],
    viz: "network",
  },
  {
    slug: "ai-advice-seeking",
    name: "AI Advice-Seeking Experiment",
    context: "UMass Amherst · DACSS",
    year: "2026",
    result: { value: "250", label: "survey observations" },
    summary:
      "When do people take advice from a model instead of a person? A designed experiment, 250 observations, ANOVA.",
    detail: [
      "A survey experiment on when people accept advice from an AI system versus a human, across " +
        "250 observations. Analysed with ANOVA against a pre-specified design.",
      "This is the question I care most about right now. Every deployed model is a piece of advice " +
        "someone has to decide whether to take, and the literature on that decision is thinner than the " +
        "literature on the models.",
    ],
    stack: ["R", "ANOVA", "Experimental design", "Survey methods"],
    viz: "series",
  },
  {
    slug: "recell-pricing",
    name: "Dynamic Pricing — ReCell",
    context: "UT Austin",
    year: "2024",
    result: { value: "20k+", label: "device sales analysed" },
    summary:
      "Regression pricing model over 20,000+ refurbished device sales. What actually drives resale value.",
    detail: [
      "A linear regression model on 20,000+ refurbished device transactions to identify the drivers of " +
        "resale value — and, more usefully, which of the features the business believed mattered did not.",
      "Heavy on EDA before any modelling. The refurbished market has messy, structurally missing data, " +
        "and most of the work was in earning the right to fit a model at all.",
    ],
    stack: ["Python", "scikit-learn", "Linear regression", "EDA"],
    viz: "regression",
  },
  {
    slug: "stock-clustering",
    name: "S&P 500 Clustering",
    context: "UT Austin",
    year: "2024",
    result: null,
    summary:
      "k-means and hierarchical clustering over S&P 500 time series to surface diversification structure.",
    detail: [
      "Unsupervised clustering of S&P 500 equity time series using both k-means and hierarchical " +
        "methods, to find groups that move together beyond the sector labels.",
      "The interesting output was where the two methods disagreed. Agreement tells you about the data; " +
        "disagreement tells you about your distance metric.",
    ],
    stack: ["Python", "k-means", "Hierarchical clustering", "Time series"],
    viz: "cluster",
  },
];

/* ==========================================================================
   Kinnovation — the venture studio
   ========================================================================== */

export const KINNOVATION = {
  name: "Kinnovation",
  role: "Co-founder",
  cofounder: { name: "Kinjal Pandey", href: "https://kinjalpandey.com/" },
  site: "https://kinnovationgroup.com",
  line: "A venture studio for problems where the evidence already exists and nobody has joined it up.",
  body:
    "Kinnovation is the label on the work Kinjal Pandey and I do outside the day job. Not an incubator " +
    "and not a consultancy — a studio, in the sense that we build the things ourselves and keep the ones " +
    "that survive contact with a room full of judges.",
} as const;

export interface Venture {
  slug: string;
  name: string;
  line: string;
  stage: string;
  award?: string;
  body: string;
  hue: string;
}

/**
 * Only the ventures Rishav is documented on. Kinnovation's full portfolio
 * lives on kinnovationgroup.com.
 */
export const VENTURES: Venture[] = [
  {
    slug: "karnah",
    name: "Karnah",
    line: "In-kind giving you can trace from your door to the person who needed it.",
    stage: "In development",
    award: "2nd place · $750 · UMass UPitch Spring 2026",
    body:
      "AI-powered matching for in-kind donations. Nonprofits drown in the wrong donations while the " +
      "right ones never find them; Karnah is a matching and transparency layer over that gap, aimed at " +
      "cutting the waste rather than just moving it.",
    hue: "--magenta",
  },
  {
    slug: "calendai",
    name: "CalendAI",
    line: "A calendar that reschedules itself when the day breaks.",
    stage: "In development",
    award: "KickStart VT Seed Grant winner",
    body:
      "Intelligent scheduling built on behavioural modelling rather than calendar rules. I founded it at " +
      "Virginia Tech and worked as its behavioural data analyst — predictive modelling and A/B testing on " +
      "smart-calendar features, on AWS, MongoDB, Node and React.",
    hue: "--indigo",
  },
  {
    slug: "measmi",
    name: "MeAsmi",
    line: "Finding what actually worked for children whose symptoms match yours, not whose diagnosis does.",
    stage: "In development",
    body:
      "An ML platform for neurodivergent support. I co-led the interdisciplinary team, using clustering " +
      "and supervised methods to surface therapy-efficacy signal — the question every parent asks and " +
      "almost no dataset is arranged to answer.",
    hue: "--violet",
  },
  {
    slug: "nutri-navigator",
    name: "NutriNavigator",
    line: "What to eat, when and where — from your body, your calendar and what's within walking distance.",
    stage: "In development",
    body:
      "A nutrition guidance app built in Dart and Flutter. Constraint satisfaction more than " +
      "recommendation: the hard part is not knowing what is healthy, it is what is healthy, open, " +
      "affordable and reachable in the forty minutes you actually have.",
    hue: "--lime",
  },
];

/* ==========================================================================
   Recognition
   ========================================================================== */

export interface Honor {
  name: string;
  body: string;
  by: string;
  year: string;
  prize?: string;
}

export const HONORS: Honor[] = [
  {
    name: "UPitch Spring 2026 — Second Place",
    body: "For Karnah. Nonprofit matching, transparency, and waste reduction in in-kind giving.",
    by: "UMass Amherst",
    year: "2026",
    prize: "$750",
  },
  {
    name: "The Action Taker Award",
    body:
      "For leading the digital upgrades during the LISC Digital Growth Accelerator — systems and client " +
      "engagement, executed rather than proposed.",
    by: "LISC Massachusetts & the IXL Center",
    year: "2025",
  },
  {
    name: "KickStart VT Seed Grant",
    body: "For founding and building CalendAI, an AI-powered calendar for intelligent scheduling.",
    by: "Virginia Tech",
    year: "2024",
  },
  {
    name: "Future Founder Startup Award",
    body:
      "Minute Pitch Competition — for creativity, confidence, and the promise of the venture.",
    by: "Minute Pitch Competition",
    year: "2024",
  },
];

export const CERTIFICATIONS = [
  {
    name: "IBM Z Xplore — Mainframes & Machine Learning",
    by: "IBM",
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
    label: "Languages",
    items: ["Python", "R", "SQL", "JavaScript", "Java", "MATLAB", "Bash"],
  },
  {
    label: "ML & analysis",
    items: [
      "TensorFlow",
      "Pandas",
      "NumPy",
      "scikit-learn",
      "Matplotlib",
      "ERGM",
      "Time series",
    ],
  },
  {
    label: "Data platforms",
    items: ["Power BI", "MongoDB", "Microsoft SQL Server", "Google Cloud"],
  },
  {
    label: "Engineering",
    items: ["React", "Node.js", "Docker", "Git", "JUnit"],
  },
];

export const COURSEWORK = [
  "Applied Statistics",
  "Regression & Predictive Modelling",
  "Machine Learning",
  "Exploratory Data Analysis",
  "SQL & Database Management",
  "Data Visualisation",
  "Time Series Forecasting",
  "Model Tuning & Validation",
];

/* ==========================================================================
   Availability — used by the assistant
   ========================================================================== */

export const AVAILABILITY = {
  status:
    "Finishing the DACSS master's at UMass Amherst in May 2027, and open to data science, " +
    "machine learning, and analytics roles and internships in the meantime.",
  interests: [
    "Data science and applied ML",
    "Behavioural and experimental research",
    "Analytics engineering and BI",
    "Early-stage product work",
  ],
} as const;
