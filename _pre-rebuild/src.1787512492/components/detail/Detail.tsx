"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Console from "@/components/console/Console";
import Nav from "@/components/chrome/Nav";
import CountUp from "@/components/fx/CountUp";
import { useReveal } from "@/lib/reveal";

export interface DetailProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: { label: string; value: string }[];
  body: string[];
  metrics?: { value: string; label: string }[];
  stack: string[];
  /** Outbound links: the repo, the organisation's site, a live demo. */
  links?: { label: string; href: string; kind: "repo" | "site" | "demo" }[];
  /** Real figures, rendered as a table. Never invented for layout. */
  table?: { caption: string; head: string[]; rows: (string | number)[][] };
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

          {props.links && props.links.length > 0 && (
            <div className="dt__links" data-reveal>
              {props.links.map((l) => (
                <a
                  key={l.href}
                  className="btn"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  data-kind={l.kind}
                >
                  {l.kind === "repo" ? (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                    </svg>
                  ) : null}
                  <span>{l.label}</span>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M4 10L10 4M10 4H5.5M10 4v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          )}

          {props.metrics && props.metrics.length > 0 && (
            <ul className="dt__metrics" data-reveal>
              {props.metrics.map((m) => (
                <li key={m.label}>
                  <b>
                    <CountUp value={m.value} />
                  </b>
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

          {props.table && (
            <figure className="dt__figure" data-reveal>
              <div className="dt__scroll">
                <table>
                  <caption>{props.table.caption}</caption>
                  <thead>
                    <tr>
                      {props.table.head.map((h, i) => (
                        <th key={h} scope="col" data-num={i > 0 ? "" : undefined}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {props.table.rows.map((row) => (
                      <tr key={String(row[0])}>
                        {row.map((cell, i) =>
                          i === 0 ? (
                            <th key={i} scope="row">
                              {cell}
                            </th>
                          ) : (
                            <td key={i}>{cell}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </figure>
          )}

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

        /* :global — next/link renders the <a>, so styled-jsx cannot scope onto
           it. Without this the rule is dropped entirely and the arrow, which
           globals.css sets to display:block like every other svg, falls onto
           its own line. */
        .dt__inner :global(a.dt__back) {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          transition: color 0.3s var(--ease);
        }
        .dt__inner :global(a.dt__back):hover {
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

        /* --- outbound links ---------------------------------------------- */

        .dt__links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 2.5rem;
        }
        .dt__links a[data-kind="repo"] {
          border-color: rgb(var(--hue) / 0.35);
          color: rgb(var(--hue));
        }

        /* --- table --------------------------------------------------------
           The numbers are real, so the table is the honest form. Three models
           within 0.6 percentage points of each other rendered as bars would
           imply a difference the data does not support. */

        .dt__figure {
          margin: 3rem 0 0;
        }

        /* Wide content scrolls inside its own box; the page body never does. */
        .dt__scroll {
          overflow-x: auto;
          border: 1px solid var(--line);
          border-radius: var(--radius);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        caption {
          caption-side: top;
          text-align: left;
          padding: 1rem 1.25rem 0.85rem;
          font-family: var(--mono);
          font-size: 0.6875rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-faint);
        }

        th,
        td {
          padding: 0.75rem 1.25rem;
          text-align: left;
          border-top: 1px solid var(--line);
        }

        thead th {
          font-family: var(--mono);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-faint);
        }

        /* Figures right-aligned and tabular so the decimal points line up —
           the only reason a metrics table is faster to read than a list. */
        thead th[data-num],
        tbody td {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        tbody th {
          font-weight: 500;
          color: var(--text);
        }

        tbody td {
          color: var(--text-dim);
        }

        tbody tr:first-child td,
        tbody tr:first-child th {
          color: rgb(var(--hue));
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
