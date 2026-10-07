"use client";

import { DEGREES } from "@/data/profile";

/** Degrees with the coursework behind each one. */
export default function Education() {
  return (
    <section className="edu" id="education">
      <div className="shell">
        <header className="edu__head" data-reveal>
          <p className="t-label">Education</p>
          <h2 className="t-section">Where I studied.</h2>
        </header>

        <ol className="edu__list">
          {DEGREES.map((d, i) => (
            <li key={d.school} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}>
              <div className="edu__row">
                <h3>
                  <a href={d.href} target="_blank" rel="noreferrer">
                    {d.school}
                  </a>
                </h3>
                <span className="edu__years">
                  {d.start} – {d.end}
                </span>
              </div>
              <p className="edu__field">
                {d.credential} · {d.field}
              </p>
              <p className="edu__note">{d.note}</p>
              <div className="edu__course">
                <p className="t-label">Relevant coursework</p>
                <ul>
                  {d.coursework.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <style jsx>{`
        .edu {
          padding-block: clamp(3rem, 8vh, 5rem) clamp(6rem, 14vh, 11rem);
        }

        .edu__head .t-section {
          margin-top: 1.25rem;
        }

        .edu__list {
          list-style: none;
          margin: clamp(2.5rem, 6vh, 4rem) 0 0;
          padding: 0;
          max-width: 52rem;
        }

        .edu__list li {
          padding-block: 1.9rem;
          border-top: 1px solid var(--line);
        }
        .edu__list li:first-child {
          border-top: 0;
          padding-top: 0;
        }

        .edu__row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.4rem 1rem;
        }

        .edu__row h3 {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
        }
        .edu__row h3 a {
          border-bottom: 1px solid rgb(255 255 255 / 0.18);
          padding-bottom: 1px;
          transition: border-color 0.3s var(--ease);
        }
        .edu__row h3 a:hover {
          border-bottom-color: currentColor;
        }

        .edu__years {
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          white-space: nowrap;
        }

        .edu__field {
          margin-top: 0.4rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: rgb(var(--cyan) / 0.85);
        }

        .edu__note {
          margin-top: 0.75rem;
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--text-dim);
          max-width: 46rem;
          text-wrap: pretty;
        }

        .edu__course {
          margin-top: 1.25rem;
        }
        .edu__course ul {
          list-style: none;
          margin: 0.8rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .edu__course li {
          font-size: 0.8125rem;
          padding: 0.3rem 0.7rem;
          border-radius: 99px;
          border: 1px solid var(--line-strong);
          color: var(--text-dim);
        }
      `}</style>
    </section>
  );
}
