/** Captures one section by id at a given offset. node tools/shoot-one.mjs <id> <offsetPx> <name> */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const [id, off, name] = [process.argv[2], Number(process.argv[3]||0), process.argv[4]||"shot"];
mkdirSync("/home/claude/shots/one", { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900} });
await ctx.addInitScript(()=>{try{sessionStorage.setItem("rc.boot.v1","1")}catch{}});
const p = await ctx.newPage();
p.on("pageerror", e => console.log("PAGEERROR:", e.message));
await p.goto("http://localhost:4173/", { waitUntil:"networkidle" });
await p.waitForTimeout(700);
const top = await p.evaluate((i) => document.getElementById(i)?.offsetTop ?? 0, id);
await p.evaluate((y) => window.scrollTo(0, y), top + off);
await p.waitForTimeout(1800);
await p.screenshot({ path: `/home/claude/shots/one/${name}.png` });
await b.close();
console.log("ok", id, top + off);
