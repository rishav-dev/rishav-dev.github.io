"use client";

import { useMemo, useState } from "react";
import {
  FORECAST_RACES,
  FORECAST_SUMMARY,
  type ForecastRace,
  type ForecastRating,
} from "@/data/senateForecast";

/**
 * The results of the 2026 Senate forecast, from the team's final run.
 *
 * Three views of the same 35 races: where the Senate stands, how the closest
 * races look once uncertainty is drawn in, and a table of every race that can
 * be filtered and sorted. Everything is computed from the data file, so the
 * page cannot disagree with the CSV it links to.
 */

export const RATING_LABEL: Record<ForecastRating, string> = {
  "safe-r": "Safe R",
  "lean-r": "Lean R",
  "toss-up": "Toss-up",
  "lean-d": "Lean D",
  "likely-d": "Likely D",
  "safe-d": "Safe D",
};

/* Left to right, Republican to Democratic, the order the seats are drawn in. */
export const ORDER: ForecastRating[] = ["safe-r", "lean-r", "toss-up", "lean-d", "likely-d", "safe-d"];

export const pct = (p: number) => (p >= 0.995 ? ">99%" : p <= 0.005 ? "<1%" : `${Math.round(p * 100)}%`);

export const leaning = (m: number) => `${m >= 0 ? "D" : "R"}+${Math.abs(m).toFixed(1)}`;

type SortKey = "close" | "dem" | "rep" | "state" | "polls";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "close", label: "Closest first" },
  { key: "dem", label: "Most Democratic" },
  { key: "rep", label: "Most Republican" },
  { key: "state", label: "State, A to Z" },
  { key: "polls", label: "Most polls" },
];

function sortRaces(races: ForecastRace[], key: SortKey): ForecastRace[] {
  const list = [...races];
  switch (key) {
    case "dem":
      return list.sort((a, b) => b.demProb - a.demProb);
    case "rep":
      return list.sort((a, b) => a.demProb - b.demProb);
    case "state":
      return list.sort((a, b) => a.state.localeCompare(b.state));
    case "polls":
      return list.sort((a, b) => b.polls - a.polls || a.state.localeCompare(b.state));
    default:
      return list.sort((a, b) => Math.abs(a.demProb - 0.5) - Math.abs(b.demProb - 0.5));
  }
}

/* --- the Senate as a bar ------------------------------------------------- */

export function SeatBar() {
  const counts = useMemo(() => {
    const c = Object.fromEntries(ORDER.map((r) => [r, 0])) as Record<ForecastRating, number>;
    for (const race of FORECAST_RACES) c[race.rating] += 1;
    return c;
  }, []);

  const { demHoldovers, repHoldovers, seatsNeeded } = FORECAST_SUMMARY;
  const total = demHoldovers + repHoldovers + FORECAST_RACES.length;
  /* Democrats need 51 seats, so everything to the right of this line, counting
     from the Democratic end, is the 51. */
  const line = ((total - seatsNeeded) / total) * 100;

  const segments: { key: string; label: string; n: number; cls: string }[] = [
    { key: "up-r", label: "Not up (R)", n: repHoldovers, cls: "r-hold" },
    ...ORDER.map((r) => ({ key: r, label: RATING_LABEL[r], n: counts[r], cls: r })),
    { key: "up-d", label: "Not up (D)", n: demHoldovers, cls: "d-hold" },
  ];

  return (
    <figure className="sb">
      <figcaption>
        <b>Where the Senate stands</b>
        <span>Democrats need {seatsNeeded} seats. Everything right of the line is {seatsNeeded}.</span>
      </figcaption>

      <div className="sb__bar" role="img" aria-label={segments.map((s) => `${s.label}: ${s.n}`).join(", ")}>
        {segments.map((s) => (
          <span key={s.key} className={`sb__seg sb__seg--${s.cls}`} style={{ flexGrow: s.n }} title={`${s.label}: ${s.n}`}>
            {s.n >= 2 ? s.n : ""}
          </span>
        ))}
        <i className="sb__line" style={{ left: `${line}%` }} aria-hidden="true" />
      </div>

      <ul className="sb__key" aria-hidden="true">
        {segments.map((s) => (
          <li key={s.key}>
            <i className={`sb__swatch sb__seg--${s.cls}`} />
            {s.label} <b>{s.n}</b>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* --- the closest races, with their uncertainty --------------------------- */

const LO = -20;
const HI = 14;

export function Ladder() {
  const races = useMemo(
    () => sortRaces(FORECAST_RACES, "close").slice(0, 12).sort((a, b) => b.margin - a.margin),
    [],
  );

  const W = 760;
  const left = 150;
  const right = 96;
  const rowH = 30;
  const top = 10;
  const H = top + races.length * rowH + 44;
  const x = (m: number) => left + ((Math.min(HI, Math.max(LO, m)) - LO) / (HI - LO)) * (W - left - right);

  return (
    <figure className="ld">
      <figcaption>
        <b>The 12 closest races</b>
        <span>
          Expected margin with the model&rsquo;s 80% range. The number in brackets is how many polls the state has.
        </span>
      </figcaption>

      <div className="ld__scroll">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Expected margin and 80% range for the 12 closest Senate races. The same numbers are in the table below."
      >
        {[-15, -10, -5, 0, 5, 10].map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={top} y2={top + races.length * rowH} className={t === 0 ? "ld__zero" : "ld__grid"} />
            <text x={x(t)} y={top + races.length * rowH + 18} textAnchor="middle" className="ld__tick">
              {t === 0 ? "0" : t > 0 ? `D+${t}` : `R+${-t}`}
            </text>
          </g>
        ))}

        {races.map((r, i) => {
          const y = top + i * rowH + rowH / 2;
          const dem = r.margin >= 0;
          return (
            <g key={r.abbr} className={dem ? "ld__row ld__row--d" : "ld__row ld__row--r"}>
              <title>
                {`${r.state}: ${r.dem} ${pct(r.demProb)} to win. Expected margin ${leaning(r.margin)}, 80% range ${leaning(r.low)} to ${leaning(r.high)}. ${r.polls} polls.`}
              </title>
              <text x={left - 12} y={y + 4} textAnchor="end" className="ld__label">
                {r.state} <tspan className="ld__n">({r.polls})</tspan>
              </text>
              <line x1={x(r.low)} x2={x(r.high)} y1={y} y2={y} className="ld__range" />
              <circle cx={x(r.margin)} cy={y} r={5} className="ld__dot" />
              <text x={W - right + 14} y={y + 4} className="ld__p">
                {pct(r.demProb)}
              </text>
            </g>
          );
        })}

        <text x={W - right + 14} y={top - 1} className="ld__head">
          D/opp wins
        </text>
      </svg>
      </div>
    </figure>
  );
}

/* --- every race ---------------------------------------------------------- */

export function RaceTable() {
  const [filter, setFilter] = useState<ForecastRating | "all">("all");
  const [sort, setSort] = useState<SortKey>("close");

  const counts = useMemo(() => {
    const c = Object.fromEntries(ORDER.map((r) => [r, 0])) as Record<ForecastRating, number>;
    for (const race of FORECAST_RACES) c[race.rating] += 1;
    return c;
  }, []);

  const rows = useMemo(
    () => sortRaces(FORECAST_RACES.filter((r) => filter === "all" || r.rating === filter), sort),
    [filter, sort],
  );

  return (
    <div className="rt">
      <div className="rt__tools">
        <div className="rt__chips" role="group" aria-label="Filter by rating">
          <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
            All {FORECAST_RACES.length}
          </button>
          {ORDER.map((r) => (
            <button key={r} type="button" aria-pressed={filter === r} onClick={() => setFilter(r)} className={`rt__chip rt__chip--${r}`}>
              {RATING_LABEL[r]} {counts[r]}
            </button>
          ))}
        </div>

        <label className="rt__sort">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rt__scroll">
        <table>
          <caption className="sr-only">Forecast for each of the 35 Senate races</caption>
          <thead>
            <tr>
              <th scope="col">State</th>
              <th scope="col">Democrat / opposition</th>
              <th scope="col">Republican</th>
              <th scope="col" className="rt__num">
                Chance D/opp wins
              </th>
              <th scope="col">Rating</th>
              <th scope="col" className="rt__num">
                Polls
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.abbr}>
                <th scope="row">{r.state}</th>
                <td>
                  {r.dem}
                  {r.independent && (
                    <abbr className="rt__ind" title="Independent challenger">
                      {" "}
                      (I)
                    </abbr>
                  )}
                </td>
                <td>{r.rep}</td>
                <td className="rt__num">
                  <span className="rt__prob">
                    <i style={{ width: `${r.demProb * 100}%` }} className={r.demProb >= 0.5 ? "rt__fill rt__fill--d" : "rt__fill rt__fill--r"} />
                  </span>
                  <b>{pct(r.demProb)}</b>
                </td>
                <td>
                  <span className={`rt__rating rt__chip--${r.rating}`}>{RATING_LABEL[r.rating]}</span>
                </td>
                <td className="rt__num">{r.polls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="rt__note">
        (I) means the challenger is an independent. In those four states the model trusts its starting guess less, and we
        assume an independent who wins would caucus with Democrats 80% of the time. Ratings: Safe is 85% or more, Likely
        70 to 85%, Lean 60 to 70%, and Toss-up under 60%.
      </p>
    </div>
  );
}

/** The styles for the results charts and the table. Rendered once, by the write-up. */
export function ForecastStyles() {
  return (
      <style jsx global>{`
        .sf {
          margin-top: 3.5rem;
        }

        .sf figure {
          margin: 2.25rem 0 0;
        }
        .sf figcaption {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-bottom: 1rem;
        }
        .sf figcaption b {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.0625rem;
          letter-spacing: -0.02em;
        }
        .sf figcaption span {
          font-size: 0.875rem;
          color: var(--text-dim);
          max-width: 46rem;
          line-height: 1.55;
        }

        /* --- seat bar ---------------------------------------------------- */

        .sb__bar {
          position: relative;
          display: flex;
          gap: 2px;
          height: 2.6rem;
        }
        .sb__seg {
          display: grid;
          place-items: center;
          font-family: var(--mono);
          font-size: 0.75rem;
          font-weight: 500;
          color: #fff;
          min-width: 3px;
        }
        .sb__seg:first-child {
          border-radius: 0.5rem 0 0 0.5rem;
        }
        .sb__seg:last-of-type {
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .sb__line {
          position: absolute;
          top: -0.5rem;
          bottom: -0.5rem;
          width: 2px;
          background: var(--text);
          pointer-events: none;
        }
        .sb__seg--r-hold {
          background: #4a2a31;
        }
        .sb__seg--safe-r {
          background: #b8333f;
        }
        .sb__seg--lean-r {
          background: #e2848c;
        }
        .sb__seg--toss-up {
          background: #8a84a6;
        }
        .sb__seg--lean-d {
          background: #78a3de;
        }
        .sb__seg--likely-d {
          background: #4d84d4;
        }
        .sb__seg--safe-d {
          background: #2b5fb2;
        }
        .sb__seg--d-hold {
          background: #1b3763;
        }

        .sb__key {
          list-style: none;
          margin: 0.9rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem 1.25rem;
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .sb__key li {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .sb__key b {
          font-family: var(--mono);
          font-weight: 500;
          color: var(--text);
        }
        .sb__swatch {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          display: inline-block;
        }

        /* --- ladder ------------------------------------------------------ */

        .ld__scroll {
          overflow-x: auto;
        }
        .sf .ld svg {
          min-width: 600px;
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .ld__grid {
          stroke: var(--line);
          stroke-width: 1;
        }
        .ld__zero {
          stroke: var(--text-faint);
          stroke-width: 1;
          stroke-dasharray: 3 3;
        }
        .ld__tick,
        .ld__head,
        .ld__n {
          fill: var(--text-faint);
          font-family: var(--mono);
          font-size: 10.5px;
        }
        .ld__label {
          fill: var(--text);
          font-size: 13px;
        }
        .ld__p {
          fill: var(--text);
          font-family: var(--mono);
          font-size: 12px;
        }
        .ld__range {
          stroke-width: 6;
          stroke-linecap: round;
          opacity: 0.35;
        }
        .ld__row--d .ld__range {
          stroke: #4d84d4;
        }
        .ld__row--r .ld__range {
          stroke: #c4444f;
        }
        .ld__row--d .ld__dot {
          fill: #78a3de;
        }
        .ld__row--r .ld__dot {
          fill: #e2848c;
        }
        .ld__dot {
          stroke: var(--void);
          stroke-width: 2;
        }

        /* --- table ------------------------------------------------------- */

        .sf__table {
          margin-top: 3rem;
        }
        .sf__table h3 {
          font-family: var(--display);
          font-weight: 600;
          font-size: 1.0625rem;
          letter-spacing: -0.02em;
        }

        .rt__tools {
          margin-top: 1rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem 1.5rem;
        }
        .rt__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .rt__chips button {
          padding: 0.35rem 0.8rem;
          border-radius: 99px;
          border: 1px solid var(--line-strong);
          font-size: 0.8125rem;
          color: var(--text-dim);
          transition:
            color 0.25s var(--ease),
            border-color 0.25s var(--ease),
            background 0.25s var(--ease);
        }
        .rt__chips button:hover {
          color: var(--text);
        }
        .rt__chips button[aria-pressed="true"] {
          color: var(--text);
          border-color: rgb(var(--cyan) / 0.7);
          background: rgb(var(--cyan) / 0.1);
        }

        .rt__sort {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.8125rem;
          color: var(--text-faint);
        }
        .rt__sort select {
          appearance: none;
          padding: 0.4rem 1.9rem 0.4rem 0.9rem;
          border-radius: 99px;
          border: 1px solid var(--line-strong);
          background-color: rgb(255 255 255 / 0.03);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8l3.5-3.5' stroke='%23b9b9c6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          color: var(--text);
          font: inherit;
          font-size: 0.8125rem;
          cursor: pointer;
        }
        .rt__sort option {
          background: #0b0b11;
        }

        .rt__scroll {
          margin-top: 1rem;
          overflow-x: auto;
          border: 1px solid var(--line);
          border-radius: 1rem;
        }
        .sf table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        .sf th,
        .sf td {
          padding: 0.65rem 1rem;
          text-align: left;
          border-top: 1px solid var(--line);
          white-space: nowrap;
        }
        .sf thead th {
          border-top: 0;
          font-family: var(--mono);
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .sf tbody th {
          font-weight: 500;
        }
        .sf td {
          color: var(--text-dim);
        }
        .rt__num {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .sf td.rt__num b {
          display: inline-block;
          min-width: 3.2rem;
          font-weight: 500;
          color: var(--text);
        }
        .rt__ind {
          text-decoration: none;
          color: var(--text-faint);
        }

        .rt__prob {
          display: inline-block;
          vertical-align: middle;
          width: 5.5rem;
          height: 6px;
          margin-right: 0.6rem;
          border-radius: 99px;
          background: rgb(255 255 255 / 0.08);
          overflow: hidden;
        }
        .rt__fill {
          display: block;
          height: 100%;
          border-radius: 99px;
        }
        .rt__fill--d {
          background: #4d84d4;
        }
        .rt__fill--r {
          background: #4d84d4;
          opacity: 0.55;
        }

        .rt__rating {
          display: inline-block;
          padding: 0.15rem 0.55rem;
          border-radius: 5px;
          font-family: var(--mono);
          font-size: 0.6875rem;
        }
        .rt__chip--safe-r {
          box-shadow: inset 0 0 0 1px #b8333f;
        }
        .rt__chip--lean-r {
          box-shadow: inset 0 0 0 1px #e2848c;
        }
        .rt__chip--toss-up {
          box-shadow: inset 0 0 0 1px #8a84a6;
        }
        .rt__chip--lean-d {
          box-shadow: inset 0 0 0 1px #78a3de;
        }
        .rt__chip--likely-d {
          box-shadow: inset 0 0 0 1px #4d84d4;
        }
        .rt__chip--safe-d {
          box-shadow: inset 0 0 0 1px #2b5fb2;
        }
        .rt__chips .rt__chip--safe-r,
        .rt__chips .rt__chip--lean-r,
        .rt__chips .rt__chip--toss-up,
        .rt__chips .rt__chip--lean-d,
        .rt__chips .rt__chip--likely-d,
        .rt__chips .rt__chip--safe-d {
          box-shadow: none;
        }

        .rt__note {
          margin-top: 1rem;
          font-size: 0.8125rem;
          line-height: 1.6;
          color: var(--text-faint);
          max-width: 50rem;
        }

        .sf__links {
          margin-top: 2rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 2rem;
          font-family: var(--mono);
          font-size: 0.8125rem;
        }
        .sf__links a {
          color: rgb(var(--cyan));
          border-bottom: 1px solid rgb(var(--cyan) / 0.35);
          padding-bottom: 1px;
        }
        .sf__links a:hover {
          border-bottom-color: rgb(var(--cyan));
        }
        .sf__credit {
          margin-top: 1.25rem;
          font-size: 0.75rem;
          line-height: 1.6;
          color: var(--text-faint);
          max-width: 50rem;
        }
      `}</style>
  );
}
