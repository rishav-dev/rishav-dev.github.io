/**
 * Section captures.
 *
 * Skips the boot sequence by pre-seeding its sessionStorage key, then scrolls
 * to each anchor and captures. The scroll-driven sections are also sampled
 * part-way through so the sticky states get seen, not just their entry frame.
 *
 *   node tools/shoot-sections.mjs [width] [outDir]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const W = Number(process.argv[2] || 1440);
/* Phone widths get a phone aspect ratio, not a letterbox. Deriving height from
   width alone gave a 390x242 viewport, which is not a device and made every
   sticky section look broken. */
const H = Number(process.argv[4] || (W < 700 ? 844 : Math.round(W * 0.62)));
const OUT = process.argv[3] || "/home/claude/shots/sections";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});

const ctx = await browser.newContext({ viewport: { width: W, height: H } });

/* Pre-seed the boot's session key so every capture starts on the settled
   page — the boot has its own harness. */
await ctx.addInitScript(() => {
  try {
    sessionStorage.setItem("rc.boot.v1", "1");
  } catch {}
});

const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));

await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);

/** Scroll to an absolute document position and settle. */
async function at(name, y) {
  await page.evaluate((py) => window.scrollTo(0, py), y);
  /* Two rAFs plus a beat: one to run the scroll handlers, one to paint, and
     the wait for the CSS reveal transitions to finish. */
  await page.waitForTimeout(950);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

const anchors = await page.evaluate(() => {
  const out = {};
  for (const id of [
    "top",
    "thesis",
    "pipeline",
    "work",
    "kinnovation",
    "projects",
    "recognition",
    "contact",
  ]) {
    const el = document.getElementById(id);
    if (el) out[id] = { top: el.offsetTop, height: el.offsetHeight };
  }
  out.__doc = document.body.scrollHeight;
  return out;
});

console.log("document height:", anchors.__doc);

await at("01-hero", 0);
/* Sticky sections: sample at 25%, 55% and 85% of their scroll range. */
await at("02-thesis-early", anchors.thesis.top + anchors.thesis.height * 0.25);
await at("03-thesis-late", anchors.thesis.top + anchors.thesis.height * 0.7);
await at("04-pipeline-1", anchors.pipeline.top + anchors.pipeline.height * 0.08);
await at("05-pipeline-2", anchors.pipeline.top + anchors.pipeline.height * 0.38);
await at("06-pipeline-4", anchors.pipeline.top + anchors.pipeline.height * 0.86);
await at("07-work", anchors.work.top + 40);
await at("08-kinnovation", anchors.kinnovation.top + 40);
await at("09-ventures", anchors.kinnovation.top + anchors.kinnovation.height * 0.55);
await at("10-projects", anchors.projects.top + 40);
await at("11-projects-2", anchors.projects.top + anchors.projects.height * 0.55);
await at("12-recognition", anchors.recognition.top + 40);
await at("13-contact", anchors.contact.top + 40);

/* The console, opened. */
await page.keyboard.down("Control");
await page.keyboard.press("k");
await page.keyboard.up("Control");
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/14-console.png` });

/* And with an answer in it. */
await page.keyboard.type("why does the psychology background matter");
await page.keyboard.press("Enter");
await page.waitForTimeout(3200);
await page.screenshot({ path: `${OUT}/15-console-answer.png` });

await browser.close();

if (errors.length) {
  console.log("CONSOLE ERRORS:");
  [...new Set(errors)].forEach((e) => console.log("  " + e));
} else {
  console.log("no console errors");
}
