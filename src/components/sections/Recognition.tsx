"use client";

import { CERTIFICATIONS, DEGREES, HONORS } from "@/data/profile";

/**
 * Recognition and education, in one section.
 *
 * They were two separate pages on the old site, both of which restated the
 * index. They belong together: an award and a degree are the same kind of
 * claim, something external that vouches for the work, and neither needs a
 * page of its own to say four lines.
 *
 * The ticker along the top is the only place the awards are shouted; the list
 * underneath is where they are actually explained.
 */
export default function Recognition() {
  /* Duplicated so the strip can loop seamlessly, the animation translates by
     exactly -50%, which lands the copy where the original started. */
  const strip = [...HONORS, ...HONORS];

  return (
    <section className="rec" id="recognition">
      <div className="rec__ticker" aria-hidden="true">
        <div className="rec__track">
          {strip.map((h, i) => (
            <span key={`${h.name}-${i}`}>
              {h.name}
              <i>◆</i>
            </span>
          ))}
        </div>
      </div>

      <div className="shell rec__inner">
        <div className="rec__col">
          <p className="t-label" data-reveal>
            Recognition
          </p>
          <ol className="rec__list">
            {HONORS.map((h, i) => (
              <li key={h.name} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}>
                <div className="rec__row">
                  <h3>{h.name}</h3>
                  {h.prize && <span className="rec__prize">{h.prize}</span>}
                </div>
                <p className="rec__by">
                  {h.byHref ? (
                    <a href={h.byHref} target="_blank" rel="noreferrer">
                      {h.by}
                    </a>
                  ) : (
                    h.by
                  )}{" "}
                  · {h.year}
                </p>
                <p className="rec__body">{h.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rec__col">
          <p className="t-label" data-reveal>
            Education
          </p>
          <ol className="rec__list">
            {DEGREES.map((d, i) => (
              <li key={d.school} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}>
                <div className="rec__row">
                  <h3>
                    <a href={d.href} target="_blank" rel="noreferrer">
                      {d.school}
                    </a>
                  </h3>
                  <span className="rec__years">
                    {d.start}–{d.end}
                  </span>
                </div>
                <p className="rec__by">
                  {d.credential} · {d.field}
                </p>
                <p className="rec__body">{d.note}</p>
              </li>
            ))}
          </ol>

          <div className="rec__certs" data-reveal>
            <p className="t-label">Certification</p>
            {CERTIFICATIONS.map((c) => (
              <p className="rec__cert" key={c.name}>
                <a href={c.href} target="_blank" rel="noreferrer">
                  {c.name}
                </a>{" "}
                <span>{c.by}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .rec {
          padding-block: clamp(4rem, 10vh, 7rem) clamp(6rem, 14vh, 11rem);
        }

        /* --- ticker ------------------------------------------------------ */

        .rec__ticker {
          overflow: hidden;
          border-block: 1px solid var(--line);
          padding-block: 1.1rem;
          margin-bottom: clamp(3rem, 8vh, 5.5rem);
          /* Fade the ends so the loop point is never visible at the edges. */
          mask-image: linear-gradient(
            90deg,
            transparent,
            #000 8%,
            #000 92%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            #000 8%,
            #000 92%,
            transparent
          );
        }

        .rec__track {
          display: flex;
          width: max-content;
          gap: 2.5rem;
          animation: marquee 46s linear infinite;
        }

        .rec__track span {
          display: inline-flex;
          align-items: center;
          gap: 2.5rem;
          font-family: var(--display);
          font-weight: 500;
          font-size: clamp(1rem, 2vw, 1.5rem);
          letter-spacing: -0.025em;
          color: var(--text-faint);
          white-space: nowrap;
        }
        .rec__track i {
          font-style: normal;
          font-size: 0.5em;
          color: rgb(var(--amber) / 0.85);
        }

        @keyframes marquee {
          to {
            transform: translateX(-50%);
          }
        }

        /* --- lists ------------------------------------------------------- */

        .rec__inner {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(21rem, 1fr));
          gap: clamp(2.5rem, 6vw, 5rem);
        }

        .rec__list {
          list-style: none;
          margin: 1.75rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .rec__list li {
          padding-block: 1.5rem;
          border-top: 1px solid var(--line);
        }
        .rec__list li:first-child {
          border-top: 0;
          padding-top: 0;
        }

        .rec__row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
        }

        .rec__row h3 {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.0625rem;
          letter-spacing: -0.02em;
          text-wrap: balance;
        }

        .rec__prize {
          font-family: var(--mono);
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 5px;
          color: rgb(var(--lime));
          background: rgb(var(--lime) / 0.12);
          white-space: nowrap;
        }

        .rec__years {
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          white-space: nowrap;
        }

        .rec__by {
          margin-top: 0.4rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: rgb(var(--cyan) / 0.85);
        }

        /* Underline only on the linked ones, so the difference between a name
           that goes somewhere and one that does not is visible before you
           hover it. */
        .rec__by a,
        .rec__row h3 a,
        .rec__cert a {
          border-bottom: 1px solid currentColor;
          border-color: rgb(255 255 255 / 0.18);
          padding-bottom: 1px;
          transition: border-color 0.3s var(--ease);
        }
        .rec__by a:hover,
        .rec__row h3 a:hover,
        .rec__cert a:hover {
          border-bottom-color: currentColor;
        }

        .rec__body {
          margin-top: 0.6rem;
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--text-dim);
          text-wrap: pretty;
        }

        .rec__certs {
          margin-top: 2.5rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--line);
        }

        .rec__cert {
          margin-top: 0.9rem;
          font-size: 0.9375rem;
        }
        .rec__cert span {
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          margin-left: 0.5rem;
        }
      `}</style>
    </section>
  );
}
