"use client";

import { motion } from "framer-motion";
import { BOT_ACCENT, BOTS, TARGET_LABEL } from "@/lib/bots";
import { BotFigure } from "./BotFigures";
import { RiskMeter } from "./RiskMeter";
import { Reveal, SectionHeading } from "./Reveal";

const ROWS = [
  { key: "target", label: "Proposed monthly target" },
  { key: "risk", label: "Risk level" },
  { key: "profile", label: "General strategy profile" },
  { key: "downside", label: "Potential downside" },
] as const;

export function Compare() {
  return (
    <section id="compare" data-shot="compare" aria-labelledby="compare-title" className="safe-x relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="compare-title"
          eyebrow="Chapter 05 · Compare"
          title="Side by side, risk first."
          intro="A higher proposed target comes with higher risk. Read the downside column as carefully as the target column."
        />

        {/* Qualitative spectrum — deliberately unscaled */}
        <Reveal delay={0.1} className="mt-12">
          <div className="relative h-3 rounded-full bg-gradient-to-r from-safe via-core to-nova opacity-80">
            {BOTS.map((b, i) => (
              <motion.span
                key={b.id}
                className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-void"
                style={{ left: `${[12, 50, 88][i]}%`, background: BOT_ACCENT[b.id].color }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 + i * 0.15 }}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
            <span>Lower risk</span>
            <span className="hidden sm:inline">Qualitative ordering — not a measured risk score</span>
            <span>Higher risk</span>
          </div>
        </Reveal>

        {/* Desktop / tablet table */}
        <Reveal delay={0.15} className="mt-12 hidden md:block">
          <div className="panel overflow-hidden">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Comparison of FUSION SAFE, FUSION CORE and FUSION NOVA. Targets are illustrative and not guaranteed.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[22%] p-6 align-bottom font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-dim">
                    Profile
                  </th>
                  {BOTS.map((b) => (
                    <th key={b.id} scope="col" className="border-l border-line p-6 align-bottom">
                      <span className="flex items-center gap-3">
                        <BotFigure id={b.id} className="h-14 w-14" title="" />
                        <span className="display text-lg font-semibold" style={{ color: BOT_ACCENT[b.id].color }}>
                          {b.name}
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.key} className="border-t border-line">
                    <th scope="row" className="p-6 align-top text-sm font-semibold text-muted">
                      {r.label}
                      {r.key === "target" && <span className="mt-1 block text-xs font-normal text-dim">{TARGET_LABEL}</span>}
                    </th>
                    {BOTS.map((b) => (
                      <td key={b.id} className="border-l border-line p-6 align-top leading-relaxed">
                        {r.key === "target" && (
                          <span className="display text-2xl font-bold">
                            {b.min}–{b.max}%<span className="ml-1 text-sm font-normal text-muted">/ mo</span>
                          </span>
                        )}
                        {r.key === "risk" && <RiskMeter tier={b.riskTier} color={BOT_ACCENT[b.id].color} label={b.risk} />}
                        {r.key === "profile" && <span className="text-muted">{b.profile}</span>}
                        {r.key === "downside" && <span className={b.id === "nova" ? "font-semibold text-ink" : "text-ink/90"}>{b.downside}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Mobile cards */}
        <ul className="mt-10 grid gap-4 md:hidden">
          {BOTS.map((b, i) => (
            <Reveal as="li" key={b.id} delay={i * 0.08} className="panel p-5">
              <div className="flex items-center gap-3">
                <BotFigure id={b.id} className="h-14 w-14" title="" />
                <h3 className="display text-lg font-semibold" style={{ color: BOT_ACCENT[b.id].color }}>
                  {b.name}
                </h3>
              </div>
              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="text-xs text-dim">Proposed monthly target · {TARGET_LABEL.toLowerCase()}</dt>
                  <dd className="display mt-0.5 text-xl font-bold">{b.min}–{b.max}%</dd>
                </div>
                <div>
                  <dt className="text-xs text-dim">Risk level</dt>
                  <dd className="mt-1.5"><RiskMeter tier={b.riskTier} color={BOT_ACCENT[b.id].color} label={b.risk} /></dd>
                </div>
                <div>
                  <dt className="text-xs text-dim">General strategy profile</dt>
                  <dd className="mt-0.5 text-muted">{b.profile}</dd>
                </div>
                <div>
                  <dt className="text-xs text-dim">Potential downside</dt>
                  <dd className="mt-0.5 font-semibold">{b.downside}</dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
