"use client";

import { useCallback, useEffect, useState } from "react";
import BootSequence from "@/components/boot/BootSequence";
import Console from "@/components/console/Console";
import Nav from "@/components/chrome/Nav";
import Cursor from "@/components/fx/Cursor";
import ScrollRail from "@/components/fx/ScrollRail";
import Hero from "@/components/sections/Hero";
import Thesis from "@/components/sections/Thesis";
import Pipeline from "@/components/sections/Pipeline";
import Work from "@/components/sections/Work";
import Ventures from "@/components/sections/Ventures";
import Projects from "@/components/sections/Projects";
import Repos from "@/components/sections/Repos";
import Recognition from "@/components/sections/Recognition";
import Contact from "@/components/sections/Contact";
import { useReveal } from "@/lib/reveal";

/**
 * The index.
 *
 * One page, eight sections, each with a different form: a hero, a scroll-scrubbed
 * statement, a sticky four-stage pipeline, a ledger of roles, a saturated colour
 * break for the studio, a project grid with generated visuals, a ticker plus two
 * lists, and a footer that is also the contact page.
 *
 * The old site had seven routes that each restated the index in a card grid.
 * Everything here appears exactly once; the detail pages under /work and
 * /projects are the only places that go deeper, and they are reached from here.
 */
export default function Home() {
  const [consoleOpen, setConsoleOpen] = useState(false);

  useReveal();

  const openConsole = useCallback(() => setConsoleOpen(true), []);
  const closeConsole = useCallback(() => setConsoleOpen(false), []);

  /* ⌘K / Ctrl-K from anywhere. Bound at the document so it works whether or
     not focus is inside a section. */
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

  /* Arriving with a hash — following "Projects" from a detail page, or a
     shared deep link — lands in the wrong place. The browser jumps as soon as
     the element exists, but four sticky sections above it are still resolving
     their heights, so the target has moved by the time the page settles.
     Re-aim once layout is stable, then once more after fonts land. */
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === "#top") return;

    const aim = () => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    };

    const t1 = window.setTimeout(aim, 120);
    const t2 = window.setTimeout(aim, 700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <>
      <BootSequence />
      <Cursor />
      <Nav onOpenConsole={openConsole} />
      <ScrollRail />

      <main>
        <Hero />
        <Thesis />
        <Pipeline />
        <Work />
        <Ventures />
        <Projects />
        <Repos />
        <Recognition />
      </main>

      <Contact onOpenConsole={openConsole} />

      <Console open={consoleOpen} onClose={closeConsole} />
    </>
  );
}
