"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/data/profile";

/**
 * A small generative drawing of the method each project actually used.
 *
 * Not stock illustration and not a screenshot: k-means gets points converging
 * on centroids, the regression gets a scatter and a fitted line, the ERGM work
 * gets a force-ish graph, the vision project gets a scanning detector, the
 * experiment gets a time series with a confidence band. It is the cheapest
 * honest way to make five cards look like five different pieces of work.
 *
 * Canvas 2D at ~30fps, seeded per project so the picture is stable across
 * reloads, paused whenever the card is off-screen, and it does not start at
 * all under prefers-reduced-motion (a static first frame is drawn instead).
 */

/** Deterministic PRNG — mulberry32. Same card, same picture, every visit. */
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

    /* Resolve the CSS custom property once — reading it per frame forces
       style recalculation on every tick. */
    const accent =
      getComputedStyle(canvas).getPropertyValue("--viz-hue").trim() ||
      "34 217 255";
    const A = (a: number) => `rgb(${accent} / ${a})`;

    const r = rng(hashOf(seedKey));

    /* --- fixed data, generated once ---------------------------------- */
    const N = 46;
    const pts = Array.from({ length: N }, () => ({
      x: r(),
      y: r(),
      g: r() < 0.5 ? 0 : 1,
      p: r() * Math.PI * 2,
    }));
    const centroids = [
      { x: 0.3, y: 0.36 },
      { x: 0.7, y: 0.64 },
    ];
    const edges: [number, number][] = [];
    for (let i = 0; i < 26; i += 1) {
      edges.push([Math.floor(r() * 18), Math.floor(r() * 18)]);
    }

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

      if (kind === "cluster") {
        /* k-means: points drift, then snap toward their centroid on a slow
           cycle, and the centroids themselves wander a little. */
        const phase = (Math.sin(t * 0.5) + 1) / 2;
        centroids.forEach((c, ci) => {
          const cx = X(c.x + Math.sin(t * 0.3 + ci) * 0.03);
          const cy = Y(c.y + Math.cos(t * 0.24 + ci) * 0.03);
          ctx!.beginPath();
          ctx!.arc(cx, cy, 5 + phase * 2, 0, Math.PI * 2);
          ctx!.strokeStyle = A(0.75);
          ctx!.lineWidth = 1.2;
          ctx!.stroke();
        });
        pts.forEach((p) => {
          const c = centroids[p.g];
          const px = X(p.x + (c.x - p.x) * phase * 0.75);
          const py = Y(p.y + (c.y - p.y) * phase * 0.75);
          ctx!.beginPath();
          ctx!.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx!.fillStyle = p.g ? A(0.85) : "rgb(255 255 255 / 0.34)";
          ctx!.fill();
        });
      } else if (kind === "regression") {
        /* Scatter with a fitted line and a residual for each point. */
        const slope = 0.62;
        const inter = 0.18;
        ctx!.beginPath();
        ctx!.moveTo(X(0), Y(1 - inter));
        ctx!.lineTo(X(1), Y(1 - (inter + slope)));
        ctx!.strokeStyle = A(0.9);
        ctx!.lineWidth = 1.6;
        ctx!.stroke();

        pts.forEach((p, i) => {
          const fit = inter + slope * p.x;
          const wobble = Math.sin(t * 0.9 + p.p) * 0.035;
          const yv = fit + (p.y - 0.5) * 0.34 + wobble;
          const px = X(p.x);
          const py = Y(1 - yv);
          if (i % 3 === 0) {
            ctx!.beginPath();
            ctx!.moveTo(px, py);
            ctx!.lineTo(px, Y(1 - fit));
            ctx!.strokeStyle = A(0.22);
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
          ctx!.beginPath();
          ctx!.arc(px, py, 2, 0, Math.PI * 2);
          ctx!.fillStyle = "rgb(255 255 255 / 0.6)";
          ctx!.fill();
        });
      } else if (kind === "network") {
        /* A small graph breathing on its own axes. */
        const nodes = pts.slice(0, 18).map((p, i) => ({
          x: X(0.5 + Math.cos(p.p + t * 0.16) * (0.16 + (i % 4) * 0.075)),
          y: Y(0.5 + Math.sin(p.p + t * 0.16) * (0.2 + (i % 3) * 0.085)),
        }));
        edges.forEach(([a, b]) => {
          const na = nodes[a];
          const nb = nodes[b];
          if (!na || !nb || a === b) return;
          ctx!.beginPath();
          ctx!.moveTo(na.x, na.y);
          ctx!.lineTo(nb.x, nb.y);
          ctx!.strokeStyle = A(0.16);
          ctx!.lineWidth = 1;
          ctx!.stroke();
        });
        nodes.forEach((n, i) => {
          const pulse = 1 + Math.sin(t * 1.6 + i) * 0.25;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, 2.4 * pulse, 0, Math.PI * 2);
          ctx!.fillStyle = i % 5 === 0 ? A(1) : "rgb(255 255 255 / 0.5)";
          ctx!.fill();
        });
      } else if (kind === "vision") {
        /* A detector box locking on, with a scan line crossing the frame. */
        const bw = w * 0.3;
        const bh = h * 0.42;
        const bx = w * 0.5 - bw / 2 + Math.sin(t * 0.5) * w * 0.07;
        const by = h * 0.5 - bh / 2 + Math.cos(t * 0.4) * h * 0.07;

        ctx!.strokeStyle = A(0.9);
        ctx!.lineWidth = 1.4;
        const corner = 10;
        [
          [bx, by, 1, 1],
          [bx + bw, by, -1, 1],
          [bx, by + bh, 1, -1],
          [bx + bw, by + bh, -1, -1],
        ].forEach(([cx, cy, sx, sy]) => {
          ctx!.beginPath();
          ctx!.moveTo(cx + corner * sx, cy);
          ctx!.lineTo(cx, cy);
          ctx!.lineTo(cx, cy + corner * sy);
          ctx!.stroke();
        });

        /* Scan line. Kept faint — at full strength it dominates the card and
           the detector box, which is the actual subject, disappears. */
        const scanY = pad + ((t * 46) % (h - pad * 2));
        const grad = ctx!.createLinearGradient(0, scanY - 22, 0, scanY + 22);
        grad.addColorStop(0, A(0));
        grad.addColorStop(0.5, A(0.16));
        grad.addColorStop(1, A(0));
        ctx!.fillStyle = grad;
        ctx!.fillRect(pad, scanY - 22, w - pad * 2, 44);

        pts.slice(0, 24).forEach((p) => {
          ctx!.fillStyle = "rgb(255 255 255 / 0.16)";
          ctx!.fillRect(X(p.x), Y(p.y), 2, 2);
        });
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
