"use client";

import { useEffect, useRef } from "react";

/**
 * Trailing cursor ring with magnetic snap.
 *
 * A ring that lags the pointer, and when the pointer is over anything
 * interactive the ring snaps to that element's centre and takes its shape.
 * So the affordance reads before you have consciously registered the hover.
 *
 * Notes on why it is built this way:
 * - The native cursor is never hidden. Hiding it is a common flourish and a
 *   real accessibility problem; this rides alongside instead.
 * - Everything runs in a rAF loop writing `transform` directly, outside React.
 *   A cursor that re-renders a component tree per pointer event stutters.
 * - Pointer-fine devices only. A touch device has no hover state to express.
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    const pointer = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const size = { w: 26, h: 26, r: 999 };
    const seen = { w: 26, h: 26, r: 999 };

    /** The element the ring is currently magnetised to, if any. */
    let locked: HTMLElement | null = null;
    let raf = 0;
    let visible = false;

    const INTERACTIVE =
      "a, button, [role='button'], input, summary, .vent, .card, [data-magnetic]";

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;

      if (!visible) {
        visible = true;
        pos.x = pointer.x;
        pos.y = pointer.y;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }

      const el = (e.target as HTMLElement | null)?.closest?.(
        INTERACTIVE,
      ) as HTMLElement | null;
      locked = el ?? null;
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onOut = () => {
      visible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onOut);

    const tick = () => {
      raf = requestAnimationFrame(tick);

      let tx = pointer.x;
      let ty = pointer.y;

      if (locked && locked.isConnected) {
        const r = locked.getBoundingClientRect();
        /* Only magnetise to things small enough that snapping reads as
           intent. Over a large card, follow the pointer and just grow. */
        const small = r.width < 340 && r.height < 160;
        if (small) {
          tx = r.left + r.width / 2;
          ty = r.top + r.height / 2;
          size.w = r.width + 14;
          size.h = r.height + 14;
          size.r = Math.max(10, parseFloat(getComputedStyle(locked).borderRadius) || 12) + 7;
        } else {
          size.w = 54;
          size.h = 54;
          size.r = 999;
        }
      } else {
        size.w = 26;
        size.h = 26;
        size.r = 999;
      }

      pos.x += (tx - pos.x) * 0.19;
      pos.y += (ty - pos.y) * 0.19;
      seen.w += (size.w - seen.w) * 0.22;
      seen.h += (size.h - seen.h) * 0.22;
      seen.r += (size.r - seen.r) * 0.22;

      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      ring.style.width = `${seen.w}px`;
      ring.style.height = `${seen.h}px`;
      ring.style.borderRadius = `${seen.r}px`;

      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onOut);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />

      <style jsx global>{`
        .cursor-ring,
        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 300;
          pointer-events: none;
          opacity: 0;
          will-change: transform;
        }

        .cursor-ring {
          width: 26px;
          height: 26px;
          border: 1px solid rgb(var(--cyan) / 0.75);
          border-radius: 999px;
          background: rgb(var(--cyan) / 0.05);
          transition:
            opacity 0.3s var(--ease),
            background 0.3s var(--ease),
            border-color 0.3s var(--ease);
        }

        .cursor-ring.is-down {
          background: rgb(var(--cyan) / 0.2);
          border-color: rgb(var(--cyan));
        }

        .cursor-dot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: rgb(var(--lime));
          transition: opacity 0.3s var(--ease);
        }

        /* Coarse pointers and reduced-motion users never get these mounted,
           but belt and braces in case the media query flips at runtime. */
        @media (pointer: coarse), (prefers-reduced-motion: reduce) {
          .cursor-ring,
          .cursor-dot {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
