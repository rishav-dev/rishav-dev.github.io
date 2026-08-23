import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
await ctx.addInitScript(()=>{try{sessionStorage.setItem("rc.boot.v1","1")}catch{}});
const p = await ctx.newPage();
await p.goto("http://localhost:4173/", { waitUntil:"networkidle" });
await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(() => {
  const h1 = document.querySelector(".hero__title");
  const cs = getComputedStyle(h1);
  const before = { op: cs.opacity, delay: cs.transitionDelay, dur: cs.transitionDuration,
                   revealVar: cs.getPropertyValue("--reveal-delay"), attr: h1.getAttribute("data-reveal") };
  // force: does an explicit inline opacity take effect?
  h1.style.opacity = "1";
  const forced = getComputedStyle(h1).opacity;
  h1.style.opacity = "";
  // re-set the attribute
  h1.removeAttribute("data-reveal");
  void h1.offsetHeight;
  h1.setAttribute("data-reveal", "in");
  const after = getComputedStyle(h1).opacity;
  return { before, forced, afterReset: after,
           anims: h1.getAnimations().map(a => ({ t: a.constructor.name, state: a.playState })) };
}), null, 2));
await p.waitForTimeout(1500);
console.log("after 1.5s:", await p.evaluate(() => getComputedStyle(document.querySelector(".hero__title")).opacity));
await b.close();
