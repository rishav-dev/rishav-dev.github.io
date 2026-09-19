"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Console from "@/components/console/Console";
import Nav from "@/components/chrome/Nav";

export default function SimulationFrame({
  src,
  title,
  backHref,
  backLabel,
}: {
  src: string;
  title: string;
  backHref: string;
  backLabel: string;
}) {
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

      <main className="sim">
        <div className="shell sim__inner">
          <div className="sim__bar">
            <Link className="sim__back" href={backHref}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M13 8H3M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {backLabel}
            </Link>
            <a className="sim__open" href={src} target="_blank" rel="noreferrer">
              Open full screen
            </a>
          </div>

          <iframe className="sim__frame" src={src} title={title} allow="clipboard-write" />
        </div>
      </main>

      <Console open={consoleOpen} onClose={() => setConsoleOpen(false)} />

      <style jsx>{`
        .sim {
          padding-top: calc(var(--bar-h) + 1.25rem);
          padding-bottom: 2rem;
          min-height: 100svh;
        }
        .sim__inner {
          max-width: 96rem;
        }
        .sim__bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.9rem;
          font-family: var(--mono);
          font-size: 0.75rem;
        }
        .sim__bar :global(a.sim__back),
        .sim__open {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--text-faint);
          transition: color 0.3s var(--ease);
        }
        .sim__bar :global(a.sim__back):hover,
        .sim__open:hover {
          color: rgb(var(--cyan));
        }
        .sim__frame {
          display: block;
          width: 100%;
          height: calc(100svh - var(--bar-h) - 5.5rem);
          min-height: 40rem;
          border: 1px solid var(--line);
          border-radius: 0.75rem;
          background: #eef0f3;
        }
      `}</style>
    </>
  );
}
