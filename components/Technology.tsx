"use client";

import { motion } from "framer-motion";
import { Reveal, SectionHeading } from "./Reveal";

/* Deterministic abstract lines — NOT market data, NOT performance. */
function walk(seed: number, vol: number, drift: number) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  let y = 150;
  const pts: string[] = [];
  for (let x = 0; x <= 600; x += 12) {
    y += (rnd() - 0.5) * vol + drift;
    y = Math.max(30, Math.min(270, y));
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}
const LINES = [
  { d: walk(11, 14, -0.15), c: "#3fd8ff", w: 2 },
  { d: walk(29, 30, -0.1), c: "#9478ff", w: 2 },
  { d: walk(53, 52, 0), c: "#ff8a3d", w: 2 },
];

const NODES: [number, number][] = [
  [60, 60], [170, 40], [270, 90], [110, 150], [220, 170], [320, 160], [60, 240], [180, 260], [300, 240],
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [5, 8], [6, 7], [7, 8],
];

const CONCEPTS = [
  {
    k: "01",
    title: "Data streams in",
    body: "Markets produce a continuous flow of prices. Algorithmic trading begins by observing that flow.",
  },
  {
    k: "02",
    title: "Rules interpret it",
    body: "A strategy profile is a defined set of rules for how a system responds to what it observes.",
  },
  {
    k: "03",
    title: "Risk shapes everything",
    body: "SAFE, CORE and NOVA differ in how much risk their approach accepts in pursuit of a target.",
  },
];

export function Technology() {
  return (
    <section id="technology" data-shot="technology" aria-labelledby="tech-title" className="safe-x relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="tech-title"
          eyebrow="Chapter 07 · Technology"
          title={
            <>
              Intelligence, <span className="text-muted">visualised.</span>
            </>
          }
          intro="Algorithmic trading uses predefined logic to analyse market data and act on it. Here is the idea behind FUSION AI, shown as a concept rather than a specification."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Abstract market streams */}
          <Reveal className="panel overflow-hidden p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">Signal field</p>
              <p className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-warm">
                Abstract animation · not market data
              </p>
            </div>
            <div className="relative mt-5">
              <svg viewBox="0 0 600 300" className="w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="scan" x1="0" x2="1">
                    <stop offset="0" stopColor="#3fd8ff" stopOpacity="0" />
                    <stop offset="1" stopColor="#3fd8ff" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                {[60, 120, 180, 240].map((y) => (
                  <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#96aaff" strokeOpacity="0.08" />
                ))}
                {[100, 200, 300, 400, 500].map((x) => (
                  <line key={x} y1="0" y2="300" x1={x} x2={x} stroke="#96aaff" strokeOpacity="0.06" />
                ))}
                {LINES.map((l, i) => (
                  <motion.path
                    key={i}
                    d={l.d}
                    fill="none"
                    stroke={l.c}
                    strokeWidth={l.w}
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.9 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.4, delay: 0.2 + i * 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
                <rect className="motion-safe:animate-[sweep_6s_linear_infinite]" x="-120" y="0" width="120" height="300" fill="url(#scan)" />
              </svg>
            </div>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
              <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-safe" />Lower volatility (SAFE)</li>
              <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-core" />Moderate volatility (CORE)</li>
              <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-nova" />High volatility (NOVA)</li>
            </ul>
          </Reveal>

          {/* Network */}
          <Reveal delay={0.12} className="panel p-5 sm:p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">Decision network · concept</p>
            <svg viewBox="0 0 380 300" className="mt-5 w-full" aria-hidden="true">
              {EDGES.map(([a, b], i) => (
                <line
                  key={i}
                  x1={NODES[a][0]}
                  y1={NODES[a][1]}
                  x2={NODES[b][0]}
                  y2={NODES[b][1]}
                  stroke={i % 3 === 0 ? "#3fd8ff" : i % 3 === 1 ? "#9478ff" : "#ff8a3d"}
                  strokeOpacity="0.5"
                  className="flow"
                />
              ))}
              {NODES.map(([x, y], i) => (
                <motion.g
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 + i * 0.07 }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                >
                  <circle cx={x} cy={y} r="14" fill="#0b1233" stroke="#96aaff" strokeOpacity="0.35" />
                  <circle cx={x} cy={y} r="4.5" fill={i === 4 ? "#ffffff" : "#c9d8ff"} />
                </motion.g>
              ))}
            </svg>
          </Reveal>
        </div>

        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {CONCEPTS.map((c, i) => (
            <Reveal as="li" key={c.k} delay={i * 0.1} className="panel p-6">
              <span className="font-mono text-xs text-safe">{c.k}</span>
              <h3 className="mt-3 text-lg font-bold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-8 rounded-2xl border border-dashed border-warm/30 bg-warm/[0.04] p-5 text-sm leading-relaxed text-muted">
            <strong className="text-warm">Documentation pending.</strong> Technical documentation for FUSION AI has not
            yet been published. This section illustrates the general concept of algorithmic trading. It does not describe
            a verified system, data source, model capability, back-test or live market feed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
