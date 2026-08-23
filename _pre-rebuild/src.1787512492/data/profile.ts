/**
 * Every fact on this site comes from this file.
 *
 * One source, so nothing can drift out of sync between a section, a detail
 * page, the resume and the assistant's answers — which is exactly how the old
 * site ended up saying the same thing four different ways.
 *
 * Rule for editing: if it isn't on the resume, on LinkedIn, or in a repo you
 * can open, it doesn't go here. The assistant is grounded on this data and
 * will repeat an invented number in a confident sentence to a recruiter.
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
    tools: ["SQL", "Pandas", "Power BI", "PRAW", "MongoDB"],
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
      "A model nobody acts on is a hobby. Dashboards leadership actually opens, a rebuilt site that " +
      "moved new client enquiries 37%, workflows that took 43% of the admin load off a small firm.",
    hue: "--lime",
    tools: ["Power BI", "Plotly Dash", "D3.js", "React", "Docker"],
  },
];

/* ==========================================================================
   Work
   ========================================================================== */

export interface Role {
  slug: string;
  org: string;
  /** The organisation's own site. Every name on this site goes somewhere. */
  orgHref?: string;
  title: string;
  start: string;
  end: string;
  /** Sort key — YYYYMM of start */
  order: number;
  place: string;
  /** One line. This is what shows on the timeline before you open it. */
  summary: string;
  /** The real detail. Prose, not bullets. */
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
    orgHref: "https://www.intercaretherapy.com/",
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
    orgHref: "https://www.fccdc.org/",
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
    orgHref: "https://developers.google.com/community/gdsc",
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
    orgHref: "https://www.zadholding.com/",
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
    orgHref: "https://www.ooredoo.qa/",
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
  href: string;
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
    href: "https://www.umass.edu/social-science-computation/",
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
    href: "https://www.utexas.edu/",
    credential: "Postgraduate Diploma",
    field: "Data Science & Business Analytics",
    start: "2024",
    end: "2024",
    place: "Austin, TX",
    note: "Eight months, applied end to end. Two of the projects below started here.",
  },
  {
    school: "Virginia Tech",
    href: "https://www.vt.edu/",
    credential: "B.S.",
    field: "Psychology, minor in Computer Science",
    start: "2021",
    end: "2024",
    place: "Blacksburg, VA",
    note: "The combination was not a plan at first. It turned out to be the whole point.",
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
  /** Drives the generative visual on the card */
  viz: "cluster" | "regression" | "network" | "vision" | "series" | "sentiment";
  /** Public repository, when there is one. Not every project has one. */
  repo?: string;
  /** Live demo, when there is one. */
  demo?: string;
  /**
   * Real figures, for the table on the detail page. Only ever numbers that
   * exist in the repo or on the resume.
   */
  table?: { caption: string; head: string[]; rows: (string | number)[][] };
}

export const PROJECTS: Project[] = [
  {
    slug: "reddit-mental-health",
    name: "Mental Health Signal on Reddit",
    context: "UMass Amherst · Data Visualisation",
    year: "2026",
    result: { value: "25,886", label: "posts and comments analysed" },
    summary:
      "Collected 6,398 posts and 19,488 comments from r/Anxiety, r/depression and r/mentalhealth, then compared three classifiers on the sentiment labels.",
    detail: [
      "The pipeline runs end to end. PRAW pulls posts and comments from r/Anxiety, r/depression and " +
        "r/mentalhealth — 6,398 posts and 19,488 comments — and each one gets scored three ways: VADER, " +
        "TextBlob, and a HuggingFace transformer, because lexicon-based sentiment and a fine-tuned model " +
        "disagree in interesting places on text this personal.",
      "Then classification. TF-IDF features into logistic regression, a linear SVM, and a random forest. " +
        "Logistic regression and the random forest tied at 91.25% accuracy and 0.871 F1; the linear SVM " +
        "came in just behind at 90.63% and 0.868. The gap between the three is smaller than the gap " +
        "between any of them and a careful reading of what the labels actually mean — which is the point " +
        "worth making about this kind of work.",
      "Topic modelling over the same corpus pulled out clusters that are mostly not about mental health: " +
        "money, housing, politics, social media. That is the finding I would defend in an interview. The " +
        "subreddit is where people talk about anxiety, and what they talk about is rent.",
      "Everything lands in a Plotly Dash dashboard — sentiment distribution by subreddit, sentiment " +
        "trend over time, and the model comparison.",
    ],
    stack: ["Python", "PRAW", "scikit-learn", "NLTK VADER", "Transformers", "Plotly Dash"],
    viz: "sentiment",
    repo: "https://github.com/rishav-dev/MentalHealthResearch-SocialMedia",
    table: {
      caption: "Classifier comparison — TF-IDF features, sentiment labels",
      head: ["Model", "Accuracy", "Precision", "Recall", "F1"],
      rows: [
        ["Logistic Regression", "0.9125", "0.8327", "0.9125", "0.8708"],
        ["Random Forest", "0.9125", "0.8327", "0.9125", "0.8708"],
        ["Linear SVM", "0.9063", "0.8322", "0.9063", "0.8676"],
      ],
    },
  },
  {
    slug: "billboard-hot-100",
    name: "The Evolution of the Billboard Hot 100",
    context: "UMass Amherst · DACSS 690S",
    year: "2026",
    result: { value: "24", label: "years of charts, scrollytold" },
    summary:
      "A D3 and Three.js scrollytelling piece on how pop music changed between 2000 and 2023, built on Billboard chart data joined to Spotify audio features.",
    detail: [
      "An interactive narrative rather than a dashboard. You scroll, and the argument moves: long-term " +
        "trends in danceability, energy, acousticness and valence; how the distribution of what makes a " +
        "song chart has shifted; then a 3D pass through the feature space where the 2D charts stop being " +
        "able to show the structure.",
      "The data is Billboard Hot 100 entries from 2000 to 2023 joined to Spotify audio features, " +
        "preprocessed into three cleaned JSON layers — track level, year level, and artist level — so the " +
        "front end can switch granularity without refetching. Missing numerics are normalised to null and " +
        "filtered rather than imputed, because a silently imputed audio feature is a lie you then plot.",
      "D3 handles the 2D work and scroll-triggered transitions run off an IntersectionObserver. Three.js " +
        "takes the multi-dimensional views. There are artist-level deep dives too — Taylor Swift, Drake, " +
        "The Weeknd — which is where most people actually start clicking.",
    ],
    stack: ["D3.js", "Three.js", "JavaScript", "Python", "Spotify audio features"],
    viz: "series",
    repo: "https://github.com/rishav-dev/690s-final",
  },
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
    viz: "regression",
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
   Repositories
   --------------------------------------------------------------------------
   Only repositories that actually exist and are public. A portfolio that links
   to a 404 is worse than one that links to nothing.
   ========================================================================== */

export interface Repo {
  name: string;
  href: string;
  language: string;
  blurb: string;
  /** Links the repo to a project write-up, when there is one. */
  project?: string;
}

export const REPOS: Repo[] = [
  {
    name: "MentalHealthResearch-SocialMedia",
    href: "https://github.com/rishav-dev/MentalHealthResearch-SocialMedia",
    language: "Python",
    blurb:
      "Reddit collection, three sentiment methods, three classifiers, topic modelling, and a Dash dashboard over all of it.",
    project: "reddit-mental-health",
  },
  {
    name: "690s-final",
    href: "https://github.com/rishav-dev/690s-final",
    language: "JavaScript",
    blurb:
      "The Billboard Hot 100 scrollytelling piece. D3 for the 2D charts, Three.js for the feature space.",
    project: "billboard-hot-100",
  },
  {
    name: "nutri-navigator-app",
    href: "https://github.com/rishav-dev/nutri-navigator-app",
    language: "Dart",
    blurb: "The NutriNavigator client, built in Flutter.",
  },
  {
    name: "StressMap",
    href: "https://github.com/rishav-dev/StressMap",
    language: "Jupyter Notebook",
    blurb:
      "Level of Traffic Stress from OpenStreetMap data. Forked from UMassCDS and worked on there.",
  },
  {
    name: "rishav-dev.github.io",
    href: "https://github.com/rishav-dev/rishav-dev.github.io",
    language: "TypeScript",
    blurb: "This site. Next.js, a WebGL boot sequence, and an assistant with no API key.",
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
  href?: string;
  repo?: string;
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
    href: "https://kinnovationgroup.com/karnah",
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
    href: "https://kinnovationgroup.com/calendai",
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
    href: "https://kinnovationgroup.com/measmi",
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
    href: "https://kinnovationgroup.com/nutri-navigator",
    repo: "https://github.com/rishav-dev/nutri-navigator-app",
  },
];

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

export const HONORS: Honor[] = [
  {
    name: "UPitch Spring 2026 — Second Place",
    body: "For Karnah. Nonprofit matching, transparency, and waste reduction in in-kind giving.",
    by: "UMass Amherst",
    byHref: "https://www.umass.edu/entrepreneurship/",
    year: "2026",
    prize: "$750",
  },
  {
    name: "The Action Taker Award",
    body:
      "For leading the digital upgrades during the LISC Digital Growth Accelerator — systems and client " +
      "engagement, executed rather than proposed.",
    by: "LISC Massachusetts & the IXL Center",
    byHref: "https://www.lisc.org/massachusetts/",
    year: "2025",
  },
  {
    name: "KickStart VT Seed Grant",
    body: "For founding and building CalendAI, an AI-powered calendar for intelligent scheduling.",
    by: "Virginia Tech",
    byHref: "https://apexcenter.vt.edu/",
    year: "2024",
  },
  {
    name: "Future Founder Startup Award",
    body: "Minute Pitch Competition — for creativity, confidence, and the promise of the venture.",
    by: "Minute Pitch Competition",
    year: "2024",
  },
];

export const CERTIFICATIONS = [
  {
    name: "IBM Z Xplore — Mainframes & Machine Learning",
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
    label: "Languages",
    items: ["Python", "R", "SQL", "JavaScript", "Java", "MATLAB", "Bash"],
  },
  {
    label: "ML & analysis",
    items: [
      "TensorFlow",
      "scikit-learn",
      "Pandas",
      "NumPy",
      "Transformers",
      "NLTK",
      "ERGM",
      "Time series",
    ],
  },
  {
    label: "Visualisation",
    items: ["D3.js", "Three.js", "Plotly Dash", "Power BI", "Matplotlib"],
  },
  {
    label: "Platforms & engineering",
    items: ["MongoDB", "Microsoft SQL Server", "Google Cloud", "React", "Node.js", "Docker", "Git"],
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
   Availability
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
