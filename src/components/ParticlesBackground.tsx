"use client";

import { useCallback } from "react";
import type { Engine, Container } from "@tsparticles/engine";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

/**
 * Particle background component for the portfolio.
 *
 * The TSParticles library requires explicitly loading an engine for tree-shaking
 * when using the React wrapper. Here we load the lightweight `slim` engine
 * which includes the common shapes and interactions used in this site.
 */
export default function ParticlesBackground() {
  // Initialize the engine with the slim preset. This must be memoised to
  // prevent reloading on every render.
  const particlesInit = useCallback(async (engine: Engine) => {
    // Load only the slim version of tsparticles to keep bundle size small.
    await loadSlim(engine);
  }, []);

  // Optionally hook into the loaded container. Here we leave the callback
  // empty but it could be used for debugging or custom interactions.
  const particlesLoaded = useCallback(async (container?: Container) => {
    // noop
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      particlesLoaded={particlesLoaded}
      className="absolute inset-0 -z-10"
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: {
              enable: true,
            },
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#00d4ff", "#00b4d8", "#0077be"],
          },
          links: {
            color: "#00d4ff",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              width: 800,
              height: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
            animation: {
              enable: true,
              speed: 1,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
            animation: {
              enable: true,
              speed: 2,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
