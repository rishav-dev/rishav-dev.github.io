import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-slate-950/70 shadow-[0_0_35px_rgba(34,211,238,0.18)] backdrop-blur-xl transition duration-300 group-hover:scale-105 group-hover:border-cyan-200/50">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-300/18 via-teal-300/8 to-transparent" />

        <svg
          viewBox="0 0 80 76"
          className="relative h-9 w-11"
          role="img"
          aria-label="Rishav Chakravarty logo"
        >
          <defs>
            <linearGradient id="rGradient" x1="10" y1="12" x2="44" y2="54">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="55%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <linearGradient id="cGradient" x1="34" y1="28" x2="72" y2="72">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="55%" stopColor="#5eead4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>

            <filter id="rGlow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="1.25" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 0.13  0 0 0 0 0.83  0 0 0 0 0.93  0 0 0 0.34 0"
              />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="cGlow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="1.25" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 0.36  0 0 0 0 0.91  0 0 0 0 0.82  0 0 0 0.3 0"
              />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* R: higher and left */}
          <path
            d="M9 48V14h20.4c8.3 0 13.7 4.4 13.7 11.3 0 5.2-2.9 9-8 10.6L45 48H34.9L26.4 36.8h-8V48H9Zm9.4-18.9h9.8c3.3 0 5.4-1.6 5.4-4.2s-2.1-4.2-5.4-4.2h-9.8v8.4Z"
            fill="url(#rGradient)"
            filter="url(#rGlow)"
          />

          {/* C: closer to R and hanging lower */}
          <path
            d="M69.5 39.5C66 34.7 60.8 32 54.5 32c-10.5 0-18.4 8-18.4 19.3C36.1 62.5 44 70 54.5 70c6.6 0 11.9-2.9 15.3-7.8l-6.9-5.1c-1.9 2.8-4.7 4.5-8.3 4.5-5.8 0-9.9-4.3-9.9-10.4 0-6.2 4.1-10.5 9.9-10.5 3.6 0 6.3 1.6 8.2 4.3l6.7-5.5Z"
            fill="url(#cGradient)"
            filter="url(#cGlow)"
          />

          <path
            d="M11 58H38"
            stroke="url(#rGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.42"
          />

          <path
            d="M36 73H67"
            stroke="url(#cGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.42"
          />
        </svg>
      </div>

      <div className="leading-tight">
        <div className="bg-gradient-to-r from-cyan-200 via-white to-teal-200 bg-clip-text text-lg font-bold tracking-wide text-transparent">
          Rishav
        </div>
        <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">
          Analytics
        </div>
      </div>
    </Link>
  );
}