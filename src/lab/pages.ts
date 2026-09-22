/* The ProDose design lab pages. Each one is a fragment in src/lab/pages plus the scripts it needs, loaded in order. */

export interface LabPage {
  slug: string;
  label: string;
  title: string;
  description: string;
  route: string;
  /** The simulator is a full-height app rather than a document. */
  app?: boolean;
  scripts: string[];
}

export const LAB_PAGES: LabPage[] = [
  {
    slug: "overview",
    label: "Overview",
    title: "ProDose design lab",
    description: "Six pill-dispensing concepts, simulated with real physics: single-pill metering, dispensing confirmation, chute and collection, cleaning and materials.",
    route: "/work/prodose/simulation/",
    scripts: [
      "/prodose-sim/js/site.js",
      "/prodose-sim/js/charts.js",
      "/prodose-sim/data/bench.js",
      "/prodose-sim/js/bench-lib.js",
      "/prodose-sim/js/inline-overview.js",
    ],
  },
  {
    slug: "simulator",
    label: "Simulator",
    title: "ProDose simulator",
    description: "Live rigid-body physics simulation of six pill-dispensing concepts.",
    route: "/work/prodose/simulation/simulator/",
    app: true,
    scripts: [
      "/prodose-sim/js/lib/matter.min.js",
      "/prodose-sim/js/config.js",
      "/prodose-sim/js/contact.js",
      "/prodose-sim/js/physics.js",
      "/prodose-sim/js/actuators.js",
      "/prodose-sim/js/concepts.js",
      "/prodose-sim/js/render.js",
      "/prodose-sim/js/render-concepts.js",
      "/prodose-sim/js/scope.js",
      "/prodose-sim/js/site.js",
      "/prodose-sim/js/app.js",
    ],
  },
  {
    slug: "bench",
    label: "Test bench",
    title: "ProDose test bench",
    description: "Single-pill success, multiples, misses, jams and damage for six dispensing concepts, measured in a physics simulation.",
    route: "/work/prodose/simulation/bench/",
    scripts: [
      "/prodose-sim/js/lib/matter.min.js",
      "/prodose-sim/js/config.js",
      "/prodose-sim/js/contact.js",
      "/prodose-sim/js/physics.js",
      "/prodose-sim/js/actuators.js",
      "/prodose-sim/js/concepts.js",
      "/prodose-sim/js/trial.js",
      "/prodose-sim/js/site.js",
      "/prodose-sim/js/charts.js",
      "/prodose-sim/data/bench.js",
      "/prodose-sim/js/bench-lib.js",
      "/prodose-sim/js/bench-page.js",
    ],
  },
  {
    slug: "sensing",
    label: "Sensing lab",
    title: "ProDose sensing lab",
    description: "Can a break-beam prove exactly one pill? Six confirmation methods tested against overlapping pills with real physics.",
    route: "/work/prodose/simulation/sensing/",
    scripts: [
      "/prodose-sim/js/lib/matter.min.js",
      "/prodose-sim/js/config.js",
      "/prodose-sim/js/contact.js",
      "/prodose-sim/js/physics.js",
      "/prodose-sim/js/actuators.js",
      "/prodose-sim/js/concepts.js",
      "/prodose-sim/js/trial.js",
      "/prodose-sim/js/sensing.js",
      "/prodose-sim/js/site.js",
      "/prodose-sim/js/charts.js",
      "/prodose-sim/data/sensing.js",
      "/prodose-sim/js/sensors-page.js",
    ],
  },
  {
    slug: "labs",
    label: "Labs",
    title: "ProDose labs",
    description: "Bottle interface reliability, chute and collection experiments, air-purge cleaning model and material selection for the Prodose module.",
    route: "/work/prodose/simulation/labs/",
    scripts: [
      "/prodose-sim/js/lib/matter.min.js",
      "/prodose-sim/js/config.js",
      "/prodose-sim/js/contact.js",
      "/prodose-sim/js/physics.js",
      "/prodose-sim/js/chute.js",
      "/prodose-sim/js/site.js",
      "/prodose-sim/js/charts.js",
      "/prodose-sim/data/chute.js",
      "/prodose-sim/js/labs-page.js",
    ],
  },
  {
    slug: "design",
    label: "Design decision",
    title: "ProDose design decision",
    description: "Design alternatives, rationale, failure modes, test procedures and recommendations for the Prodose pill dispensing module.",
    route: "/work/prodose/simulation/design/",
    scripts: [
      "/prodose-sim/js/site.js",
      "/prodose-sim/js/charts.js",
      "/prodose-sim/data/bench.js",
      "/prodose-sim/data/sensing.js",
      "/prodose-sim/js/bench-lib.js",
      "/prodose-sim/js/research-lib.js",
      "/prodose-sim/js/design-page.js",
    ],
  },
  {
    slug: "research",
    label: "Research",
    title: "ProDose research",
    description: "Extended validation: variance-based sensitivity analysis, held-out generalization, and a real search-vs-baseline optimization case study, plus what this simulation cannot show without physical hardware.",
    route: "/work/prodose/simulation/research/",
    scripts: [
      "/prodose-sim/js/site.js",
      "/prodose-sim/js/charts.js",
      "/prodose-sim/data/bench.js",
      "/prodose-sim/js/bench-lib.js",
      "/prodose-sim/js/research-lib.js",
      "/prodose-sim/data/challenge.js",
      "/prodose-sim/data/optimize.js",
      "/prodose-sim/js/research-page.js",
    ],
  },
  {
    slug: "physics-check",
    label: "Physics check",
    title: "ProDose physics check",
    description: "Validation of the simulator's physics against closed-form solutions: free fall, friction, restitution, projectile motion, actuator force limits and suction force.",
    route: "/work/prodose/simulation/physics-check/",
    scripts: [
      "/prodose-sim/js/lib/matter.min.js",
      "/prodose-sim/js/config.js",
      "/prodose-sim/js/contact.js",
      "/prodose-sim/js/physics.js",
      "/prodose-sim/js/actuators.js",
      "/prodose-sim/js/validation.js",
      "/prodose-sim/js/site.js",
      "/prodose-sim/js/charts.js",
      "/prodose-sim/js/inline-physics-check.js",
    ],
  },
];

export const labPage = (slug: string) => {
  const page = LAB_PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`Unknown lab page: ${slug}`);
  return page;
};
