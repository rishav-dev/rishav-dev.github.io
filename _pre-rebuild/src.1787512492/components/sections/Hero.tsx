"use client";

import Field from "@/components/fx/Field";
import { HERO, PERSON } from "@/data/profile";
import { splitChars } from "@/lib/reveal";

/**
 * The first screen.
 *
 * The wordmark the boot sequence resolves into sits directly behind this, so
 * the headline has to land in the same optical position the particles left —
 * that is what makes the handoff read as one continuous move rather than an
 * animation followed by a page.
 */
export default function Hero() {
  return (
    <section className="hero" id="top">
      {/* Three bloom sources, deliberately off-centre and different sizes.
          Concentric glows read as a vignette; offset ones read as light. */}
      <div className="hero__light" aria-hidden="true">
        <span className="bloom" style={{ ["--hue" as string]: "var(--indigo)", width: "46vw", height: "46vw", left: "-8vw", top: "6vh" }} />
        <span className="bloom" style={{ ["--hue" as string]: "var(--cyan)", width: "34vw", height: "34vw", right: "-6vw", top: "34vh", opacity: 0.34 }} />
        <span className="bloom" style={{ ["--hue" as string]: "var(--magenta)", width: "28vw", height: "28vw", left: "38vw", bottom: "-8vh", opacity: 0.28 }} />
      </div>

      {/* The live layer. Picks up where the boot sequence leaves off: the same
          point cloud, now drifting and reacting to the pointer. */}
      <div className="hero__field" aria-hidden="true">
        <Field />
      </div>

      <div className="shell hero__inner">
        <p className="t-label hero__eyebrow" data-reveal>
          {HERO.role}
        </p>

        <h1
          className="t-hero hero__title"
          aria-label={HERO.lines.join(" ")}
          data-reveal
        >
          {/* Line one assembles letter by letter. */}
          <span className="hero__line" aria-hidden="true">
            {splitChars(HERO.lines[0]).map((word, wi) => (
              <span className="hero__word" key={`w-${wi}`}>
                {word.map((c, ci) => (
                  <span
                    className="split-char"
                    key={`c-${wi}-${ci}`}
                    style={{ ["--d" as string]: `${260 + c.delay}ms` }}
                  >
                    {c.char}
                  </span>
                ))}
              </span>
            ))}
          </span>

          {/* Line two arrives whole, and it must: it carries the gradient via
              background-clip:text, and a transformed descendant gets painted
              as its own layer that the parent's clipped background cannot
              reach — so per-character animation here renders the line
              invisible for the entire length of its own entrance. Animating
              the line as one element keeps the clip and the transform on the
              same box, where they work. */}
          <span className="hero__line hero__line--grad" aria-hidden="true">
            {HERO.lines[1]}
          </span>
        </h1>

        <p className="t-lede hero__kicker" data-reveal style={{ ["--reveal-delay" as string]: "620ms" }}>
          {HERO.kicker}
        </p>

        <div className="hero__actions" data-reveal style={{ ["--reveal-delay" as string]: "760ms" }}>
          <a className="btn btn--primary" href="#work">
            <span>See the work</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a className="btn" href={PERSON.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="btn" href={PERSON.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>

      <div className="hero__floor" aria-hidden="true">
        <span className="hero__scroll">
          <i />
        </span>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-block: calc(var(--bar-h) + 4rem) 6rem;
          overflow: hidden;
          isolation: isolate;
        }

        .hero__light {
          position: absolute;
          inset: 0;
          z-index: -2;
          /* Bloom is expensive to composite over content; keeping it on its
             own layer behind everything means it never re-rasterises. */
          contain: strict;
        }

        /* Between the bloom and the copy. Masked so the points fade out behind
           the headline — the field is atmosphere, and atmosphere that competes
           with the text has stopped being atmosphere. */
        .hero__field {
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0.85;
          mask-image: radial-gradient(
            120% 90% at 22% 52%,
            transparent 0%,
            rgb(0 0 0 / 0.35) 34%,
            #000 68%
          );
          -webkit-mask-image: radial-gradient(
            120% 90% at 22% 52%,
            transparent 0%,
            rgb(0 0 0 / 0.35) 34%,
            #000 68%
          );
        }

        .hero__inner {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .hero__eyebrow {
          color: rgb(var(--cyan) / 0.9);
        }

        .hero__title {
          margin: 0;
          /* perspective makes the per-character rotateX in globals.css read
             as depth rather than a vertical squash */
          perspective: 800px;
        }

        .hero__line {
          display: block;
        }

        .hero__word {
          display: inline-block;
          white-space: nowrap;
          margin-right: 0.24em;
        }

        /* The second line takes the gradient. One coloured line, not two —
           the restraint is what makes the colour land. */
        .hero__line--grad {
          background: linear-gradient(
            100deg,
            rgb(var(--indigo)),
            rgb(var(--cyan)) 42%,
            rgb(var(--lime))
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;

          /* Its own entrance, timed to land just after the last character of
             line one. */
          opacity: 0;
          transform: translate3d(0, 0.34em, 0);
          transition:
            opacity 0.8s var(--ease) 0.5s,
            transform 0.8s var(--ease) 0.5s;
        }

        :global([data-reveal="in"]) .hero__line--grad {
          opacity: 1;
          transform: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero__line--grad {
            opacity: 1;
            transform: none;
          }
        }

        .hero__kicker {
          margin-top: 0.75rem;
        }

        .hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }

        .hero__floor {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 2rem;
          display: flex;
          justify-content: center;
        }

        .hero__scroll {
          width: 1px;
          height: 56px;
          background: var(--line-strong);
          overflow: hidden;
        }
        .hero__scroll i {
          display: block;
          width: 100%;
          height: 40%;
          background: rgb(var(--cyan));
          animation: trickle 2.4s var(--ease-io) infinite;
        }

        @keyframes trickle {
          0% {
            transform: translateY(-100%);
          }
          60%,
          100% {
            transform: translateY(250%);
          }
        }

        @media (max-width: 640px) {
          .hero {
            padding-block: calc(var(--bar-h) + 2rem) 4rem;
          }
        }
      `}</style>
    </section>
  );
}
