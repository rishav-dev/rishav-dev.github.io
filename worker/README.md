# The assistant Worker

This turns the site's console (⌘K) from a written FAQ into an actual model
reading Rishav's profile. It is optional. The site ships working without it, and it costs nothing.

## Why it works this way

Cloudflare Workers AI runs the model **inside** the Worker. There is no
third-party API key: not in this repo, not in the frontend bundle, not in a
GitHub secret. Nothing to leak and nothing to rotate.

The browser does the retrieval (`src/data/corpus.ts` picks the five most
relevant profile passages), then sends the question plus those passages here.
This Worker wraps them in a grounding prompt and streams the reply back. The
model never sees anything except what the site already says on its own pages,
which is why it cannot invent a job Rishav did not have.

## Deploy

Ten minutes, free tier, no card.

```bash
npm install -g wrangler     # if you don't have it
cd worker
wrangler login              # opens a browser
wrangler deploy
```

Wrangler prints a URL like `https://rishav-assistant.<your-subdomain>.workers.dev`.

Paste it into `src/lib/assistant.ts`:

```ts
export const ASSISTANT = {
  endpoint: "https://rishav-assistant.your-subdomain.workers.dev",
  ...
};
```

Commit, push, done. The console's status dot turns green and its footer says
`model` instead of `offline`.

## Check it

Open the Worker URL directly in a browser. A `GET` runs a one-word prompt
against every model in the list and reports which ones actually work on your
account right now:

```json
{ "status": "alive", "usable": ["@cf/meta/llama-3.3-70b-instruct-fp8-fast"], ... }
```

If `usable` is empty, the daily allocation is spent or every pinned model has
been retired. Check the current catalogue at
[developers.cloudflare.com/workers-ai/models](https://developers.cloudflare.com/workers-ai/models)
and update `MODELS` in `src/index.js`.

## What happens when it breaks

Nothing visible breaks. The site tries the Worker, and on any failure (network, HTTP error, empty
stream, or a response slower than 18 seconds) it falls back to the written answers in `src/data/knowledge.ts` and tells the
visitor it did so, in small amber text under the reply.

That honesty is deliberate. Silently serving canned answers while implying they
came from a model is worse than a brief, visible degradation.

## Editing what it says

Two places, and they do different jobs:

- **`SYSTEM` in `src/index.js`** holds the rules. Tone, length, what it must refuse,
  what it must never invent. Edit here to change *how* it answers.
- **`src/data/profile.ts`** in the site holds the facts. The corpus is assembled
  from it, so the assistant and the pages can never disagree. Edit here to
  change *what* it knows.

Do not add facts to the system prompt. Facts go in `profile.ts`, where the
pages will render them too.

## Origins

`ALLOWED` in `src/index.js` is the CORS allowlist. Add any new preview domain
there or the browser will refuse the call.
