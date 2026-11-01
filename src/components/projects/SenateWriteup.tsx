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
  ["short-version", "The short version"],
  ["result", "The result"],
  ["polls", "Where the polls came from"],
  ["weights", "How I weight each poll"],
  ["guess", "The starting guess for each state"],
  ["mood", "The national mood"],
  ["simulation", "Running the election 50,000 times"],
  ["checking", "Checking it on past elections"],
  ["wrong", "What could be wrong"],
  ["races", "Every race"],
  ["next", "What I would do next"],
] as const;

export default function SenateWriteup() {
  const { asOf, electionDay, csv, article, demHoldovers, repHoldovers, seatsNeeded } = FORECAST_SUMMARY;
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

      <section id="short-version" className="sw__sec">
        <h2>The short version</h2>
        <ul className="sw__points">
          <li>
            Democrats have a <b>79.5%</b> chance of controlling the Senate. They need {seatsNeeded} seats, because a
            Republican vice president breaks a 50-50 tie.
          </li>
          <li>
            The most likely result is <b>53</b> Democratic seats, and 80% of the simulations land between 49 and 56.
          </li>
          <li>
            Most of the 35 races are not close. {safe} of them are rated Safe for one party, so the Senate comes down to a
            handful of states.
          </li>
          <li>
            The biggest unknown is the national mood. Depending on how it is set, the odds go from 64% to 79%.
          </li>
        </ul>
        <p>
          Everything on this page is the forecast as of {asOf}, four days before the election on {electionDay}.
        </p>
      </section>

      <section id="result" className="sw__sec">
        <h2>The result</h2>
        <p>
          The Senate has 100 seats. This year 35 of them are on the ballot, and {demHoldovers} Democratic and{" "}
          {repHoldovers} Republican seats are not up, so each side starts with a base. Democrats need {seatsNeeded} to
          control the chamber, and the bar below shows how the 35 races stack up on top of that base.
        </p>
        <SeatBar />
        <p>
          The five closest races are Iowa (Democrat 57%), Nebraska (Republican 57%), South Carolina (Republican 64%),
          Alaska (Democrat 66%) and Kansas (Democrat 66%). In four states (Nebraska, South Dakota, Idaho and Montana) the
          main challenger is an independent instead of a Democrat. The table at the bottom marks them.
        </p>
        <TileMap />
        <Ladder />
        <p>
          As a quick check on the simulation, I added up the 35 individual win chances and the {demHoldovers} Democratic
          seats that are not up. That gives about {(demHoldovers + sumP).toFixed(1)} seats, which lines up with the
          simulated median of 53.
        </p>
        <ChanceSpread />
      </section>

      <section id="polls" className="sw__sec">
        <h2>Where the polls came from</h2>
        <p>
          We pull Senate polls from two places, VoteHub and Wikipedia&rsquo;s state polling tables. We compare them
          against each other and remove duplicates. Then we keep only the last 120 days and drop primary polls, along with
          any poll where the two sources disagree. That leaves 576 polls in 28 states.
        </p>
        <p>
          Each poll becomes a single number: the Democrat&rsquo;s share minus the Republican&rsquo;s. In Nebraska, South
          Dakota, Idaho and Montana, where an independent is running instead of a Democrat, it is the independent&rsquo;s
          share. Two pollsters, Wedgewood Polls and SoCal Strategies, were removed at Dr. Adler&rsquo;s direction, and the
          tests check that none of their polls get used.
        </p>
        <PollCoverage />
        <p>
          Seven states have no polls at all: Colorado, Delaware, New Jersey, Oregon, Virginia, West Virginia and Wyoming.
          Kentucky, Oklahoma and Tennessee have one each. For those ten, the forecast is mostly the starting guess I
          describe below, and the chart shows what that costs.
        </p>
        <PollsVsRange />
        <p>
          The model shows this too. The races with 40 or more polls have an 80% range about 11 points wide, while the
          seven with no polls have a range close to 38 points wide. All ten states with one poll or none end up rated Safe,
          but the model is much less sure about how big the margin is.
        </p>
      </section>

      <section id="weights" className="sw__sec">
        <h2>How I weight each poll</h2>
        <p>
          Not every poll should count the same. A poll from last week should count more than one from two months ago,
          and a poll of likely voters should count more than one of all adults. So each poll gets a weight, and the weight
          is several factors multiplied together.
        </p>
        <WeightDecay />
        <p>
          The half-life of 21 days is a choice, not something we proved. In our original model we also tried 7, 14 and 30
          days, and the odds of Democratic control stayed between 75% and 77%, so we kept 21. We have not checked it
          against past forecasts.
        </p>
        <PollMultipliers />
        <ul className="sw__list">
          <li>
            <b>Pollster track record.</b> Pollsters are ranked 5 to 10 on past accuracy, which becomes a weight between
            0.70 and 1.00.
          </li>
          <li>
            <b>No double counting.</b> One survey counts once, and a pollster that publishes a lot in one state is turned
            down so it cannot take over the average.
          </li>
          <li>
            <b>Pollster lean.</b> If a pollster has leaned one way in the past, we subtract part of that lean. Only part,
            so we do not over-correct when there is little history.
          </li>
          <li>
            <b>Party sponsors.</b> In past years Democratic-sponsored polls ran about 3.4 points too good for Democrats,
            and Republican-sponsored polls about 2.5 points too bad for them. We shift for that on top of the 0.8 weight.
          </li>
          <li>
            <b>How wrong a poll can be.</b> Every poll is treated as off by at least 5 points, and on top of that all the
            polls in a state share a 4.5 point miss. That shared part matters, because 20 polls in one state are not 20
            independent chances to be right.
          </li>
        </ul>
      </section>

      <section id="guess" className="sw__sec">
        <h2>The starting guess for each state</h2>
        <p>
          Before the model looks at any poll, it makes a guess for each state using three things: how the state voted for
          president in the last two elections, how the same Senate seat voted last time, and the national mood. We fit the
          first two on Senate races going back to 1984.
        </p>
        <p>
          The fit is a simple formula. Our original model used 1.29 times the state&rsquo;s presidential lean plus 0.35
          times the seat&rsquo;s last Senate margin. The revised model, which is the official forecast, refits the same two
          terms on the longer history and gets 1.12 and 0.51.
        </p>
        <p>
          We also tested incumbency, unemployment, GDP, inflation and population change. None of them improved predictions
          on past races, so we left them out. I think that is a good result to report even though it is less exciting than
          adding more inputs.
        </p>
      </section>

      <section id="mood" className="sw__sec">
        <h2>The national mood</h2>
        <p>
          Elections swing together across the country, so the model needs a guess for the national mood. It starts from
          presidential approval, which is at a net of about -26. That works out to roughly +2.6 points for Democrats.
        </p>
        <p>
          Approval is a weak signal on its own, so the state polls are used to adjust it. The two are blended, and the
          result is a Democratic lead of 8.9 points, give or take 2.8. This is the number the whole forecast leans on most.
          If you shift it, the odds of controlling the Senate move from 64% to 79%.
        </p>
      </section>

      <section id="simulation" className="sw__sec">
        <h2>Running the election 50,000 times</h2>
        <p>
          In each state, the model combines the starting guess with the poll average and trusts whichever one is more
          certain. With no polls, the guess stands alone. In the four states with an independent, the guess is trusted
          less, and we assume an independent winner would caucus with the Democrats 80% of the time. That 80% is our
          assumption, not something we measured.
        </p>
        <p>
          Then the simulation plays out the election 50,000 times. In each run there is a national swing that moves every
          state, and states in the same region or with similar politics move together. The errors are also fatter-tailed
          than a normal bell curve, so upsets happen more often than a simple model would say. Each run counts the seats,
          and the chance of control is the share of runs where Democrats reach {seatsNeeded}.
        </p>
        <p>
          We never adjust a probability by hand because of news. The race-by-race adjustments in the code are all set to
          zero for now.
        </p>
      </section>

      <section id="checking" className="sw__sec">
        <h2>Checking it on past elections</h2>
        <p>
          A model can look good on the elections it was built on and still be bad. To get around that, we picked the
          settings for the pollster lean fix, the sponsor fix and the flat poll error using 2016 and 2018 only. Then we
          scored them once on 2020 and 2022, covering 322 statewide races.
        </p>
        <ErrorBeforeAfter />
        <p>
          The changes helped a little on each measure. Brier score is a way to grade probabilities, where 0 is perfect and
          lower is better, so the move from 0.076 to 0.069 means the win chances were somewhat better.
        </p>
        <ModelParts />
        <p>
          There are two things the back-test could not do. The approval-based national mood cannot be tested on past years
          because the repository does not include a licensed historical approval series. And the data does not
          record whether old polls were of likely or registered voters, so those weights are untested. The back-test report
          also says to treat small differences as noise, and I agree.
        </p>
      </section>

      <section id="wrong" className="sw__sec">
        <h2>What could be wrong</h2>
        <WhatIf />
        <ul className="sw__list">
          <li>
            <b>The national mood.</b> It is the biggest single input, and it ranges from 64% to 79% depending on how it is
            set.
          </li>
          <li>
            <b>The polls could all lean one way.</b> If polls as a group favor Democrats, the forecast is too high. Moving
            every poll just 3 points toward the Republicans takes the odds down to about 40%.
          </li>
          <li>
            <b>Thin data in some states.</b> Ten states have one poll or none, and they lean on the starting guess.
          </li>
          <li>
            <b>Things the model leaves out.</b> Ranked-choice voting and runoffs are not modeled.
          </li>
          <li>
            <b>How much states move together.</b> We set this by judgment, because we do not have enough past data to
            test it.
          </li>
        </ul>
      </section>

      <section id="races" className="sw__sec">
        <h2>Every race</h2>
        <div className="sf__table">
          <RaceTable />
        </div>
        <p className="sf__links">
          <a href={csv} download>
            Download the state-by-state results (CSV)
          </a>
          <a href={article} target="_blank" rel="noreferrer">
            Read the forecast on The YIMBY Manifesto
          </a>
        </p>
      </section>

      <section id="next" className="sw__sec">
        <h2>What I would do next</h2>
        <ul className="sw__list">
          <li>Find a historical approval series so the national mood can be tested on past elections.</li>
          <li>Test the 21-day half-life against past forecasts instead of only against our own model.</li>
          <li>Get enough history to measure how much states move together, so it stops being a judgment call.</li>
          <li>Add ranked-choice voting and runoffs.</li>
        </ul>
        <p>
          I also want to compare the forecast with the actual results once the election has happened, including the
          places where it was wrong.
        </p>
        <p className="sf__credit">
          Poll data from VoteHub (CC BY 4.0) and Wikipedia&rsquo;s state polling tables (CC BY-SA). Historical results
          from MIT Election Lab, pollster ratings from FiveThirtyEight and approval history from Gallup. This was built
          with Isaiah Wood, Jake Wilkinson and Xiaowen Guo in Dr. Brian Adler&rsquo;s election forecasting group at UMass
          Amherst, and the code, data and tests are in the public repository linked at the top of this page.
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
