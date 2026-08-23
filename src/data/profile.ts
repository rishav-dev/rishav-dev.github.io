/**
 * Every fact on this site comes from this file.
 *
 * THE RULE: if a visitor cannot click through and check it, it does not go
 * here as a number.
 *
 * That rule is why the consulting percentages that used to be on this site are
 * gone. They were real, but they were internal figures from private companies
 * with no public record, and a portfolio full of numbers nobody can verify is
 * worth less than a portfolio with five repositories anyone can open. What is
 * left is code you can read, datasets you can download, cheques that were
 * photographed, and degrees that can be confirmed.
 *
 * Voice: first person, plain, no em dashes. Write it the way he would say it.
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
  line: "Curiosity is the part you cannot teach. Everything else I went and learned.",
  body:
    "I started in psychology because I wanted to know why people do what they do. " +
    "Four years in, I realised the answers I wanted were sitting inside datasets nobody had bothered to " +
    "build properly. So I went and learned that too: a postgraduate diploma at UT Austin, then the DACSS " +
    "master's at UMass Amherst. " +
    "I am not the person who stops when something works. I am the person who asks what it would take to " +
    "make it right, and then goes and does that part as well.",
} as const;

export const HERO = {
  /* Two lines. The second takes the gradient. */
  lines: ["Built on data.", "Driven by curiosity."],
  kicker:
    "Data scientist and ML engineer, currently finishing a master's in Data Analytics and Computational " +
    "Social Science at UMass Amherst. I came in through psychology, so I start with why people behave " +
    "the way they do and build the system from there.",
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
    id: "behaviour",
    index: "01",
    title: "Behaviour",
    verb: "Observe",
    body:
      "I spent months doing Applied Behaviour Analysis with autistic children, recording every prompt and " +
      "every response, session after session, under HIPAA. That job taught me something no course did. " +
      "The data you end up with is a product of the question you asked and the room you asked it in. " +
      "I have never been able to look at a dataset the same way since.",
    hue: "--violet",
    tools: ["ABA", "Experimental design", "Survey instruments"],
  },
  {
    id: "data",
    index: "02",
    title: "Data",
    verb: "Build",
    body:
      "Most of the work is here, and most people skip it. Pulling 25,886 Reddit posts and comments through " +
      "the API. Joining Billboard chart history to Spotify audio features. Assembling source tables in Doha " +
      "so a monthly report could run itself. I like this part. Nothing downstream is any better than what " +
      "you built here.",
    hue: "--cyan",
    tools: ["Python", "SQL", "PRAW", "Pandas", "Power BI"],
  },
  {
    id: "model",
    index: "03",
    title: "Model",
    verb: "Test",
    body:
      "Regression, clustering, classification, computer vision, exponential random graph models. I do not " +
      "have a favourite method. I have a habit of running three and reporting where they disagree, because " +
      "the disagreement is usually the interesting result and it is the one most people leave out.",
    hue: "--indigo",
    tools: ["scikit-learn", "TensorFlow", "R", "statnet", "Transformers"],
  },
  {
    id: "decision",
    index: "04",
    title: "Decision",
    verb: "Ship",
    body:
      "A model nobody opens is a hobby. I build the dashboard, the scrollytelling piece, the app, whatever " +
      "it takes for the finding to reach the person who has to act on it. If the work stops at a notebook, " +
      "I have not finished.",
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
      "A year building the analytics for a legal practice, and rebuilding the site that fed it.",
    detail: [
      "A law firm is a strange place to do behavioural work, which is why I wanted it. People arrive at a " +
        "lawyer anxious, mid-problem, scanning fast for whether this person handles their specific thing. " +
        "I rebuilt the site around that state of mind instead of around the firm's org chart.",
      "The half I am prouder of is quieter. I took the recurring admin, the intake, the scheduling, the " +
        "reports nobody had time to run, and automated it. Nothing about that is glamorous. It gave a small " +
        "team back a serious amount of their week.",
      "Underneath both, I ran the statistical analysis on client data to find where engagement was actually " +
        "breaking, built the dashboards so the partners could see it without asking me, and put together " +
        "predictive models to flag which matters were likely to need attention early.",
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
    summary:
      "A wellness practice that was good at the work and bad at explaining it. I fixed the explaining.",
    detail: [
      "They were genuinely good at what they did and nobody could tell from the outside. I reworked the " +
        "service pages, the event galleries and the testimonial flow, which are the three places a nervous " +
        "first-time client decides whether to trust you.",
      "Then I instrumented all of it. That is the step that turned a redesign into a feedback loop. Once we " +
        "could see which workshops people were finishing and which ones they were abandoning halfway, the " +
        "next decisions made themselves.",
      "I also helped shape new workshop formats out of what the data and the client feedback were saying, " +
        "and set up intern roles for design and social so the marketing would keep running after I left. " +
        "Building something that outlives your involvement is the actual test.",
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
    title: "Behavioural Health Technician",
    start: "Jan 2025",
    end: "Jun 2025",
    order: 202501,
    place: "San Diego, CA",
    summary:
      "Applied Behaviour Analysis with autistic children. The hardest job I have had, and the one that shaped everything after.",
    detail: [
      "I delivered ABA to children with developmental disorders alongside Board Certified Behaviour Analysts. " +
        "Reinforcement scheduling, prompt fading, task analysis. I collected data on every single trial, " +
        "because the plan gets adjusted from that data or it does not get adjusted at all.",
      "When your dataset is a child's afternoon, you stop treating measurement as paperwork. You learn " +
        "exactly what a noisy signal costs. You learn that the instrument changes the reading. You learn how " +
        "fast a model falls apart when the conditions shift, because you are watching it happen in front of " +
        "you and a real person is on the other end of it.",
      "I also worked with caregivers so the strategies held up at home, handled de-escalation when they did " +
        "not, and stayed HIPAA compliant throughout. I will never describe an individual case. That is the " +
        "point of the standard.",
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
    summary: "Selected for the Spring 2026 cohort. Ten weeks of having my assumptions taken apart.",
    detail: [
      "I applied and got in. The training was useful. The mentorship was the real thing: people who had " +
        "already made the mistakes I was lining up to make, telling me which ones were worth making anyway.",
      "I came out with a much sharper read on positioning and a much shorter list of next steps. Both of " +
        "those are worth more than a longer list.",
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
    summary: "Invited to speak on machine learning for personalised mental health intervention.",
    detail: [
      "My argument was that the model is the easy part. Mental health data is small, deeply personal, and " +
        "collected under conditions that break most of the assumptions you get taught. Anyone can fit a " +
        "classifier. Knowing whether you are allowed to believe it is the skill.",
      "I built the supporting analytics in Power BI so the claims were something the room could look at " +
        "rather than take on my word. That felt important given what I was arguing.",
    ],
    did: [
      "Invited talk on ML for personalised therapeutic intervention",
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
    summary: "Six months building datasets from scratch and the automated reporting that ran on them.",
    detail: [
      "I built the database structures and then the Power BI reporting on top of them. This was the first " +
        "time I saw analytics change how a week actually felt for the people doing the work, rather than " +
        "just producing a nicer chart. That stuck with me.",
      "I also ran a cost-benefit analysis on the final approach, which is where I learned that the " +
        "statistically best answer and the answer a business will actually adopt are frequently not the " +
        "same answer. Getting people to use the thing is part of the job, not somebody else's problem.",
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
      "Five and a half years running shifts in a high-volume dining hall, through the whole degree and the diploma.",
    detail: [
      "I ran daily operations at D2 and DX, trained and mentored staff, gave performance feedback, and " +
        "enforced food safety standards. It is not a data job and I am putting it on here on purpose.",
      "I did this the entire time I was earning a psychology degree, picking up a computer science minor, " +
        "and then starting a postgraduate diploma. Nobody handed me the runway. I built it while working, " +
        "and I would rather someone hiring me knew that than not.",
      "Managing a team through a dinner rush also taught me something about analytics I could not have got " +
        "from a course. A recommendation is worthless if the people who have to act on it are already at " +
        "capacity. I think about that every time I design a dashboard.",
    ],
    did: [
      "Ran daily operations at a high-volume dining hall",
      "Trained and mentored staff, gave ongoing performance feedback",
      "Enforced food safety law and service standards",
      "Held it down for five and a half years alongside full-time study",
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
    summary: "Designed a mobile data plan from how customers actually used their phones.",
    detail: [
      "Telecoms pricing is a behaviour problem wearing a spreadsheet. I built a model on real usage data and " +
        "used statistical inference to design a plan around what people were genuinely doing, instead of " +
        "around what the existing tier structure assumed they were doing.",
      "I was nineteen and nobody expected an intern to question the tier structure. I did it anyway. It is " +
        "the same instinct I still work from.",
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
      "I chose DACSS specifically because it refuses to treat the social science as decoration. Network " +
      "analysis, experimental design and causal inference sit alongside the modelling, which is exactly the " +
      "combination I had been trying to assemble on my own.",
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
      "Eight months, applied end to end, taken while I was still finishing at Virginia Tech. I wanted the " +
      "quantitative foundation properly rather than picked up in pieces.",
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
      "The computer science minor started as curiosity and turned into the other half of what I do. I have " +
      "stopped thinking of them as two subjects.",
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
  viz: "cluster" | "regression" | "network" | "vision" | "series" | "sentiment";
  /** Public repository. Its presence is what allows a headline number. */
  repo?: string;
  /** Public dataset the work is built on, where there is one. */
  source?: { label: string; href: string };
  table?: { caption: string; head: string[]; rows: (string | number)[][] };
}

export const PROJECTS: Project[] = [
  {
    slug: "reddit-mental-health",
    name: "Mental Health Signal on Reddit",
    context: "UMass Amherst",
    year: "2026",
    result: { value: "25,886", label: "posts and comments" },
    summary:
      "I pulled 6,398 posts and 19,488 comments out of three mental health subreddits and put three classifiers against each other on the sentiment labels. Every file is in the repo.",
    detail: [
      "This is the project I would hand someone first, because you can check all of it. The repository has " +
        "the collection script, the raw CSVs, the scored CSVs, the model results and the dashboard.",
      "PRAW pulls posts and comments from r/Anxiety, r/depression and r/mentalhealth. Every item gets scored " +
        "three separate ways: VADER, TextBlob, and a HuggingFace transformer. I used three because " +
        "lexicon-based sentiment and a fine-tuned model disagree in genuinely interesting places on text " +
        "this personal, and I wanted to see where.",
      "Then classification. TF-IDF features into logistic regression, a linear SVM and a random forest. " +
        "Logistic regression and the random forest tied at 91.25 percent accuracy and 0.871 F1. The SVM came " +
        "in at 90.63 and 0.868. Those three are closer to each other than any of them is to a careful reading " +
        "of what the labels actually mean, and I think that is the honest thing to say about this kind of work.",
      "The finding I would defend in a room is from the topic modelling. The clusters that came out are " +
        "mostly not about mental health at all. They are about money, housing, politics and social media. " +
        "The subreddit is where people go to talk about anxiety, and what they talk about is rent.",
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
    slug: "billboard-hot-100",
    name: "The Evolution of the Billboard Hot 100",
    context: "UMass Amherst, DACSS 690S",
    year: "2026",
    result: { value: "24", label: "years of charts, scrollytold" },
    summary:
      "A D3 and Three.js scrollytelling piece on how pop music changed across 24 years, built on Billboard chart data joined to Spotify audio features.",
    detail: [
      "I wanted to build an argument you scroll through rather than a dashboard you poke at. As you move, " +
        "the case builds: long-term trends in danceability, energy, acousticness and valence, then how the " +
        "distribution of what makes a song chart has shifted, then a 3D pass through the feature space for " +
        "the point where two dimensions genuinely stop being enough.",
      "The data is Billboard Hot 100 entries from 2000 to 2023 joined to Spotify audio features. I " +
        "preprocessed it into three cleaned JSON layers, track level, year level and artist level, so the " +
        "front end can change granularity without going back to the network. Missing numerics are normalised " +
        "to null and filtered rather than imputed. A quietly imputed audio feature is a lie you then plot.",
      "D3 does the 2D work, scroll triggers run off an IntersectionObserver, and Three.js takes the " +
        "multi-dimensional views. There are artist deep dives too, Taylor Swift, Drake, The Weeknd, which is " +
        "where most people actually start clicking.",
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
    slug: "copenhagen-networks",
    name: "Copenhagen Networks Study",
    context: "UMass Amherst, DACSS",
    year: "2026",
    result: null,
    summary:
      "Exponential random graph modelling on Facebook friendship ties in a closed student population, with proximity and call records alongside.",
    detail: [
      "ERGMs are the right tool for this and an unforgiving one. The model is a statement about the process " +
        "that generated the network, so a bad specification does not fit badly. It fits confidently and " +
        "wrong, which is worse.",
      "I reported odds ratios with the degeneracy checks that make them believable, because without those " +
        "checks the numbers are decoration. The underlying dataset is public and linked below if you want to " +
        "look at what I was working with.",
      "The coursework itself is not in a public repository, so I am not putting a headline figure on this " +
        "one. The dataset is public; my analysis of it is not.",
    ],
    stack: ["R", "statnet", "ERGM", "Network analysis"],
    viz: "network",
    source: {
      label: "Copenhagen Networks Study (Nature Scientific Data)",
      href: "https://www.nature.com/articles/s41597-019-0325-x",
    },
  },
  {
    slug: "ai-advice-seeking",
    name: "AI Advice-Seeking Experiment",
    context: "UMass Amherst, DACSS",
    year: "2026",
    result: null,
    summary:
      "A designed survey experiment on when people accept advice from a model instead of a person, analysed with ANOVA.",
    detail: [
      "This is the question I care most about at the moment. Every deployed model is a piece of advice that " +
        "somebody has to decide whether to take, and the literature on that decision is far thinner than the " +
        "literature on the models themselves.",
      "I ran it as a pre-specified design and analysed it with ANOVA. Pre-specified matters here. It is very " +
        "easy to go looking through a survey until something is significant, and I did not want to be able " +
        "to do that to myself.",
      "Coursework, not published, and not in a public repository, so there is no headline number on this " +
        "card. I will happily walk through the design and the results in an interview.",
    ],
    stack: ["R", "ANOVA", "Experimental design", "Survey methods"],
    viz: "regression",
  },
  {
    slug: "face-recognition",
    name: "Face Recognition System",
    context: "Independent",
    year: "2024",
    result: null,
    summary:
      "A TensorFlow face detection system for live video and stills, tuned for a real-time latency budget rather than accuracy alone.",
    detail: [
      "I built this on my own time to understand what real-time actually costs. The accuracy gains came from " +
        "hyperparameter tuning rather than any architectural cleverness, which is where they usually are and " +
        "where nobody wants them to be.",
      "The part I would point at is inference time. Real-time is a latency budget, not an accuracy target. " +
        "A model that is right and late is wrong. Moving the pipeline onto GPU acceleration is what made it " +
        "usable at all.",
      "This one predates my habit of putting everything in a public repository, so I am not printing a " +
        "figure I cannot show you the code for.",
    ],
    stack: ["Python", "TensorFlow", "OpenCV", "CUDA"],
    viz: "vision",
  },
  {
    slug: "recell-pricing",
    name: "Dynamic Pricing for ReCell",
    context: "UT Austin",
    year: "2024",
    result: null,
    summary:
      "A regression model over refurbished device sales to find what actually drives resale value, and which features the business only believed mattered.",
    detail: [
      "The useful output was not the model. It was the list of features the business was confident about " +
        "that turned out to carry nothing. Telling people that is harder than building the model and it is " +
        "the part that changes a decision.",
      "Most of my time went on exploratory analysis before any modelling. The refurbished market has messy, " +
        "structurally missing data, and I wanted to earn the right to fit a model before I fitted one.",
      "Coursework at UT Austin, not a public repository.",
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
      "k-means and hierarchical clustering over S&P 500 time series, looking for groups that move together past the sector labels.",
    detail: [
      "I ran both methods on purpose. Where they agreed told me something about the data. Where they " +
        "disagreed told me something about my distance metric, and that was the more useful lesson.",
      "Running two methods and reporting the disagreement is a habit I picked up here and have kept. It is " +
        "slower and it is the only way I trust an unsupervised result.",
      "Coursework at UT Austin, not a public repository.",
    ],
    stack: ["Python", "k-means", "Hierarchical clustering", "Time series"],
    viz: "cluster",
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
      "Reddit collection, three sentiment methods, three classifiers, topic modelling and a Dash dashboard. Raw data included so you can re-run it.",
    project: "reddit-mental-health",
  },
  {
    name: "690s-final",
    href: "https://github.com/rishav-dev/690s-final",
    language: "JavaScript",
    blurb: "The Billboard Hot 100 scrollytelling piece. D3 for the 2D charts, Three.js for the feature space.",
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
    blurb: "Level of Traffic Stress from OpenStreetMap data. Forked from UMassCDS and worked on there.",
  },
  {
    name: "rishav-dev.github.io",
    href: "https://github.com/rishav-dev/rishav-dev.github.io",
    language: "TypeScript",
    blurb: "This site. Next.js, a WebGL boot sequence, and an assistant with no API key anywhere.",
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
  line: "Six ventures. Three prizes. One partner I have never built anything without.",
  body:
    "Kinnovation is what Kinjal Pandey and I do outside the day job. We are not an incubator and we are not " +
    "a consultancy. We build the things ourselves, we take them into rooms full of judges, and we keep the " +
    "ones that survive it. Every venture below is joint work and every prize was won together.",
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
    line: "In-kind giving you can trace from your door to the person who needed it.",
    stage: "In development",
    award: "$750, second place at UPitch Spring 2026",
    body:
      "AI verification of an item's condition and fair market value from photos, matched to charities that " +
      "actually need that item, with an audit-ready tax receipt at the end. Nonprofits drown in the wrong " +
      "donations while the right ones never find them. Karnah closes that gap.",
    hue: "--magenta",
    href: "https://kinnovationgroup.com/karnah",
  },
  {
    slug: "trendify",
    name: "Trendify AI",
    line: "You already shot it. You just cannot find it.",
    stage: "Conceptual architecture",
    award: "$300, Minute Pitch winner",
    body:
      "Nobody has nothing to post. They have eleven thousand photos and no idea which one fits the format " +
      "that is working this week. Trendify reads what is trending, indexes the library you already own and " +
      "puts the two together. The hard problem is finding the right eight seconds inside forty thousand files.",
    hue: "--amber",
    href: "https://kinnovationgroup.com/trendify",
  },
  {
    slug: "calendai",
    name: "CalendAI",
    line: "A calendar that reschedules itself when the day breaks.",
    stage: "In development",
    award: "$500, Apex Center for Entrepreneurs",
    body:
      "Intelligent scheduling built on behavioural modelling instead of calendar rules. I worked as its " +
      "behavioural data analyst, doing the predictive modelling and the A/B testing on smart-calendar " +
      "features, on AWS, MongoDB, Node and React.",
    hue: "--indigo",
    href: "https://kinnovationgroup.com/calendai",
  },
  {
    slug: "measmi",
    name: "MeAsmi",
    line: "Finding what actually worked for children whose symptoms match yours, not whose diagnosis does.",
    stage: "In development",
    body:
      "A machine learning platform for neurodivergent support. I co-led the interdisciplinary team, using " +
      "clustering and supervised methods to surface therapy-efficacy signal. It is the question every parent " +
      "asks and almost no dataset is arranged to answer, which is exactly why I wanted to work on it.",
    hue: "--violet",
    href: "https://kinnovationgroup.com/measmi",
  },
  {
    slug: "nutri-navigator",
    name: "NutriNavigator",
    line: "What to eat, when and where, from your body, your calendar and what is within walking distance.",
    stage: "In development",
    body:
      "A nutrition guidance app in Dart and Flutter. It is constraint satisfaction more than recommendation. " +
      "The hard part was never knowing what is healthy. It is what is healthy, open, affordable and " +
      "reachable in the forty minutes you actually have.",
    hue: "--lime",
    href: "https://kinnovationgroup.com/nutri-navigator",
    repo: "https://github.com/rishav-dev/nutri-navigator-app",
  },
  {
    slug: "witness-platform",
    name: "Witness",
    line: "A record of what people saw, kept sealed until the person it happened to asks for it.",
    stage: "Concept and legal framing",
    body:
      "Thirty people see it happen, none of them know each other, and within hours the details have blurred. " +
      "Camera footage is overwritten in a day. Witness holds accounts while they are still accurate and " +
      "releases them only with consent from everyone involved. A neutral evidence vault, deliberately not a " +
      "reputational database.",
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
    body:
      "Given for leading the digital upgrades through the LISC Digital Growth Accelerator. The name of the " +
      "award is the part I liked. It was for executing, not for proposing.",
    by: "LISC Massachusetts and the IXL Center",
    byHref: "https://www.lisc.org/massachusetts/",
    year: "2025",
  },
  {
    name: "Entrepreneurs Accelerator Program",
    body: "Selected for the Spring 2026 cohort out of an open application round.",
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
  { label: "Visualisation", items: ["D3.js", "Three.js", "Plotly Dash", "Power BI", "Matplotlib"] },
  {
    label: "Platforms and engineering",
    items: ["MongoDB", "Microsoft SQL Server", "Google Cloud", "React", "Node.js", "Flutter", "Docker", "Git"],
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
    "I finish the DACSS master's at UMass Amherst in May 2027 and I am looking for data science, machine " +
    "learning and analytics work in the meantime. I would rather join something where the problem is hard " +
    "than something where the title is impressive.",
  interests: [
    "Data science and applied machine learning",
    "Behavioural and experimental research",
    "Analytics engineering and BI",
    "Early-stage product work",
  ],
} as const;
