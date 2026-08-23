/** Captures the detail routes and the resume, at desktop and phone widths. */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const OUT = "/home/claude/shots/pages"; mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const errs = [];
for (const [w,h,tag] of [[1440,900,"desk"],[390,844,"phone"]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h} });
  await ctx.addInitScript(()=>{try{sessionStorage.setItem("rc.boot.v1","1")}catch{}});
  const p = await ctx.newPage();
  p.on("pageerror", e => errs.push(`${tag}: ${e.message}`));
  p.on("console", m => m.type()==="error" && errs.push(`${tag}: ${m.text()}`));
  for (const [path,name] of [["/resume/","resume"],["/projects/reddit-mental-health/","project"],["/work/steve-fisher/","work"],["/#code","code"]]) {
    await p.goto("http://localhost:4173"+path, { waitUntil:"networkidle" });
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `${OUT}/${name}-${tag}.png`, fullPage: name==="resume" && tag==="desk" });
  }
  await ctx.close();
}
await b.close();
console.log(errs.length ? "ERRORS:\n"+[...new Set(errs)].join("\n") : "no console errors");
