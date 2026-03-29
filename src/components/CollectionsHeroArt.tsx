"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Compact catalog-hero SVG: soft light pools + one subtle ring.
 * Matches common e-commerce patterns (gradient mesh, minimal motion, no heavy filters).
 */
export function CollectionsHeroArt() {
  const reduceMotion = useReducedMotion();

  const drift = reduceMotion
    ? {}
    : {
        animate: { y: [0, -8, 0], x: [0, 6, 0] },
        transition: {
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const driftAlt = reduceMotion
    ? {}
    : {
        animate: { y: [0, 10, 0], x: [0, -8, 0] },
        transition: {
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 2,
        },
      };

  const ringSpin = reduceMotion
    ? {}
    : {
        animate: { rotate: [0, 360] },
        transition: { duration: 200, repeat: Infinity, ease: "linear" as const },
      };

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 960 400"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="ch-a" cx="22%" cy="35%" r="42%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="ch-b" cx="78%" cy="45%" r="38%">
            <stop offset="0%" stopColor="rgba(96,165,250,0.2)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </radialGradient>
          <linearGradient id="ch-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
          </linearGradient>
        </defs>

        <motion.g {...drift}>
          <circle cx={200} cy={160} r={160} fill="url(#ch-a)" />
        </motion.g>
        <motion.g {...driftAlt}>
          <circle cx={760} cy={220} r={140} fill="url(#ch-b)" />
        </motion.g>

        <motion.g
          style={{ transformOrigin: "480px 200px" }}
          {...ringSpin}
        >
          <ellipse
            cx={480}
            cy={200}
            rx={280}
            ry={120}
            fill="none"
            stroke="url(#ch-ring)"
            strokeWidth={1}
            opacity={0.55}
          />
        </motion.g>
      </svg>
    </div>
  );
}
