"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Console from "@/components/console/Console";
import Nav from "@/components/chrome/Nav";
import { useReveal } from "@/lib/reveal";

export interface DetailProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: { label: string; value: string }[];
  body: string[];
  metrics?: { value: string; label: string }[];
  stack: string[];
  /** Previous/next within the same collection, for reading straight through. */
  siblings: { href: string; label: string; dir: "prev" | "next" }[];
  backHref: string;
  backLabel: string;
  hue: string;
}

/**
 * Shared shell for the /work and /projects detail pages.
 *
 * These exist so the index can stay short. The index says what a role was in
 * one line; this is where the same role gets three paragraphs. Nothing is
 * duplicated between the two — the summary line lives on the index, the detail
 * lives here, and both come from the same entry in profile.ts.
 */
export default function Detail(props: DetailProps) {
  const [consoleOpen, setConsoleOpen] = useState(false);
  useReveal();

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

      <main className="dt" style={{ ["--hue" as string]: `var(${props.hue})` }}>
        <div className="dt__light" aria-hidden="true">
          <span
            className="bloom"
            style={{
              ["--hue" as string]: `var(${props.hue})`,
              width: "48vw",
              height: "40vw",
              left: "-6vw",
              top: "-6vh",
              opacity: 0.34,
            }}
          />
        </div>

        <div className="shell dt__inner">
          <Link className="dt__back" href={props.backHref}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {props.backLabel}
          </Link>

          <header className="dt__head">
            <p className="t-label dt__eyebrow" data-reveal>
              {props.eyebrow}
            </p>
            <h1 className="t-display dt__title" data-reveal>
              {props.title}
            </h1>
            <p className="dt__sub" data-reveal style={{ ["--reveal-delay" as string]: "90ms" }}>
              {props.subtitle}
            </p>
          </header>

          <dl className="dt__meta" data-reveal>
            {props.meta.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>

          {props.metrics && props.metrics.length > 0 && (
            <ul className="dt__metrics" data-reveal>
              {props.metrics.map((m) => (
                <li key={m.label}>
                  <b>{m.value}</b>
                  <i>{m.label}</i>
                </li>
              ))}
            </ul>
          )}

          <div className="dt__body">
            {props.body.map((p, i) => (
              <p key={i} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
                {p}
              </p>
            ))}
          </div>

          <div className="dt__stack" data-reveal>
            <p className="t-label">Tools &amp; methods</p>
            <ul>
              {props.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <nav className="dt__nav" aria-label="More">
            {props.siblings.map((s) => (
              <Link key={s.href} className="dt__sib" href={s.href} data-dir={s.dir}>
                <span>{s.dir === "prev" ? "Previous" : "Next"}</span>
                <strong>{s.label}</strong>
              </Link>
            ))}
          </nav>
        </div>
      </main>

      <Console open={consoleOpen} onClose={() => setConsoleOpen(false)} />

      <style jsx>{`
        .dt {
          position: relative;
          padding-block: calc(var(--bar-h) + 3rem) 6rem;
          overflow: hidden;
          isolation: isolate;
          min-height: 100svh;
        }

        .dt__light {
          position: absolute;
          inset: 0;
          z-index: -1;
          contain: strict;
        }

        .dt__inner {
          max-width: 62rem;
        }

        .dt__back {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          transition: color 0.3s var(--ease);
        }
        .dt__back:hover {
          color: rgb(var(--hue));
        }

        .dt__head {
          margin-top: 3rem;
        }

        .dt__eyebrow {
          color: rgb(var(--hue));
        }

        .dt__title {
          margin-top: 1.1rem;
          font-size: clamp(2.25rem, 6.5vw, 4.75rem);
        }

        .dt__sub {
          margin-top: 1.5rem;
          font-size: clamp(1.0625rem, 1.8vw, 1.375rem);
          line-height: 1.5;
          color: var(--text-dim);
          max-width: 46ch;
          text-wrap: pretty;
        }

        /* --- meta -------------------------------------------------------- */

        .dt__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 2.5rem;
          margin: 3rem 0 0;
          padding-block: 1.5rem;
          border-block: 1px solid var(--line);
        }
        .dt__meta dt {
          font-family: var(--mono);
          font-size: 0.625rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .dt__meta dd {
          margin: 0.4rem 0 0;
          font-size: 0.9375rem;
        }

        /* --- metrics ----------------------------------------------------- */

        .dt__metrics {
          list-style: none;
          margin: 3rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 3.5rem;
        }
        .dt__metrics b {
          display: block;
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(2.5rem, 6vw, 4rem);
          line-height: 1;
          letter-spacing: -0.045em;
          color: rgb(var(--hue));
        }
        .dt__metrics i {
          display: block;
          margin-top: 0.5rem;
          font-style: normal;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
        }

        /* --- body -------------------------------------------------------- */

        .dt__body {
          margin-top: 3.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 40rem;
        }
        .dt__body p {
          font-size: 1.0625rem;
          line-height: 1.75;
          color: var(--text-dim);
          text-wrap: pretty;
        }
        /* Lead paragraph gets full-strength ink, so the eye knows where the
           reading starts. */
        .dt__body p:first-child {
          font-size: 1.1875rem;
          color: var(--text);
        }

        /* --- stack ------------------------------------------------------- */

        .dt__stack {
          margin-top: 3.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--line);
        }
        .dt__stack ul {
          list-style: none;
          margin: 1.1rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .dt__stack li {
          font-family: var(--mono);
          font-size: 0.75rem;
          padding: 0.35rem 0.7rem;
          border-radius: 99px;
          border: 1px solid rgb(var(--hue) / 0.28);
          color: rgb(var(--hue));
        }

        /* --- prev / next ------------------------------------------------- */

        .dt__nav {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid var(--line);
        }

        .dt__nav :global(a.dt__sib) {
          flex: 1 1 14rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding: 1.25rem;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          transition:
            border-color 0.4s var(--ease),
            background 0.4s var(--ease);
        }
        .dt__nav :global(a.dt__sib):hover {
          border-color: rgb(var(--hue) / 0.45);
          background: rgb(var(--hue) / 0.06);
        }
        .dt__nav :global(a.dt__sib)[data-dir="next"] {
          text-align: right;
        }
        .dt__sib span {
          font-family: var(--mono);
          font-size: 0.625rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .dt__sib strong {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.0625rem;
          letter-spacing: -0.02em;
        }
      `}</style>
    </>
  );
}
