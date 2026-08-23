"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-linked progress for a sticky section.
 *
 * Returns 0 while the element's top edge is still below the viewport, 1 once
 * its bottom edge has passed, and the linear position in between. That is the
 * whole vocabulary the scroll-driven sections need, a tall wrapper, a sticky
 * child, and one number saying how far through it you are.
 *
 * Reads are batched into a rAF and the listener is passive, so this never
 * blocks the scroll thread. State only updates when the value actually moves,
 * because React re-rendering on every scroll event is the usual reason these
 * things stutter.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let last = -1;

    const measure = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;

      /* Section shorter than the viewport, there is no scroll to track, so
         report it as fully in view rather than dividing by zero. */
      if (total <= 0) {
        if (last !== 1) {
          last = 1;
          setProgress(1);
        }
        return;
      }

      const raw = -rect.top / total;
      const next = raw < 0 ? 0 : raw > 1 ? 1 : raw;

      /* Quantise. Sub-half-percent moves are invisible and would re-render
         the subtree on every single scroll event. */
      const q = Math.round(next * 200) / 200;
      if (q !== last) {
        last = q;
        setProgress(q);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}

/**
 * Maps a 0..1 progress value onto `count` discrete stages, with `hold` of each
 * stage's slice spent settled rather than in transit.
 *
 * Returns the active index plus how far through the *current* stage you are,
 * so a section can both switch content and animate within a step.
 */
export function stageOf(
  progress: number,
  count: number,
  hold = 0.45,
): { index: number; local: number } {
  const slice = 1 / count;
  const raw = Math.min(progress / slice, count - 0.0001);
  const index = Math.floor(raw);
  const within = raw - index;

  /* Compress the moving part into the first (1 - hold) of the slice. */
  const local = Math.min(1, within / (1 - hold));
  return { index, local };
}

/**
 * Tracks whether the page has been scrolled past a threshold. Used by the nav
 * to switch from transparent to solid.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return scrolled;
}
