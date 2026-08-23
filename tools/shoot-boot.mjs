/**
 * Boot frames, one page load per frame.
 *
 * Headless software GL makes hydration slow and variable, so a series of
 * screenshots inside one page drifts badly. A fresh load per frame costs more
 * wall time but each capture lands where it says it does.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const OUT = "/home/claude/shots"; mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"] });

for (const at of [300, 900, 1500, 2100, 2600, 3100, 3600, 4300]) {
  const ctx = await b.newContext({ viewport:{width:1440,height:900} });
  const p = await ctx.newPage();
  await p.goto("http://localhost:4173/", { waitUntil:"domcontentloaded" });
  /* Anchor to the sequence's own clock, not the page load. */
  await p.waitForFunction(() => !!document.querySelector(".boot__canvas"), null, { timeout: 15000 }).catch(()=>{});
  await p.waitForTimeout(at);
  await p.screenshot({ path: `${OUT}/b-${String(at).padStart(4,"0")}.png` });
  await ctx.close();
}
await b.close();
console.log("done");
