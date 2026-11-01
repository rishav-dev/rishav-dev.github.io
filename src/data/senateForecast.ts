/*
 * Final state-by-state results of the Team 3 2026 U.S. Senate forecast, as of October 30, 2026.
 * Read from team3_senate_forecast_by_state.csv, the file submitted with the team's methodology.
 * The five closest races match the published article exactly.
 *
 * `margin` is Democrat (or the opposition candidate) minus Republican, in points.
 * `low` and `high` are the ends of the model's 80% range for that margin.
 */

export type ForecastRating = "safe-r" | "lean-r" | "toss-up" | "lean-d" | "likely-d" | "safe-d";

export interface ForecastRace {
  state: string;
  abbr: string;
  /** Democratic nominee, or the opposition candidate where there is an independent challenger. */
  dem: string;
  rep: string;
  /** True where the opposition candidate is an independent (NE, SD, ID, MT). */
  independent: boolean;
  /** Chance the Democrat or opposition candidate wins. */
  demProb: number;
  margin: number;
  low: number;
  high: number;
  rating: ForecastRating;
  /** Polls the model used in this state. */
  polls: number;
}

export const FORECAST_SUMMARY = {
  asOf: "October 30, 2026",
  electionDay: "November 3, 2026",
  demControl: 0.795,
  medianSeats: 53,
  seatRange: [49, 56] as const,
  simulations: 50000,
  polls: 576,
  statesWithPolls: 28,
  demHoldovers: 34,
  repHoldovers: 31,
  seatsNeeded: 51,
  article: "https://yimbymanifesto.substack.com/p/the-first-of-several-us-senate-forecasts",
  csv: "/data/team3_senate_forecast_by_state.csv",
} as const;

export const FORECAST_RACES: ForecastRace[] = [
  {
    "state": "Alabama",
    "abbr": "AL",
    "dem": "Everett Wess",
    "rep": "Barry Moore",
    "independent": false,
    "demProb": 0.0052,
    "margin": -15.6,
    "low": -21.9,
    "high": -9.3,
    "rating": "safe-r",
    "polls": 6
  },
  {
    "state": "Alaska",
    "abbr": "AK",
    "dem": "Mary Peltola",
    "rep": "Dan S. Sullivan",
    "independent": false,
    "demProb": 0.6601,
    "margin": 1.8,
    "low": -4.2,
    "high": 8.0,
    "rating": "lean-d",
    "polls": 20
  },
  {
    "state": "Arkansas",
    "abbr": "AR",
    "dem": "Hallie Shoffner",
    "rep": "Tom Cotton",
    "independent": false,
    "demProb": 0.0194,
    "margin": -14.2,
    "low": -22.0,
    "high": -6.4,
    "rating": "safe-r",
    "polls": 9
  },
  {
    "state": "Colorado",
    "abbr": "CO",
    "dem": "John Hickenlooper",
    "rep": "Mark Baisley",
    "independent": false,
    "demProb": 0.9155,
    "margin": 20.5,
    "low": 1.5,
    "high": 39.7,
    "rating": "safe-d",
    "polls": 0
  },
  {
    "state": "Delaware",
    "abbr": "DE",
    "dem": "Chris Coons",
    "rep": "Michael Katz",
    "independent": false,
    "demProb": 0.9681,
    "margin": 29.2,
    "low": 10.4,
    "high": 48.4,
    "rating": "safe-d",
    "polls": 0
  },
  {
    "state": "Florida",
    "abbr": "FL",
    "dem": "Angie Nixon",
    "rep": "Ashley Moody",
    "independent": false,
    "demProb": 0.0664,
    "margin": -6.8,
    "low": -12.4,
    "high": -1.2,
    "rating": "safe-r",
    "polls": 26
  },
  {
    "state": "Georgia",
    "abbr": "GA",
    "dem": "Jon Ossoff",
    "rep": "Mike Collins",
    "independent": false,
    "demProb": 0.9738,
    "margin": 9.9,
    "low": 3.9,
    "high": 16.1,
    "rating": "safe-d",
    "polls": 18
  },
  {
    "state": "Idaho",
    "abbr": "ID",
    "dem": "Todd Achilles",
    "rep": "Jim Risch",
    "independent": true,
    "demProb": 0.0964,
    "margin": -8.5,
    "low": -16.7,
    "high": -0.1,
    "rating": "safe-r",
    "polls": 10
  },
  {
    "state": "Illinois",
    "abbr": "IL",
    "dem": "Juliana Stratton",
    "rep": "Don Tracy",
    "independent": false,
    "demProb": 0.9883,
    "margin": 15.9,
    "low": 8.0,
    "high": 23.7,
    "rating": "safe-d",
    "polls": 2
  },
  {
    "state": "Iowa",
    "abbr": "IA",
    "dem": "Josh Turek",
    "rep": "Ashley Hinson",
    "independent": false,
    "demProb": 0.5712,
    "margin": 0.7,
    "low": -4.9,
    "high": 6.3,
    "rating": "toss-up",
    "polls": 46
  },
  {
    "state": "Kansas",
    "abbr": "KS",
    "dem": "Adam Hamilton",
    "rep": "Roger Marshall",
    "independent": false,
    "demProb": 0.6582,
    "margin": 1.7,
    "low": -4.0,
    "high": 7.4,
    "rating": "lean-d",
    "polls": 21
  },
  {
    "state": "Kentucky",
    "abbr": "KY",
    "dem": "Charles Booker",
    "rep": "Andy Barr",
    "independent": false,
    "demProb": 0.0752,
    "margin": -16.4,
    "low": -30.6,
    "high": -2.0,
    "rating": "safe-r",
    "polls": 1
  },
  {
    "state": "Louisiana",
    "abbr": "LA",
    "dem": "Jamie Davis",
    "rep": "Julia Letlow",
    "independent": false,
    "demProb": 0.117,
    "margin": -11.0,
    "low": -22.9,
    "high": 1.0,
    "rating": "safe-r",
    "polls": 2
  },
  {
    "state": "Maine",
    "abbr": "ME",
    "dem": "Troy Jackson",
    "rep": "Susan Collins",
    "independent": false,
    "demProb": 0.789,
    "margin": 3.3,
    "low": -2.2,
    "high": 8.9,
    "rating": "likely-d",
    "polls": 40
  },
  {
    "state": "Massachusetts",
    "abbr": "MA",
    "dem": "Ed Markey",
    "rep": "John Deaton",
    "independent": false,
    "demProb": 0.9997,
    "margin": 28.4,
    "low": 21.7,
    "high": 35.1,
    "rating": "safe-d",
    "polls": 15
  },
  {
    "state": "Michigan",
    "abbr": "MI",
    "dem": "Abdul El-Sayed",
    "rep": "Mike Rogers",
    "independent": false,
    "demProb": 0.8653,
    "margin": 4.6,
    "low": -0.8,
    "high": 10.1,
    "rating": "safe-d",
    "polls": 72
  },
  {
    "state": "Minnesota",
    "abbr": "MN",
    "dem": "Peggy Flanagan",
    "rep": "Michele Tafoya",
    "independent": false,
    "demProb": 0.7607,
    "margin": 3.7,
    "low": -3.3,
    "high": 10.9,
    "rating": "likely-d",
    "polls": 5
  },
  {
    "state": "Mississippi",
    "abbr": "MS",
    "dem": "Scott Colom",
    "rep": "Cindy Hyde-Smith",
    "independent": false,
    "demProb": 0.135,
    "margin": -7.4,
    "low": -16.2,
    "high": 1.4,
    "rating": "safe-r",
    "polls": 3
  },
  {
    "state": "Montana",
    "abbr": "MT",
    "dem": "Seth Bodnar",
    "rep": "Kurt Alme",
    "independent": true,
    "demProb": 0.0265,
    "margin": -11.6,
    "low": -18.6,
    "high": -4.6,
    "rating": "safe-r",
    "polls": 17
  },
  {
    "state": "Nebraska",
    "abbr": "NE",
    "dem": "Dan Osborn",
    "rep": "Pete Ricketts",
    "independent": true,
    "demProb": 0.4284,
    "margin": -0.8,
    "low": -7.2,
    "high": 5.5,
    "rating": "toss-up",
    "polls": 16
  },
  {
    "state": "New Hampshire",
    "abbr": "NH",
    "dem": "Chris Pappas",
    "rep": "John E. Sununu",
    "independent": false,
    "demProb": 0.9642,
    "margin": 9.0,
    "low": 3.0,
    "high": 14.9,
    "rating": "safe-d",
    "polls": 18
  },
  {
    "state": "New Jersey",
    "abbr": "NJ",
    "dem": "Cory Booker",
    "rep": "Justin Murphy",
    "independent": false,
    "demProb": 0.9304,
    "margin": 22.2,
    "low": 3.4,
    "high": 41.2,
    "rating": "safe-d",
    "polls": 0
  },
  {
    "state": "New Mexico",
    "abbr": "NM",
    "dem": "Ben Ray Luján",
    "rep": "Larry Marker",
    "independent": false,
    "demProb": 0.9899,
    "margin": 17.0,
    "low": 9.1,
    "high": 24.9,
    "rating": "safe-d",
    "polls": 3
  },
  {
    "state": "North Carolina",
    "abbr": "NC",
    "dem": "Roy Cooper",
    "rep": "Michael Whatley",
    "independent": false,
    "demProb": 0.9809,
    "margin": 10.6,
    "low": 4.7,
    "high": 16.5,
    "rating": "safe-d",
    "polls": 60
  },
  {
    "state": "Ohio",
    "abbr": "OH",
    "dem": "Sherrod Brown",
    "rep": "Jon Husted",
    "independent": false,
    "demProb": 0.7896,
    "margin": 3.3,
    "low": -2.2,
    "high": 8.9,
    "rating": "likely-d",
    "polls": 45
  },
  {
    "state": "Oklahoma",
    "abbr": "OK",
    "dem": "N'Kiyla Jasmine Thomas",
    "rep": "Kevin Hern",
    "independent": false,
    "demProb": 0.0303,
    "margin": -25.5,
    "low": -41.7,
    "high": -9.3,
    "rating": "safe-r",
    "polls": 1
  },
  {
    "state": "Oregon",
    "abbr": "OR",
    "dem": "Jeff Merkley",
    "rep": "David Brock Smith",
    "independent": false,
    "demProb": 0.9583,
    "margin": 26.8,
    "low": 7.9,
    "high": 45.7,
    "rating": "safe-d",
    "polls": 0
  },
  {
    "state": "Rhode Island",
    "abbr": "RI",
    "dem": "Jack Reed",
    "rep": "Raymond McKay",
    "independent": false,
    "demProb": 0.9994,
    "margin": 27.6,
    "low": 20.1,
    "high": 35.2,
    "rating": "safe-d",
    "polls": 4
  },
  {
    "state": "South Carolina",
    "abbr": "SC",
    "dem": "Annie Andrews",
    "rep": "Darline Graham",
    "independent": false,
    "demProb": 0.3573,
    "margin": -1.6,
    "low": -7.4,
    "high": 4.2,
    "rating": "lean-r",
    "polls": 19
  },
  {
    "state": "South Dakota",
    "abbr": "SD",
    "dem": "Brian Bengs",
    "rep": "Mike Rounds",
    "independent": true,
    "demProb": 0.0358,
    "margin": -10.2,
    "low": -16.9,
    "high": -3.4,
    "rating": "safe-r",
    "polls": 12
  },
  {
    "state": "Tennessee",
    "abbr": "TN",
    "dem": "Marquita Bradshaw",
    "rep": "Bill Hagerty",
    "independent": false,
    "demProb": 0.0325,
    "margin": -22.3,
    "low": -36.7,
    "high": -7.8,
    "rating": "safe-r",
    "polls": 1
  },
  {
    "state": "Texas",
    "abbr": "TX",
    "dem": "James Talarico",
    "rep": "Ken Paxton",
    "independent": false,
    "demProb": 0.7323,
    "margin": 2.4,
    "low": -2.9,
    "high": 7.8,
    "rating": "likely-d",
    "polls": 84
  },
  {
    "state": "Virginia",
    "abbr": "VA",
    "dem": "Mark Warner",
    "rep": "Bert Mizusawa",
    "independent": false,
    "demProb": 0.9031,
    "margin": 19.0,
    "low": 0.3,
    "high": 38.2,
    "rating": "safe-d",
    "polls": 0
  },
  {
    "state": "West Virginia",
    "abbr": "WV",
    "dem": "Rachel Fetty Anderson",
    "rep": "Shelley Moore Capito",
    "independent": false,
    "demProb": 0.0136,
    "margin": -37.4,
    "low": -56.2,
    "high": -18.3,
    "rating": "safe-r",
    "polls": 0
  },
  {
    "state": "Wyoming",
    "abbr": "WY",
    "dem": "James W. Byrd",
    "rep": "Harriet Hageman",
    "independent": false,
    "demProb": 0.007,
    "margin": -43.4,
    "low": -62.3,
    "high": -24.3,
    "rating": "safe-r",
    "polls": 0
  }
];
