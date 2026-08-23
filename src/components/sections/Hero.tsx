"use client";

import Field from "@/components/fx/Field";
import { HERO, PERSON } from "@/data/profile";
import { splitChars } from "@/lib/reveal";

/**
 * The first screen.
 *
 * The wordmark the boot sequence resolves into sits directly behind this, so
 * the headline has to land in the same optical position the particles left.
 * That is what makes the handoff read as one continuous move rather than an
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
              reach, so per-character animation here renders the line
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

      {/* Where a decorative scroll hairline used to be. Three claims, each one
          a link to the thing that backs it. If a number cannot be checked it
          does not belong in the first screen of a portfolio. */}
      <ul className="hero__proof" data-reveal style={{ ["--reveal-delay" as string]: "900ms" }}>
        {HERO.proof.map((p) => (
          <li key={p.label}>
            <a href={p.href}>
              <b>{p.value}</b>
              <span>{p.label}</span>
            </a>
          </li>
        ))}
      </ul>

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
           the headline, the field is atmosphere, and atmosphere that competes
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

        /* The second line takes the gradient. One coloured line, not two.
           The restraint is what makes the colour land. */
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

        /* --- proof strip -------------------------------------------------- */

        .hero__proof {
          list-style: none;
          margin: clamp(3rem, 8vh, 5rem) 0 0;
          padding: 0;
          width: 100%;
          max-width: 96rem;
          margin-inline: auto;
          padding-inline: var(--gutter);
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1.5rem, 5vw, 4.5rem);
        }

        .hero__proof li {
          border-left: 1px solid var(--line-strong);
          padding-left: 1.1rem;
        }

        .hero__proof a {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .hero__proof b {
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(1.5rem, 2.6vw, 2.125rem);
          line-height: 1;
          letter-spacing: -0.035em;
          transition: color 0.35s var(--ease);
        }

        .hero__proof span {
          font-family: var(--mono);
          font-size: 0.6875rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-faint);
          transition: color 0.35s var(--ease);
        }

        /* Each one gets its own step of the same ramp the rest of the site
           uses, so the strip reads as a set rather than three loose numbers. */
        .hero__proof li:nth-child(1) b {
          color: rgb(var(--cyan));
        }
        .hero__proof li:nth-child(2) b {
          color: rgb(var(--amber));
        }
        .hero__proof li:nth-child(3) b {
          color: rgb(var(--lime));
        }

        .hero__proof a:hover span {
          color: var(--text);
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
