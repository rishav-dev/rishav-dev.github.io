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
  email: "rishavchakra@umass.edu",
  emailAlt: "rishavchakravarty18@gmail.com",
  phone: "443-214-4881",
  linkedin: "https://www.linkedin.com/in/rishav-dsc",
  github: "https://github.com/rishav-dev",
  site: "https://www.rishavchakravarty.com",
  resume: "/Rishav_Chakravarty_Resume_DSA.pdf",
} as const;

export const THESIS = {
  line: "I got into data because I wanted to understand people.",
  body:
    "I started in psychology because I wanted to know why people do what they do. Somewhere along the way " +
    "I realized a lot of the answers were sitting in data, so I taught myself to work with it. That led to a " +
    "postgraduate diploma at UT Austin and now the DACSS master's at UMass Amherst. " +
    "When something works, I like to keep going until I know it will hold up.",
} as const;

export const HERO = {
  /* Two lines. The second takes the gradient. */
  lines: ["Built on data.", "Driven by curiosity."],
  kicker:
    "I'm a data scientist and ML engineer finishing a master's in Data Analytics and Computational Social " +
    "Science at UMass Amherst. I started in psychology, so I begin with why people behave the way they do " +
    "and build from there.",
  role: "Data Science · Machine Learning · Founder",
  /**
   * The proof strip under the hero. Three claims, each one clickable through
   * to the thing that backs it. Nothing goes here that cannot be checked.
   */
  proof: [
    { value: "5", label: "public repositories", href: "#code" },
    { value: "$1,550", label: "in pitch prizes won", href: "#kinnovation" },
    { value: "25,886", label: "records in one analysis", href: "#projects" },
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
      "Before I wrote any analysis code, I spent months doing Applied Behavior Analysis with autistic children, " +
      "recording every prompt and response, session after session, under HIPAA. It taught me that a dataset only " +
      "reflects the question you asked and the situation you asked it in. I check that first on every project now.",
    hue: "--violet",
    tools: ["ABA", "Experimental design", "Survey instruments"],
  },
  {
    id: "data",
    index: "02",
    title: "Data",
    verb: "Build",
    body:
      "Most of the work happens here. I pulled 25,886 Reddit posts and comments through the API, joined " +
      "Billboard chart history to Spotify audio features, and built the source tables in Doha that let a " +
      "monthly report run on its own. Everything downstream depends on this step, so it gets the most care.",
    hue: "--cyan",
    tools: ["Python", "SQL", "PRAW", "Pandas", "Power BI"],
  },
  {
    id: "model",
    index: "03",
    title: "Model",
    verb: "Test",
    body:
      "I've used regression, clustering, classification, computer vision and exponential random graph models. " +
      "I usually run a few different methods on the same problem and look at where they disagree, because " +
      "that's often the most interesting part of the result.",
    hue: "--indigo",
    tools: ["scikit-learn", "TensorFlow", "R", "statnet", "Transformers"],
  },
  {
    id: "decision",
    index: "04",
    title: "Decision",
    verb: "Ship",
    body:
      "A model nobody uses doesn't help anyone. So I build the dashboard, the interactive story or the app " +
      "that gets the result in front of the person who has to act on it.",
    hue: "--lime",
    tools: ["D3.js", "Three.js", "Plotly Dash", "React", "Flutter"],
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
      "Product manager for a smart pill dispenser, working with a five-person senior capstone team.",
    detail: [
      "ProDose is a smart dispenser that automatically dispenses scheduled doses of tablets and capsules. " +
        "I'm the product manager, working with a five-person Mechanical & Industrial Engineering senior " +
        "capstone team at UMass Amherst.",
      "Right now that mostly means the physical design. I model parts in CAD and we 3D print prototypes, and " +
        "each round is built to answer a specific question about the dispensing mechanism before we change " +
        "the design again. You can try a physics simulation of the two dispensing concepts we're comparing " +
        "on this site.",
      "The rest is keeping the team lined up, so that design decisions, manufacturing constraints and " +
        "technical requirements stay consistent as the design develops.",
    ],
    did: [
      "Product development for a smart medication dispenser",
      "3D modeling, CAD and iterative printed prototypes",
      "Design refinement and manufacturability review",
      "Coordinating technical requirements across a five-person capstone team",
    ],
    stack: ["CAD", "3D printing", "Prototyping", "Product management"],
    kind: "work",
    links: [{ label: "Try the dispenser simulation", href: "/work/prodose/simulation/", kind: "demo" }],
  },
  {
    slug: "steve-fisher",
    org: "Steve Fisher Consulting",
    title: "Data & Behavioral Insights Associate",
    start: "May 2025",
    end: "Apr 2026",
    order: 202505,
    place: "Menifee, CA",
    summary: "Analytics and a website rebuild for a law firm.",
    detail: [
      "Steve Fisher Consulting is a law firm, which made it an interesting place to apply behavioral science. " +
        "People usually contact a lawyer when they're stressed and want a quick answer on whether this person " +
        "handles their kind of problem. I redesigned the website around that, instead of around how the firm " +
        "is organized internally.",
      "I also automated routine admin work like intake, scheduling and reports that nobody had time to run, " +
        "which gave a small team a good part of their week back.",
      "On the analytics side, I ran statistical analysis on client data to find where engagement was " +
        "dropping off, built dashboards so the partners could see it themselves, and built predictive models " +
        "to flag which matters were likely to need attention early.",
    ],
    did: [
      "Statistical analysis of client engagement and conversion data",
      "KPI dashboards for the partners",
      "Predictive models for early intervention",
      "Full site rebuild and workflow automation",
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
    summary: "Redesigned a wellness practice's website and added analytics to show what was working.",
    detail: [
      "Simple Coaching is a wellness practice that was good at its work but didn't come across that way " +
        "online. I reworked the service pages, event galleries and testimonials, which are where a nervous " +
        "first-time client decides whether to trust you.",
      "Then I added analytics, so we could see which workshops people finished and which ones they dropped " +
        "partway through. That turned the redesign into something we could keep improving.",
      "I also helped design new workshop formats based on client feedback and the data, and set up design " +
        "and social media intern roles so the marketing could keep going after I left.",
    ],
    did: [
      "Client journey analysis and service page redesign",
      "Analytics dashboards and ongoing monitoring",
      "SEO and content strategy",
      "Set up design and social intern roles for handover",
    ],
    stack: ["SEO", "Analytics", "Journey mapping", "Content strategy"],
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
      "Applied Behavior Analysis with autistic children. It shaped how I think about data more than any course has.",
    detail: [
      "I delivered ABA therapy to children with developmental disorders, working alongside Board Certified " +
        "Behavior Analysts. That meant reinforcement scheduling, prompt fading and task analysis, with data " +
        "recorded on every trial, because the treatment plan gets adjusted based on that data.",
      "When your dataset is a child's afternoon, measurement stops being paperwork. You see what a noisy " +
        "signal costs, how the act of measuring changes what you measure, and how quickly a plan stops " +
        "working when conditions change.",
      "I also trained caregivers so the strategies carried over at home, handled de-escalation when " +
        "things got hard, and followed HIPAA throughout.",
    ],
    did: [
      "Trial-by-trial data collection and plan adjustment",
      "Reinforcement scheduling, prompt fading, task analysis",
      "Caregiver training and de-escalation",
      "HIPAA compliance",
    ],
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
    summary: "Selected for the Spring 2026 cohort of an accelerator for early-stage founders.",
    detail: [
      "I applied and was accepted into the Spring 2026 Entrepreneurs Accelerator Program at the Franklin " +
        "County Community Development Corporation. It combined entrepreneurial training with mentorship and " +
        "feedback on my venture.",
      "I used it to tighten my business strategy and market positioning and to work out concrete next " +
        "steps for the startup.",
    ],
    did: [
      "Selected for the Spring 2026 cohort",
      "Business strategy and market positioning work",
      "Mentorship and venture planning",
    ],
    stack: ["Venture strategy", "Market positioning"],
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
    summary: "Invited to speak about machine learning for personalized mental health care.",
    detail: [
      "I gave a talk on using machine learning to personalize mental health interventions, especially for " +
        "neurodivergent people, and on why that work needs people from different fields working together.",
      "My main point was that the model is the easy part. Mental health data is small, personal and " +
        "collected in conditions that break a lot of standard assumptions, so the hard question is whether " +
        "you can trust the result. I built the supporting analytics in Power BI so the audience could see " +
        "the data behind what I was saying.",
    ],
    did: [
      "Invited talk on ML for personalized therapeutic intervention",
      "Built the supporting analytics in Power BI",
    ],
    stack: ["Machine learning", "Power BI", "Public speaking"],
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
    summary: "Six-month internship building datasets from scratch and the automated reporting on top of them.",
    detail: [
      "I built the database structures and the Power BI reporting on top of them. It was the first time I " +
        "saw analytics change how someone's work week actually went, not just produce a nicer chart.",
      "I also ran a cost-benefit analysis on the final approach. It taught me that the statistically best " +
        "answer and the one a business will actually adopt aren't always the same, and that getting people " +
        "to use the result is part of the job.",
    ],
    did: [
      "Built datasets and database structures from scratch",
      "Automated Power BI reporting",
      "Cost-benefit analysis on the final approach",
    ],
    stack: ["Power BI", "SQL", "Statistical analysis"],
    kind: "work",
  },
  {
    slug: "dietrick",
    org: "Dietrick Dining, Virginia Tech",
    orgHref: "https://dining.vt.edu/",
    title: "Student Manager",
    start: "Aug 2018",
    end: "Apr 2024",
    order: 201808,
    place: "Blacksburg, VA",
    summary:
      "Student manager in a high-volume dining hall for five and a half years, alongside my degrees.",
    detail: [
      "I ran daily operations at D2 and DX, trained and mentored staff, gave performance feedback and " +
        "enforced food safety standards. It isn't a data job, and I've kept it on here on purpose.",
      "I worked this job the whole time I was earning a psychology degree with a computer science minor, " +
        "and then a postgraduate diploma. I'd want an employer to know that.",
      "Managing a team through a dinner rush also taught me something about analytics: a recommendation is " +
        "no use if the people who have to act on it are already stretched thin. I think about that whenever " +
        "I design a dashboard.",
    ],
    did: [
      "Ran daily operations at a high-volume dining hall",
      "Trained and mentored staff, gave ongoing performance feedback",
      "Enforced food safety law and service standards",
      "Worked five and a half years alongside full-time study",
    ],
    stack: ["Team leadership", "Operations", "Training"],
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
    summary: "Designed a mobile data plan based on how customers actually use their phones.",
    detail: [
      "I built a model on real customer usage data and used statistical inference to design a data plan " +
        "around what people actually do, instead of what the existing tiers assumed they do.",
      "I was nineteen, and nobody expected an intern to question the tier structure. I did anyway.",
    ],
    did: [
      "Usage model built on real customer data",
      "Statistical inference to design the plan structure",
      "Power BI reporting",
    ],
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
      "I picked DACSS because it treats the social science as a real part of the work. Network analysis, " +
      "experimental design and causal inference sit alongside the modeling, which is the mix I'd been " +
      "trying to piece together on my own.",
  },
  {
    school: "The University of Texas at Austin",
    href: "https://www.utexas.edu/",
    credential: "Postgraduate Diploma",
    field: "Data Science & Business Analytics",
    start: "2024",
    end: "2024",
    place: "Austin, TX",
    note:
      "An eight-month applied program, taken while I was still finishing at Virginia Tech. I wanted a " +
      "solid quantitative foundation instead of picking it up piece by piece.",
  },
  {
    school: "Virginia Tech",
    href: "https://www.vt.edu/",
    credential: "B.S.",
    field: "Psychology, minor in Computer Science",
    start: "2021",
    end: "2024",
    place: "Blacksburg, VA",
    note:
      "The computer science minor started out of curiosity and became the other half of what I do.",
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
        "about mental health directly. They were about money, housing, politics and social media. People " +
        "go to these subreddits to talk about anxiety, and a lot of what they talk about is rent.",
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
    year: "2026",
    result: { value: "24", label: "years of Billboard charts" },
    summary:
      "An interactive scroll-through of how the Billboard Hot 100 changed over 24 years, built from chart data joined to Spotify audio features, using D3 and Three.js.",
    detail: [
      "I wanted to make something you scroll through and follow as an argument, not a dashboard you click " +
        "around in. As you scroll, it covers long-term trends in danceability, energy, acousticness and " +
        "valence, how what makes a song chart has shifted, and then a 3D view of the feature space for the " +
        "point where two dimensions stop being enough.",
      "The data is Billboard Hot 100 entries from 2000 to 2023, joined to Spotify audio features. I cleaned " +
        "it into three JSON layers (by track, by year and by artist) so the page can switch between levels " +
        "of detail without more network requests. Missing values are dropped instead of filled in, because " +
        "an estimated audio feature would just be made-up data on the chart.",
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
        "still returns a legal move instead of timing out. Building around the deadline first and then " +
        "making it smarter within that budget is the same approach you'd take with any latency-bound model.",
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
  name: "Kinnovation",
  role: "Co-founder",
  cofounder: { name: "Kinjal Pandey", href: "https://kinjalpandey.com/" },
  site: "https://kinnovationgroup.com",
  line: "Six ventures and three pitch prizes, all built with my co-founder Kinjal Pandey.",
  body:
    "Kinnovation is what Kinjal Pandey and I work on outside our jobs and classes. We're not an incubator or " +
    "a consultancy. We build the products ourselves, pitch them to judges, and keep working on the ones that " +
    "hold up. Every venture below is joint work, and every prize was won together.",
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

export const VENTURES: Venture[] = [
  {
    slug: "karnah",
    name: "Karnah",
    line: "Donate items and see where they end up.",
    stage: "In development",
    award: "$750, second place at UPitch Spring 2026",
    body:
      "Karnah uses AI to check an item's condition and fair market value from photos, matches it with a " +
      "charity that needs that item, and produces a tax receipt that's ready for an audit. Charities often " +
      "get donations they can't use while the ones they need never reach them, and Karnah is meant to close " +
      "that gap.",
    hue: "--magenta",
    href: "https://kinnovationgroup.com/karnah",
  },
  {
    slug: "trendify",
    name: "Trendify AI",
    line: "Find the right clip in the footage you already have.",
    stage: "Conceptual architecture",
    award: "$300, Minute Pitch winner",
    body:
      "Most people have thousands of photos and videos and no idea which one fits what's trending this week. " +
      "Trendify tracks what's trending, indexes your library and matches the two. The hard part is finding " +
      "the right eight seconds inside forty thousand files.",
    hue: "--amber",
    /* No href on purpose. Trendify is the one venture with no page on
       kinnovationgroup.com yet, and a "Read more" that lands on a 404 is worse
       than no link at all. Add the URL here once the page is published. */
  },
  {
    slug: "calendai",
    name: "CalendAI",
    line: "A calendar that reschedules itself when your day falls apart.",
    stage: "In development",
    award: "$500, Apex Center for Entrepreneurs",
    body:
      "Scheduling based on behavioral modeling instead of fixed calendar rules. I worked on it as the " +
      "behavioral data analyst, doing the predictive modeling and A/B testing of smart-calendar features " +
      "on AWS, MongoDB, Node and React.",
    hue: "--indigo",
    href: "https://kinnovationgroup.com/calendai",
  },
  {
    slug: "measmi",
    name: "MeAsmi",
    line: "Find what worked for children with similar symptoms, not just the same diagnosis.",
    stage: "In development",
    body:
      "A machine learning platform for supporting neurodivergent children. I co-led the interdisciplinary " +
      "team, using clustering and supervised models to find which therapies worked for whom. It's the " +
      "question every parent asks and hardly any dataset is set up to answer, which is why I wanted to " +
      "work on it.",
    hue: "--violet",
    href: "https://kinnovationgroup.com/measmi",
  },
  {
    slug: "nutri-navigator",
    name: "NutriNavigator",
    line: "What to eat, based on your body, your schedule and what's nearby.",
    stage: "In development",
    body:
      "A nutrition app built in Dart and Flutter. It's less about recommending foods and more about " +
      "constraints: what's healthy, open, affordable and close enough to reach in the forty minutes you " +
      "actually have.",
    hue: "--lime",
    href: "https://kinnovationgroup.com/nutri-navigator",
    repo: "https://github.com/rishav-dev/nutri-navigator-app",
  },
  {
    slug: "witness-platform",
    name: "Witness",
    line: "A neutral record of what people saw, sealed until the person involved asks for it.",
    stage: "Concept and legal framing",
    body:
      "When something happens, thirty strangers might see it and the details fade within hours, while " +
      "camera footage often gets overwritten within a day. Witness stores accounts while they're still " +
      "fresh and only releases them with consent from everyone involved. It's meant to be a neutral " +
      "evidence vault, not a reputation database.",
    hue: "--cyan",
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
    hue: "--magenta",
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
    hue: "--amber",
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
    body: "Selected for the Spring 2026 cohort from an open application round.",
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
  { label: "Languages", items: ["Python", "R", "SQL", "JavaScript", "Java", "MATLAB", "Bash"] },
  {
    label: "ML and analysis",
    items: ["TensorFlow", "scikit-learn", "Pandas", "NumPy", "Transformers", "NLTK", "ERGM", "Time series"],
  },
  { label: "Visualization", items: ["D3.js", "Three.js", "Plotly Dash", "Power BI", "Matplotlib"] },
  {
    label: "Platforms and engineering",
    items: ["MongoDB", "Microsoft SQL Server", "Google Cloud", "React", "Node.js", "Flutter", "Docker", "Git"],
  },
];

export const COURSEWORK = [
  "Applied Statistics",
  "Regression & Predictive Modeling",
  "Machine Learning",
  "Exploratory Data Analysis",
  "SQL & Database Management",
  "Data Visualization",
  "Time Series Forecasting",
  "Model Tuning & Validation",
];

/* ==========================================================================
   Availability
   ========================================================================== */

export const AVAILABILITY = {
  status:
    "I finish the DACSS master's at UMass Amherst in May 2027, and I'm looking for data science, machine " +
    "learning and analytics roles. I'd rather work on a hard problem than have an impressive title.",
  interests: [
    "Data science and applied machine learning",
    "Behavioral and experimental research",
    "Analytics engineering and BI",
    "Early-stage product work",
  ],
} as const;
