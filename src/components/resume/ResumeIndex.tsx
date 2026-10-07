"use client";

import Link from "next/link";
import ResumeFrame from "@/components/resume/ResumeFrame";
import { RESUMES } from "@/data/resumes";

/** The resume landing page: pick the focus area closest to the role. */
export default function ResumeIndex() {
  return (
    <ResumeFrame>
      <div className="shell ri">
        <Link className="ri__back" href="/">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to the site
        </Link>

        <header className="ri__head">
          <p className="t-label">Resume</p>
          <h1 className="t-section ri__title">Pick the resume that fits the role.</h1>
          <p className="t-body ri__sub">
            The same experience, ordered and worded for {RESUMES.length} kinds of work. Each
            page shows the full resume and has PDF and Word downloads.
          </p>
        </header>

        <ul className="ri__grid">
          {RESUMES.map((r) => (
            <li key={r.slug}>
              <Link className="ri__card" href={`/resume/${r.slug}/`}>
                <span className="ri__num">{r.number}</span>
                <strong>{r.title}</strong>
                <span className="ri__desc">{r.description}</span>
                <span className="ri__go">
                  View resume
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .ri__head {
          margin-top: 3rem;
          max-width: 44rem;
        }
        .ri__title {
          margin-top: 1.25rem;
        }
        .ri__sub {
          margin-top: 1.5rem;
        }

        .ri :global(a.ri__back) {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          transition: color 0.3s var(--ease);
        }
        .ri :global(a.ri__back):hover {
          color: rgb(var(--cyan));
        }

        .ri__grid {
          list-style: none;
          margin: clamp(2.5rem, 6vh, 4rem) 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(18.5rem, 1fr));
          gap: 0.9rem;
        }

        .ri__grid :global(a.ri__card) {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          padding: 1.4rem 1.4rem 1.2rem;
          border: 1px solid var(--line);
          border-radius: 1rem;
          background: rgb(255 255 255 / 0.018);
          transition:
            border-color 0.4s var(--ease),
            background 0.4s var(--ease),
            transform 0.4s var(--ease);
        }
        .ri__grid :global(a.ri__card):hover {
          border-color: rgb(var(--cyan) / 0.45);
          background: rgb(var(--cyan) / 0.05);
          transform: translateY(-2px);
        }

        .ri__num {
          font-family: var(--mono);
          font-size: 0.6875rem;
          letter-spacing: 0.18em;
          color: var(--text-faint);
        }

        .ri__card strong {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.1875rem;
          line-height: 1.2;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .ri__desc {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-dim);
          text-wrap: pretty;
        }

        .ri__go {
          margin-top: auto;
          padding-top: 0.6rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: rgb(var(--cyan));
        }
      `}</style>
    </ResumeFrame>
  );
}
