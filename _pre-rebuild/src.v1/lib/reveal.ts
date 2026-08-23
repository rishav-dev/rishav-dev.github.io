"use client";

import { useEffect } from "react";

/**
 * Scroll reveal.
 *
 * One IntersectionObserver for the whole document rather than one per
 * element, watching anything marked `data-reveal`. When an element enters,
 * its attribute flips to `data-reveal="in"` and CSS does the rest — see the
 * `[data-reveal]` rules in globals.css.
 *
 * Elements are unobserved once revealed, so scrolling back up does not replay
 * anything. Content that animates every time it passes the viewport is a
 * novelty on the first pass and an irritation on the third.
 */
export function useReveal(): void {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!nodes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.setAttribute("data-reveal", "in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "in");
          io.unobserve(entry.target);
        }
      },
      /* The negative bottom margin holds the trigger until the element is
         properly in the frame, not one pixel over the fold. */
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );

    nodes.forEach((n) => {
      if (n.getAttribute("data-reveal") !== "in") io.observe(n);
    });

    return () => io.disconnect();
  }, []);
}

/**
 * Splits a string into per-character spans for the staggered headline reveal.
 *
 * Words are kept whole so the line still wraps and still reads correctly to a
 * screen reader — the caller is expected to put the plain string in an
 * `aria-label` and mark the split version `aria-hidden`.
 */
export function splitChars(
  text: string,
  stagger = 22,
): { char: string; delay: number }[][] {
  let i = 0;
  return text.split(" ").map((word) =>
    word.split("").map((char) => ({ char, delay: i++ * stagger })),
  );
}
