"use client";

import { AVAILABILITY, PERSON, STACK } from "@/data/profile";

/**
 * Contact, and the stack, and the footer.
 *
 * One screen instead of three pages. The old site had a contact page, a resume
 * page and a skills block that each restated the same details; there is no
 * version of "here is my email" that needs its own route.
 *
 * The email is a real mailto and is set at display size, because the single
 * most common reason someone reaches the bottom of a portfolio is to find it.
 */
export default function Contact({ onOpenConsole }: { onOpenConsole: () => void }) {
  return (
    <footer className="ct" id="contact">
      <div className="ct__light" aria-hidden="true">
        <span className="bloom" style={{ ["--hue" as string]: "var(--indigo)", width: "50vw", height: "40vw", left: "10vw", bottom: "-18vh", opacity: 0.4 }} />
        <span className="bloom" style={{ ["--hue" as string]: "var(--cyan)", width: "30vw", height: "30vw", right: "4vw", bottom: "-6vh", opacity: 0.22 }} />
      </div>

      <div className="shell">
        <div className="ct__top">
          <div>
            <p className="t-label" data-reveal>
              Get in touch
            </p>
            <a className="ct__email" href={`mailto:${PERSON.email}`} data-reveal>
              {PERSON.email}
            </a>
            <p className="t-body ct__avail" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
              {AVAILABILITY.status}
            </p>

            <div className="ct__actions" data-reveal style={{ ["--reveal-delay" as string]: "180ms" }}>
              <a className="btn btn--primary" href={PERSON.resume} download>
                <span>Download resume</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v9m0 0L4.5 7.5M8 11l3.5-3.5M2.5 13.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <button className="btn" onClick={onOpenConsole}>
                Ask the assistant
              </button>
              <a className="btn" href={PERSON.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="btn" href={PERSON.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>

          <ul className="ct__interests" data-reveal style={{ ["--reveal-delay" as string]: "220ms" }}>
            <li className="t-label">Open to</li>
            {AVAILABILITY.interests.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="ct__stack" data-reveal>
          {STACK.map((g) => (
            <div key={g.label}>
              <p className="t-label">{g.label}</p>
              <p className="ct__items">{g.items.join(" · ")}</p>
            </div>
          ))}
        </div>

        <div className="ct__base">
          <p>
            © {new Date().getFullYear()} {PERSON.name} · {PERSON.location}
          </p>
          <p className="ct__colophon">
            Next.js · WebGL · no analytics, no cookies, no third-party fonts
          </p>
        </div>
      </div>

      <style jsx>{`
        .ct {
          position: relative;
          padding-block: clamp(6rem, 14vh, 10rem) 3rem;
          border-top: 1px solid var(--line);
          overflow: hidden;
          isolation: isolate;
        }

        .ct__light {
          position: absolute;
          inset: 0;
          z-index: -1;
          contain: strict;
        }

        .ct__top {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: clamp(2rem, 6vw, 5rem);
          align-items: start;
        }

        .ct__email {
          display: block;
          margin-top: 1.25rem;
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(1.5rem, 4.6vw, 3.5rem);
          line-height: 1;
          letter-spacing: -0.045em;
          /* Break at the @ rather than overflowing on a phone. */
          overflow-wrap: anywhere;
          background: linear-gradient(
            100deg,
            var(--text),
            rgb(var(--cyan)) 60%,
            rgb(var(--indigo))
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          transition: opacity 0.3s var(--ease);
        }
        .ct__email:hover {
          opacity: 0.75;
        }

        .ct__avail {
          margin-top: 1.75rem;
        }

        .ct__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 2rem;
        }

        .ct__interests {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.9375rem;
          color: var(--text-dim);
          white-space: nowrap;
        }
        .ct__interests li:first-child {
          margin-bottom: 0.4rem;
        }

        .ct__stack {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
          gap: 2rem;
          margin-top: clamp(4rem, 10vh, 7rem);
          padding-top: 2.5rem;
          border-top: 1px solid var(--line);
        }

        .ct__items {
          margin-top: 0.9rem;
          font-size: 0.875rem;
          line-height: 1.8;
          color: var(--text-dim);
        }

        .ct__base {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 4rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--line);
          font-family: var(--mono);
          font-size: 0.6875rem;
          color: var(--text-faint);
        }

        .ct__colophon {
          color: var(--text-ghost);
        }

        @media (max-width: 820px) {
          .ct__top {
            grid-template-columns: 1fr;
          }
          .ct__interests {
            white-space: normal;
          }
        }
      `}</style>
    </footer>
  );
}
