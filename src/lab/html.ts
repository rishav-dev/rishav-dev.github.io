import fs from "node:fs";
import path from "node:path";

/** Reads a lab page fragment at build time, so the markup is in the exported HTML. */
export function labHtml(slug: string): string {
  return fs.readFileSync(path.join(process.cwd(), "src", "lab", "pages", `${slug}.html`), "utf8");
}
