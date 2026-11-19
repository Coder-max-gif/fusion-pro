"use client";

import { motion } from "framer-motion";
import { BOT_ACCENT, BOTS } from "@/lib/bots";
import { useWebGL } from "@/lib/useWebGL";
import { Reveal } from "./Reveal";
import { ScrubText } from "./ScrubText";

const ORBITS = [
  { id: "safe", r: 70, dur: 26 },
  { id: "core", r: 120, dur: 18 },
  { id: "nova", r: 170, dur: 11 },
] as const;

export function Story() {
  const webgl = useWebGL();
  return (
    <section id="story" data-shot="story" aria-labelledby="story-title" className="safe-x relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">Chapter 02 · The platform</p>
            <h2 id="story-title" className="display mt-4 text-[clamp(2rem,5vw,3.6rem)] font-semibold text-balance">
              One experience. <span className="text-muted">Three ways to approach risk.</span>
            </h2>
          </Reveal>
          <ScrubText
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink sm:text-xl max-lg:rounded-2xl max-lg:border max-lg:border-white/10 max-lg:bg-void/60 max-lg:p-4 max-lg:backdrop-blur-md"
            text="FUSION AI brings three distinct trading strategy profiles into one experience. Each bot represents a different balance of target, activity and risk. Explore the approach behind each profile before deciding whether it is appropriate for you."
          />

          <Reveal delay={0.2}>
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {[
                ["3", "strategy profiles"],
                ["1", "shared experience"],
                ["0", "guaranteed outcomes"],
              ].map(([n, l]) => (
                <div key={l} className="bg-deep/90 p-4 sm:p-5">
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="display block text-3xl font-semibold sm:text-4xl">{n}</span>
                    <span className="mt-1 block text-xs leading-snug text-muted sm:text-sm">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Orbit diagram: distance from the core = risk appetite */}
        <Reveal delay={0.1} className="relative">
          <figure className={webgl !== false ? "mx-auto max-w-[360px] lg:mr-0 lg:mt-[34rem]" : "panel mx-auto max-w-[520px] p-5 sm:p-8"}>
            <svg viewBox="0 0 400 400" className={webgl !== false ? "hidden" : "w-full"} role="img" aria-labelledby="orbit-cap">
              <defs>
                <radialGradient id="story-core">
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="0.3" stopColor="#b7c4ff" stopOpacity="0.6" />
                  <stop offset="1" stopColor="#3fd8ff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="200" cy="200" r="60" fill="url(#story-core)" />
              <circle cx="200" cy="200" r="9" fill="#fff" />
              {ORBITS.map((o, i) => {
                const c = BOT_ACCENT[o.id].color;
                return (
                  <g key={o.id}>
                    <motion.circle
                      cx="200"
                      cy="200"
                      r={o.r}
                      fill="none"
                      stroke={c}
                      strokeOpacity="0.45"
                      strokeDasharray={i === 2 ? "3 7" : undefined}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, delay: 0.2 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <g
                      style={{ transformOrigin: "200px 200px", animationDuration: `${o.dur}s` }}
                      className="motion-safe:animate-[spin_linear_infinite]"
                    >
                      <circle cx={200 + o.r} cy="200" r="12" fill={c} opacity="0.25" />
                      <circle cx={200 + o.r} cy="200" r="6" fill={c} />
                    </g>
                  </g>
                );
              })}
              <text x="200" y="384" textAnchor="middle" fill="#7b84ab" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="2">
                FURTHER FROM CORE = HIGHER RISK
              </text>
            </svg>
            <figcaption
              id="orbit-cap"
              className={`grid gap-2 text-sm ${webgl !== false ? "rounded-2xl border border-white/10 bg-void/60 p-4 backdrop-blur-md" : "mt-4"}`}
            >
              {webgl !== false && (
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                  Further from the core = higher risk
                </span>
              )}
              <span className="sr-only">
                Diagram: three orbits around a central core. The further the orbit, the higher the risk and the higher
                the illustrative target.
              </span>
              {BOTS.map((b) => (
                <span key={b.id} className="flex items-center justify-between gap-3 border-t border-line pt-2">
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: BOT_ACCENT[b.id].color }} />
                    {b.name}
                  </span>
                  <span className="font-mono text-xs text-muted">{b.risk.toUpperCase()} RISK</span>
                </span>
              ))}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
