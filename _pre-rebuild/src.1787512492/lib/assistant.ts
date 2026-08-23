"use client";

import { selectContext, type Chunk } from "@/data/corpus";
import { retrieve } from "@/data/knowledge";

/**
 * Where the assistant sends questions.
 *
 * Leave `endpoint` empty and the site uses its built-in offline assistant —
 * keyword retrieval over the same profile, no network involved. Everything
 * still works; the answers are just written rather than generated.
 *
 * To turn on the live model, deploy the Worker in `/worker` (see its README —
 * about ten minutes, no card, no API key anywhere) and paste the URL Wrangler
 * prints here.
 */
export const ASSISTANT = {
  endpoint: "",

  /** How many profile passages to send as grounding context. */
  passages: 5,

  /** Give up on the endpoint after this long and answer locally instead. */
  timeoutMs: 18000,
} as const;

export interface Reply {
  /** 'live' came from the model, 'local' from the built-in retrieval. */
  mode: "live" | "local";
  /** Passage titles the answer drew on, shown as chips. */
  sources: string[];
  /**
   * Set when the model was configured but could not be reached. Surfaced in
   * the UI: silently downgrading to canned answers is worse than saying so.
   */
  degraded?: string;
}

export const isLive = (): boolean => ASSISTANT.endpoint.length > 0;

/**
 * Asks a question. `onToken` fires as text arrives; the promise resolves when
 * the reply is complete.
 *
 * The live path is attempted first when configured, and any failure at all —
 * network, HTTP error, empty stream, timeout — falls through to the local
 * answer rather than surfacing an error. A portfolio assistant that says
 * "something went wrong" has failed at the only job it has.
 */
export async function ask(
  question: string,
  onToken: (text: string) => void,
): Promise<Reply> {
  if (isLive()) {
    const context = selectContext(question, ASSISTANT.passages);
    try {
      return await askModel(question, context, onToken);
    } catch (err) {
      const reason = err instanceof Error ? err.message : "unknown error";
      console.warn("[assistant] live model unavailable, answering locally:", reason);
      const local = await askLocal(question, onToken);
      return { ...local, degraded: reason };
    }
  }
  return askLocal(question, onToken);
}

/* ==========================================================================
   Live model
   ========================================================================== */

async function askModel(
  question: string,
  context: Chunk[],
  onToken: (text: string) => void,
): Promise<Reply> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ASSISTANT.timeoutMs);

  try {
    const response = await fetch(ASSISTANT.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        passages: context.map((c) => `${c.title}\n${c.text}`),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      /* Surface what the Worker actually said — a bare "HTTP 503" tells you
         nothing about whether the allocation is spent or the model is gone. */
      let detail = "";
      try {
        const body = await response.json();
        detail = body?.detail || body?.error || "";
      } catch {
        /* body wasn't JSON */
      }
      throw new Error(`HTTP ${response.status}${detail ? `, ${detail}` : ""}`);
    }
    if (!response.body) throw new Error("Empty response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let produced = false;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      /* Server-sent events: one `data: {...}` per line. The last element is
         kept back because a chunk boundary can land mid-line. */
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payload);
          const text: string = parsed.response ?? parsed.delta?.content ?? "";
          if (text) {
            produced = true;
            onToken(text);
          }
        } catch {
          /* Partial JSON across a chunk boundary — wait for the rest. */
        }
      }
    }

    if (!produced) throw new Error("Empty response");

    return { mode: "live", sources: context.map((c) => c.title) };
  } finally {
    clearTimeout(timer);
  }
}

/* ==========================================================================
   Offline
   ========================================================================== */

async function askLocal(
  question: string,
  onToken: (text: string) => void,
): Promise<Reply> {
  const match = retrieve(question);

  const paragraphs = match
    ? match.entry.answer
    : [
        "That one isn't in my notes.",
        "I can cover his background, education, roles, projects, machine learning work, Kinnovation and the ventures, awards, technical stack, or how to reach him. Type `help` for the full list.",
      ];

  /* Typed out word by word so the offline path has the same rhythm as the
     streaming one — a canned answer that appears instantly reads as a lookup,
     which undercuts everything else the console is doing. */
  for (let i = 0; i < paragraphs.length; i += 1) {
    if (i) onToken("\n\n");
    const words = paragraphs[i].split(" ");
    for (let w = 0; w < words.length; w += 1) {
      onToken(w ? ` ${words[w]}` : words[w]);
      await new Promise((r) => setTimeout(r, 13));
    }
  }

  return {
    mode: "local",
    sources: match ? [match.entry.question] : [],
  };
}
