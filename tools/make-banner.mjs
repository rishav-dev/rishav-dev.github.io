/**
 * Renders the GitHub profile banner.
 *
 * Same approach as make-og.mjs: a real HTML page screenshotted at a fixed
 * size, so the banner uses the site's actual typeface instead of whatever a
 * fallback stack resolves to. GitHub proxies profile images and will not load
 * web fonts, which rules out doing this as SVG text.
 *
 *   node tools/make-banner.mjs [outPath]
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { mkdirSync } from "node:fs";

const out = process.argv[2] || "/home/claude/profile/assets/banner.png";
mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 340 },
  deviceScaleFactor: 2,
});
await page.goto(pathToFileURL(resolve("tools/banner-template.html")).href, {
  waitUntil: "networkidle",
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: out });
await browser.close();
console.log("wrote", out);
