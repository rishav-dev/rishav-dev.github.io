"use client";

import { THESIS } from "@/data/profile";
import { useScrollProgress } from "@/lib/scroll";

/**
 * The argument.
 *
 * One sentence, set very large on a nearly empty screen, revealed word by word
 * against scroll position rather than on a timer — so the reading pace is the
 * visitor's, and stopping halfway leaves it stopped halfway.
 *
 * Deliberately the least decorated section on the site. It sits between the
 * hero and the pipeline as a held breath; if it had a card treatment it would
 * read as another feature block and the claim would disappear into the design.
 */
export default function Thesis() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const words = THESIS.line.split(" ");

  /* The sentence finishes revealing at 65% so the body copy underneath has
     room to arrive before the section leaves. */
  const lit = progress / 0.65;

  return (
    <section className="thesis" id="thesis" ref={ref}>
      <div className="thesis__sticky">
        <div className="shell">
          <p className="t-label thesis__label">The argument</p>

          <p className="thesis__line" aria-label={THESIS.line}>
            {words.map((word, i) => {
              /* Each word gets its own slice of the scroll, with a long tail
                 so neighbours overlap and the line brightens as a wave. */
              const at = i / words.length;
              const on = Math.max(0, Math.min(1, (lit - at) * words.length * 0.7));
              return (
                <span
                  key={`${word}-${i}`}
                  aria-hidden="true"
                  style={{
                    opacity: 0.12 + on * 0.88,
                    filter: `blur(${(1 - on) * 5}px)`,
                  }}
                >
                  {word}{" "}
                </span>
              );
            })}
          </p>

          <p
            className="t-body thesis__body"
            style={{
              opacity: Math.max(0, Math.min(1, (progress - 0.6) * 4)),
              transform: `translateY(${Math.max(0, 20 - progress * 30)}px)`,
            }}
          >
            {THESIS.body}
          </p>
        </div>
      </div>

      <style jsx>{`
        .thesis {
          /* Tall wrapper, sticky child — the scroll distance is what the
             reveal is scrubbing against. */
          height: 260vh;
          position: relative;
        }

        .thesis__sticky {
          position: sticky;
          top: 0;
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding-block: 6rem;
        }

        .thesis__label {
          margin-bottom: 2.5rem;
        }

        .thesis__line {
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(1.75rem, 4.6vw, 4rem);
          line-height: 1.08;
          letter-spacing: -0.035em;
          max-width: 22ch;
          text-wrap: balance;
        }

        .thesis__line span {
          /* No transition — the value is driven directly by scroll position,
             and a transition on top of that lags behind the finger. */
          display: inline;
          will-change: opacity, filter;
        }

        .thesis__body {
          margin-top: 3rem;
          font-size: 1.0625rem;
          transition: opacity 0.2s linear;
        }

        @media (max-width: 720px) {
          .thesis {
            height: 200vh;
          }
        }
      `}</style>
    </section>
  );
}
