# Running, building and shipping this site

Everything below is run from the repo folder:

```
C:\Users\Rishav\Documents\GitHub\rishav-dev.github.io
```

Open it in a terminal first, in VS Code that's **Terminal → New Terminal**, or in
File Explorer type `cmd` in the address bar and press Enter.

---

## 1. First time only, install

```bash
npm install
```

Reads `package.json` and downloads what the site needs into `node_modules/`.
Takes a minute or two. You only repeat this when dependencies change.

If npm complains about the lockfile being out of date, that's expected, this
rebuild removed a dozen packages. `npm install` rewrites `package-lock.json`,
and that rewrite **should be committed**.

---

## 2. Work on it, the dev server

```bash
npm run dev
```

Open **http://localhost:3000**. Edit any file, save, and the browser updates
itself. Leave this running while you work; `Ctrl+C` stops it.

Two things to know while developing:

- The boot animation runs **once per browser session**. To see it again, open a
  new incognito window, or run `sessionStorage.clear()` in the browser console
  and reload.
- Almost all content lives in **`src/data/profile.ts`**. Changing a job title,
  a number, or a project description happens there and updates the index, the
  detail page, the resume and the assistant all at once.

---

## 3. Check it before you ship

```bash
npm run lint
```

Clears the build cache, then runs the TypeScript compiler over `src`. **If this
fails, stop and fix it.** A type error becomes a blank white page in production.

There is no ESLint here. `next lint` was removed in Next 16, and ESLint 10 with
`eslint-config-next` fails to load its config, so keeping it would have meant a
lint command that always errored. The typecheck is the check that actually
protects the deploy, and it is the one the workflow runs.

If you ever see errors coming from `_pre-rebuild/`, that folder is the backup of
your old site. It is excluded in `tsconfig.json` and gitignored, so it should
not be scanned at all. Delete it once you have read through the diff.

The cache clear at the start matters more than it looks. `.next/types` holds a
generated route validator, and a stale one from a previous build will complain
about routes that no longer exist.

```bash
npm run build
npm run preview
```

`build` produces the real static site in `out/`. `preview` serves that folder
at **http://localhost:4173** so you can click through exactly what visitors
will get. This catches things the dev server hides, broken links between
pages, missing images, routes that don't exist.

Optional, if you changed the hero copy and want the link preview to match:

```bash
node tools/make-og.mjs
```

Regenerates `public/og.png`, the image LinkedIn and Slack show when someone
shares your URL.

---

## 4. Ship it, commit and push

### Housekeeping, once

Two leftovers from the rebuild:

```bash
git rm --cached .env.local
```

That file holds old EmailJS keys. It's in `.gitignore` but was committed before
the ignore rule existed, so git is still tracking it. This command stops
tracking it without deleting your local copy. The keys are unused now, the
contact section is a plain `mailto:`, but rotate them at emailjs.com anyway.

Then delete the `_pre-rebuild/` folder once you've looked through the diff. It
holds your old `src/` and the delivery zips.

### The actual push

```bash
git status
```

Shows what changed. Read it, this is your last chance to catch a file you
didn't mean to touch.

```bash
git add -A
git commit -m "Rebuild site: new index, boot sequence, assistant, resume"
git push origin main
```

That's it. Pushing to `main` is what triggers the deploy.

---

## 5. What happens after you push

The workflow at `.github/workflows/deploy.yml` runs automatically on GitHub's
servers:

1. Checks out your code
2. `npm ci`, installs from the lockfile
3. `npx tsc --noEmit`, typechecks, and **fails the deploy if it doesn't pass**
4. `npm run build`, produces `out/`
5. Uploads `out/` and publishes it to GitHub Pages

**Watch it run:** go to your repo → **Actions** tab. A yellow dot means
building, green tick means live, red X means it failed, click into it to read
why. It takes about two minutes.

Your site is live at **https://www.rishavchakravarty.com** (the `CNAME` file
points GitHub Pages at your domain).

### If the site doesn't update

Check these in order:

1. **Actions tab**, did the workflow actually run and go green? A red X means
   the build failed and the old site is still up. That's the system working as
   designed.
2. **Settings → Pages → Build and deployment → Source** must be
   **GitHub Actions**, not "Deploy from a branch". If it's set to a branch, the
   workflow runs and nothing happens.
3. **Hard refresh**, `Ctrl+Shift+R`. Your browser caches aggressively and will
   happily show you yesterday's site.
4. Still stale after a few minutes? Try an incognito window. If it's correct
   there, it's your cache, not the deploy.

---

## 6. Turning the assistant on

The ⌘K console currently answers from written answers in
`src/data/knowledge.ts`. To switch it to a real model:

```bash
npm install -g wrangler
cd worker
wrangler login
wrangler deploy
```

Wrangler prints a URL. Paste it into `endpoint` in `src/lib/assistant.ts`,
commit, push. Free, no card, and **no API key ends up in the repo**, the model
runs inside the Cloudflare Worker. Full detail in `worker/README.md`.

---

## Everyday cheat sheet

| I want to… | Command |
|---|---|
| Work on the site | `npm run dev` → localhost:3000 |
| Check for errors | `npm run lint` |
| See the real built site | `npm run build` then `npm run preview` |
| Publish | `git add -A && git commit -m "..." && git push` |
| See if it deployed | Repo → Actions tab |
| Change any fact | `src/data/profile.ts` |
| Change colours or type | `src/app/globals.css` |
| Retime the boot animation | `TIMELINE` in `src/lib/boot-gl.ts` |
| Update the link preview | `node tools/make-og.mjs` |

---

## If you break something

Nothing you do locally can break the live site until you push, and a failed
build won't deploy. To throw away uncommitted changes and start again from the
last commit:

```bash
git restore .
```

To undo the last commit but keep the changes as edits:

```bash
git reset --soft HEAD~1
```
