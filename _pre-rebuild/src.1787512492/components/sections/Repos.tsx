"use client";

import Link from "next/link";
import { PERSON, PROJECTS, REPOS } from "@/data/profile";

/** Language dot colours, matching GitHub's own so they read as familiar. */
const LANG: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Dart: "#00B4AB",
  "Jupyter Notebook": "#DA5B0B",
};

/**
 * The code.
 *
 * Five repositories, every one of them real and public — checked, not assumed.
 * A portfolio that links to a private or missing repo is worse than one that
 * links to nothing, because the recruiter who clicks finds a 404 with your name
 * on it.
 *
 * Where a repo has a write-up on this site, the row links to both: the prose
 * and the source. They answer different questions.
 */
export default function Repos() {
  return (
    <section className="code" id="code">
      <div className="shell">
        <header className="code__head" data-reveal>
          <p className="t-label">On GitHub</p>
          <h2 className="t-section">Open the source.</h2>
          <p className="t-body code__intro">
            Not a curated highlight reel — this is what is actually public on{" "}
            <a href={PERSON.github} target="_blank" rel="noreferrer">
              @rishav-dev
            </a>
            , including the coursework. The interesting ones have write-ups; the
            rest you can just read.
          </p>
        </header>

        <ul className="code__list">
          {REPOS.map((repo, i) => {
            const project = repo.project
              ? PROJECTS.find((p) => p.slug === repo.project)
              : undefined;

            return (
              <li
                key={repo.name}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
              >
                <div className="repo">
                  <a
                    className="repo__main"
                    href={repo.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="repo__name">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                      </svg>
                      {repo.name}
                      <svg className="repo__out" width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M4 10L10 4M10 4H5.5M10 4v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="repo__blurb">{repo.blurb}</span>
                  </a>

                  <span className="repo__meta">
                    <span className="repo__lang">
                      <i style={{ background: LANG[repo.language] ?? "#888" }} />
                      {repo.language}
                    </span>
                    {project && (
                      <Link className="repo__write" href={`/projects/${project.slug}`}>
                        Write-up →
                      </Link>
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        .code {
          padding-block: clamp(5rem, 12vh, 9rem);
        }

        .code__head {
          max-width: 44rem;
          margin-bottom: clamp(2.5rem, 6vh, 4rem);
        }
        .code__head .t-section {
          margin-top: 1.25rem;
        }
        .code__intro {
          margin-top: 1.5rem;
        }
        .code__intro a {
          color: rgb(var(--cyan));
          border-bottom: 1px solid rgb(var(--cyan) / 0.35);
          padding-bottom: 1px;
          transition: border-color 0.3s var(--ease);
        }
        .code__intro a:hover {
          border-bottom-color: rgb(var(--cyan));
        }

        .code__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.6rem;
        }

        .repo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.1rem 1.35rem;
          border: 1px solid var(--line);
          border-radius: 0.9rem;
          background: rgb(255 255 255 / 0.018);
          transition:
            border-color 0.4s var(--ease),
            background 0.4s var(--ease),
            transform 0.4s var(--ease);
        }
        .repo:hover {
          border-color: rgb(var(--cyan) / 0.4);
          background: rgb(var(--cyan) / 0.045);
          transform: translateX(3px);
        }

        .repo__main {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          min-width: 0;
          flex: 1;
        }

        .repo__name {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--mono);
          font-size: 0.9375rem;
          color: var(--text);
        }

        .repo__out {
          opacity: 0;
          transform: translate(-3px, 3px);
          transition:
            opacity 0.35s var(--ease),
            transform 0.35s var(--ease);
          color: rgb(var(--cyan));
        }
        .repo:hover .repo__out {
          opacity: 1;
          transform: none;
        }

        .repo__blurb {
          font-size: 0.875rem;
          line-height: 1.55;
          color: var(--text-dim);
          text-wrap: pretty;
        }

        .repo__meta {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-shrink: 0;
        }

        .repo__lang {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          white-space: nowrap;
        }
        .repo__lang i {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .repo__meta :global(a.repo__write) {
          font-family: var(--mono);
          font-size: 0.75rem;
          color: rgb(var(--lime));
          white-space: nowrap;
          transition: opacity 0.3s var(--ease);
        }
        .repo__meta :global(a.repo__write):hover {
          opacity: 0.75;
        }

        @media (max-width: 720px) {
          .repo {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
}
