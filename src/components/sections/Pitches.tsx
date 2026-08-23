"use client";

import CountUp from "@/components/fx/CountUp";
import { KINNOVATION, PITCHES, PITCH_TOTAL } from "@/data/profile";

/**
 * The pitch record.
 *
 * Three competitions, three cheques, and the same two names on all of them.
 * This sits inside the Kinnovation block rather than in the awards list because
 * a prize is only interesting next to the thing that won it, "second place,
 * $750" says nothing; "second place for a donation-matching platform, judged
 * against everything else in the room" says quite a lot.
 *
 * Every figure is read off the presentation cheque. Where a cheque names no
 * competition, CalendAI's does not, none is claimed.
 */
export default function Pitches() {
  return (
    <section className="pitch" aria-labelledby="pitch-heading">
      <header className="pitch__head" data-reveal>
        <h3 className="pitch__title" id="pitch-heading">
          Three pitches. Three cheques.
        </h3>
        <p className="pitch__total">
          <b>
            <CountUp value={PITCH_TOTAL} duration={1800} />
          </b>
          <span>
            in prize money, across two universities. All of it won with{" "}
            <a href={KINNOVATION.cofounder.href} target="_blank" rel="noreferrer">
              {KINNOVATION.cofounder.name}
            </a>
            . Neither of us has ever pitched alone.
          </span>
        </p>
      </header>

      <ol className="pitch__list">
        {PITCHES.map((p, i) => (
          <li
            key={p.ventureSlug}
            data-reveal
            style={{
              ["--hue" as string]: `var(${p.hue})`,
              ["--reveal-delay" as string]: `${i * 90}ms`,
            }}
          >
            <article className="win">
              <div className="win__amount">
                <b>{p.amount}</b>
                {p.placing && <em>{p.placing}</em>}
              </div>

              <div className="win__body">
                <h4>
                  {p.venture}
                  {p.competition && <span> · {p.competition}</span>}
                </h4>
                <p className="win__where">
                  {p.center}
                  <br />
                  {p.school}
                </p>
              </div>

              <div className="win__when">
                <time dateTime={p.date}>{p.dateLabel}</time>
                <span>{p.institution}</span>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <style jsx>{`
        .pitch {
          margin-top: clamp(3rem, 7vh, 5rem);
          padding-top: clamp(2.5rem, 6vh, 4rem);
          border-top: 1px solid var(--line);
        }

        .pitch__head {
          max-width: 46rem;
          margin-bottom: 2.5rem;
        }

        .pitch__title {
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(1.5rem, 3.4vw, 2.5rem);
          letter-spacing: -0.035em;
          line-height: 1.05;
        }

        .pitch__total {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.85rem;
          margin-top: 1.35rem;
        }
        .pitch__total b {
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          line-height: 1;
          letter-spacing: -0.045em;
          background: linear-gradient(
            100deg,
            rgb(var(--amber)),
            rgb(var(--magenta)) 60%,
            rgb(var(--violet))
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .pitch__total span {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-dim);
          max-width: 34ch;
        }
        .pitch__total a {
          color: var(--text);
          border-bottom: 1px solid rgb(var(--magenta) / 0.55);
          padding-bottom: 1px;
          transition: border-color 0.3s var(--ease);
        }
        .pitch__total a:hover {
          border-bottom-color: rgb(var(--magenta));
        }

        /* --- the wins ---------------------------------------------------- */

        .pitch__list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid var(--line);
        }
        .pitch__list li {
          border-bottom: 1px solid var(--line);
        }

        .win {
          display: grid;
          grid-template-columns: 8.5rem 1fr auto;
          gap: clamp(1rem, 3vw, 2.5rem);
          align-items: center;
          padding: 1.5rem 0;
          position: relative;
        }

        /* A hue bar that grows from the left edge on hover, the row is
           otherwise undecorated, and the bar ties each win to its venture's
           colour in the cards above. */
        .win::before {
          content: "";
          position: absolute;
          left: -1.25rem;
          top: 0.75rem;
          bottom: 0.75rem;
          width: 2px;
          border-radius: 2px;
          background: rgb(var(--hue));
          transform: scaleY(0);
          transform-origin: 50% 50%;
          transition: transform 0.45s var(--ease);
        }
        .win:hover::before {
          transform: scaleY(1);
        }

        .win__amount b {
          display: block;
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(1.75rem, 3.4vw, 2.5rem);
          line-height: 1;
          letter-spacing: -0.04em;
          color: rgb(var(--hue));
        }
        .win__amount em {
          display: block;
          margin-top: 0.35rem;
          font-style: normal;
          font-family: var(--mono);
          font-size: 0.6875rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-faint);
        }

        .win__body h4 {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.125rem;
          letter-spacing: -0.025em;
        }
        .win__body h4 span {
          color: rgb(var(--hue));
        }

        .win__where {
          margin-top: 0.45rem;
          font-size: 0.875rem;
          line-height: 1.55;
          color: var(--text-dim);
        }

        .win__when {
          text-align: right;
          font-family: var(--mono);
          font-size: 0.75rem;
          white-space: nowrap;
        }
        .win__when time {
          display: block;
          color: var(--text);
        }
        .win__when span {
          display: block;
          margin-top: 0.3rem;
          color: var(--text-faint);
        }

        @media (max-width: 760px) {
          .win {
            grid-template-columns: 1fr auto;
            gap: 0.75rem 1.25rem;
          }
          .win__amount {
            grid-column: 1;
          }
          .win__when {
            grid-column: 2;
            grid-row: 1;
            align-self: start;
          }
          .win__body {
            grid-column: 1 / -1;
          }
          .win::before {
            left: -0.75rem;
          }
        }
      `}</style>
    </section>
  );
}
