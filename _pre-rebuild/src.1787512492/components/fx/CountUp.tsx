"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up when it first scrolls into view.
 *
 * Takes the display string ("37%", "6,429", "20k+", "150+") and animates only
 * the numeric part, keeping whatever prefix and suffix it was written with —
 * so the data file stays human-readable and nothing has to be re-encoded as
 * {value, prefix, suffix} triples.
 *
 * Runs once, respects reduced motion, and renders the final string on the
 * server so the number is in the HTML for anything that does not run scripts.
 */
export default function CountUp({
  value,
  duration = 1500,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Split "6,429" into ("", 6429, "") and "20k+" into ("", 20, "k+"). */
    const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) return;

    const [, prefix, digits, suffix] = match;
    const target = parseFloat(digits.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;

    const grouped = digits.includes(",");
    const decimals = (digits.split(".")[1] ?? "").length;

    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      const withGroups = grouped
        ? Number(fixed).toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : fixed;
      return `${prefix}${withGroups}${suffix}`;
    };

    let raf = 0;
    let startedAt = 0;

    const run = (now: number) => {
      if (!startedAt) startedAt = now;
      const t = Math.min(1, (now - startedAt) / duration);
      /* Fast start, long settle — the same feel as --ease elsewhere. */
      const eased = 1 - Math.pow(1 - t, 4);
      setShown(format(target * eased));
      if (t < 1) raf = requestAnimationFrame(run);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setShown(format(0));
        raf = requestAnimationFrame(run);
      },
      { threshold: 0.4 },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}
