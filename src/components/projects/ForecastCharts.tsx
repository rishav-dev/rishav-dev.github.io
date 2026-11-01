"use client";

import { useMemo } from "react";
import { FORECAST_RACES, type ForecastRace, type ForecastRating } from "@/data/senateForecast";
import { ORDER, RATING_LABEL, pct } from "./SenateForecast";

/**
 * The extra charts for the Senate forecast write-up.
 *
 * Anything that comes from the results file (the map, polls per state, the
 * spread of win chances, the polls-versus-uncertainty plot) is computed from
 * FORECAST_RACES, so it cannot drift from the CSV. The other numbers (poll
 * weights, the before-and-after error, the what-if odds) are the ones in the
 * team's methodology and back-test report, typed in once here with their source
 * named in the caption.
 */

const COLOR: Record<ForecastRating, string> = {
  "safe-r": "#b8333f",
  "lean-r": "#e2848c",
  "toss-up": "#8a84a6",
  "lean-d": "#78a3de",
  "likely-d": "#4d84d4",
  "safe-d": "#2b5fb2",
};

/* --- map: one tile per state ---------------------------------------------- */

/* A tile grid, so small states are as easy to see as Texas. [column, row]. */
const GRID: Record<string, [number, number]> = {
  AK: [0, 0], ME: [10, 0],
  WI: [5, 1], VT: [9, 1], NH: [10, 1],
  WA: [0, 2], ID: [1, 2], MT: [2, 2], ND: [3, 2], MN: [4, 2], IL: [5, 2], MI: [6, 2], NY: [8, 2], MA: [9, 2],
  OR: [0, 3], NV: [1, 3], WY: [2, 3], SD: [3, 3], IA: [4, 3], IN: [5, 3], OH: [6, 3], PA: [7, 3], NJ: [8, 3], CT: [9, 3], RI: [10, 3],
  CA: [0, 4], UT: [1, 4], CO: [2, 4], NE: [3, 4], MO: [4, 4], KY: [5, 4], WV: [6, 4], VA: [7, 4], MD: [8, 4], DE: [9, 4],
  AZ: [1, 5], NM: [2, 5], KS: [3, 5], AR: [4, 5], TN: [5, 5], NC: [6, 5], SC: [7, 5],
  OK: [3, 6], LA: [4, 6], MS: [5, 6], AL: [6, 6], GA: [7, 6],
  HI: [0, 7], TX: [3, 7], FL: [8, 7],
};

export function TileMap() {
  const byAbbr = useMemo(() => new Map(FORECAST_RACES.map((r) => [r.abbr, r])), []);
  const size = 52;
  const gap = 5;
  const step = size + gap;
  const W = 11 * step - gap;
  const H = 8 * step - gap;

  return (
    <figure className="fc">
      <figcaption>
        <b>Every race on a map</b>
        <span>
          One tile per state. Colored tiles have a Senate race in 2026, and the number is the chance the Democrat (or the
          independent running against the Republican) wins. Gray tiles have no race this year.
        </span>
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="fc__map"
        role="img"
        aria-label="Tile map of the 35 Senate races colored by rating. The full list is in the table at the end of the page."
      >
        {Object.entries(GRID).map(([abbr, [c, r]]) => {
          const race = byAbbr.get(abbr);
          const x = c * step;
          const y = r * step;
          return (
            <g key={abbr}>
              {race ? (
                <>
                  <title>{`${race.state}: ${RATING_LABEL[race.rating]}. ${race.dem} has a ${pct(race.demProb)} chance.`}</title>
                  <rect x={x} y={y} width={size} height={size} rx={7} fill={COLOR[race.rating]} />
                  <text x={x + size / 2} y={y + 22} textAnchor="middle" className="fc__tile-abbr">
                    {abbr}
                  </text>
                  <text x={x + size / 2} y={y + 39} textAnchor="middle" className="fc__tile-p">
                    {pct(race.demProb)}
                  </text>
                </>
              ) : (
                <>
                  <rect x={x} y={y} width={size} height={size} rx={7} className="fc__tile-off" />
                  <text x={x + size / 2} y={y + size / 2 + 4} textAnchor="middle" className="fc__tile-offtext">
                    {abbr}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <ul className="fc__key" aria-hidden="true">
        {ORDER.map((r) => (
          <li key={r}>
            <i style={{ background: COLOR[r] }} />
            {RATING_LABEL[r]}
          </li>
        ))}
        <li>
          <i className="fc__key-off" />
          No race
        </li>
      </ul>
    </figure>
  );
}

/* --- polls per state ------------------------------------------------------- */

export function PollCoverage() {
  const races = useMemo(
    () => [...FORECAST_RACES].sort((a, b) => b.polls - a.polls || a.state.localeCompare(b.state)),
    [],
  );
  const W = 760;
  const H = 270;
  const left = 8;
  const right = 8;
  const top = 26;
  const bottom = 34;
  const max = 90;
  const slot = (W - left - right) / races.length;
  const y = (v: number) => top + (1 - v / max) * (H - top - bottom);

  return (
    <figure className="fc">
      <figcaption>
        <b>How many polls each state has</b>
        <span>
          The model used 576 polls in total, but they are spread very unevenly. Seven states have none, so those races
          rest on the starting estimate alone.
        </span>
      </figcaption>

      <div className="fc__scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="fc__wide"
          role="img"
          aria-label="Bar chart of the number of polls used in each of the 35 races, from 84 in Texas down to none in seven states."
        >
          {[0, 30, 60, 90].map((t) => (
            <g key={t}>
              <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} className="fc__grid" />
            </g>
          ))}
          {races.map((r, i) => {
            const x = left + i * slot + slot * 0.18;
            const w = slot * 0.64;
            const none = r.polls === 0;
            return (
              <g key={r.abbr}>
                <title>{`${r.state}: ${r.polls} ${r.polls === 1 ? "poll" : "polls"}`}</title>
                {none ? (
                  <rect x={x} y={y(0) - 3} width={w} height={3} className="fc__bar-none" />
                ) : (
                  <rect x={x} y={y(r.polls)} width={w} height={y(0) - y(r.polls)} rx={2} className="fc__bar" />
                )}
                {(r.polls >= 20 || none || r.polls === 1) && (
                  <text x={x + w / 2} y={y(r.polls) - 6} textAnchor="middle" className="fc__val">
                    {r.polls}
                  </text>
                )}
                <text
                  x={x + w / 2}
                  y={H - bottom + 14}
                  textAnchor="middle"
                  className={none ? "fc__abbr fc__abbr--none" : "fc__abbr"}
                >
                  {r.abbr}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}

/* --- polls against uncertainty -------------------------------------------- */

const width = (r: ForecastRace) => r.high - r.low;

export function PollsVsRange() {
  const W = 720;
  const H = 330;
  const left = 54;
  const right = 18;
  const top = 16;
  const bottom = 46;
  const xMax = 90;
  const yMin = 0;
  const yMax = 40;
  const x = (v: number) => left + (v / xMax) * (W - left - right);
  const y = (v: number) => top + (1 - (v - yMin) / (yMax - yMin)) * (H - top - bottom);

  const named = new Set(["TX", "MI", "KY", "OK", "WY"]);

  return (
    <figure className="fc">
      <figcaption>
        <b>More polls, narrower range</b>
        <span>
          Each dot is a state. Going up means the model is less sure of the margin (the width of its 80% range, in
          points). States with plenty of polls are pinned down to about 11 points. States with none are unsure by close to
          40.
        </span>
      </figcaption>

      <div className="fc__scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="fc__wide fc__wide--sm"
          role="img"
          aria-label="Scatter plot of polls used against the width of the 80 percent range for each state. States with more polls have narrower ranges."
        >
          {[0, 10, 20, 30, 40].map((t) => (
            <g key={t}>
              <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} className="fc__grid" />
              <text x={left - 10} y={y(t) + 4} textAnchor="end" className="fc__tick">
                {t}
              </text>
            </g>
          ))}
          {[0, 20, 40, 60, 80].map((t) => (
            <text key={t} x={x(t)} y={H - bottom + 18} textAnchor="middle" className="fc__tick">
              {t}
            </text>
          ))}
          <text x={(left + W - right) / 2} y={H - 6} textAnchor="middle" className="fc__axis">
            Polls used in the state
          </text>
          <text x={14} y={(top + H - bottom) / 2} textAnchor="middle" className="fc__axis" transform={`rotate(-90 14 ${(top + H - bottom) / 2})`}>
            Width of 80% range (points)
          </text>

          {FORECAST_RACES.map((r) => (
            <g key={r.abbr}>
              <title>{`${r.state}: ${r.polls} polls, 80% range ${width(r).toFixed(1)} points wide`}</title>
              <circle cx={x(r.polls)} cy={y(width(r))} r={5.5} className={r.polls === 0 ? "fc__dot fc__dot--none" : "fc__dot"} />
              {named.has(r.abbr) && (
                <text x={x(r.polls) + (r.polls > 60 ? -10 : 10)} y={y(width(r)) + 4} textAnchor={r.polls > 60 ? "end" : "start"} className="fc__dotlabel">
                  {r.state}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </figure>
  );
}

/* --- how fast a poll loses weight ------------------------------------------ */

export function WeightDecay() {
  const W = 720;
  const H = 280;
  const left = 54;
  const right = 24;
  const top = 18;
  const bottom = 46;
  const days = 120;
  const x = (d: number) => left + (d / days) * (W - left - right);
  const y = (w: number) => top + (1 - w) * (H - top - bottom);
  const weight = (d: number) => Math.pow(0.5, d / 21);

  const line = Array.from({ length: 121 }, (_, d) => `${d === 0 ? "M" : "L"}${x(d).toFixed(1)} ${y(weight(d)).toFixed(1)}`).join(" ");
  const area = `${line} L${x(days)} ${y(0)} L${x(0)} ${y(0)} Z`;
  const marks = [0, 21, 42, 63, 120];

  return (
    <figure className="fc">
      <figcaption>
        <b>A poll loses half its weight every 21 days</b>
        <span>
          Weight is 0.5 raised to (age in days divided by 21). A poll from today counts fully, one from three weeks ago
          counts half as much, and one from the edge of the 120-day window counts about 2%.
        </span>
      </figcaption>

      <div className="fc__scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="fc__wide fc__wide--sm"
          role="img"
          aria-label="Curve showing a poll's weight falling by half every 21 days, from 100 percent today to about 2 percent at 120 days."
        >
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t}>
              <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} className="fc__grid" />
              <text x={left - 10} y={y(t) + 4} textAnchor="end" className="fc__tick">
                {Math.round(t * 100)}%
              </text>
            </g>
          ))}
          {[0, 30, 60, 90, 120].map((t) => (
            <text key={t} x={x(t)} y={H - bottom + 18} textAnchor="middle" className="fc__tick">
              {t}
            </text>
          ))}
          <text x={(left + W - right) / 2} y={H - 6} textAnchor="middle" className="fc__axis">
            Age of the poll (days)
          </text>

          <path d={area} className="fc__area" />
          <path d={line} className="fc__line" />
          {marks.map((d) => (
            <g key={d}>
              <circle cx={x(d)} cy={y(weight(d))} r={4.5} className="fc__pt" />
              <text x={x(d) + (d === 0 ? 10 : 0)} y={y(weight(d)) - (d === 0 ? -4 : 12)} textAnchor={d === 0 ? "start" : "middle"} className="fc__val">
                {weight(d) >= 0.1 ? `${Math.round(weight(d) * 1000) / 10}%` : `${(weight(d) * 100).toFixed(0)}%`}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </figure>
  );
}

/* --- small horizontal bars used by several charts -------------------------- */

interface Bar {
  label: string;
  value: number;
  text: string;
  tone?: "main" | "alt" | "muted";
}

function HBars({ rows, max, mark, ariaLabel }: { rows: Bar[]; max: number; mark?: { at: number; label: string }; ariaLabel: string }) {
  return (
    <ul className="hb" role="img" aria-label={ariaLabel}>
      {rows.map((r) => (
        <li key={r.label}>
          <span className="hb__label">{r.label}</span>
          <span className="hb__track">
            <i className={`hb__fill hb__fill--${r.tone ?? "main"}`} style={{ width: `${(r.value / max) * 100}%` }} />
            {mark && <em className="hb__mark" style={{ left: `${(mark.at / max) * 100}%` }} title={mark.label} />}
          </span>
          <b className="hb__value">{r.text}</b>
        </li>
      ))}
    </ul>
  );
}

/* --- the multipliers on a poll --------------------------------------------- */

export function PollMultipliers() {
  return (
    <figure className="fc">
      <figcaption>
        <b>What else changes a poll&rsquo;s weight</b>
        <span>
          These are multiplied together with the age weight. A poll of likely voters from a well-rated, nonpartisan
          pollster keeps almost all of its weight. A party-sponsored generic poll of all adults keeps a lot less.
        </span>
      </figcaption>

      <div className="fc__group">
        <h4>Who was asked</h4>
        <HBars
          ariaLabel="Weights by population surveyed: likely voters 1.0, registered voters 0.9, all adults 0.8."
          max={1}
          rows={[
            { label: "Likely voters", value: 1, text: "1.00" },
            { label: "Registered voters", value: 0.9, text: "0.90" },
            { label: "All adults", value: 0.8, text: "0.80" },
          ]}
        />
      </div>
      <div className="fc__group">
        <h4>Other adjustments</h4>
        <HBars
          ariaLabel="Weights for other poll types: party-sponsored 0.8, generic ballot 0.75, pollster track record between 0.70 and 1.00."
          max={1}
          rows={[
            { label: "Sponsored by a party", value: 0.8, text: "0.80", tone: "alt" },
            { label: "Generic (party only)", value: 0.75, text: "0.75", tone: "alt" },
            { label: "Worst-rated pollster", value: 0.7, text: "0.70", tone: "alt" },
            { label: "Best-rated pollster", value: 1, text: "1.00", tone: "alt" },
          ]}
        />
      </div>
    </figure>
  );
}

/* --- before and after the changes ------------------------------------------ */

export function ErrorBeforeAfter() {
  return (
    <figure className="fc" style={{ ["--lab" as string]: "3.2rem" }}>
      <figcaption>
        <b>Did the changes help on past elections?</b>
        <span>
          We chose the settings using the 2016 and 2018 elections, then scored them once on 2020 and 2022, which the
          settings never saw. Lower is better in all three.
        </span>
      </figcaption>

      <div className="fc__pair">
        <div className="fc__group">
          <h4>Poll error, all 322 statewide races (points)</h4>
          <HBars
            ariaLabel="Average poll error across 322 races fell from 7.27 points to 6.80 points."
            max={9}
            rows={[
              { label: "Before", value: 7.27, text: "7.27", tone: "muted" },
              { label: "After", value: 6.8, text: "6.80" },
            ]}
          />
        </div>
        <div className="fc__group">
          <h4>Forecast error, 161 Senate races (points)</h4>
          <HBars
            ariaLabel="Senate-only forecast error fell from 8.33 points to 7.68 points."
            max={9}
            rows={[
              { label: "Before", value: 8.33, text: "8.33", tone: "muted" },
              { label: "After", value: 7.68, text: "7.68" },
            ]}
          />
        </div>
        <div className="fc__group">
          <h4>Brier score, 161 Senate races</h4>
          <HBars
            ariaLabel="Senate-only Brier score fell from 0.076 to 0.069."
            max={0.09}
            rows={[
              { label: "Before", value: 0.076, text: "0.076", tone: "muted" },
              { label: "After", value: 0.069, text: "0.069" },
            ]}
          />
        </div>
      </div>
    </figure>
  );
}

/* --- polls only, starting guess only, both --------------------------------- */

export function ModelParts() {
  return (
    <figure className="fc">
      <figcaption>
        <b>Polls, starting guess, or both?</b>
        <span>
          The back-test also scores the two pieces of the model on their own, on the same 161 Senate races from 2020 and
          2022. The blend has the best Brier score, which measures how good the win probabilities are. But the starting
          guess alone had a smaller error in the margin. With only 161 races, I would not read much more into it than that.
        </span>
      </figcaption>

      <div className="fc__pair">
        <div className="fc__group">
          <h4>Error in the margin (points)</h4>
          <HBars
            ariaLabel="Margin error on 161 Senate races: polls only 8.32, starting guess only 6.49, both together 7.68."
            max={9}
            rows={[
              { label: "Polls only", value: 8.32, text: "8.32", tone: "muted" },
              { label: "Starting guess only", value: 6.49, text: "6.49", tone: "muted" },
              { label: "Both (the model)", value: 7.68, text: "7.68" },
            ]}
          />
        </div>
        <div className="fc__group">
          <h4>Brier score (win probabilities)</h4>
          <HBars
            ariaLabel="Brier score on 161 Senate races: polls only 0.075, starting guess only 0.096, both together 0.069."
            max={0.11}
            rows={[
              { label: "Polls only", value: 0.075, text: "0.075", tone: "muted" },
              { label: "Starting guess only", value: 0.096, text: "0.096", tone: "muted" },
              { label: "Both (the model)", value: 0.069, text: "0.069" },
            ]}
          />
        </div>
      </div>
    </figure>
  );
}

/* --- what-if odds ---------------------------------------------------------- */

export function WhatIf() {
  return (
    <figure className="fc">
      <figcaption>
        <b>How the 79.5% moves when an assumption changes</b>
        <span>
          Chance Democrats control the Senate. The line is 50%. The poll shifts move every poll toward the Republican by
          the same amount, to see how much the forecast leans on the polls being right on average. The odds for the
          shifts and the other versions are the approximate figures from our methodology.
        </span>
      </figcaption>

      <HBars
        ariaLabel="Chance Democrats control the Senate: official forecast 79.5 percent, original version about 77, lowest national mood setting 64, polls shifted 1 point toward Republicans about 68, 2 points about 55, 3 points about 40."
        max={100}
        mark={{ at: 50, label: "50%" }}
        rows={[
          { label: "Our forecast", value: 79.5, text: "79.5%" },
          { label: "Original version", value: 77, text: "about 77%", tone: "muted" },
          { label: "Polls 1 point more R", value: 68, text: "about 68%", tone: "alt" },
          { label: "Lowest national mood", value: 64, text: "64%", tone: "alt" },
          { label: "Polls 2 points more R", value: 55, text: "about 55%", tone: "alt" },
          { label: "Polls 3 points more R", value: 40, text: "about 40%", tone: "alt" },
        ]}
      />
    </figure>
  );
}

/* --- how lopsided the 35 races are ----------------------------------------- */

export function ChanceSpread() {
  const bins = useMemo(() => {
    const counts = Array.from({ length: 10 }, () => 0);
    for (const r of FORECAST_RACES) counts[Math.min(9, Math.floor(r.demProb * 10))] += 1;
    return counts;
  }, []);
  const max = Math.max(...bins);

  const W = 720;
  const H = 260;
  const left = 38;
  const right = 12;
  const top = 22;
  const bottom = 46;
  const slot = (W - left - right) / 10;
  const y = (v: number) => top + (1 - v / (max + 1)) * (H - top - bottom);

  return (
    <figure className="fc">
      <figcaption>
        <b>Most races are not close</b>
        <span>
          Races grouped by the Democrat&rsquo;s chance of winning. {bins[0] + bins[9]} of the 35 sit at the very
          ends, below 10% or above 90%. Only {bins[4] + bins[5]} fall between 40% and 60%.
        </span>
      </figcaption>

      <div className="fc__scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="fc__wide fc__wide--sm"
          role="img"
          aria-label={`Histogram of the 35 races by the Democrat's chance of winning, in ten groups. The counts from 0 to 100 percent are ${bins.join(", ")}.`}
        >
          {[0, 5, 10].filter((t) => t <= max + 1).map((t) => (
            <g key={t}>
              <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} className="fc__grid" />
              <text x={left - 10} y={y(t) + 4} textAnchor="end" className="fc__tick">
                {t}
              </text>
            </g>
          ))}
          {bins.map((n, i) => {
            const x = left + i * slot + slot * 0.1;
            const w = slot * 0.8;
            const mid = (i + 0.5) / 10;
            const color = mid < 0.4 ? COLOR["safe-r"] : mid < 0.6 ? COLOR["toss-up"] : COLOR["safe-d"];
            return (
              <g key={i}>
                <title>{`${i * 10}% to ${(i + 1) * 10}%: ${n} ${n === 1 ? "race" : "races"}`}</title>
                <rect x={x} y={y(n)} width={w} height={y(0) - y(n)} rx={3} fill={color} opacity={0.9} />
                {n > 0 && (
                  <text x={x + w / 2} y={y(n) - 6} textAnchor="middle" className="fc__val">
                    {n}
                  </text>
                )}
                <text x={x + w / 2} y={H - bottom + 18} textAnchor="middle" className="fc__tick">
                  {i * 10}-{(i + 1) * 10}
                </text>
              </g>
            );
          })}
          <text x={(left + W - right) / 2} y={H - 6} textAnchor="middle" className="fc__axis">
            Democrat&rsquo;s chance of winning (%)
          </text>
        </svg>
      </div>
    </figure>
  );
}

/* --- styles ----------------------------------------------------------------- */

export function ChartStyles() {
  return (
    <style jsx global>{`
      .fc__map {
        width: 100%;
        max-width: 40rem;
        height: auto;
        display: block;
      }
      .fc__tile-abbr {
        fill: #fff;
        font-family: var(--mono);
        font-size: 13px;
        font-weight: 600;
      }
      .fc__tile-p {
        fill: #fff;
        font-family: var(--mono);
        font-size: 11px;
        opacity: 0.92;
      }
      .fc__tile-off {
        fill: none;
        stroke: var(--line-strong);
        stroke-width: 1;
        stroke-dasharray: 3 3;
      }
      .fc__tile-offtext {
        fill: var(--text-faint);
        font-family: var(--mono);
        font-size: 11px;
        opacity: 0.7;
      }
      .fc__key {
        list-style: none;
        margin: 1rem 0 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem 1.1rem;
        font-size: 0.75rem;
        color: var(--text-dim);
      }
      .fc__key li {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
      }
      .fc__key i {
        width: 10px;
        height: 10px;
        border-radius: 3px;
        display: inline-block;
      }
      .fc__key .fc__key-off {
        background: none;
        border: 1px dashed var(--line-strong);
      }

      .fc__scroll {
        overflow-x: auto;
      }
      .fc__wide {
        display: block;
        width: 100%;
        min-width: 560px;
        height: auto;
      }
      .fc__wide--sm {
        min-width: 480px;
      }
      .fc__grid {
        stroke: var(--line);
        stroke-width: 1;
      }
      .fc__tick,
      .fc__axis,
      .fc__val,
      .fc__abbr,
      .fc__dotlabel {
        font-family: var(--mono);
        fill: var(--text-faint);
        font-size: 10.5px;
      }
      .fc__axis {
        font-size: 11px;
      }
      .fc__val {
        fill: var(--text);
        font-size: 11px;
      }
      .fc__abbr--none {
        fill: var(--text);
      }
      .fc__dotlabel {
        fill: var(--text-dim);
        font-size: 11px;
      }
      .fc__bar {
        fill: rgb(var(--cyan));
        opacity: 0.85;
      }
      .fc__bar-none {
        fill: rgb(var(--indigo));
      }
      .fc__dot {
        fill: rgb(var(--cyan));
        fill-opacity: 0.8;
        stroke: var(--void);
        stroke-width: 1.5;
      }
      .fc__dot--none {
        fill: rgb(var(--indigo));
        fill-opacity: 0.95;
      }
      .fc__line {
        fill: none;
        stroke: rgb(var(--cyan));
        stroke-width: 2.5;
      }
      .fc__area {
        fill: rgb(var(--cyan) / 0.1);
      }
      .fc__pt {
        fill: rgb(var(--cyan));
        stroke: var(--void);
        stroke-width: 2;
      }

      .fc__pair {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
        gap: 1.75rem 2.5rem;
      }
      .fc__group h4 {
        margin: 0 0 0.8rem;
        font-family: var(--mono);
        font-size: 0.6875rem;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-faint);
      }
      .fc__group + .fc__group {
        margin-top: 1.5rem;
      }
      .fc__pair .fc__group + .fc__group {
        margin-top: 0;
      }
      .fc__pair .hb li {
        grid-template-columns: var(--lab, 8.5rem) 1fr 3.4rem;
        gap: 0.6rem;
      }

      .hb {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
      }
      .hb li {
        display: grid;
        grid-template-columns: 9.5rem 1fr 4.6rem;
        align-items: center;
        gap: 0.9rem;
        font-size: 0.8125rem;
      }
      .hb__label {
        color: var(--text-dim);
      }
      .hb__track {
        position: relative;
        height: 10px;
        border-radius: 99px;
        background: rgb(255 255 255 / 0.07);
        overflow: visible;
      }
      .hb__fill {
        display: block;
        height: 100%;
        border-radius: 99px;
      }
      .hb__fill--main {
        background: rgb(var(--cyan));
      }
      .hb__fill--alt {
        background: rgb(var(--indigo));
      }
      .hb__fill--muted {
        background: rgb(255 255 255 / 0.28);
      }
      .hb__mark {
        position: absolute;
        top: -4px;
        bottom: -4px;
        width: 2px;
        background: var(--text);
        opacity: 0.7;
      }
      .hb__value {
        font-family: var(--mono);
        font-weight: 500;
        font-size: 0.75rem;
        text-align: right;
        color: var(--text);
        font-variant-numeric: tabular-nums;
      }

      @media (max-width: 560px) {
        .hb li {
          grid-template-columns: 7rem 1fr 4rem;
          gap: 0.6rem;
        }
      }
    `}</style>
  );
}
