/**
 * Renders the social preview image.
 *
 * Opens tools/og-template.html at exactly 1200x630 in headless Chromium and
 * screenshots it to public/og.png. Rendering it in a browser rather than
 * drawing it in a script means it uses the real web fonts and the same CSS
 * gradients as the site, so the preview and the page cannot drift apart.
 *
 *   node tools/make-og.mjs
 *
 * Re-run after editing og-template.html. The result is committed, because
 * GitHub Pages serves static files and there is nothing to generate it at
 * request time.
 */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const template = pathToFileURL(resolve("tools/og-template.html")).href;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2, // retina-sharp in the LinkedIn feed
});

await page.goto(template, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

await page.screenshot({ path: "public/og.png" });

/* A 1:1 crop for the surfaces that want a square avatar-ish card. */
await page.setViewportSize({ width: 1200, height: 1200 });
await browser.close();

console.log("wrote public/og.png");
