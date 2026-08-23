# rishavchakravarty.com

Personal site for Rishav Chakravarty. Data science, applied ML, and the
behavioural science underneath both.

Next.js 16 (App Router), TypeScript, static export to GitHub Pages. No CMS, no
database, no analytics, no cookies, no third-party fonts, no runtime API keys.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export into ./out
npm run preview      # serve ./out on :4173
npm run lint         # clears the cache, then tsc --noEmit over src
npm run typecheck    # tsc --noEmit on its own
npm run format       # biome format --write src
```

Deploys automatically from `main` via `.github/workflows/deploy.yml`.

**→ [DEPLOY.md](DEPLOY.md)** has the full walkthrough: running locally,
checking before you ship, committing, pushing, and what to check when the live
site doesn't update.

---

## The one file that matters

**`src/data/profile.ts`** holds every fact on the site: roles, projects,
ventures, awards, education, the stack, the copy. Nothing is hard-coded in a
component.

That is not tidiness for its own sake. The assistant's grounding corpus
(`src/data/corpus.ts`) is *assembled* from the same file, so the pages and the
assistant physically cannot disagree. Change a job title in `profile.ts` and
the timeline, the detail page, and every answer the bot gives all move together.

**Rule: if it isn't on the resume or LinkedIn, it doesn't go in `profile.ts`.**
The assistant will repeat a number you invent, in a sentence that sounds
confident, to a recruiter.

---

## Structure

```
src/
  app/
    page.tsx              the index: nine sections, one route
    resume/               the resume, on screen and in print
    work/[slug]/          a page per role, generated from ROLES
    projects/[slug]/      a page per project, generated from PROJECTS
    globals.css           design tokens: colour, type, motion, layout
    layout.tsx            metadata, JSON-LD, OG image, self-hosted fonts
    sitemap.ts robots.ts  generated at build time
  components/
    boot/                 the WebGL2 opening sequence
    chrome/               the nav
    console/              the ⌘K assistant
    detail/               shared shell for /work and /projects pages
    fx/                   Field, Cursor, Tilt, CountUp
    resume/               the resume view
    sections/             one file per index section
  data/
    profile.ts            ← every fact
    corpus.ts             grounding passages + retrieval, built from profile.ts
    knowledge.ts          hand-written answers for the offline assistant
  lib/
    boot-gl.ts            the boot point-cloud renderer
    field-gl.ts           the live pointer-reactive field behind the hero
    scroll.ts             scroll-progress hooks for the sticky sections
    reveal.ts             IntersectionObserver reveal
    assistant.ts          Worker client, SSE streaming, offline fallback
worker/                   optional Cloudflare Worker for the live model
tools/                    Playwright harnesses + the OG image generator
```

### Three levels of detail, said once each

The index gives a role one line. `/work/<slug>` gives it three paragraphs.
`/resume` gives it a scannable row. Nothing is repeated between them. They
answer different questions, and all three read from the same entry in
`profile.ts`.

### Sections do not share a form

The index has eight sections and deliberately no reusable "card grid"
component. The pipeline is a sticky scroll-driven diagram; work is a ledger of
rows; Kinnovation is a saturated full-bleed break; projects are an asymmetric
grid with generated visuals; recognition is a ticker plus two lists.

The previous version of this site put the same frosted-glass card treatment on
seven routes that each restated the index. If you add a section, give it its own
form. That constraint is the design.

---

## The boot sequence

`src/lib/boot-gl.ts`. One WebGL2 draw call, one buffer, one shader, no library.

It plays the site's argument before the site says a word: a seed point ignites,
bursts into unstructured noise, sorts into two labelled clusters, a decision
boundary sweeps between them, and everything collapses into the wordmark.

- ~4.2 seconds. Retime it by editing `TIMELINE` at the top of the file.
- Skippable with a click, scroll, key, or Escape.
- Runs **once per browser session** (`sessionStorage`), not per navigation.
- Skipped entirely under `prefers-reduced-motion`, and when WebGL2 is absent.
- The page underneath is complete and interactive the whole time. This is a
  layer over a finished site, never a gate in front of an unfinished one.

Bump `SESSION_KEY` in `BootSequence.tsx` if you change the sequence materially
and want returning visitors to see it once more.

---

## The assistant (⌘K)

Two modes, and the console always says which one you got.

**Offline (default).** Keyword retrieval over hand-written answers in
`src/data/knowledge.ts`. No network, no cost, fully deterministic. It can only
say things written there.

**Live.** Deploy `worker/` to Cloudflare (see `worker/README.md`: about ten
minutes, free, **no API key anywhere**) and paste the URL into
`ASSISTANT.endpoint` in `src/lib/assistant.ts`. The browser retrieves the five
most relevant profile passages, sends them with the question, and the Worker
streams a grounded answer back.

On any live failure (network, HTTP error, empty stream, or slower than 18s) it falls back to
the offline answers and says so in small amber text under the reply. Silently
serving canned answers while implying they came from a model is worse than a
brief, visible degradation.

---

## Design tokens

All in `src/app/globals.css`.

Six hues (`--indigo --violet --magenta --cyan --lime --amber`) stored as raw
channels so they work with alpha: `rgb(var(--cyan) / 0.4)`. Components use the
semantic aliases (`--accent`, `--accent-2`, `--accent-hot`), so the whole site
re-skins from six lines.

Colour is authored twice: sRGB is the floor, and a `display-p3` block gives
wide-gamut screens saturations sRGB cannot address. That is where the HDR look
comes from: the same design with more headroom where the panel has it.

Two easing curves for everything: `--ease` (fast out, long settle) and
`--ease-io`. Motion that does not use one of them will feel like it belongs to a
different site.

---

## The link preview

`public/og.png` is what LinkedIn, Slack, iMessage and email show when someone
is sent the URL. During a job search that image is seen far more often than the
site, so it is worth keeping current.

It is rendered, not drawn: `tools/og-template.html` is a real HTML page using
the same fonts and gradients as the site, screenshotted at 1200×630.

```bash
node tools/make-og.mjs      # edits to og-template.html land in public/og.png
```

Commit the result. GitHub Pages serves static files and there is nothing to
generate it at request time.

## Motion

Everything in `src/components/fx/` is additive: remove any of it and the site
still works, only quieter.

- **Field**. The live point lattice behind the hero. Pointer pushes points
  outward and lights them; they spring back. Runs on the GPU, pauses off-screen
  and in hidden tabs, and **refuses to start on a software rasteriser**
  (SwiftShader, llvmpipe) because emulated WebGL starves the main thread and
  stalls CSS transitions elsewhere on the page.
- **Cursor**. A trailing ring that snaps to and takes the shape of small
  interactive elements. Never hides the native cursor. Pointer-fine only.
- **ScrollRail**, reading position and section nav on the right edge. Labels
  appear on hover only; a pinned label would sit over the content column at
  common laptop widths.
- **Tilt**, writes `--mx/--my/--rx/--ry` to an element; the card's own CSS
  decides what to do with them. 5–6 degrees, not 20.
- **CountUp**, animates the numeric part of a string, keeping whatever prefix
  and suffix it was written with, so `profile.ts` stays readable.

All of them no-op under `prefers-reduced-motion`.

## Screenshots

```bash
npm run build && npm run preview     # in one terminal
npm run shots                        # in another, all sections, 1440px
node tools/shoot-sections.mjs 390    # phone
npm run shots:boot                   # the boot sequence, frame by frame
```

Both harnesses report console errors. The section harness pre-seeds the boot's
session key so captures start on the settled page.

---

## Notes for future edits

- **Never put facts in the Worker's system prompt.** Facts go in `profile.ts`,
  where the pages render them too. The prompt is for rules, tone, length, what
  to refuse.
- **styled-jsx does not scope class names onto React components**, only onto
  host elements. A `className` on `next/link` gets no hash, so rules targeting
  it must be written `:global(a.thing)` anchored to a hashed ancestor. This
  silently broke the work-row grid once; see the comments in `Work.tsx`.
- **Accessibility floor:** every animation respects `prefers-reduced-motion`,
  split-character headlines carry an `aria-label` with the plain string, and
  the canvas visuals are `aria-hidden`.
