"use client";

import { useCallback, useEffect, useState } from "react";
import Console from "@/components/console/Console";
import Nav from "@/components/chrome/Nav";

/** Site chrome for the resume pages: nav, the assistant, and the page padding. */
export default function ResumeFrame({ children }: { children: React.ReactNode }) {
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
      <main className="rf">{children}</main>
      <Console open={consoleOpen} onClose={() => setConsoleOpen(false)} />

      <style jsx>{`
        .rf {
          padding-block: calc(var(--bar-h) + 3rem) 6rem;
          min-height: 100svh;
        }
      `}</style>
    </>
  );
}
