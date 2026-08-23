"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Console from "@/components/console/Console";
import Nav from "@/components/chrome/Nav";
import {
  AVAILABILITY,
  CERTIFICATIONS,
  COURSEWORK,
  DEGREES,
  HONORS,
  PERSON,
  PROJECTS,
  ROLES,
  STACK,
  THESIS,
} from "@/data/profile";

const ordered = [...ROLES].sort((a, b) => b.order - a.order);

/**
 * The resume, as a web page.
 *
 * Three audiences, one document. A recruiter skimming on a phone reads the
 * left column and stops. Someone who wants the PDF gets a button. Someone
 * pasting into an ATS gets real selectable text in a sane DOM order, which a
 * PDF-in-an-iframe, the usual approach, does not give them.
 *
 * The print stylesheet at the bottom is the third audience: hitting ⌘P here
 * produces a clean black-on-white document with the chrome, the glow and the
 * links stripped out, so this page is also a perfectly good handout.
 */
export default function ResumeView() {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const openConsole = useCallback(() => setConsoleOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setConsoleOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Nav onOpenConsole={openConsole} />

      <main className="rs">
        <div className="rs__light" aria-hidden="true">
          <span
            className="bloom"
            style={{
              ["--hue" as string]: "var(--indigo)",
              width: "44vw",
              height: "36vw",
              left: "-8vw",
              top: "-8vh",
              opacity: 0.3,
            }}
          />
        </div>

        <div className="shell rs__inner">
          <Link className="rs__back" href="/">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to the site
          </Link>

          {/* --- masthead ------------------------------------------------ */}
          <header className="rs__head">
            <div>
              <h1 className="rs__name">{PERSON.name}</h1>
              <p className="rs__role">
                Data Scientist · ML Engineer · Co-founder, Kinnovation
              </p>
              <ul className="rs__contact">
                <li>
                  <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
                </li>
                <li>{PERSON.location}</li>
                <li>
                  <a href={PERSON.linkedin} target="_blank" rel="noreferrer">
                    linkedin.com/in/rishav-dsc
                  </a>
                </li>
                <li>
                  <a href={PERSON.github} target="_blank" rel="noreferrer">
                    github.com/rishav-dev
                  </a>
                </li>
              </ul>
            </div>

            <div className="rs__actions">
              <a className="btn btn--primary" href={PERSON.resume} download>
                <span>PDF</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v9m0 0L4.5 7.5M8 11l3.5-3.5M2.5 13.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <button className="btn" onClick={() => window.print()}>
                Print
              </button>
            </div>
          </header>

          <p className="rs__summary">{THESIS.body}</p>

          <div className="rs__grid">
            {/* --- main column ------------------------------------------- */}
            <div className="rs__main">
              <section>
                <h2 className="rs__h2">Experience</h2>
                {ordered.map((role) => (
                  <article className="rs__entry" key={role.slug}>
                    <div className="rs__entryHead">
                      <h3>{role.org}</h3>
                      <span className="rs__dates">
                        {role.start} – {role.end}
                      </span>
                    </div>
                    <p className="rs__sub">
                      {role.title} · {role.place}
                    </p>
                    <p className="rs__text">{role.summary}</p>
                    {role.did.length > 0 && (
                      <ul className="rs__metrics">
                        {role.did.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    )}
                    <p className="rs__more">
                      <Link href={`/work/${role.slug}`}>Full write-up →</Link>
                    </p>
                  </article>
                ))}
              </section>

              <section>
                <h2 className="rs__h2">Selected projects</h2>
                {PROJECTS.map((p) => (
                  <article className="rs__entry" key={p.slug}>
                    <div className="rs__entryHead">
                      <h3>{p.name}</h3>
                      <span className="rs__dates">{p.year}</span>
                    </div>
                    <p className="rs__sub">{p.context}</p>
                    <p className="rs__text">{p.summary}</p>
                    <p className="rs__tools">{p.stack.join(" · ")}</p>
                  </article>
                ))}
              </section>
            </div>

            {/* --- side column ------------------------------------------- */}
            <aside className="rs__side">
              <section>
                <h2 className="rs__h2">Education</h2>
                {DEGREES.map((d) => (
                  <div className="rs__entry" key={d.school}>
                    <h3>{d.school}</h3>
                    <p className="rs__sub">
                      {d.credential} · {d.field}
                    </p>
                    <p className="rs__dates">
                      {d.start}–{d.end} · {d.place}
                    </p>
                  </div>
                ))}
                <p className="rs__tools rs__course">
                  <b>Coursework </b>
                  {COURSEWORK.join(" · ")}
                </p>
              </section>

              <section>
                <h2 className="rs__h2">Skills</h2>
                {STACK.map((g) => (
                  <div className="rs__skill" key={g.label}>
                    <h3>{g.label}</h3>
                    <p>{g.items.join(" · ")}</p>
                  </div>
                ))}
              </section>

              <section>
                <h2 className="rs__h2">Awards</h2>
                {HONORS.map((h) => (
                  <div className="rs__entry" key={h.name}>
                    <h3>
                      {h.name}
                      {h.prize && <em> · {h.prize}</em>}
                    </h3>
                    <p className="rs__dates">
                      {h.by} · {h.year}
                    </p>
                  </div>
                ))}
                {CERTIFICATIONS.map((c) => (
                  <div className="rs__entry" key={c.name}>
                    <h3>{c.name}</h3>
                    <p className="rs__dates">{c.by}</p>
                  </div>
                ))}
              </section>

              <section className="rs__avail">
                <h2 className="rs__h2">Availability</h2>
                <p className="rs__text">{AVAILABILITY.status}</p>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <Console open={consoleOpen} onClose={() => setConsoleOpen(false)} />

      <style jsx>{`
        .rs {
          position: relative;
          padding-block: calc(var(--bar-h) + 3rem) 6rem;
          overflow: hidden;
          isolation: isolate;
        }

        .rs__light {
          position: absolute;
          inset: 0;
          z-index: -1;
          contain: strict;
        }

        .rs__inner {
          max-width: 68rem;
        }

        /* :global, see the note in Detail.tsx. next/link renders the anchor,
           so a styled-jsx rule targeting its className never matches. */
        .rs__inner :global(a.rs__back) {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          transition: color 0.3s var(--ease);
        }
        .rs__inner :global(a.rs__back):hover {
          color: rgb(var(--cyan));
        }

        /* --- masthead ---------------------------------------------------- */

        .rs__head {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          margin-top: 2.75rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--line);
        }

        .rs__name {
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(2.25rem, 5.5vw, 3.75rem);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .rs__role {
          margin-top: 0.85rem;
          font-size: 1.0625rem;
          color: rgb(var(--cyan) / 0.92);
        }

        .rs__contact {
          list-style: none;
          margin: 1.25rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1.25rem;
          font-family: var(--mono);
          font-size: 0.8125rem;
          color: var(--text-dim);
        }
        .rs__contact a {
          border-bottom: 1px solid var(--line-strong);
          padding-bottom: 1px;
          transition: border-color 0.3s var(--ease);
        }
        .rs__contact a:hover {
          border-bottom-color: rgb(var(--cyan));
        }

        .rs__actions {
          display: flex;
          gap: 0.6rem;
        }

        .rs__summary {
          margin-top: 2rem;
          font-size: 1.0625rem;
          line-height: 1.7;
          color: var(--text-dim);
          max-width: 62ch;
          text-wrap: pretty;
        }

        /* --- columns ----------------------------------------------------- */

        .rs__grid {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
          gap: clamp(2rem, 5vw, 4.5rem);
          margin-top: 3.5rem;
        }

        .rs__main,
        .rs__side {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .rs__h2 {
          font-family: var(--mono);
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgb(var(--cyan) / 0.85);
          padding-bottom: 0.85rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--line);
        }

        .rs__entry {
          margin-bottom: 1.75rem;
        }
        .rs__entry:last-child {
          margin-bottom: 0;
        }

        .rs__entryHead {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
        }

        .rs__entry h3 {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.0625rem;
          letter-spacing: -0.02em;
          text-wrap: balance;
        }
        .rs__entry h3 em {
          font-style: normal;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: rgb(var(--lime));
        }

        .rs__dates {
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          white-space: nowrap;
        }

        .rs__sub {
          margin-top: 0.3rem;
          font-size: 0.875rem;
          color: rgb(var(--cyan) / 0.8);
        }

        .rs__text {
          margin-top: 0.6rem;
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--text-dim);
          text-wrap: pretty;
        }

        /* A scannable list of what was actually done. Replaced a row of
           percentage tiles that nobody outside the company could verify. */
        .rs__metrics {
          list-style: none;
          margin: 0.75rem 0 0;
          padding: 0;
          display: grid;
          gap: 0.3rem;
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--text-dim);
        }
        .rs__metrics li {
          position: relative;
          padding-left: 0.95rem;
        }
        .rs__metrics li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.5em;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgb(var(--cyan) / 0.7);
        }

        .rs__tools {
          margin-top: 0.6rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          line-height: 1.7;
          color: var(--text-faint);
        }
        .rs__course b {
          color: var(--text-dim);
        }

        .rs__more {
          margin-top: 0.6rem;
          font-size: 0.8125rem;
        }
        .rs__more :global(a) {
          color: rgb(var(--indigo));
        }
        .rs__more :global(a):hover {
          color: rgb(var(--cyan));
        }

        .rs__skill {
          margin-bottom: 1.15rem;
        }
        .rs__skill h3 {
          font-family: var(--mono);
          font-size: 0.6875rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .rs__skill p {
          margin-top: 0.35rem;
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--text-dim);
        }

        .rs__avail .rs__text {
          margin-top: 0;
        }

        @media (max-width: 820px) {
          .rs__grid {
            grid-template-columns: 1fr;
          }
        }

        /* ================================================================
           Print
           ----------------------------------------------------------------
           ⌘P on this page should produce a document someone can hand to a
           hiring manager: black on white, no chrome, no glow, no links to
           pages that do not exist on paper.
           ================================================================ */

        @media print {
          .rs {
            padding: 0;
          }
          .rs__light,
          .rs__back,
          .rs__actions,
          .rs__more {
            display: none !important;
          }

          .rs__inner {
            max-width: none;
            padding: 0;
          }

          .rs__name,
          .rs__entry h3 {
            color: #000 !important;
            background: none !important;
          }
          .rs__metrics li::before {
            background: #666 !important;
          }

          .rs__role,
          .rs__sub,
          .rs__h2 {
            color: #333 !important;
          }

          .rs__text,
          .rs__summary,
          .rs__contact,
          .rs__skill p,
          .rs__metrics {
            color: #222 !important;
          }

          .rs__dates,
          .rs__tools {
            color: #555 !important;
          }

          .rs__h2,
          .rs__head {
            border-color: #bbb !important;
          }

          .rs__grid {
            gap: 2rem;
            margin-top: 1.5rem;
          }

          /* Never split an entry across a page break. */
          .rs__entry {
            break-inside: avoid;
          }
          section {
            break-inside: avoid-page;
          }
        }
      `}</style>

      {/* Page-level print rules. These have to be unscoped: they target
          <body> and elements owned by other components. */}
      <style jsx global>{`
        @media print {
          html,
          body {
            background: #fff !important;
            color: #000 !important;
          }
          .grain,
          header.nav,
          .cx {
            display: none !important;
          }
          @page {
            margin: 14mm;
          }
        }
      `}</style>
    </>
  );
}
