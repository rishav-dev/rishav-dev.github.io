"use client";

import Link from "next/link";
import CountUp from "@/components/fx/CountUp";
import Tilt from "@/components/fx/Tilt";
import { PROJECTS } from "@/data/profile";
import ProjectViz from "./ProjectViz";

/* One hue per project, walked along the same spectrum the rest of the site
   uses so the grid reads as a set rather than seven unrelated accents.
   Assigned by position and never cycled per-render, so a project keeps its
   colour between the card, its detail page and the repo list. */
const HUES = ["--cyan", "--indigo", "--violet", "--lime", "--amber", "--magenta", "--cyan"];

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
          <h2 className="t-section">
            Seven problems.
            <br />
            No two solved the same way.
          </h2>
          <p className="t-body proj__intro">
            The drawing on each card is generated live from the method that
            project actually used: two distributions pulling apart, clustering
            converging on its centroids, a fitted line with its residuals, a
            graph breathing, a detector locking on. They are motifs, not
            results; the numbers are in the write-ups.
          </p>
        </header>

        <ul className="proj__grid">
          {PROJECTS.map((p, i) => (
            <li
              key={p.slug}
              data-wide={i === 0 ? "" : undefined}
              data-reveal
              style={{
                ["--hue" as string]: `var(${HUES[i % HUES.length]})`,
                ["--reveal-delay" as string]: `${i * 70}ms`,
              }}
            >
              <Tilt className="card__tilt" max={3.5}>
                <article className="card">
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
                        <b>
                          <CountUp value={p.result.value} />
                        </b>
                        <i>{p.result.label}</i>
                      </p>
                    )}

                    <p className="card__summary">{p.summary}</p>

                    <ul className="card__stack">
                      {p.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>

                    {/* GitHub is the primary action wherever there is a repo.
                        The write-up explains the work; the repo proves it, and
                        proof goes first. Where there is no public repo the card
                        says so plainly instead of quietly hiding the link. */}
                    <p className="card__links">
                      {p.repo ? (
                        <>
                          <a className="card__link" href={p.repo} target="_blank" rel="noreferrer">
                            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                            </svg>
                            View the code
                          </a>
                          <Link className="card__second" href={`/projects/${p.slug}`}>
                            Write-up
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link className="card__link" href={`/projects/${p.slug}`}>
                            Read the write-up
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                              <path d="M3 8h10M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                          <span className="card__norepo">no public repo</span>
                        </>
                      )}
                    </p>
                  </div>
                </article>
              </Tilt>
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

        .proj__grid > li {
          display: flex;
        }
        .proj__grid > li > :global(*) {
          flex: 1;
        }

        .proj__grid :global(.card__tilt) {
          perspective: 1400px;
        }

        .card {
          position: relative;
          height: 100%;
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
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition:
            border-color 0.5s var(--ease),
            transform 0.4s var(--ease);
        }
        .card:hover {
          border-color: rgb(var(--hue) / 0.42);
        }

        .proj__grid > li[data-wide] {
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

        .card__links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.25rem;
          margin-top: auto;
          padding-top: 1.1rem;
        }

        /* The plain <a> to GitHub gets the styled-jsx hash; the next/link one
           does not, because styled-jsx cannot scope onto a React component.
           Both selectors are written so either element picks the style up. */
        .card__links :global(a.card__link),
        .card__links a.card__link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(var(--hue));
          white-space: nowrap;
        }
        .card__links :global(a.card__link) svg,
        .card__links a.card__link svg {
          transition: transform 0.35s var(--ease);
        }
        .card__links :global(a.card__link):hover svg,
        .card__links a.card__link:hover svg {
          transform: translateX(3px);
        }

        .card__links :global(a.card__second) {
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          white-space: nowrap;
          transition: color 0.3s var(--ease);
        }
        .card__links :global(a.card__second):hover {
          color: var(--text);
        }

        /* Said out loud rather than left as an absence. A missing link that is
           explained reads as honesty. A missing link that is not explained
           reads as a claim with nothing behind it. */
        .card__norepo {
          font-family: var(--mono);
          font-size: 0.6875rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-ghost);
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .proj__grid > li[data-wide] {
            grid-column: span 1;
          }
        }
      `}</style>
    </section>
  );
}
