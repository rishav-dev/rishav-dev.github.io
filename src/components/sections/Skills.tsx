"use client";

import { STACK } from "@/data/profile";

/**
 * Skills, grouped the way a recruiter searches: the analytics methods first,
 * then the languages and tools they run on.
 */
export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="shell">
        <header className="skills__head" data-reveal>
          <p className="t-label">Skills</p>
          <h2 className="t-section">What I work with.</h2>
        </header>

        <div className="skills__grid">
          {STACK.map((g, i) => (
            <div
              className="skills__group"
              key={g.label}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
            >
              <h3>{g.label}</h3>
              <ul>
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .skills {
          padding-block: clamp(5rem, 12vh, 9rem) clamp(2rem, 5vh, 4rem);
        }

        .skills__head .t-section {
          margin-top: 1.25rem;
        }

        .skills__grid {
          margin-top: clamp(2.5rem, 6vh, 4rem);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
          gap: 1rem;
        }

        .skills__group {
          padding: 1.5rem 1.5rem 1.6rem;
          border: 1px solid var(--line);
          border-radius: 1rem;
          background: rgb(255 255 255 / 0.018);
        }

        .skills__group h3 {
          font-family: var(--mono);
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-faint);
        }

        .skills__group ul {
          list-style: none;
          margin: 1.1rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skills__group li {
          font-size: 0.875rem;
          padding: 0.35rem 0.75rem;
          border-radius: 99px;
          border: 1px solid var(--line-strong);
          color: var(--text-dim);
        }
      `}</style>
    </section>
  );
}
