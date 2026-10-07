"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ResumeFrame from "@/components/resume/ResumeFrame";
import { PERSON } from "@/data/profile";
import { RESUMES, type ResumeVariant } from "@/data/resumes";

/** Turns a contact item from the resume header into a link where it can be one. */
function contactHref(item: string): string | null {
  if (item.includes("@")) return `mailto:${item}`;
  if (/^[\d\s().+-]{7,}$/.test(item)) return `tel:${item.replace(/[^\d+]/g, "")}`;
  if (/^(linkedin|github)\.com/.test(item) || item.includes(".com")) return `https://${item}`;
  return null;
}

/** One resume, rendered as a page, with the focus-area switcher and downloads. */
export default function ResumeDoc({ variant }: { variant: ResumeVariant }) {
  const router = useRouter();

  return (
    <ResumeFrame>
      <div className="shell rd">
        <Link className="rd__back" href="/resume/">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All resumes
        </Link>

        <header className="rd__head">
          <div className="rd__headText">
            <p className="t-label">
              Resume · {variant.number} of {RESUMES.length}
            </p>
            <h1 className="t-display rd__title">{variant.title}</h1>
            <p className="rd__sub">{variant.description}</p>
          </div>

          <div className="rd__tools">
            <label className="rd__switch">
              <span className="t-label">Focus area</span>
              <select
                value={variant.slug}
                onChange={(e) => router.push(`/resume/${e.target.value}/`)}
                aria-label="Switch to a resume for a different focus area"
              >
                {RESUMES.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.number} · {r.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="rd__downloads">
              <a className="btn btn--primary" href={variant.pdf} download>
                <span>PDF</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v9m0 0L4.5 7.5M8 11l3.5-3.5M2.5 13.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a className="btn" href={variant.docx} download>
                Word
              </a>
            </div>
          </div>
        </header>

        <article className="doc">
          <header className="doc__head">
            <h2>{PERSON.name}</h2>
            <p>{variant.header.location}</p>
            <ul className="doc__contact">
              {variant.header.contact.map((c) => {
                const href = contactHref(c);
                return (
                  <li key={c}>
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                        {c}
                      </a>
                    ) : (
                      c
                    )}
                  </li>
                );
              })}
            </ul>
          </header>

          <section>
            <h3>Education</h3>
            {variant.education.map((e) => (
              <div className="doc__entry" key={e.school}>
                <div className="doc__row">
                  <h4>{e.school}</h4>
                  <span>{e.dates}</span>
                </div>
                <p className="doc__sub">
                  {e.degree} · {e.place}
                </p>
              </div>
            ))}
          </section>

          <section>
            <h3>Relevant coursework</h3>
            <ul className="doc__chips">
              {variant.coursework.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Experience</h3>
            {variant.experience.map((e) => (
              <div className="doc__entry" key={`${e.org}-${e.dates}`}>
                <div className="doc__row">
                  <h4>{e.org}</h4>
                  <span>{e.dates}</span>
                </div>
                <p className="doc__sub">
                  {e.role} · {e.place}
                </p>
                <ul className="doc__bullets">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h3>Projects</h3>
            {variant.projects.map((p) => (
              <div className="doc__entry" key={p.name}>
                <div className="doc__row">
                  <h4>{p.name}</h4>
                  <span>{p.context}</span>
                </div>
                <p className="doc__sub">{p.tools}</p>
                <ul className="doc__bullets">
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h3>Technical skills</h3>
            <dl className="doc__skills">
              {variant.skills.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.items}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h3>Honors and awards</h3>
            {variant.honors.map((h) => (
              <p className="doc__honor" key={h.name}>
                <b>{h.name}:</b> {h.text}
              </p>
            ))}
          </section>
        </article>
      </div>

      <style jsx>{`
        .rd :global(a.rd__back) {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          transition: color 0.3s var(--ease);
        }
        .rd :global(a.rd__back):hover {
          color: rgb(var(--cyan));
        }

        .rd__head {
          margin-top: 3rem;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
        }
        .rd__headText {
          max-width: 40rem;
        }
        .rd__title {
          margin-top: 1.1rem;
          font-size: clamp(2.25rem, 6vw, 4.25rem);
        }
        .rd__sub {
          margin-top: 1.25rem;
          font-size: 1.0625rem;
          line-height: 1.6;
          color: var(--text-dim);
          max-width: 44ch;
          text-wrap: pretty;
        }

        .rd__tools {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.1rem;
        }

        .rd__switch {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .rd__switch select {
          appearance: none;
          min-width: 16rem;
          max-width: 100%;
          padding: 0.65rem 2.4rem 0.65rem 1.1rem;
          border-radius: 999px;
          border: 1px solid var(--line-strong);
          background-color: rgb(255 255 255 / 0.03);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8l3.5-3.5' stroke='%23b9b9c6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          color: var(--text);
          font: inherit;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: border-color 0.3s var(--ease);
        }
        .rd__switch select:hover,
        .rd__switch select:focus-visible {
          border-color: rgb(var(--cyan) / 0.6);
        }
        .rd__switch option {
          background: #0b0b11;
          color: #f3f3f7;
        }

        .rd__downloads {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        /* --- the document ------------------------------------------------ */

        .doc {
          margin-top: clamp(2.5rem, 6vh, 4rem);
          max-width: 52rem;
          padding: clamp(1.5rem, 4vw, 3rem);
          border: 1px solid var(--line);
          border-radius: 1.25rem;
          background: rgb(255 255 255 / 0.018);
        }

        .doc__head {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--line);
        }
        .doc__head h2 {
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          letter-spacing: -0.035em;
        }
        .doc__head p {
          margin-top: 0.4rem;
          color: var(--text-dim);
        }
        .doc__contact {
          list-style: none;
          margin: 0.9rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem 1.25rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .doc__contact a {
          border-bottom: 1px solid rgb(255 255 255 / 0.18);
          transition: color 0.3s var(--ease);
        }
        .doc__contact a:hover {
          color: rgb(var(--cyan));
        }

        .doc section {
          padding-top: 2rem;
        }
        .doc h3 {
          font-family: var(--mono);
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgb(var(--cyan) / 0.9);
          padding-bottom: 0.6rem;
          border-bottom: 1px solid var(--line);
        }

        .doc__entry {
          margin-top: 1.25rem;
        }
        .doc__row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.2rem 1rem;
        }
        .doc__row h4 {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.0625rem;
          letter-spacing: -0.02em;
        }
        .doc__row span {
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          white-space: nowrap;
        }
        .doc__sub {
          margin-top: 0.25rem;
          font-size: 0.9rem;
          color: var(--text-dim);
        }

        .doc__bullets {
          list-style: none;
          margin: 0.7rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .doc__bullets li {
          position: relative;
          padding-left: 1.1rem;
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--text-dim);
          text-wrap: pretty;
        }
        .doc__bullets li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.62em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgb(var(--cyan));
        }

        .doc__chips {
          list-style: none;
          margin: 1rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .doc__chips li {
          font-size: 0.8125rem;
          padding: 0.3rem 0.7rem;
          border-radius: 99px;
          border: 1px solid var(--line-strong);
          color: var(--text-dim);
        }

        .doc__skills {
          margin: 1rem 0 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .doc__skills dt {
          font-family: var(--mono);
          font-size: 0.6875rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .doc__skills dd {
          margin: 0.2rem 0 0;
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--text-dim);
        }

        .doc__honor {
          margin-top: 0.9rem;
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--text-dim);
          text-wrap: pretty;
        }
        .doc__honor b {
          font-weight: 500;
          color: var(--text);
        }
      `}</style>
    </ResumeFrame>
  );
}
