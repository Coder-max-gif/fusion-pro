"use client";

import { motion, type Variants } from "framer-motion";
import { BOT_ACCENT, BOTS, TARGET_LABEL, type Bot, type BotId } from "@/lib/bots";
import { useBotDialog } from "./BotDialog";
import { RiskMeter } from "./RiskMeter";
import { BotFigure } from "./BotFigures";
import { RangeCounter } from "./RangeCounter";
import { SectionHeading } from "./Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

/* Each bot enters with its own personality, on a shared rhythm. */
const ENTER: Record<BotId, Variants> = {
  safe: {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 1.1, ease } },
  },
  core: {
    hidden: { opacity: 0, scale: 0.88, rotate: -2 },
    show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.1, ease, delay: 0.12 } },
  },
  nova: {
    hidden: { opacity: 0, x: 60, filter: "blur(10px)" },
    show: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 90, damping: 14, delay: 0.24 },
    },
  },
};

function BotCard({ bot, onOpen }: { bot: Bot; onOpen: (id: BotId, el: HTMLElement) => void }) {
  const a = BOT_ACCENT[bot.id];
  return (
    <motion.article
      variants={ENTER[bot.id]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      aria-labelledby={`bot-${bot.id}-name`}
      className="bot-host panel panel-glow group flex flex-col overflow-hidden"
      style={{ ["--accent" as string]: a.color }}
    >
      {/* Character stage */}
      <div className="relative h-72 overflow-hidden sm:h-80" style={{ background: `radial-gradient(70% 70% at 50% 60%, ${a.soft}, transparent 70%)` }}>
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${a.color}, transparent)` }}
        />
        <span className="absolute left-5 top-5 font-mono text-[11px] tracking-[0.2em] text-dim">
          0{BOTS.indexOf(bot) + 1} / 03
        </span>
        <span
          className="absolute right-5 top-5 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ borderColor: `${a.color}66`, color: a.color }}
        >
          {bot.risk} risk
        </span>
        <BotFigure id={bot.id} className="absolute inset-x-0 bottom-2 mx-auto h-[92%] w-auto" />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 id={`bot-${bot.id}-name`} className="display text-2xl font-semibold">
          {bot.name}
        </h3>
        <p className="mt-1 text-sm text-muted">{bot.tagline}</p>

        <div className="mt-6 rounded-2xl border border-line bg-black/20 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Proposed monthly target</p>
          <p className="mt-1 flex items-baseline gap-2">
            <RangeCounter min={bot.min} max={bot.max} className="display text-4xl font-bold" />
            <span className="text-sm text-muted">/ month</span>
          </p>
          <p className="mt-2 text-xs font-semibold" style={{ color: a.color }}>
            {TARGET_LABEL}
          </p>
        </div>

        <div className="mt-5">
          <RiskMeter tier={bot.riskTier} color={a.color} label={bot.risk} />
        </div>

        <p className="mt-5 leading-relaxed text-muted">{bot.description}</p>

        <p className="mt-5 flex gap-3 rounded-xl border border-danger/25 bg-danger/[0.06] p-3.5 text-sm leading-relaxed text-ink/90">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-danger">
            <path d="M10 2 1 18h18L10 2Zm0 5v5m0 3v.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{bot.riskStatement}</span>
        </p>

        <div className="h-6 shrink-0" aria-hidden="true" />
        <button
          type="button"
          onClick={(e) => onOpen(bot.id, e.currentTarget)}
          className="btn btn-ghost mt-auto w-full justify-between"
          aria-haspopup="dialog"
        >
          Explore this bot
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-hover:translate-x-1">
            <path d="M4 10h12m0 0-5-5m5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </motion.article>
  );
}

export function Bots() {
  const { open } = useBotDialog();
  const onOpen = (id: BotId, el: HTMLElement) => open(id, el);

  return (
    <section id="bots" data-shot="plans" aria-labelledby="bots-title" className="safe-x relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="bots-title"
          eyebrow="Chapter 04 · The plans"
          title={
            <>
              Meet <span className="text-safe">SAFE</span>, <span className="text-core">CORE</span> &{" "}
              <span className="text-nova">NOVA</span>.
            </>
          }
          intro="Three strategy profiles, each with a different proposed target and a different level of risk. The figures shown are illustrative targets — not guaranteed returns or verified results."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {BOTS.map((b) => (
            <BotCard key={b.id} bot={b} onOpen={onOpen} />
          ))}
        </div>
      </div>

    </section>
  );
}
