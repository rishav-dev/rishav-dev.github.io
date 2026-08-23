/**
 * Grounding corpus for the assistant.
 *
 * Every passage is assembled from `profile.ts`, the same data the pages
 * render. That is the whole design: the assistant cannot claim something the
 * site does not say, because there is nowhere else for it to read from. Edit a
 * role in profile.ts and both the timeline and the assistant change together.
 *
 * A handful of passages at the bottom carry things that have no home on a page
 * (availability, how to reach him, what he will not answer).
 */

import {
  AVAILABILITY,
  CERTIFICATIONS,
  COURSEWORK,
  DEGREES,
  HONORS,
  KINNOVATION,
  PERSON,
  PIPELINE,
  PITCHES,
  PITCH_TOTAL,
  PROJECTS,
  ROLES,
  STACK,
  THESIS,
  VENTURES,
} from "./profile";

export interface Chunk {
  id: string;
  /** Shown as a source chip under the answer. */
  title: string;
  /** Extra terms that should pull this passage in. */
  tags: string[];
  text: string;
}

const chunks: Chunk[] = [];

/* --- identity ------------------------------------------------------------ */

chunks.push({
  id: "identity",
  title: "Overview",
  tags: [
    "who", "about", "summary", "bio", "intro", "introduce", "rishav",
    "chakravarty", "himself", "background", "story",
  ],
  text:
    `${PERSON.name} is a data scientist and machine learning engineer based in ${PERSON.location}. ` +
    `He is currently a master's candidate in Data Analytics and Computational Social Science (DACSS) at ` +
    `UMass Amherst, graduating May 2027. ${THESIS.body} ` +
    `He is also co-founder of Kinnovation, a venture studio. ` +
    `Reach him at ${PERSON.email}.`,
});

chunks.push({
  id: "differentiator",
  title: "Why Rishav, what makes him unusual",
  tags: [
    "why", "hire", "hiring", "strength", "fit", "unique", "different", "stand",
    "value", "candidate", "recruit", "good", "best", "suited", "edge",
  ],
  text:
    `What separates Rishav from other data science candidates is the route in. He has a B.S. in Psychology ` +
    `with a Computer Science minor from Virginia Tech, and worked as a Behavioural Health Technician ` +
    `delivering Applied Behaviour Analysis to autistic children, collecting and acting on real-time data ` +
    `under HIPAA. That is four years of behavioural research before the modelling work, so he reads a metric ` +
    `as a decision someone made rather than only as a feature that correlates. ` +
    `He pairs it with formal training: a Postgraduate Diploma in Data Science and Business Analytics from ` +
    `UT Austin and the DACSS master's at UMass Amherst. ` +
    `He also finishes things and puts them where they can be checked. Six public repositories, including ` +
    `one holding 25,886 Reddit records, three sentiment methods, three classifiers and the raw data to ` +
    `re-run all of it. Six ventures co-founded with Kinjal Pandey, three of which have won pitch ` +
    `competitions. ` +
    `Note on numbers: this site deliberately does not quote performance percentages from his consulting ` +
    `work. Those figures were real but they were internal to private companies and no visitor can verify ` +
    `them, so they were removed in favour of claims anyone can click through and check.`,
});

chunks.push({
  id: "method",
  title: "How he works",
  tags: ["method", "approach", "process", "pipeline", "how", "philosophy", "think"],
  text:
    `Rishav describes his work as four stages. ` +
    PIPELINE.map((s) => `${s.index} ${s.title} (${s.verb}): ${s.body} Tools: ${s.tools.join(", ")}.`).join(" "),
});

/* --- roles --------------------------------------------------------------- */

for (const role of ROLES) {
  chunks.push({
    id: `role-${role.slug}`,
    title: `${role.org}: ${role.title}`,
    tags: [
      ...role.org.toLowerCase().split(/\W+/).filter(Boolean),
      ...role.title.toLowerCase().split(/\W+/).filter(Boolean),
      ...role.stack.map((s) => s.toLowerCase()),
      "job", "role", "work", "experience", "position",
    ],
    text:
      `${role.title} at ${role.org}, ${role.start} to ${role.end}, ${role.place}. ` +
      `${role.summary} ${role.detail.join(" ")} ` +
      `What he did there: ${role.did.join("; ")}. ` +
      `Tools and methods: ${role.stack.join(", ")}.`,
  });
}

chunks.push({
  id: "experience-index",
  title: "Experience, every role",
  tags: ["experience", "roles", "jobs", "worked", "history", "career", "where", "employers"],
  text:
    `Rishav's roles, most recent first: ` +
    [...ROLES]
      .sort((a, b) => b.order - a.order)
      .map((r) => `${r.title} at ${r.org} (${r.start}–${r.end}, ${r.place})`)
      .join("; ") +
    `.`,
});

/* --- education ----------------------------------------------------------- */

chunks.push({
  id: "education",
  title: "Education",
  tags: [
    "education", "degree", "school", "university", "college", "study", "studied",
    "masters", "bachelor", "umass", "amherst", "dacss", "virginia", "tech",
    "texas", "austin", "psychology", "graduate", "gpa", "coursework",
  ],
  text:
    DEGREES.map(
      (d) => `${d.credential} in ${d.field}, ${d.school} (${d.start}–${d.end}, ${d.place}). ${d.note}`,
    ).join(" ") +
    ` Relevant coursework: ${COURSEWORK.join(", ")}.` +
    ` Certification: ${CERTIFICATIONS.map((c) => `${c.name} (${c.by})`).join(", ")}.`,
});

/* --- projects ------------------------------------------------------------ */

for (const p of PROJECTS) {
  chunks.push({
    id: `project-${p.slug}`,
    title: `Project: ${p.name}`,
    tags: [
      ...p.name.toLowerCase().split(/\W+/).filter(Boolean),
      ...p.stack.map((s) => s.toLowerCase()),
      "project", "built", "portfolio",
    ],
    text:
      `${p.name} (${p.context}, ${p.year}). ${p.summary} ${p.detail.join(" ")} ` +
      (p.result ? `Headline result: ${p.result.value} ${p.result.label}. ` : "") +
      `Stack: ${p.stack.join(", ")}.`,
  });
}

chunks.push({
  id: "projects-index",
  title: "Projects, all of them",
  tags: ["projects", "portfolio", "built", "made", "work samples", "github"],
  text:
    `Rishav's projects: ` +
    PROJECTS.map((p) => `${p.name}: ${p.summary} (${p.context}, ${p.year})`).join("; ") +
    `. His code is at ${PERSON.github}.`,
});

/* --- ventures ------------------------------------------------------------ */

chunks.push({
  id: "kinnovation",
  title: "Kinnovation",
  tags: [
    "kinnovation", "studio", "venture", "startup", "founder", "cofounder",
    "co-founder", "entrepreneur", "company", "business", "kinjal", "pandey",
  ],
  text:
    `Kinnovation is a venture studio Rishav co-founded with ${KINNOVATION.cofounder.name}. ` +
    `${KINNOVATION.line} ${KINNOVATION.body} ` +
    `The studio's site is ${KINNOVATION.site}. ` +
    `The ventures Rishav works on: ` +
    VENTURES.map((v) => `${v.name}: ${v.line} Stage: ${v.stage}.${v.award ? ` ${v.award}.` : ""}`).join(" "),
});

for (const v of VENTURES) {
  chunks.push({
    id: `venture-${v.slug}`,
    title: `Venture: ${v.name}`,
    tags: [
      ...v.name.toLowerCase().split(/\W+/).filter(Boolean),
      "venture", "startup", "product", "kinnovation",
    ],
    text:
      `${v.name}: ${v.line} ${v.body} Stage: ${v.stage}. ` +
      (v.award ? `Recognition: ${v.award}. ` : "") +
      `It is part of the Kinnovation portfolio, the studio Rishav co-founded with ${KINNOVATION.cofounder.name}.`,
  });
}

/* --- recognition --------------------------------------------------------- */

chunks.push({
  id: "pitches",
  title: "Pitch competition wins",
  tags: [
    "pitch", "pitches", "competition", "prize", "prizes", "won", "win", "money",
    "cheque", "check", "upitch", "minute", "berthiaume", "apex", "award",
    "awards", "grant", "funding", "cash", "total",
  ],
  text:
    `Rishav and Kinjal Pandey have won three pitch competitions together, ${PITCH_TOTAL} in total prize ` +
    `money across two universities. Every one was won jointly; neither of them pitches alone. ` +
    PITCHES.map(
      (p) =>
        `${p.venture}: ${p.amount}${p.placing ? `, ${p.placing}` : ""}` +
        `${p.competition ? `, ${p.competition}` : ""}, awarded by the ${p.center}, ` +
        `${p.school}, ${p.institution}, ${p.dateLabel}.`,
    ).join(" ") +
    ` These are prize awards from student pitch competitions, not investment. None of the ventures is ` +
    `fundraising and none has disclosed revenue or users.`,
});

chunks.push({
  id: "honors",
  title: "Awards and recognition",
  tags: [
    "award", "awards", "honor", "honour", "recognition", "accelerator",
    "action", "taker", "lisc",
  ],
  text: HONORS.map(
    (h) => `${h.name} (${h.by}, ${h.year})${h.prize ? `, ${h.prize}` : ""}: ${h.body}`,
  ).join(" "),
});

/* --- stack --------------------------------------------------------------- */

chunks.push({
  id: "stack",
  title: "Technical stack",
  tags: [
    "stack", "skills", "tools", "technologies", "languages", "python", "sql",
    "tensorflow", "react", "powerbi", "power", "bi", "docker", "know", "proficient",
  ],
  text:
    STACK.map((g) => `${g.label}: ${g.items.join(", ")}.`).join(" ") +
    ` He is strongest in Python and SQL for analysis, TensorFlow for modelling, and Power BI for delivery.`,
});

/* --- practical ----------------------------------------------------------- */

chunks.push({
  id: "availability",
  title: "Availability and contact",
  tags: [
    "contact", "email", "reach", "hire", "available", "availability", "linkedin",
    "github", "resume", "cv", "opportunity", "internship", "job", "looking",
    "location", "where", "based", "relocate", "remote",
  ],
  text:
    `${AVAILABILITY.status} He is interested in: ${AVAILABILITY.interests.join(", ")}. ` +
    `He is based in ${PERSON.location}. ` +
    `Email ${PERSON.email}. LinkedIn ${PERSON.linkedin}. GitHub ${PERSON.github}. ` +
    `His resume is downloadable from this site.`,
});

export const CORPUS: Chunk[] = chunks;

/* ==========================================================================
   Retrieval
   ========================================================================== */

const STOP = new Set([
  "the", "a", "an", "is", "are", "was", "were", "and", "or", "but", "of", "to",
  "in", "on", "at", "for", "with", "his", "her", "he", "she", "they", "it",
  "what", "which", "that", "this", "does", "do", "did", "has", "have", "had",
  "can", "you", "me", "my", "i", "about", "tell", "give", "any", "some", "how",
  "who", "when", "where", "why", "there", "their", "from", "by", "as", "be",
]);

/**
 * Query expansion. A visitor types "ML", the corpus says "machine learning";
 * without this the best passage scores zero.
 *
 * Deliberately one-directional and small, every entry here is a place the
 * retrieval was observed to miss, not a general-purpose thesaurus.
 */
const SYNONYMS: Record<string, string[]> = {
  ml: ["machine", "learning", "model"],
  ai: ["artificial", "intelligence", "machine", "learning"],
  cv: ["computer", "vision", "detection"],
  nlp: ["language", "text"],
  eda: ["exploratory", "analysis"],
  viz: ["visualisation", "visualization", "dashboard"],
  dashboard: ["power", "bi", "reporting"],
  bi: ["power", "dashboard", "reporting"],
  stats: ["statistics", "statistical", "regression"],
  uni: ["university", "school", "college"],
  grad: ["graduate", "masters", "degree"],
  undergrad: ["bachelor", "virginia", "tech"],
  umass: ["massachusetts", "amherst", "dacss"],
  vt: ["virginia", "tech"],
  ut: ["texas", "austin"],
  psych: ["psychology", "behavioural", "behavioral"],
  behavioral: ["behavioural", "psychology", "aba"],
  behavioural: ["behavioral", "psychology", "aba"],
  aba: ["applied", "behaviour", "analysis", "intercare"],
  job: ["role", "work", "experience", "position"],
  jobs: ["role", "work", "experience", "position"],
  hire: ["hiring", "recruit", "employ", "candidate"],
  startup: ["venture", "kinnovation", "founder"],
  startups: ["venture", "kinnovation", "founder"],
  network: ["ergm", "graph", "copenhagen"],
  cluster: ["clustering", "kmeans", "hierarchical"],
  clustering: ["cluster", "kmeans", "hierarchical"],
  paper: ["research", "study", "experiment"],
  cv_doc: ["resume"],
  salary: ["compensation", "pay"],
};

function tokens(s: string): string[] {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));

  const out = new Set(base);
  for (const t of base) {
    for (const syn of SYNONYMS[t] ?? []) out.add(syn);
    /* Crude singularisation so "projects" reaches a "project" tag. */
    if (t.endsWith("s") && t.length > 3) out.add(t.slice(0, -1));
  }
  return [...out];
}

/* Pre-tokenised index, built once at module load. */
const INDEX = CORPUS.map((chunk) => ({
  chunk,
  title: chunk.title.toLowerCase(),
  tags: new Set(chunk.tags.map((t) => t.toLowerCase())),
  body: chunk.text.toLowerCase(),
}));

/**
 * Picks the passages most likely to answer `question`.
 *
 * Scoring, strongest signal first: an exact word in the passage title, an
 * exact tag, a partial tag, then term frequency in the body with a low cap so
 * one long passage cannot dominate purely by being long.
 *
 * The interesting part is what happens after scoring. Passages far below the
 * best one are dropped rather than padded out to `k`, so a specific question
 * ("what did he do at Ooredoo?") sends one passage and the model has nothing
 * irrelevant to wander into. The overview is only added back for broad
 * questions, where it genuinely helps.
 */
export function selectContext(question: string, k = 5): Chunk[] {
  const q = tokens(question);
  if (!q.length) return CORPUS.slice(0, k);

  const scored = INDEX.map((entry) => {
    let score = 0;
    for (const t of q) {
      if (entry.title.split(/\W+/).some((w) => w === t)) score += 9;
      else if (entry.title.includes(t)) score += 4;

      if (entry.tags.has(t)) score += 6;
      else {
        for (const tag of entry.tags) {
          if (tag.includes(t)) {
            score += 2;
            break;
          }
        }
      }

      const hits = entry.body.split(t).length - 1;
      if (hits) score += Math.min(hits, 3);
    }
    return { chunk: entry.chunk, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) {
    const identity = CORPUS.find((c) => c.id === "identity");
    return identity ? [identity] : CORPUS.slice(0, 1);
  }

  const top = scored[0].score;
  const kept = scored.filter((s) => s.score >= top * 0.42).slice(0, k);

  /* A dominant single match means the question was specific, leave it alone.
     Otherwise the overview gives the model something to anchor "I don't have
     that, but here is what I do have" against. */
  const dominant = kept.length === 1 || top > (scored[1]?.score ?? 0) * 1.8;
  if (!dominant && !kept.some((s) => s.chunk.id === "identity")) {
    const identity = CORPUS.find((c) => c.id === "identity");
    if (identity) kept.push({ chunk: identity, score: 0 });
  }

  return kept.slice(0, k).map((s) => s.chunk);
}
