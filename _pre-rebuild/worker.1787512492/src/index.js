/**
 * Assistant endpoint for rishavchakravarty.com
 *
 * Runs on Cloudflare Workers and calls Workers AI directly, so there is no
 * third-party API key anywhere — not in this file, not in the frontend, not in
 * a build secret. The browser sends a question plus the profile passages it
 * already selected; this Worker wraps them in a grounding prompt and streams
 * the reply back as server-sent events.
 *
 * Deploy: see README.md in this folder. Roughly ten minutes, no card needed.
 */

/**
 * Tried in order until one answers.
 *
 * Cloudflare retires models regularly, so pinning a single ID is a scheduled
 * outage. Keep several live options here and the Worker survives the next
 * deprecation without a deploy. Check the current catalogue at
 * developers.cloudflare.com/workers-ai/models and drop anything Deprecated.
 */
const MODELS = [
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/meta/llama-4-scout-17b-16e-instruct",
  "@cf/mistralai/mistral-small-3.1-24b-instruct",
  "@cf/meta/llama-3.1-8b-instruct-fast",
];

/** Origins allowed to call this Worker. Add your Pages preview URL if you use one. */
const ALLOWED = [
  "https://www.rishavchakravarty.com",
  "https://rishavchakravarty.com",
  "https://rishav-dev.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
];

/** Caps — stop a stray caller using this as a general-purpose LLM. */
const MAX_QUESTION = 400;
const MAX_CONTEXT_CHARS = 9000;
const MAX_PASSAGES = 8;

const SYSTEM = `You are the public assistant on Rishav Chakravarty's portfolio site, answering visitors' questions about him: recruiters, hiring managers, collaborators, and people who found his work. You are not Rishav and must never write as him.

ANSWER THE EXACT QUESTION ASKED. This is the most important rule.
- If asked about one employer, answer about that employer only. Do not list his other roles.
- If asked about one project, answer about that project only.
- Lead with the direct answer in the first sentence. No preamble, no scene-setting.
- The passages you receive are retrieved by keyword and will often include material irrelevant to the question. Use only the parts that actually answer it and ignore the rest.

LENGTH. Two to four sentences for a normal question. Expand only when genuinely asked for detail. Never pad. Never restate the question.

GROUNDING.
- Answer only from the PROFILE passages below. They are the only facts you have.
- If they do not answer the question, say so in one sentence and name what you can cover instead. Never guess.
- Never invent dates, employers, clients, funding, revenue, incorporation status, user counts, investors, co-founders, salary figures, grades, GPA, publications, citation counts, repository metrics, or model performance numbers. The metrics in the passages (37%, 43%, 40%, 48%, 93%, 35%, 25%, 6429, 20000, 250) are the only numbers you may state.

DISTINGUISH CAREFULLY.
- Completed work versus planned work. Never upgrade a plan into an accomplishment.
- Coursework and student projects versus professional deployment. The Copenhagen network analysis and the AI advice-seeking experiment are graduate coursework, not published research. Do not call anything a publication.
- Being open to opportunities versus actively interviewing.

VENTURES. Karnah, CalendAI, MeAsmi and NutriNavigator are all in development. None is a launched commercial product, none has disclosed revenue or users, and none is fundraising. Kinnovation is a venture studio he co-founded with Kinjal Pandey — always credit her when Kinnovation comes up, and never describe him as its sole founder. Preserve the documented stage of each venture. If asked about investment or funding beyond the pitch-competition prizes named in the passages, say the site does not cover it.

PRIVACY. Do not disclose or infer home address, personal phone number, immigration or visa status, salary expectations or financial information, medical or mental-health information, relationship or family details, date of birth or precise age, or anything about the specific children he worked with at Intercare Therapy — that work was under HIPAA and only the general nature of the role is public. If asked, say it is not something the portfolio covers and offer what is public.

CONTACT. Email rishavchakra@umass.edu, LinkedIn linkedin.com/in/rishav-dsc, GitHub github.com/rishav-dev. He finishes the DACSS master's at UMass Amherst in May 2027 and is open to data science, machine learning and analytics roles and internships. Do not state one fixed target job title or a salary expectation.

VOICE.
- Refer to him as Rishav or "he". Third person always.
- Plain, warm, professional prose. No emoji, no headings, no bullet lists unless the question explicitly asks for a list.
- No hype, no grandiosity, no startup language. Never call him a genius, prodigy, visionary, rockstar or ninja.
- Never open with "Based on the provided passages", "According to the profile", or "Great question".
- If asked to compare him to a named person, to rank him against other candidates, or to write something on his behalf (a cover letter, an email as him), decline in one sentence and offer the relevant facts instead.
- Do not describe his personality. Describe what his record shows.

EXAMPLE
Question: "What did he do at Ooredoo?"
Good: "He interned at Ooredoo Qatar in 2021, designing a usage-based mobile data plan built from real customer usage rather than the existing tier structure. He used statistical inference and Power BI to model it, and the resulting plan improved customer targeting and usage by about 40%."
Bad: any answer that also describes his Zad Holding or Steve Fisher roles.`;

function cors(origin) {
  const allow = ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    /* Health check. Open the Worker URL in a browser to see which models
       actually work on this account right now — the fastest way to diagnose
       "the assistant went quiet". */
    if (request.method === "GET") {
      const results = [];
      for (const model of MODELS) {
        try {
          const out = await env.AI.run(model, {
            messages: [{ role: "user", content: "Reply with the single word: ok" }],
            max_tokens: 5,
          });
          results.push({ model, ok: true, sample: out?.response ?? out });
        } catch (err) {
          results.push({ model, ok: false, error: String(err).slice(0, 200) });
        }
      }
      return json(
        {
          status: "alive",
          usable: results.filter((r) => r.ok).map((r) => r.model),
          results,
        },
        200,
        origin,
      );
    }

    if (request.method !== "POST") {
      return json({ error: "POST or GET only" }, 405, origin);
    }
    if (origin && !ALLOWED.includes(origin)) {
      return json({ error: "Origin not allowed" }, 403, origin);
    }

    /* Per-IP rate limit, if the binding is configured in wrangler.toml. */
    if (env.RATE_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "anon";
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) {
        return json({ error: "Too many questions — give it a minute." }, 429, origin);
      }
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Bad JSON" }, 400, origin);
    }

    const question = String(payload?.question ?? "").trim().slice(0, MAX_QUESTION);
    if (!question) return json({ error: "No question" }, 400, origin);

    const passages = Array.isArray(payload?.passages)
      ? payload.passages
          .slice(0, MAX_PASSAGES)
          .map((p) => String(p ?? ""))
          .filter(Boolean)
      : [];

    if (!passages.length) return json({ error: "No context" }, 400, origin);

    let context = passages.join("\n\n---\n\n");
    if (context.length > MAX_CONTEXT_CHARS) context = context.slice(0, MAX_CONTEXT_CHARS);

    const messages = [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `PROFILE PASSAGES:\n\n${context}\n\n---\n\nVISITOR QUESTION: ${question}`,
      },
    ];

    /* Walk the model list until one answers. */
    const failures = [];
    for (const model of MODELS) {
      try {
        const stream = await env.AI.run(model, {
          messages,
          stream: true,
          max_tokens: 320,
          temperature: 0.15,
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "X-Model": model,
            ...cors(origin),
          },
        });
      } catch (err) {
        failures.push(`${model}: ${String(err).slice(0, 160)}`);
      }
    }

    /* Every model refused — usually a spent daily allocation or a catalogue
       change. The site falls back to its own written answers when it sees
       this, and tells the visitor it did. */
    return json({ error: "No model available", detail: failures.join(" | ") }, 503, origin);
  },
};
