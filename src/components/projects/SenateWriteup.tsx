"use client";

import { FORECAST_RACES, FORECAST_SUMMARY } from "@/data/senateForecast";
import {
  ChanceSpread,
  ChartStyles,
  ErrorBeforeAfter,
  ModelParts,
  PollCoverage,
  PollMultipliers,
  PollsVsRange,
  TileMap,
  WeightDecay,
  WhatIf,
} from "./ForecastCharts";
import { ForecastStyles, Ladder, RaceTable, SeatBar } from "./SenateForecast";

/**
 * The long write-up for the 2026 Senate forecast.
 *
 * The text is mine and the numbers are from the team's methodology, back-test
 * report and final results file. Nothing here is estimated for the page: where a
 * figure is approximate, the sentence says so.
 */

const SECTIONS = [
  ["result", "The result"],
  ["polls", "Where the polls came from"],
  ["weights", "Weighting the polls"],
  ["guess", "The starting guess"],
  ["mood", "The national mood"],
  ["simulation", "The simulation"],
  ["checking", "Testing it on past elections"],
  ["wrong", "What could go wrong"],
  ["races", "Every race"],
] as const;

export default function SenateWriteup() {
  const { csv, article, demHoldovers, repHoldovers, seatsNeeded } = FORECAST_SUMMARY;
  const safe = FORECAST_RACES.filter((r) => r.rating === "safe-r" || r.rating === "safe-d").length;
  const sumP = FORECAST_RACES.reduce((n, r) => n + r.demProb, 0);

  return (
    <div className="sf sw">
      <ForecastStyles />
      <ChartStyles />

      <nav className="sw__toc" aria-label="On this page">
        <p className="t-label">On this page</p>
        <ol>
          {SECTIONS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="result" className="sw__sec">
        <h2>The result</h2>
        <p>
          There are 35 Senate seats on the ballot this year. Democrats already hold {demHoldovers}
          {" "}seats that aren&rsquo;t up and Republicans hold {repHoldovers}, so the question is whether Democrats can win enough of the 35 to get to{" "}
          {seatsNeeded}. They need {seatsNeeded} because the vice president is a Republican and breaks ties.
        </p>
        <SeatBar />
        <p>
          In our final run on October 30, Democrats won control in <b>79.5%</b> of the simulations. The most common outcome
          was <b>53</b> Democratic seats, and 80% of the runs ended up between 49 and 56.
        </p>
        <p>
          Most of the races aren&rsquo;t close. {safe} of the 35 are rated Safe for one party. The ones that decide it are
          Iowa (Democrat 57%), Nebraska (Republican 57%), South Carolina (Republican 64%), Alaska (Democrat 66%) and Kansas
          (Democrat 66%). In Nebraska, South Dakota, Idaho and Montana the main challenger is an independent instead of a
          Democrat, so the numbers in those states are for the independent.
        </p>
        <TileMap />
        <Ladder />
        <p>
          If you add up the 35 win chances and the {demHoldovers} Democratic seats that aren&rsquo;t up, you get about{" "}
          {(demHoldovers + sumP).toFixed(1)}, which is close to the simulated median of 53.
        </p>
        <ChanceSpread />
      </section>

      <section id="polls" className="sw__sec">
        <h2>Where the polls came from</h2>
        <p>
          We pulled Senate polls from VoteHub and from the state polling tables on Wikipedia, checked the two against each
          other and removed duplicates. We only kept polls from the last 120 days, and we dropped primary polls and any poll
          where the two sources didn&rsquo;t agree. That left 576 polls in 28 states.
        </p>
        <p>
          Each poll gets turned into one number, the Democrat&rsquo;s share minus the Republican&rsquo;s. In the four states
          with an independent, it&rsquo;s the independent&rsquo;s share instead. Dr. Adler had every team remove Wedgewood
          Polls and SoCal Strategies, so those are excluded, and there&rsquo;s a test that fails if any of their polls get
          in.
        </p>
        <PollCoverage />
        <p>
          The polls aren&rsquo;t spread evenly at all. Texas has 84 and Michigan has 72, but seven states have none:
          Colorado, Delaware, New Jersey, Oregon, Virginia, West Virginia and Wyoming. Kentucky, Oklahoma and Tennessee
          have one each. In those ten states the forecast is mostly the starting guess.
        </p>
        <PollsVsRange />
        <p>
          You can see it in how sure the model is. States with 40 or more polls have an 80% range around 11 points wide,
          and the seven with no polls have a range of about 38 points. All ten of those states still come out Safe, but
          the model has a much rougher idea of the margin.
        </p>
      </section>

      <section id="weights" className="sw__sec">
        <h2>Weighting the polls</h2>
        <p>
          Some polls should count more than others. A poll from last week tells you more than one from two months ago, and
          a poll of likely voters is closer to the people who will actually vote than a poll of all adults. So every poll
          gets a weight, which is a few factors multiplied together.
        </p>
        <WeightDecay />
        <p>
          We picked 21 days for the halving. In our first version we also tried 7, 14 and 30 days, and the chance of
          Democratic control only moved between 75% and 77%, so we kept 21. We haven&rsquo;t tested it against past
          elections, though.
        </p>
        <PollMultipliers />
        <p>
          Pollsters also get ranked from 5 to 10 based on how accurate they&rsquo;ve been, which turns into a weight between
          0.70 and 1.00. A survey only counts once, and a pollster that puts out a lot of polls in one state gets turned
          down so it can&rsquo;t take over that state&rsquo;s average.
        </p>
        <p>
          We also correct for bias. If a pollster has leaned toward one party in the past, we take out part of that lean,
          but only part, since some pollsters don&rsquo;t have much history. Polls paid for by a party get their own fix. In
          past years, polls sponsored by Democrats ran about 3.4 points too good for Democrats, and polls sponsored by
          Republicans ran about 2.5 points too good for Republicans.
        </p>
        <p>
          Last, every poll is treated as off by at least 5 points, plus a 4.5 point miss that all the polls in a state
          share. The shared part matters because if a state&rsquo;s polls are all wrong in the same direction, having 20 of
          them doesn&rsquo;t help.
        </p>
      </section>

      <section id="guess" className="sw__sec">
        <h2>The starting guess</h2>
        <p>
          Before it looks at any polls, the model makes a guess for every state from how the state voted for president in
          the last two elections, how the same Senate seat went last time, and the national mood. The first two are fit on
          Senate races going back to 1984.
        </p>
        <p>
          Our first version used 1.29 times the state&rsquo;s presidential lean plus 0.35 times the last Senate margin for
          that seat. The version we submitted refits the same two terms on more history and gets 1.12 and 0.51.
        </p>
        <p>
          We also tried adding incumbency, unemployment, GDP, inflation and population change. None of them made the
          predictions on past races any better, so we left them out.
        </p>
      </section>

      <section id="mood" className="sw__sec">
        <h2>The national mood</h2>
        <p>
          Senate races tend to move together across the country, so the model needs some idea of the overall mood. It
          starts with the president&rsquo;s approval rating. Net approval is around minus 26, which is worth roughly 2.6
          points for Democrats.
        </p>
        <p>
          Approval on its own is a pretty weak signal, so the state polls are used to adjust it. After blending the two,
          Democrats end up ahead nationally by 8.9 points, give or take 2.8. The forecast is more sensitive to this than to
          anything else. Depending on how it&rsquo;s set, the chance of control goes anywhere from 64% to 79%.
        </p>
      </section>

      <section id="simulation" className="sw__sec">
        <h2>The simulation</h2>
        <p>
          In each state the model combines the starting guess with the polling average and leans toward whichever one is
          more certain. If a state has no polls, it just uses the guess. In the four states with an independent, the guess
          gets less trust, and we assume an independent who wins would caucus with Democrats 80% of the time. That 80% is
          our own assumption.
        </p>
        <p>
          Then it runs the election 50,000 times. Each run has a national swing that moves every state, and states in the
          same region or with similar politics move together. The errors also allow for more upsets than a normal bell
          curve would. The chance of control is just the share of runs where Democrats get to {seatsNeeded}.
        </p>
        <p>
          We don&rsquo;t change any numbers by hand because of news. There&rsquo;s a place in the code for adjusting single
          races, and every one of those adjustments is set to zero.
        </p>
      </section>

      <section id="checking" className="sw__sec">
        <h2>Testing it on past elections</h2>
        <p>
          A model can fit the elections it was built on and still miss the next one. So we picked the settings for the
          pollster lean fix, the sponsor fix and the minimum poll error using only 2016 and 2018. Then we scored them one
          time on 2020 and 2022, which covered 322 statewide races.
        </p>
        <ErrorBeforeAfter />
        <p>
          The changes helped a little on all three. The Brier score grades probabilities, where 0 is perfect, so going from
          0.076 to 0.069 means the win chances got a bit better.
        </p>
        <ModelParts />
        <p>
          There are a couple of things we couldn&rsquo;t test. We didn&rsquo;t have a historical approval series we could
          use, so the approval part of the national mood isn&rsquo;t tested on past years. The old poll data also
          doesn&rsquo;t say whether a poll was of likely or registered voters, so those weights aren&rsquo;t tested either.
          And with this few races, small differences could just be noise.
        </p>
      </section>

      <section id="wrong" className="sw__sec">
        <h2>What could go wrong</h2>
        <WhatIf />
        <p>
          The national mood is the biggest one. The forecast depends on it more than anything else, and changing it moves
          the odds from 64% to 79%.
        </p>
        <p>
          The polls could also be off in the same direction. If they lean Democratic as a group, our number is too high.
          Shifting every poll toward Republicans by 1 point gives about 68%, by 2 points about 55%, and by 3 points about
          40%.
        </p>
        <p>
          Ten states have one poll or none, so they mostly rest on the starting guess. How much states move together is
          set by judgment, because there isn&rsquo;t enough past data to test it. And the model doesn&rsquo;t handle ranked
          choice voting or runoffs.
        </p>
      </section>

      <section id="races" className="sw__sec">
        <h2>Every race</h2>
        <div className="sf__table">
          <RaceTable />
        </div>
        <p className="sf__links">
          <a href={csv} download>
            Download the state results (CSV)
          </a>
          <a href={article} target="_blank" rel="noreferrer">
            Read the forecast on The YIMBY Manifesto
          </a>
        </p>
        <p className="sf__credit">
          Built with Isaiah Wood, Jake Wilkinson and Xiaowen Guo in Dr. Brian Adler&rsquo;s election forecasting group at
          UMass Amherst. Poll data from VoteHub (CC BY 4.0) and the state polling tables on Wikipedia (CC BY-SA).
          Historical results from MIT Election Lab, pollster ratings from FiveThirtyEight and approval history from Gallup.
        </p>
      </section>

      <style jsx global>{`
        .sw {
          margin-top: 3.5rem;
          max-width: 46rem;
        }
        .sw__toc {
          padding: 1.25rem 1.5rem;
          border: 1px solid var(--line);
          border-radius: var(--radius);
        }
        .sw__toc ol {
          list-style: none;
          margin: 0.9rem 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
          gap: 0.5rem 1.5rem;
          counter-reset: toc;
        }
        .sw__toc li {
          counter-increment: toc;
          font-size: 0.875rem;
        }
        .sw__toc li::before {
          content: counter(toc, decimal-leading-zero);
          margin-right: 0.7rem;
          font-family: var(--mono);
          font-size: 0.6875rem;
          color: var(--text-faint);
        }
        .sw__toc a {
          color: var(--text-dim);
          transition: color 0.25s var(--ease);
        }
        .sw__toc a:hover {
          color: rgb(var(--hue));
        }

        .sw__sec {
          margin-top: 4.5rem;
          scroll-margin-top: calc(var(--bar-h) + 1.5rem);
        }
        .sw__sec h2 {
          font-family: var(--display);
          font-weight: 600;
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          letter-spacing: -0.035em;
          margin-bottom: 1.1rem;
        }
        .sw__sec > p {
          margin-top: 1.1rem;
          font-size: 1.0625rem;
          line-height: 1.75;
          color: var(--text-dim);
          text-wrap: pretty;
        }
        .sw__sec > p b,
        .sw__points b {
          color: var(--text);
          font-weight: 600;
        }

        .sw__points,
        .sw__list {
          list-style: none;
          margin: 1.25rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .sw__points li,
        .sw__list li {
          position: relative;
          padding-left: 1.2rem;
          font-size: 1.0625rem;
          line-height: 1.7;
          color: var(--text-dim);
        }
        .sw__points li::before,
        .sw__list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.7em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgb(var(--hue));
        }
        .sw__list b {
          color: var(--text);
          font-weight: 600;
        }

        .sw .sf__table {
          margin-top: 1.5rem;
        }
        .sw .sf__links {
          margin-top: 1.5rem;
        }
        .sw .sf__credit {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--line);
        }
        .sw figure {
          margin: 2.25rem 0 0;
        }
        /* Charts and the table can use the full page width; the text keeps its measure. */
        .sw {
          max-width: none;
        }
        .sw__sec > p,
        .sw__points,
        .sw__list {
          max-width: 42rem;
        }
        .sw figure,
        .sw .sf__table {
          max-width: 56rem;
        }
      `}</style>
    </div>
  );
}
