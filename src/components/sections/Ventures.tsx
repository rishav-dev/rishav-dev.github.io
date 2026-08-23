"use client";

import Tilt from "@/components/fx/Tilt";
import Pitches from "@/components/sections/Pitches";
import { KINNOVATION, VENTURES } from "@/data/profile";

/**
 * Kinnovation, the venture studio Rishav co-founded with Kinjal Pandey.
 *
 * This is the one saturated section on the site, and that is a deliberate
 * budget decision: everything else runs on near-black with a single accent, so
 * when the page suddenly floods with colour it reads as a different mode of
 * work rather than as more decoration. Turning the volume up everywhere is how
 * a site ends up looking loud and saying nothing.
 *
 * The co-founder credit is a real link, not a footnote. It is her studio too.
 */
export default function Ventures() {
  return (
    <section className="kin" id="kinnovation">
      <div className="kin__field" aria-hidden="true">
        <span className="bloom" style={{ ["--hue" as string]: "var(--magenta)", width: "52vw", height: "52vw", left: "-10vw", top: "-14vh", opacity: 0.42 }} />
        <span className="bloom" style={{ ["--hue" as string]: "var(--violet)", width: "44vw", height: "44vw", right: "-8vw", top: "18vh", opacity: 0.36 }} />
        <span className="bloom" style={{ ["--hue" as string]: "var(--amber)", width: "30vw", height: "30vw", left: "44vw", bottom: "-10vh", opacity: 0.18 }} />
      </div>

      <div className="shell kin__inner">
        <header className="kin__head">
          <p className="t-label kin__label" data-reveal>
            {KINNOVATION.role} · Venture studio
          </p>

          <h2 className="kin__mark" data-reveal>
            {KINNOVATION.name}
          </h2>

          <p className="kin__line" data-reveal style={{ ["--reveal-delay" as string]: "90ms" }}>
            {KINNOVATION.line}
          </p>

          <p className="t-body kin__body" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
            {KINNOVATION.body}
          </p>

          <div className="kin__links" data-reveal style={{ ["--reveal-delay" as string]: "220ms" }}>
            <a className="btn btn--primary" href={KINNOVATION.site} target="_blank" rel="noreferrer">
              <span>kinnovationgroup.com</span>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M4 10L10 4M10 4H5.5M10 4v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <span className="kin__cofounder">
              with{" "}
              <a href={KINNOVATION.cofounder.href} target="_blank" rel="noreferrer">
                {KINNOVATION.cofounder.name}
              </a>
            </span>
          </div>
        </header>

        <ul className="kin__grid">
          {VENTURES.map((v, i) => (
            <li
              key={v.slug}
              data-reveal
              style={{
                ["--hue" as string]: `var(${v.hue})`,
                ["--reveal-delay" as string]: `${120 + i * 80}ms`,
              }}
            >
              <Tilt className="vent__tilt" max={5}>
                <article className="vent">
                  {/* The whole card is the link. The overlay below sits above
                      the content so the hit area is the full card, while the
                      text underneath stays selectable up to the moment you
                      click. */}
                  <div className="vent__top">
                    <h3 className="vent__name">{v.name}</h3>
                    <span className="vent__stage">{v.stage}</span>
                  </div>

                  <p className="vent__line">{v.line}</p>
                  <p className="vent__body">{v.body}</p>

                  {v.award && (
                    <p className="vent__award">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M8 1.5l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.3l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                      </svg>
                      {v.award}
                    </p>
                  )}

                  <p className="vent__links">
                    {v.href && (
                      <a href={v.href} target="_blank" rel="noreferrer">
                        Read more
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path d="M4 10L10 4M10 4H5.5M10 4v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    )}
                    {v.repo && (
                      <a href={v.repo} target="_blank" rel="noreferrer">
                        Source
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                        </svg>
                      </a>
                    )}
                  </p>
                </article>
              </Tilt>
            </li>
          ))}
        </ul>

        <Pitches />
      </div>

      <style jsx>{`
        .kin {
          position: relative;
          padding-block: clamp(6rem, 16vh, 12rem);
          overflow: hidden;
          isolation: isolate;
          /* A hairline top and bottom so the colour field reads as a distinct
             chapter rather than a gradient that leaked. */
          border-block: 1px solid var(--line);
          background: linear-gradient(
            180deg,
            var(--void),
            #0b0512 35%,
            #0d0616 65%,
            var(--void)
          );
        }

        .kin__field {
          position: absolute;
          inset: 0;
          z-index: -1;
          contain: strict;
        }

        .kin__inner {
          display: grid;
          gap: clamp(3rem, 8vh, 5.5rem);
        }

        .kin__head {
          max-width: 52rem;
        }

        .kin__label {
          color: rgb(var(--magenta) / 0.95);
        }

        .kin__mark {
          margin-top: 1.25rem;
          font-family: var(--display);
          font-weight: 700;
          font-size: clamp(2.75rem, 11vw, 9rem);
          line-height: 0.86;
          letter-spacing: -0.055em;
          background: linear-gradient(
            96deg,
            rgb(var(--amber)),
            rgb(var(--magenta)) 42%,
            rgb(var(--violet))
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .kin__line {
          margin-top: 1.75rem;
          font-family: var(--display);
          font-weight: 500;
          font-size: clamp(1.125rem, 2.4vw, 1.75rem);
          line-height: 1.3;
          letter-spacing: -0.025em;
          max-width: 30ch;
          text-wrap: balance;
        }

        .kin__body {
          margin-top: 1.5rem;
        }

        .kin__links {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-top: 2.25rem;
        }

        .kin__cofounder {
          font-size: 0.9375rem;
          color: var(--text-dim);
        }
        .kin__cofounder a {
          color: var(--text);
          border-bottom: 1px solid rgb(var(--magenta) / 0.6);
          padding-bottom: 1px;
          transition: border-color 0.3s var(--ease);
        }
        .kin__cofounder a:hover {
          border-bottom-color: rgb(var(--magenta));
        }

        /* --- venture cards ---------------------------------------------- */

        .kin__grid {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
          gap: 1rem;
        }

        /* Stretch the tilt wrapper and the card to the tallest in the row, so
           the "Read more" links all sit on one line. */
        .kin__grid > li {
          display: flex;
        }
        .kin__grid > li > :global(*) {
          flex: 1;
        }

        /* The tilt wrapper owns the perspective; the card inside is what
           actually rotates. Putting perspective on the rotating element itself
           is the usual reason these effects look like a shear. */
        .kin__grid :global(.vent__tilt) {
          height: 100%;
          perspective: 1000px;
        }

        .vent {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.75rem;
          border-radius: var(--radius);
          border: 1px solid rgb(var(--hue) / 0.22);
          background:
            linear-gradient(
              165deg,
              rgb(var(--hue) / 0.13),
              rgb(255 255 255 / 0.02) 55%
            );
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          overflow: hidden;
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))
            translateZ(0);
          transform-style: preserve-3d;
          transition:
            transform 0.35s var(--ease),
            border-color 0.5s var(--ease);
        }

        .vent:hover {
          border-color: rgb(var(--hue) / 0.5);
        }

        /* A specular highlight that tracks the pointer across the surface.
           This, not the rotation, is what sells the card as a physical object.
           Tilt alone reads as a CSS trick. */
        .vent::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            36% 46% at var(--mx, 50%) var(--my, 50%),
            rgb(255 255 255 / 0.16),
            transparent 72%
          );
          opacity: 0;
          transition: opacity 0.45s var(--ease);
          pointer-events: none;
        }
        .vent:hover::before {
          opacity: 1;
        }

        /* Corner glow, revealed on hover. */
        .vent::after {
          content: "";
          position: absolute;
          top: -40%;
          right: -30%;
          width: 70%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(circle, rgb(var(--hue) / 0.5), transparent 70%);
          filter: blur(46px);
          opacity: 0;
          transition: opacity 0.6s var(--ease);
          pointer-events: none;
        }
        .vent:hover::after {
          opacity: 1;
        }

        .vent__links {
          display: flex;
          flex-wrap: wrap;
          gap: 1.1rem;
          margin-top: auto;
          padding-top: 1.1rem;
        }
        .vent__links a {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: rgb(var(--hue));
          transition: opacity 0.3s var(--ease);
        }
        .vent__links a:hover {
          opacity: 0.72;
        }

        .vent__top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
        }

        .vent__name {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.375rem;
          letter-spacing: -0.03em;
          color: rgb(var(--hue));
        }

        .vent__stage {
          font-family: var(--mono);
          font-size: 0.625rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-faint);
          white-space: nowrap;
        }

        .vent__line {
          font-size: 0.9375rem;
          line-height: 1.45;
          color: var(--text);
          text-wrap: pretty;
        }

        .vent__body {
          font-size: 0.875rem;
          line-height: 1.65;
          color: var(--text-dim);
          text-wrap: pretty;
        }

        .vent__award {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          /* No auto margin here, .vent__links owns the push to the bottom,
             and two auto margins in one flex column means the first one eats
             all the space and the second does nothing. */
          margin-top: 0.4rem;
          font-family: var(--mono);
          font-size: 0.6875rem;
          line-height: 1.4;
          color: rgb(var(--amber));
        }
        .vent__award svg {
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
}
