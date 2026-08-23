"use client";

import Link from "next/link";
import { ROLES } from "@/data/profile";

const sorted = [...ROLES].sort((a, b) => b.order - a.order);

/**
 * Work, as a ledger rather than a card grid.
 *
 * Rows on a rule, newest first, with the dates in a fixed left gutter so the
 * eye can scan the chronology without reading anything. Metrics sit inline in
 * the row instead of in a separate "impact" grid, the number and the thing it
 * measures belong to the same job, and splitting them was half the reason the
 * old site kept repeating itself.
 */
export default function Work() {
  return (
    <section className="work" id="work">
      <div className="shell">
        <header className="work__head" data-reveal>
          <p className="t-label">Where</p>
          <h2 className="t-section">
            Eight roles.
            <br />
            Three countries.
          </h2>
          <p className="t-body work__intro">
            Law, wellness, clinical therapy, telecoms, and a dining hall I ran
            for five and a half years while earning the degree that got me the
            rest. Different rooms, same job underneath. Find the behaviour in
            the data, then build the thing that acts on it.
          </p>
        </header>

        <ol className="work__list">
          {sorted.map((role, i) => (
            <li key={role.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 55}ms` }}>
              <Link className="row" href={`/work/${role.slug}`}>
                <span className="row__dates">
                  <span className="row__start">{role.start}</span>
                  <span className="row__sep" aria-hidden="true" />
                  <span className="row__end">{role.end}</span>
                </span>

                <span className="row__main">
                  <span className="row__org">
                    {role.org}
                    {role.kind === "speaking" && (
                      <em className="row__tag">talk</em>
                    )}
                  </span>
                  <span className="row__title">{role.title}</span>
                  <span className="row__summary">{role.summary}</span>
                </span>

                {/* What he did, not what it supposedly moved. Every line here
                    is a description of the work itself, which is a claim he can
                    stand behind in a room without a chart nobody can audit. */}
                <span className="row__did">
                  {role.did.slice(0, 3).map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </span>

                <span className="row__go" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <style jsx>{`
        .work {
          padding-block: clamp(6rem, 14vh, 11rem);
        }

        .work__head {
          max-width: 44rem;
          margin-bottom: clamp(3rem, 7vh, 5rem);
        }
        .work__head .t-section {
          margin-top: 1.25rem;
        }
        .work__intro {
          margin-top: 1.5rem;
        }

        .work__list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid var(--line);
        }

        .work__list li {
          border-bottom: 1px solid var(--line);
        }

        /* next/link renders a real <a>, but styled-jsx only scopes class names
           onto host elements it can see in this file's JSX, it cannot add its
           hash to a React component's rendered output. So every rule targeting
           the link itself is written :global and anchored to .work__list, which
           does carry the hash. Without this the grid silently never applies and
           the row stacks. */
        .work__list :global(a.row) {
          position: relative;
          display: grid;
          grid-template-columns: 8.5rem 1fr auto 2rem;
          gap: clamp(1rem, 3vw, 2.5rem);
          align-items: start;
          padding: 1.75rem 1rem 1.75rem 0;
          transition: padding-left 0.45s var(--ease);
        }

        /* A hue wash that wipes in from the left on hover. Rows are otherwise
           completely undecorated, so this is the only affordance, and it
           moves in the reading direction, which makes it feel like the row is
           opening rather than lighting up. */
        .work__list :global(a.row)::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgb(var(--indigo) / 0.16),
            rgb(var(--cyan) / 0.05) 45%,
            transparent 75%
          );
          opacity: 0;
          transition: opacity 0.45s var(--ease);
          pointer-events: none;
        }
        .work__list :global(a.row):hover::before {
          opacity: 1;
        }
        .work__list :global(a.row):hover {
          padding-left: 1.25rem;
        }

        .row__dates {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          padding-top: 0.35rem;
          white-space: nowrap;
        }
        .row__sep {
          flex: 1;
          height: 1px;
          background: var(--line-strong);
          min-width: 8px;
        }

        .row__main {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
        }

        .row__org {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(1.125rem, 2.2vw, 1.5rem);
          letter-spacing: -0.025em;
        }

        .row__tag {
          font-family: var(--mono);
          font-style: normal;
          font-size: 0.625rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          color: rgb(var(--amber));
          background: rgb(var(--amber) / 0.12);
        }

        .row__title {
          font-size: 0.9375rem;
          color: rgb(var(--cyan) / 0.92);
        }

        .row__summary {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--text-dim);
          max-width: 52ch;
          margin-top: 0.35rem;
        }

        .row__did {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-top: 0.4rem;
          text-align: right;
          max-width: 22rem;
        }
        .row__did span {
          font-family: var(--mono);
          font-size: 0.6875rem;
          line-height: 1.5;
          color: var(--text-faint);
          position: relative;
          padding-right: 0.9rem;
        }
        /* A small tick before each line. Reads as a checklist of things done
           rather than a list of claims. */
        .row__did span::after {
          content: "";
          position: absolute;
          right: 0;
          top: 0.42em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgb(var(--cyan) / 0.55);
        }

        .row__go {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-top: 0.4rem;
          color: var(--text-ghost);
          transition:
            color 0.4s var(--ease),
            transform 0.4s var(--ease);
        }
        .work__list :global(a.row):hover .row__go {
          color: rgb(var(--cyan));
          transform: translateX(4px);
        }

        @media (max-width: 900px) {
          .work__list :global(a.row) {
            grid-template-columns: 1fr auto;
            grid-template-areas:
              "dates go"
              "main main"
              "metrics metrics";
            gap: 0.75rem;
          }
          .row__dates {
            grid-area: dates;
          }
          .row__main {
            grid-area: main;
          }
          .row__did {
            grid-area: metrics;
            text-align: left;
            max-width: none;
            margin-top: 0.5rem;
          }
          .row__did span {
            padding-right: 0;
            padding-left: 0.9rem;
          }
          .row__did span::after {
            right: auto;
            left: 0;
          }
          .row__go {
            grid-area: go;
          }
          .row__sep {
            max-width: 3rem;
          }
        }
      `}</style>
    </section>
  );
}
