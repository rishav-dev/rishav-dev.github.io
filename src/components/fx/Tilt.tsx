"use client";

import { useEffect, useRef } from "react";

/**
 * Pointer tilt.
 *
 * Rotates a card a few degrees toward the pointer and moves a light source
 * across it, via CSS custom properties the card's own styles read. The child
 * decides what to do with `--mx`, `--my`, `--rx` and `--ry`; this only supplies
 * the numbers.
 *
 * Kept small on purpose, 6 degrees, not 20. A card that lurches when the
 * pointer crosses it is a demo; one that leans slightly is an interface.
 *
 * Values are written straight to the element's style outside React, and the
 * listener is passive, so this costs nothing on the scroll thread.
 */
export default function Tilt({
  children,
  max = 6,
  className,
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    let raf = 0;
    let px = 0.5;
    let py = 0.5;

    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--ry", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      px = 0.5;
      py = 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
