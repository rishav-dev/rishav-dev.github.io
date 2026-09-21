"use client";

import { useCallback, useEffect, useState } from "react";
import Console from "@/components/console/Console";
import Nav from "@/components/chrome/Nav";
import { LAB_PAGES, type LabPage } from "@/lab/pages";
import "./lab.css";

/* One promise per script, shared across effect runs, so a page's scripts
   load exactly once and in order even when React runs the effect twice. */
const loading = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const existing = loading.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Could not load ${src}`));
    document.body.appendChild(el);
  });
  loading.set(src, promise);
  return promise;
}

/**
 * A page of the ProDose design lab, rendered as part of the site.
 *
 * The lab is a physics engine plus seven pages of charts and controls that
 * were written as plain scripts against fixed markup, so the markup is
 * rendered here and the scripts are loaded once it exists. Links out of the
 * lab are ordinary anchors on purpose: a full navigation tears down the
 * simulation's animation loop, where a client-side transition would leave it
 * running behind the next page.
 */
export default function LabShell({ page, html }: { page: LabPage; html: string }) {
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const src of page.scripts) {
        if (cancelled) return;
        try {
          await loadScript(src);
        } catch (err) {
          console.error(err);
          return;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <>
      <Nav onOpenConsole={openConsole} />

      <main className="lp">
        <div className="shell lp__inner">
          <div className="lp__top">
            <a className="lp__back" href="/work/prodose/">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M13 8H3M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ProDose
            </a>
            <p className="t-label">Design lab</p>
          </div>

          <nav className="lp__tabs" aria-label="ProDose design lab">
            {LAB_PAGES.map((p) => (
              <a
                key={p.slug}
                href={p.route}
                aria-current={p.slug === page.slug ? "page" : undefined}
              >
                {p.label}
              </a>
            ))}
          </nav>

          <div
            className={page.app ? "lab lab--sim" : "lab"}
            data-page={page.slug}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </main>

      <Console open={consoleOpen} onClose={() => setConsoleOpen(false)} />

      <style jsx>{`
        .lp {
          padding-block: calc(var(--bar-h) + 2rem) 5rem;
          min-height: 100svh;
        }

        .lp__inner {
          max-width: 88rem;
        }

        .lp__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .lp__top a {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--mono);
          font-size: 0.75rem;
          color: var(--text-faint);
          transition: color 0.3s var(--ease);
        }
        .lp__top a:hover {
          color: rgb(var(--cyan));
        }

        .lp__tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem 1.5rem;
          margin: 1.25rem 0 1.75rem;
          padding-bottom: 0.9rem;
          border-bottom: 1px solid var(--line);
        }

        .lp__tabs a {
          position: relative;
          padding-block: 0.3rem;
          font-size: 0.9375rem;
          color: var(--text-dim);
          transition: color 0.3s var(--ease);
        }
        .lp__tabs a:hover {
          color: var(--text);
        }
        .lp__tabs a[aria-current="page"] {
          color: var(--text);
        }
        .lp__tabs a[aria-current="page"]::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1rem;
          height: 2px;
          background: linear-gradient(90deg, rgb(var(--cyan)), rgb(var(--indigo)));
        }
      `}</style>
    </>
  );
}
