"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "top", label: "Start" },
  { id: "thesis", label: "Approach" },
  { id: "pipeline", label: "Method" },
  { id: "work", label: "Work" },
  { id: "kinnovation", label: "Kinnovation" },
  { id: "projects", label: "Projects" },
  { id: "code", label: "Code" },
  { id: "recognition", label: "Recognition" },
  { id: "contact", label: "Contact" },
];

/**
 * Reading position, as a rail down the right edge.
 *
 * Two jobs at once: it shows how far through a long single-page site you are,
 * and it is the actual navigation — each tick is a link, and the label appears
 * on hover. On a page this tall the top nav alone leaves you with no sense of
 * place.
 *
 * The progress line is written straight to a transform in a rAF; only the
 * active-section index goes through React state, and only when it changes.
 */
export default function ScrollRail() {
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    let lastActive = -1;

    /* Section offsets, measured once and re-measured on resize — reading
       offsetTop for nine elements on every scroll event is a layout thrash. */
    let marks: { id: string; top: number }[] = [];

    const measure = () => {
      marks = SECTIONS.map(({ id }) => {
        const el = document.getElementById(id);
        return { id, top: el ? el.getBoundingClientRect().top + window.scrollY : 0 };
      });
    };

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${p})`;
      }

      /* Active = last section whose top has passed the middle of the screen. */
      const probe = y + window.innerHeight * 0.4;
      let idx = 0;
      for (let i = 0; i < marks.length; i += 1) {
        if (marks[i].top <= probe) idx = i;
      }
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    /* Sticky sections mean the document keeps growing as fonts and images
       settle; one late re-measure avoids a rail that is wrong for the first
       few seconds. */
    const settle = window.setTimeout(measure, 1200);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <nav className="rail" aria-label="Page sections">
      <span className="rail__track" aria-hidden="true">
        <span className="rail__fill" ref={fillRef} />
      </span>

      <ul>
        {SECTIONS.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              data-on={i === active ? "" : undefined}
              aria-current={i === active ? "true" : undefined}
            >
              <span className="rail__label">{s.label}</span>
              <span className="rail__tick" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .rail {
          position: fixed;
          top: 50%;
          right: clamp(0.75rem, 2vw, 1.75rem);
          transform: translateY(-50%);
          z-index: 45;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .rail__track {
          position: absolute;
          right: 3.5px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--line);
        }

        .rail__fill {
          display: block;
          width: 100%;
          height: 100%;
          transform-origin: 50% 0;
          transform: scaleY(0);
          background: linear-gradient(
            180deg,
            rgb(var(--violet)),
            rgb(var(--cyan)) 40%,
            rgb(var(--lime))
          );
        }

        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          position: relative;
        }

        li a {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.6rem;
        }

        .rail__tick {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--void);
          border: 1px solid var(--line-strong);
          transition:
            background 0.4s var(--ease),
            border-color 0.4s var(--ease),
            transform 0.4s var(--ease-spring),
            box-shadow 0.4s var(--ease);
          flex-shrink: 0;
        }

        li a:hover .rail__tick {
          border-color: rgb(var(--cyan));
        }

        li a[data-on] .rail__tick {
          background: rgb(var(--cyan));
          border-color: rgb(var(--cyan));
          transform: scale(1.4);
          box-shadow: 0 0 16px 1px rgb(var(--cyan) / 0.7);
        }

        /* The label rides in from the right on hover. Always rendered so it is
           reachable by keyboard and readable by a screen reader. */
        .rail__label {
          font-family: var(--mono);
          font-size: 0.6875rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-faint);
          white-space: nowrap;
          opacity: 0;
          transform: translateX(6px);
          transition:
            opacity 0.35s var(--ease),
            transform 0.35s var(--ease),
            color 0.35s var(--ease);
        }

        li a:hover .rail__label,
        li a:focus-visible .rail__label {
          opacity: 1;
          transform: none;
          color: var(--text);
        }

        li a[data-on]:hover .rail__label,
        li a[data-on]:focus-visible .rail__label {
          color: rgb(var(--cyan));
        }

        /* The active label is deliberately NOT pinned open. The rail sits over
           the right edge of the content at common laptop widths, and a label
           that is always visible permanently covers whatever is under it. The
           lit tick already says where you are. */

        /* Below this the rail would overlap the content column outright, and a
           touch device has no hover to reveal the labels with. */
        @media (max-width: 1280px), (pointer: coarse) {
          .rail {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
