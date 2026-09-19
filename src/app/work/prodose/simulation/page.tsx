import type { Metadata } from "next";
import SimulationFrame from "@/components/detail/SimulationFrame";

export const metadata: Metadata = {
  title: "ProDose dispenser simulation",
  description:
    "A browser physics simulation comparing two pill-dispensing concepts for ProDose: an inverted bottle with a sorting wheel, and a bottom dock with a robotic arm.",
};

export default function ProdoseSimulation() {
  return (
    <SimulationFrame
      src="/prodose-sim/index.html"
      title="ProDose pill dispenser physics simulator"
      backHref="/work/prodose/"
      backLabel="ProDose"
    />
  );
}
