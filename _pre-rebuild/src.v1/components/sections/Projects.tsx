"use client";

import Link from "next/link";
import { PROJECTS } from "@/data/profile";
import ProjectViz from "./ProjectViz";

/* One hue per project, walked along the same spectrum the rest of the site
   uses so the grid reads as a set rather than five unrelated accents. */
const HUES = ["--cyan", "--indigo", "--violet", "--lime", "--amber"];

/**
 * Projects.
 *
 * Asymmetric on purpose: the first card spans two columns because the face
 * recognition system is the one with a headline number worth reading from
 * across the room. A uniform grid would give five equal-weight cards and no
 * point of entry.
 */
export default function Projects() {
  return (
    <section className="proj" id="projects">
      <div className="shell">
        <header className="proj__head" data-reveal>
          <p className="t-label">What I&rsquo;ve built</p>
          <h2 className="t-section">Five problems, five methods.</h2>
          <p className="t-body proj__intro">
            Each drawing below is generated from the method the project
            actually used — clustering converging on its centroids, a fitted
            line with its residuals, a graph, a detector, a forecast band.
          </p>
        </header>

        <ul className="proj__grid">
          {PROJECTS.map((p, i) => (
            <li
              key={p.slug}
              className="card"
              data-wide={i === 0 ? "" : undefined}
              data-reveal
              style={{
                ["--hue" as string]: `var(${HUES[i % HUES.length]})`,
                ["--reveal-delay" as string]: `${i * 70}ms`,
              }}
            >
              <div className="card__viz">
                <ProjectViz kind={p.viz} seedKey={p.slug} hue={HUES[i % HUES.length]} />
              </div>

              <div className="card__body">
                <div className="card__meta">
                  <span>{p.context}</span>
                  <span aria-hidden="true">·</span>
                  <span>{p.year}</span>
                </div>

                <h3 className="card__name">{p.name}</h3>

                {p.result && (
                  <p className="card__result">
                    <b>{p.result.value}</b>
                    <i>{p.result.label}</i>
                  </p>
                )}

                <p className="card__summary">{p.summary}</p>

                <ul className="card__stack">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>

                <Link className="card__link" href={`/projects/${p.slug}`}>
                  Read the write-up
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .proj {
          padding-block: clamp(6rem, 14vh, 11rem);
        }

        .proj__head {
          max-width: 44rem;
          margin-bottom: clamp(3rem, 7vh, 5rem);
        }
        .proj__head .t-section {
          margin-top: 1.25rem;
        }
        .proj__intro {
          margin-top: 1.5rem;
        }

        .proj__grid {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
          gap: 1rem;
        }

        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: linear-gradient(
            180deg,
            rgb(255 255 255 / 0.04),
            rgb(255 255 255 / 0.012)
          );
          overflow: hidden;
          transition:
            border-color 0.5s var(--ease),
            transform 0.5s var(--ease);
        }
        .card:hover {
          border-color: rgb(var(--hue) / 0.42);
          transform: translateY(-3px);
        }

        .card[data-wide] {
          grid-column: span 2;
        }

        .card__viz {
          position: relative;
          height: 150px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(
              120% 100% at 50% 0%,
              rgb(var(--hue) / 0.1),
              transparent 70%
            ),
            rgb(255 255 255 / 0.012);
        }

        .card__viz :global(.viz) {
          width: 100%;
          height: 100%;
        }

        .card__body {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          padding: 1.5rem;
          flex: 1;
        }

        .card__meta {
          display: flex;
          gap: 0.5rem;
          font-family: var(--mono);
          font-size: 0.6875rem;
          color: var(--text-faint);
        }

        .card__name {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.375rem;
          letter-spacing: -0.03em;
        }

        .card__result {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
        }
        .card__result b {
          font-family: var(--display);
          font-weight: 600;
          font-size: 2.25rem;
          line-height: 1;
          letter-spacing: -0.04em;
          color: rgb(var(--hue));
        }
        .card__result i {
          font-style: normal;
          font-family: var(--mono);
          font-size: 0.6875rem;
          color: var(--text-faint);
        }

        .card__summary {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--text-dim);
          text-wrap: pretty;
        }

        .card__stack {
          list-style: none;
          margin: 0.25rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .card__stack li {
          font-family: var(--mono);
          font-size: 0.6875rem;
          padding: 0.25rem 0.55rem;
          border-radius: 99px;
          border: 1px solid var(--line);
          color: var(--text-faint);
        }

        /* :global for the same reason as the work rows — next/link renders the
           <a>, so styled-jsx cannot put its scoping hash on it. Anchored to
           .card__body, which does carry the hash. */
        .card__body :global(a.card__link) {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: auto;
          padding-top: 1.1rem;
          font-size: 0.875rem;
          color: rgb(var(--hue));
          white-space: nowrap;
        }
        .card__body :global(a.card__link) svg {
          transition: transform 0.35s var(--ease);
        }
        .card__body :global(a.card__link):hover svg {
          transform: translateX(3px);
        }

        @media (max-width: 900px) {
          .card[data-wide] {
            grid-column: span 1;
          }
        }
      `}</style>
    </section>
  );
}
