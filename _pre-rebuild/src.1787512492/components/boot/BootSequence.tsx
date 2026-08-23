"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { runBoot, type BootHandle } from "@/lib/boot-gl";

/** Bumped when the sequence changes materially, to re-show it once. */
const SESSION_KEY = "rc.boot.v1";

/**
 * Captions, as fractions of the total sequence. They narrate what the point
 * cloud is doing — without them it is a pretty animation; with them it is the
 * argument the rest of the site spends nine sections making.
 *
 * Kept in step with TIMELINE in boot-gl.ts by hand: `at` is
 * `TIMELINE.<phase> / TIMELINE.done`.
 */
const CAPTIONS: { at: number; text: string }[] = [
  { at: 0.08, text: "signal" },
  { at: 0.3, text: "unlabelled" },
  { at: 0.5, text: "separable" },
  { at: 0.6, text: "decision boundary" },
  { at: 0.78, text: "rishav chakravarty" },
];

interface Props {
  wordmark?: string;
  /** Called once the sequence is finished or skipped. */
  onComplete?: () => void;
}

/**
 * Full-screen boot overlay.
 *
 * Renders nothing at all on the server, and nothing on the client either when
 * the visitor has already seen it this session or has asked for reduced
 * motion. The page underneath is complete and interactive the whole time —
 * this is a layer over a finished site, never a gate in front of an unfinished
 * one.
 */
export default function BootSequence({
  wordmark = "RISHAV",
  onComplete,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<BootHandle | null>(null);

  /* null = still deciding. Deciding needs window, so it cannot happen during
     render without desyncing hydration. */
  const [active, setActive] = useState<boolean | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const complete = useCallback(() => {
    setLeaving(true);
    document.documentElement.style.removeProperty("overflow");
    onComplete?.();
    /* Unmount after the CSS fade rather than on the same frame, or the
       overlay pops instead of dissolving. */
    window.setTimeout(() => setActive(false), 700);
  }, [onComplete]);

  /* --- should this run at all? ----------------------------------------- */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* Private mode, or storage disabled. Treat as unseen — showing the
         sequence twice is a far smaller failure than throwing here. */
    }

    if (reduced || seen) {
      setActive(false);
      onComplete?.();
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* Same as above. */
    }
    setActive(true);
  }, [onComplete]);

  /* --- run -------------------------------------------------------------- */
  useEffect(() => {
    if (active !== true || !canvasRef.current) return;

    /* Hold the page still for the duration. Restored in complete(), and in
       the cleanup below so an unmount mid-sequence cannot strand it. */
    document.documentElement.style.overflow = "hidden";

    const handle = runBoot({
      canvas: canvasRef.current,
      wordmark,
      onDone: complete,
      onProgress: setProgress,
    });

    /* No WebGL2. Don't show an empty black overlay — just get out of the way. */
    if (!handle) {
      complete();
      return;
    }

    handleRef.current = handle;

    const skip = () => handle.skip();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") skip();
    };

    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.removeProperty("overflow");
      handle.destroy();
      handleRef.current = null;
    };
  }, [active, wordmark, complete]);

  if (active !== true) return null;

  const caption =
    [...CAPTIONS].reverse().find((c) => progress >= c.at)?.text ?? "";

  return (
    <div
      className="boot"
      data-leaving={leaving ? "" : undefined}
      role="presentation"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="boot__canvas" />

      <div className="boot__meta">
        <span className="boot__caption" key={caption}>
          {caption}
        </span>
        <span className="boot__skip">click anywhere to skip</span>
      </div>

      <div className="boot__bar">
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>

      <style jsx>{`
        .boot {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: var(--void);
          opacity: 1;
          transition: opacity 0.6s var(--ease);
        }
        .boot[data-leaving] {
          opacity: 0;
          pointer-events: none;
        }

        .boot__canvas {
          width: 100%;
          height: 100%;
        }

        .boot__meta {
          position: absolute;
          left: 0;
          right: 0;
          bottom: clamp(2rem, 8vh, 5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
        }

        .boot__caption {
          font-family: var(--mono);
          font-size: 0.6875rem;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgb(var(--cyan) / 0.85);
          animation: fadeUp 0.5s var(--ease) both;
        }

        .boot__skip {
          font-family: var(--mono);
          font-size: 0.625rem;
          letter-spacing: 0.18em;
          color: var(--text-ghost);
        }

        /* Progress hairline across the very bottom of the viewport. */
        .boot__bar {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: rgb(255 255 255 / 0.07);
          overflow: hidden;
        }
        .boot__bar i {
          display: block;
          height: 100%;
          transform-origin: 0 50%;
          background: linear-gradient(
            90deg,
            rgb(var(--indigo)),
            rgb(var(--cyan)),
            rgb(var(--lime))
          );
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
