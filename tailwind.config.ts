import type { Config } from "tailwindcss";

/**
 * Tailwind is here for its preflight reset and the `@layer` machinery in
 * globals.css, not for utility classes — the design system is a small set of
 * semantic classes (`.t-hero`, `.panel`, `.btn`, `.shell`) plus component-scoped
 * styled-jsx, which keeps the markup readable and the styles next to what they
 * style.
 *
 * The previous config carried a full shadcn/ui token mapping and the
 * tailwindcss-animate plugin for components the site no longer has.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      /* Exposed so a one-off utility can reach the design tokens if it ever
         needs to, without duplicating the values. */
      fontFamily: {
        display: ["var(--display)"],
        ui: ["var(--ui)"],
        mono: ["var(--mono)"],
      },
      colors: {
        void: "var(--void)",
        ink: "var(--text)",
      },
    },
  },
  plugins: [],
};

export default config;
