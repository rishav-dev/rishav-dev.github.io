"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ENTRIES, SUGGESTIONS } from "@/data/knowledge";
import { ask, isLive } from "@/lib/assistant";

interface Message {
  id: number;
  role: "user" | "bot" | "system";
  text: string;
  sources?: string[];
  mode?: "live" | "local";
  degraded?: string;
  streaming?: boolean;
}

/**
 * The assistant, as a command palette.
 *
 * Opened with ⌘K / Ctrl-K from anywhere, closed with Escape. A palette rather
 * than a chat bubble in the corner: the bubble pattern reads as customer
 * support, and this is closer to a search box that answers in sentences.
 *
 * The answer streams in either way, from the model when the Worker is
 * configured, from the written knowledge base when it is not, and the footer
 * always says which one you got.
 */
export default function Console({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  /* Previously asked questions, newest last, walked with the arrow keys. */
  const history = useRef<string[]>([]);
  const historyAt = useRef(-1);

  const live = isLive();

  const scroll = useCallback(() => {
    requestAnimationFrame(() => {
      const el = logRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  const push = useCallback(
    (role: Message["role"], text: string) => {
      setMessages((list) => [...list, { id: nextId.current++, role, text }]);
      scroll();
    },
    [scroll],
  );

  /* --- open / close ----------------------------------------------------- */

  useEffect(() => {
    if (!open) return;

    /* Focus after the entry transition, or the browser scrolls the page to
       the input while the panel is still moving. */
    const t = setTimeout(() => inputRef.current?.focus(), 120);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  /* Greeting, once. */
  useEffect(() => {
    if (!open || messages.length) return;
    push(
      "system",
      live
        ? "Ask anything about Rishav. Answers come from a model reading his profile. It will tell you when something falls outside what it knows."
        : "Ask anything about Rishav. Running offline against a written profile, so answers are brief and factual.",
    );
  }, [open, messages.length, live, push]);

  /* --- submit ----------------------------------------------------------- */

  const submit = useCallback(
    async (raw?: string) => {
      const question = (raw ?? draft).trim();
      if (!question || thinking) return;

      setDraft("");
      history.current.push(question);
      historyAt.current = -1;
      push("user", question);

      const command = question.toLowerCase().replace(/[^a-z]/g, "");
      if (command === "clear" || command === "cls") {
        setMessages([]);
        return;
      }
      if (command === "help" || command === "topics") {
        push(
          "bot",
          ["Things I can cover:", ...ENTRIES.map((e) => `  · ${e.question}`)].join("\n"),
        );
        return;
      }

      setThinking(true);
      const id = nextId.current++;
      let started = false;

      const append = (text: string) => {
        if (!started) {
          started = true;
          setThinking(false);
          setMessages((list) => [
            ...list,
            { id, role: "bot", text: "", streaming: true },
          ]);
        }
        setMessages((list) =>
          list.map((m) => (m.id === id ? { ...m, text: m.text + text } : m)),
        );
        scroll();
      };

      try {
        const reply = await ask(question, append);
        setMessages((list) =>
          list.map((m) =>
            m.id === id
              ? {
                  ...m,
                  streaming: false,
                  sources: reply.sources,
                  mode: reply.mode,
                  degraded: reply.degraded,
                }
              : m,
          ),
        );
      } catch {
        push("bot", "Something went wrong reaching the assistant. Try again in a moment.");
      } finally {
        setThinking(false);
        scroll();
      }
    },
    [draft, thinking, push, scroll],
  );

  /* Arrow keys walk previously asked questions, like a shell. */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    if (!history.current.length) return;
    e.preventDefault();

    if (e.key === "ArrowUp") {
      historyAt.current =
        historyAt.current < 0
          ? history.current.length - 1
          : Math.max(0, historyAt.current - 1);
      setDraft(history.current[historyAt.current]);
    } else {
      if (historyAt.current < 0) return;
      historyAt.current += 1;
      if (historyAt.current >= history.current.length) {
        historyAt.current = -1;
        setDraft("");
      } else {
        setDraft(history.current[historyAt.current]);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="cx" role="dialog" aria-modal="true" aria-label="Ask about Rishav">
      <button className="cx__scrim" onClick={onClose} aria-label="Close" />

      <div className="cx__panel">
        <header className="cx__head">
          <span className="cx__dot" data-live={live ? "" : undefined} />
          <span className="cx__title">Ask about Rishav</span>
          <span className="cx__mode">{live ? "model" : "offline"}</span>
          <button className="cx__x" onClick={onClose} aria-label="Close">
            esc
          </button>
        </header>

        <div className="cx__log" ref={logRef}>
          {messages.map((m) => (
            <div className="msg" data-role={m.role} key={m.id}>
              {m.role === "user" && <span className="msg__caret">›</span>}
              <div className="msg__body">
                <p className="msg__text">
                  {m.text}
                  {m.streaming && <i className="msg__cursor" />}
                </p>

                {!m.streaming && m.sources && m.sources.length > 0 && (
                  <p className="msg__sources">
                    {m.sources.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </p>
                )}

                {m.degraded && (
                  <p className="msg__degraded">
                    Model unreachable ({m.degraded}). Answered from the written
                    profile instead.
                  </p>
                )}
              </div>
            </div>
          ))}

          {thinking && (
            <div className="msg" data-role="bot">
              <div className="msg__body">
                <span className="cx__thinking">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="cx__suggest">
            {SUGGESTIONS.map((s) => (
              <button key={s.id} onClick={() => void submit(s.question)}>
                {s.question}
              </button>
            ))}
          </div>
        )}

        <form
          className="cx__form"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <span className="cx__prompt" aria-hidden="true">
            ›
          </span>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="What did he do at Intercare?"
            aria-label="Your question"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" disabled={!draft.trim() || thinking}>
            ↵
          </button>
        </form>
      </div>

      <style jsx>{`
        .cx {
          position: fixed;
          inset: 0;
          /* Above the nav (50), the grain (60) and the boot overlay (100).
             A modal that leaves the site's own chrome legible on top of its
             scrim reads as broken. */
          z-index: 200;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: clamp(1rem, 10vh, 7rem) 1rem 1rem;
        }

        .cx__scrim {
          position: absolute;
          inset: 0;
          background: rgb(3 3 6 / 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: fade 0.3s var(--ease) both;
          cursor: default;
        }

        .cx__panel {
          position: relative;
          width: min(46rem, 100%);
          max-height: min(38rem, 80vh);
          display: flex;
          flex-direction: column;
          border-radius: 1rem;
          border: 1px solid var(--line-strong);
          background: rgb(11 11 17 / 0.94);
          backdrop-filter: blur(30px) saturate(150%);
          -webkit-backdrop-filter: blur(30px) saturate(150%);
          box-shadow:
            0 40px 120px -20px rgb(0 0 0 / 0.85),
            0 0 60px -30px rgb(var(--indigo) / 0.7);
          overflow: hidden;
          animation: pop 0.4s var(--ease) both;
        }

        @keyframes fade {
          from {
            opacity: 0;
          }
        }
        @keyframes pop {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.985);
          }
        }

        /* --- header ----------------------------------------------------- */

        .cx__head {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--line);
        }

        .cx__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--text-ghost);
        }
        .cx__dot[data-live] {
          background: rgb(var(--lime));
          box-shadow: 0 0 10px rgb(var(--lime) / 0.8);
        }

        .cx__title {
          font-family: var(--display);
          font-weight: 600;
          font-size: 0.9375rem;
          letter-spacing: -0.02em;
        }

        .cx__mode {
          font-family: var(--mono);
          font-size: 0.625rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin-left: auto;
        }

        .cx__x {
          font-family: var(--mono);
          font-size: 0.625rem;
          padding: 0.2rem 0.45rem;
          border-radius: 5px;
          border: 1px solid var(--line);
          color: var(--text-faint);
        }
        .cx__x:hover {
          color: var(--text);
          border-color: var(--line-strong);
        }

        /* --- log -------------------------------------------------------- */

        .cx__log {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          scroll-behavior: smooth;
        }

        .msg {
          display: flex;
          gap: 0.6rem;
          font-size: 0.9375rem;
          line-height: 1.65;
        }

        .msg[data-role="user"] {
          color: var(--text);
        }
        .msg[data-role="user"] .msg__text {
          font-family: var(--mono);
          font-size: 0.875rem;
        }

        .msg[data-role="system"] {
          color: var(--text-faint);
          font-size: 0.8125rem;
          line-height: 1.6;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid var(--line);
        }

        .msg[data-role="bot"] {
          color: var(--text-dim);
        }

        .msg__caret {
          color: rgb(var(--cyan));
          font-family: var(--mono);
          flex-shrink: 0;
        }

        .msg__body {
          min-width: 0;
          flex: 1;
        }

        .msg__text {
          white-space: pre-wrap;
          text-wrap: pretty;
        }

        /* Blinking block cursor while a reply streams. */
        .msg__cursor {
          display: inline-block;
          width: 0.5em;
          height: 1em;
          margin-left: 2px;
          vertical-align: -0.15em;
          background: rgb(var(--cyan));
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }

        .msg__sources {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.8rem;
        }
        .msg__sources span {
          font-family: var(--mono);
          font-size: 0.625rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--line);
          color: var(--text-faint);
        }

        .msg__degraded {
          margin-top: 0.7rem;
          font-family: var(--mono);
          font-size: 0.6875rem;
          line-height: 1.5;
          color: rgb(var(--amber) / 0.9);
        }

        .cx__thinking {
          display: inline-flex;
          gap: 4px;
          padding-top: 0.4rem;
        }
        .cx__thinking i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgb(var(--cyan) / 0.8);
          animation: bounce 1.1s var(--ease-io) infinite;
        }
        .cx__thinking i:nth-child(2) {
          animation-delay: 0.14s;
        }
        .cx__thinking i:nth-child(3) {
          animation-delay: 0.28s;
        }
        @keyframes bounce {
          0%,
          70%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          35% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        /* --- suggestions ------------------------------------------------- */

        .cx__suggest {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0 1rem 1rem;
        }
        .cx__suggest button {
          font-size: 0.8125rem;
          padding: 0.4rem 0.75rem;
          border-radius: 99px;
          border: 1px solid var(--line);
          color: var(--text-dim);
          transition:
            color 0.3s var(--ease),
            border-color 0.3s var(--ease),
            background 0.3s var(--ease);
        }
        .cx__suggest button:hover {
          color: var(--text);
          border-color: rgb(var(--cyan) / 0.5);
          background: rgb(var(--cyan) / 0.08);
        }

        /* --- input ------------------------------------------------------- */

        .cx__form {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1rem;
          border-top: 1px solid var(--line);
          background: rgb(255 255 255 / 0.02);
        }

        .cx__prompt {
          font-family: var(--mono);
          color: rgb(var(--cyan));
        }

        .cx__form input {
          flex: 1;
          min-width: 0;
          background: none;
          border: 0;
          outline: none;
          font-family: var(--mono);
          font-size: 0.875rem;
          color: var(--text);
        }
        .cx__form input::placeholder {
          color: var(--text-ghost);
        }

        .cx__form button {
          font-family: var(--mono);
          font-size: 0.875rem;
          width: 2rem;
          height: 2rem;
          border-radius: 7px;
          border: 1px solid var(--line);
          color: var(--text-faint);
          transition:
            color 0.3s var(--ease),
            background 0.3s var(--ease),
            border-color 0.3s var(--ease);
        }
        .cx__form button:not(:disabled):hover {
          color: #06060b;
          background: rgb(var(--cyan));
          border-color: transparent;
        }
        .cx__form button:disabled {
          opacity: 0.35;
          cursor: default;
        }

        @media (max-width: 600px) {
          .cx {
            padding-top: 1rem;
          }
          .cx__panel {
            max-height: 88vh;
          }
        }
      `}</style>
    </div>
  );
}
