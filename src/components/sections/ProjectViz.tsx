"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/data/profile";

/**
 * A small generative drawing of the method each project actually used.
 *
 * Not stock illustration and not a screenshot. The sentiment study gets two
 * distributions pulling apart, the scraper gets ten source columns feeding one
 * pile, the search agent gets a game tree with branches going dark as
 * alpha-beta prunes them, and the Billboard piece gets a series with a band.
 * It is the cheapest honest way to make four cards look like four different
 * pieces of work.
 *
 * Canvas 2D at ~30fps, seeded per project so the picture is stable across
 * reloads, paused whenever the card is off-screen, and it does not start at
 * all under prefers-reduced-motion (a static first frame is drawn instead).
 */

/** Deterministic PRNG, mulberry32. Same card, same picture, every visit. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashOf(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Kind = Project["viz"];

export default function ProjectViz({
  kind,
  seedKey,
  hue,
}: {
  kind: Kind;
  seedKey: string;
  hue: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();

    /* Resolve the CSS custom property once, reading it per frame forces
       style recalculation on every tick. */
    const accent =
      getComputedStyle(canvas).getPropertyValue("--viz-hue").trim() ||
      "34 217 255";
    const A = (a: number) => `rgb(${accent} / ${a})`;

    const r = rng(hashOf(seedKey));

    /* One draw from the seeded generator, so a card's phase offset is stable
       across reloads rather than jumping on every mount. */
    const phase = r() * Math.PI * 2;

    let raf = 0;
    let t = 0;
    let visible = true;
    let lastFrame = 0;

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      /* ~30fps is plenty for this and halves the cost with five on screen. */
      if (now - lastFrame < 33) return;
      lastFrame = now;
      t += 0.016;
      paint();
    }

    function paint() {
      ctx!.clearRect(0, 0, w, h);
      const pad = 14;
      const X = (u: number) => pad + u * (w - pad * 2);
      const Y = (v: number) => pad + v * (h - pad * 2);

      ctx!.lineCap = "round";

      if (kind === "corpus") {
        /* Ten source columns feeding one growing pile of documents. Marks drop
           down the columns and settle into a stack at the baseline, which is
           what the scraper does: many bespoke inputs, one comparable output. */
        const cols = 10;
        const base = Y(0.92);
        for (let c = 0; c < cols; c += 1) {
          const cx = X((c + 0.5) / cols);

          /* Source tick at the top of each column. */
          ctx!.beginPath();
          ctx!.moveTo(cx, Y(0.06));
          ctx!.lineTo(cx, Y(0.13));
          ctx!.strokeStyle = A(0.5);
          ctx!.lineWidth = 1.2;
          ctx!.stroke();

          /* Documents in flight. */
          for (let k = 0; k < 3; k += 1) {
            const phase = (t * 0.32 + c * 0.17 + k * 0.33) % 1;
            const y = Y(0.13) + phase * (base - Y(0.13));
            ctx!.fillStyle = A(0.16 + (1 - phase) * 0.5);
            ctx!.fillRect(cx - 2.5, y, 5, 3.5);
          }

          /* The settled stack, taller where more was collected. */
          const h = 4 + ((c * 7919) % 13);
          ctx!.fillStyle = "rgb(255 255 255 / 0.16)";
          ctx!.fillRect(cx - 3.5, base - h, 7, h);
        }

        ctx!.beginPath();
        ctx!.moveTo(X(0), base);
        ctx!.lineTo(X(1), base);
        ctx!.strokeStyle = "rgb(255 255 255 / 0.14)";
        ctx!.lineWidth = 1;
        ctx!.stroke();
      } else if (kind === "tree") {
        /* A game tree being searched, with branches going dark as alpha-beta
           prunes them. Three levels, and the cut moves so it reads as an
           ongoing search rather than a finished diagram. */
        const levels = [1, 3, 6];
        const cut = (Math.sin(t * 0.5) * 0.5 + 0.5) * 6;

        const nodeAt = (lvl: number, i: number) => {
          const n = levels[lvl];
          return {
            x: X((i + 0.5) / n),
            y: Y(0.16 + lvl * 0.34),
          };
        };

        /* Edges first so nodes sit on top of them. */
        for (let lvl = 0; lvl < levels.length - 1; lvl += 1) {
          const n = levels[lvl];
          const m = levels[lvl + 1];
          for (let i = 0; i < m; i += 1) {
            const parent = nodeAt(lvl, Math.floor((i * n) / m));
            const child = nodeAt(lvl + 1, i);
            /* Deeper-right subtrees get pruned as the cut sweeps. */
            const pruned = lvl === 1 && i > cut;
            ctx!.beginPath();
            ctx!.moveTo(parent.x, parent.y);
            ctx!.lineTo(child.x, child.y);
            ctx!.strokeStyle = pruned ? "rgb(255 255 255 / 0.07)" : A(0.42);
            ctx!.lineWidth = pruned ? 1 : 1.4;
            ctx!.stroke();
          }
        }

        for (let lvl = 0; lvl < levels.length; lvl += 1) {
          for (let i = 0; i < levels[lvl]; i += 1) {
            const { x, y } = nodeAt(lvl, i);
            const pruned = lvl === 2 && i > cut;
            ctx!.beginPath();
            ctx!.arc(x, y, lvl === 0 ? 4 : 3, 0, Math.PI * 2);
            if (pruned) {
              ctx!.fillStyle = "rgb(255 255 255 / 0.12)";
            } else {
              /* MAX levels take the accent, MIN levels stay neutral. */
              ctx!.fillStyle = lvl % 2 === 0 ? A(0.95) : "rgb(255 255 255 / 0.6)";
            }
            ctx!.fill();
          }
        }
      } else if (kind === "sentiment") {
        /* Two overlapping distributions drifting apart and back, negative and
           positive sentiment over the same corpus. The shapes move; the areas
           stay honest, because nothing here claims to be the real histogram. */
        const steps = 48;
        const drift = Math.sin(t * 0.35) * 0.07;

        const curve = (mu: number, sigma: number, amp: number) => {
          ctx!.beginPath();
          for (let i = 0; i <= steps; i += 1) {
            const u = i / steps;
            const z = (u - mu) / sigma;
            const v = Math.exp(-0.5 * z * z) * amp;
            ctx!.lineTo(X(u), Y(1 - v * 0.8 - 0.06));
          }
          ctx!.lineTo(X(1), Y(0.06));
          ctx!.lineTo(X(0), Y(0.06));
          ctx!.closePath();
        };

        curve(0.34 - drift, 0.15, 0.9);
        ctx!.fillStyle = "rgb(255 255 255 / 0.09)";
        ctx!.fill();
        ctx!.strokeStyle = "rgb(255 255 255 / 0.35)";
        ctx!.lineWidth = 1.3;
        ctx!.stroke();

        curve(0.64 + drift, 0.13, 0.72);
        ctx!.fillStyle = A(0.16);
        ctx!.fill();
        ctx!.strokeStyle = A(0.95);
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        /* Baseline. */
        ctx!.beginPath();
        ctx!.moveTo(X(0), Y(0.94));
        ctx!.lineTo(X(1), Y(0.94));
        ctx!.strokeStyle = "rgb(255 255 255 / 0.12)";
        ctx!.lineWidth = 1;
        ctx!.stroke();
      } else {
        /* series: a line with a confidence band around it. */
        const steps = 44;
        const val = (i: number) => {
          const u = i / steps;
          return (
            0.5 +
            Math.sin(u * 6.4 + t * 0.7) * 0.16 +
            Math.sin(u * 15 + t * 0.3) * 0.06
          );
        };

        ctx!.beginPath();
        for (let i = 0; i <= steps; i += 1) ctx!.lineTo(X(i / steps), Y(1 - val(i) - 0.09));
        for (let i = steps; i >= 0; i -= 1) ctx!.lineTo(X(i / steps), Y(1 - val(i) + 0.09));
        ctx!.closePath();
        ctx!.fillStyle = A(0.13);
        ctx!.fill();

        ctx!.beginPath();
        for (let i = 0; i <= steps; i += 1) ctx!.lineTo(X(i / steps), Y(1 - val(i)));
        ctx!.strokeStyle = A(0.95);
        ctx!.lineWidth = 1.6;
        ctx!.stroke();
      }
    }

    paint();

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    const onResize = () => {
      fit();
      paint();
    };
    window.addEventListener("resize", onResize);

    if (!still) raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [kind, seedKey]);

  return (
    <canvas
      ref={ref}
      className="viz"
      style={{ ["--viz-hue" as string]: `var(${hue})` }}
      aria-hidden="true"
    />
  );
}
