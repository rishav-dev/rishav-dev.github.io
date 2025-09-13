// src/components/ParticlesBackground.tsx
"use client";

import { useEffect } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const options: ISourceOptions = {
  fullScreen: { enable: false },
  background: { color: "transparent" },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: { enable: true, mode: "push" },
      onHover: { enable: true, mode: "repulse" },
      resize: { enable: true },
    },
    modes: {
      push: { quantity: 4 },
      repulse: { distance: 200, duration: 0.4 },
    },
  },
  particles: {
    color: { value: ["#00d4ff", "#00b4d8", "#0077be"] },
    links: { color: "#00d4ff", distance: 150, enable: true, opacity: 0.2, width: 1 },
    move: { enable: true, speed: 2, outModes: { default: "bounce" } },
    number: { value: 80, density: { enable: true, width: 800, height: 800 } },
    opacity: { value: 0.5, animation: { enable: true, speed: 1, sync: false } },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 }, animation: { enable: true, speed: 2, sync: false } },
  },
  detectRetina: true,
};

export default function ParticlesBackground() {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine); // load only the slim bundle
    });
  }, []);

  return <Particles id="tsparticles" className="absolute inset-0 -z-10" options={options} />;
}
