import type { Metadata } from "next";
import SimulationFrame from "@/components/detail/SimulationFrame";

export const metadata: Metadata = {
  title: "ProDose dispenser simulation",
  description:
    "The ProDose design lab: a browser physics simulation of six ways to dispense exactly one pill, with a test bench, a sensing lab and a design recommendation.",
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
