"use client";

import { PIPELINE } from "@/data/profile";
import { stageOf, useScrollProgress } from "@/lib/scroll";

/**
 * The method, as a scroll-driven pipeline.
 *
 * Four stages — observe, structure, predict, ship — advanced by scroll rather
 * than by clicking tabs. The spine on the left draws itself as you go and each
 * node lights in its own hue, so the section is legible as a diagram even at a
 * glance, and the colour ramp across the four stages is the same one the boot
 * sequence used.
 *
 * This replaces the "three parallel expertise cards" pattern the old site had.
 * The content is the same category of thing; the difference is that a sequence
 * carries an argument and three cards carry a list.
 */
export default function Pipeline() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const { index, local } = stageOf(progress, PIPELINE.length, 0.5);
  const active = PIPELINE[Math.min(index, PIPELINE.length - 1)];

  /* How far the spine has been drawn, 0..1 across all four stages. */
  const drawn = Math.min(1, (index + local) / (PIPELINE.length - 1 || 1));

  return (
    <section className="pipe" id="pipeline" ref={ref}>
      <div className="pipe__sticky">
        <div className="shell pipe__grid">
          {/* --- the spine ------------------------------------------------ */}
          <div className="pipe__rail" aria-hidden="true">
            <div className="pipe__track">
              <div
                className="pipe__fill"
                style={{ transform: `scaleY(${drawn})` }}
              />
            </div>

            <ol className="pipe__nodes">
              {PIPELINE.map((s, i) => (
                <li
                  key={s.id}
                  data-state={i === index ? "on" : i < index ? "past" : "off"}
                  style={{ ["--hue" as string]: `var(${s.hue})` }}
                >
                  <span className="pipe__dot" />
                  <span className="pipe__num">{s.index}</span>
                  <span className="pipe__name">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* --- the active stage ----------------------------------------- */}
          <div
            className="pipe__panel"
            style={{ ["--hue" as string]: `var(${active.hue})` }}
          >
            <p className="t-label pipe__eyebrow">
              Stage {active.index} — {active.verb}
            </p>

            {/* key on the id so React swaps the node and the entry animation
                replays for each stage */}
            <h2 className="t-section pipe__title" key={`t-${active.id}`}>
              {active.title}
            </h2>

            <p className="t-lede pipe__body" key={`b-${active.id}`}>
              {active.body}
            </p>

            <ul className="pipe__tools" key={`k-${active.id}`}>
              {active.tools.map((t, i) => (
                <li key={t} style={{ ["--i" as string]: i }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pipe {
          /* One viewport of scroll per stage, plus a little run-out. */
          height: 440vh;
          position: relative;
        }

        .pipe__sticky {
          position: sticky;
          top: 0;
          height: 100svh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .pipe__grid {
          display: grid;
          grid-template-columns: minmax(200px, 260px) 1fr;
          gap: clamp(2rem, 6vw, 6rem);
          align-items: center;
          width: 100%;
        }

        /* --- rail ------------------------------------------------------- */

        .pipe__rail {
          position: relative;
          display: flex;
          gap: 1.5rem;
        }

        .pipe__track {
          position: relative;
          width: 2px;
          background: var(--line);
          border-radius: 2px;
        }

        .pipe__fill {
          position: absolute;
          inset: 0;
          transform-origin: 50% 0;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgb(var(--violet)),
            rgb(var(--cyan)) 38%,
            rgb(var(--indigo)) 68%,
            rgb(var(--lime))
          );
          transition: transform 0.5s var(--ease);
        }

        .pipe__nodes {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: clamp(1.5rem, 5vh, 3.25rem);
          flex: 1;
        }

        .pipe__nodes li {
          position: relative;
          display: grid;
          grid-template-columns: auto auto 1fr;
          align-items: center;
          gap: 0.75rem;
          transition: opacity 0.45s var(--ease);
          opacity: 0.32;
        }
        .pipe__nodes li[data-state="past"] {
          opacity: 0.55;
        }
        .pipe__nodes li[data-state="on"] {
          opacity: 1;
        }

        .pipe__dot {
          /* Pulled left onto the track. */
          position: absolute;
          left: -2.13rem;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--void-2);
          border: 1.5px solid var(--line-strong);
          transition:
            background 0.45s var(--ease),
            border-color 0.45s var(--ease),
            box-shadow 0.45s var(--ease),
            transform 0.45s var(--ease-spring);
        }
        .pipe__nodes li[data-state="on"] .pipe__dot {
          background: rgb(var(--hue));
          border-color: rgb(var(--hue));
          box-shadow: 0 0 20px 2px rgb(var(--hue) / 0.75);
          transform: scale(1.35);
        }
        .pipe__nodes li[data-state="past"] .pipe__dot {
          background: rgb(var(--hue) / 0.5);
          border-color: rgb(var(--hue) / 0.5);
        }

        .pipe__num {
          font-family: var(--mono);
          font-size: 0.6875rem;
          color: var(--text-faint);
        }

        .pipe__name {
          font-family: var(--display);
          font-weight: 500;
          font-size: 0.9375rem;
          letter-spacing: -0.02em;
        }
        .pipe__nodes li[data-state="on"] .pipe__name {
          color: rgb(var(--hue));
        }

        /* --- panel ------------------------------------------------------- */

        .pipe__panel {
          position: relative;
          max-width: 46rem;
        }

        /* The active hue as a wash behind the text. Cheaper than a bloom
           element and it re-tints instantly when the stage changes. */
        .pipe__panel::before {
          content: "";
          position: absolute;
          left: -12%;
          top: -30%;
          width: 60%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgb(var(--hue) / 0.24),
            transparent 68%
          );
          filter: blur(60px);
          pointer-events: none;
          z-index: -1;
          transition: background 0.6s var(--ease);
        }

        .pipe__eyebrow {
          color: rgb(var(--hue));
        }

        .pipe__title {
          margin-top: 1rem;
          animation: rise 0.55s var(--ease) both;
        }

        .pipe__body {
          margin-top: 1.5rem;
          animation: rise 0.55s var(--ease) 0.06s both;
        }

        .pipe__tools {
          list-style: none;
          margin: 2.25rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .pipe__tools li {
          padding: 0.4rem 0.8rem;
          border-radius: 99px;
          border: 1px solid rgb(var(--hue) / 0.3);
          background: rgb(var(--hue) / 0.08);
          color: rgb(var(--hue));
          font-family: var(--mono);
          font-size: 0.75rem;
          animation: rise 0.5s var(--ease) both;
          animation-delay: calc(0.1s + var(--i) * 0.05s);
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @media (max-width: 900px) {
          .pipe__grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          /* The rail becomes a compact horizontal stepper on narrow screens —
             a vertical spine next to stacked content reads as decoration. */
          .pipe__rail {
            gap: 0;
          }
          .pipe__track {
            display: none;
          }
          .pipe__nodes {
            flex-direction: row;
            gap: 1.25rem;
            overflow-x: auto;
            scrollbar-width: none;
          }
          .pipe__nodes::-webkit-scrollbar {
            display: none;
          }
          .pipe__nodes li {
            grid-template-columns: auto auto;
            flex-shrink: 0;
          }
          .pipe__dot {
            position: static;
          }
          .pipe__num {
            display: none;
          }
        }

        @media (max-width: 720px) {
          .pipe {
            height: 380vh;
          }
        }
      `}</style>
    </section>
  );
}
