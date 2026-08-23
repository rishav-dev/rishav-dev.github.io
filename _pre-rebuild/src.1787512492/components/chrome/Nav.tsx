"use client";

import { useScrolled } from "@/lib/scroll";

/* Hash links work from the index; from a detail page they need the leading
   slash to get back there first. Written absolute so both cases behave. */
const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#kinnovation", label: "Kinnovation" },
  { href: "/#projects", label: "Projects" },
  { href: "/#code", label: "Code" },
  { href: "/resume", label: "Resume" },
  { href: "/#contact", label: "Contact" },
];

/**
 * The bar.
 *
 * Transparent over the hero, glass once you leave it. The monogram is drawn
 * rather than typeset so it stays crisp at 28px and needs no font to have
 * loaded — it is the first thing painted after the boot sequence hands over.
 */
export default function Nav({ onOpenConsole }: { onOpenConsole: () => void }) {
  const scrolled = useScrolled(40);

  return (
    <header className="nav" data-solid={scrolled ? "" : undefined}>
      <div className="shell nav__inner">
        <a className="nav__mark" href="/#top" aria-label="Rishav Chakravarty — top">
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <defs>
              <linearGradient id="markGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(var(--indigo))" />
                <stop offset="55%" stopColor="rgb(var(--cyan))" />
                <stop offset="100%" stopColor="rgb(var(--lime))" />
              </linearGradient>
            </defs>
            {/* Four nodes and the path between them — the pipeline, at 28px. */}
            <path
              d="M5 24 L12 14 L20 19 L27 7"
              fill="none"
              stroke="url(#markGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="5" cy="24" r="2.4" fill="rgb(var(--indigo))" />
            <circle cx="27" cy="7" r="2.4" fill="rgb(var(--lime))" />
          </svg>
          <span className="nav__name">Rishav Chakravarty</span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <button className="nav__ask" onClick={onOpenConsole}>
          <span className="nav__pulse" aria-hidden="true" />
          Ask about me
          <kbd>⌘K</kbd>
        </button>
      </div>

      <style jsx>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          height: var(--bar-h);
          display: flex;
          align-items: center;
          transition:
            background 0.5s var(--ease),
            border-color 0.5s var(--ease),
            backdrop-filter 0.5s var(--ease);
          border-bottom: 1px solid transparent;
        }

        .nav[data-solid] {
          background: rgb(5 5 9 / 0.72);
          border-bottom-color: var(--line);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
        }

        .nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          width: 100%;
        }

        .nav__mark {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          flex-shrink: 0;
        }

        .nav__name {
          font-family: var(--display);
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: -0.02em;
        }

        .nav__links {
          display: flex;
          gap: 1.75rem;
          font-size: 0.875rem;
          color: var(--text-dim);
        }

        .nav__links a {
          position: relative;
          padding-block: 0.35rem;
          transition: color 0.3s var(--ease);
        }
        .nav__links a::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: rgb(var(--cyan));
          transform: scaleX(0);
          transform-origin: 0 50%;
          transition: transform 0.4s var(--ease);
        }
        .nav__links a:hover {
          color: var(--text);
        }
        .nav__links a:hover::after {
          transform: scaleX(1);
        }

        .nav__ask {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.6rem 0.5rem 0.85rem;
          border: 1px solid var(--line-strong);
          border-radius: 99px;
          font-size: 0.8125rem;
          color: var(--text-dim);
          flex-shrink: 0;
          transition:
            color 0.3s var(--ease),
            border-color 0.3s var(--ease),
            background 0.3s var(--ease);
        }
        .nav__ask:hover {
          color: var(--text);
          border-color: rgb(var(--cyan) / 0.55);
          background: rgb(var(--cyan) / 0.07);
        }

        /* A live dot. The one piece of ambient motion in the chrome — it is
           what tells you the console is a thing that answers, not a link. */
        .nav__pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgb(var(--lime));
          box-shadow: 0 0 0 0 rgb(var(--lime) / 0.7);
          animation: pulse 2.6s var(--ease-io) infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgb(var(--lime) / 0.55);
          }
          70%,
          100% {
            box-shadow: 0 0 0 9px rgb(var(--lime) / 0);
          }
        }

        .nav__ask kbd {
          font-family: var(--mono);
          font-size: 0.6875rem;
          padding: 0.15rem 0.4rem;
          border-radius: 5px;
          border: 1px solid var(--line);
          background: rgb(255 255 255 / 0.05);
          color: var(--text-faint);
        }

        @media (max-width: 1080px) {
          .nav__links {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .nav__name {
            display: none;
          }
          .nav__ask kbd {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
