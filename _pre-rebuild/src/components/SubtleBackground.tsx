"use client";

import { usePathname } from "next/navigation";

/**
 * Aurora Veil — advanced subtle background for non-home routes.
 */
export default function SubtleBackground() {
  const pathname = usePathname();
  const isHome =
    pathname === "/" || pathname === "/home" || pathname === "/homepage";
  if (isHome) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {/* Base dark + faint mesh gradient */}
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_700px_at_15%_10%,rgba(34,211,238,.08),transparent_60%),radial-gradient(1200px_900px_at_85%_80%,rgba(99,102,241,.08),transparent_65%)]" />

      {/* Aurora bands */}
      <div className="absolute inset-0 mix-blend-screen">
        <div className="aurora aurora--1" />
        <div className="aurora aurora--2" />
        <div className="aurora aurora--3" />
      </div>

      {/* ultra-subtle sweep */}
      <div className="absolute inset-0 opacity-[0.06] animate-[bgSweep_40s_linear_infinite] bg-[linear-gradient(115deg,transparent_0,transparent_49%,rgba(255,255,255,.25)_50%,transparent_51%,transparent_100%)] bg-[length:300%_300%]" />

      <style jsx global>{`
        .aurora {
          position: absolute;
          inset: -10%;
          width: 120%;
          height: 120%;
          background: conic-gradient(
            from 180deg at 50% 50%,
            rgba(34, 211, 238, 0.25),
            rgba(59, 130, 246, 0.18),
            rgba(147, 51, 234, 0.22),
            rgba(34, 211, 238, 0.25)
          );
          filter: blur(80px);
          opacity: 0.18;
        }
        .aurora--1 {
          animation: auroraShift1 28s ease-in-out infinite alternate;
          transform: translate(-8%, -6%) rotate(2deg);
        }
        .aurora--2 {
          animation: auroraShift2 34s ease-in-out infinite alternate;
          transform: translate(6%, 4%) rotate(-3deg);
          opacity: 0.14;
        }
        .aurora--3 {
          animation: auroraShift3 42s ease-in-out infinite alternate;
          transform: translate(-4%, 2%) rotate(1deg);
          opacity: 0.12;
        }
        @keyframes auroraShift1 {
          0% { transform: translate(-8%, -6%) rotate(2deg); }
          100% { transform: translate(6%, 4%) rotate(-4deg); }
        }
        @keyframes auroraShift2 {
          0% { transform: translate(6%, 4%) rotate(-3deg); }
          100% { transform: translate(-6%, -2%) rotate(5deg); }
        }
        @keyframes auroraShift3 {
          0% { transform: translate(-4%, 2%) rotate(1deg); }
          100% { transform: translate(5%, -4%) rotate(-2deg); }
        }
        @keyframes bgSweep {
          0% { background-position: 0% 0%; }
          100% { background-position: 300% 300%; }
        }
      `}</style>
    </div>
  );
}
