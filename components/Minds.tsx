"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BOT_ACCENT, BOTS, TARGET_LABEL, type Bot } from "@/lib/bots";
import { useWebGL } from "@/lib/useWebGL";
import { useBotDialog } from "./BotDialog";
import { BotFigure } from "./BotFigures";
import { RangeCounter } from "./RangeCounter";
import { SectionHeading } from "./Reveal";
import { RiskMeter } from "./RiskMeter";

/**
 * "Meet the minds" — a pinned, scroll-driven chapter per bot.
 * Each chapter is a tall track with a sticky viewport; the 3D camera flies to the bot
 * (see world/shots.ts) while this copy panel scrubs in and out with scroll.
 */
function Chapter({ bot, i }: { bot: Bot; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const webgl = useWebGL();
  const { open } = useBotDialog();
  const a = BOT_ACCENT[bot.id];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.18, 0.32, 0.68, 0.84], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.18, 0.32, 0.68, 0.84], [90, 0, 0, -90]);
  const blur = useTransform(scrollYProgress, [0.18, 0.32, 0.68, 0.84], ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);
  const bigX = useTransform(scrollYProgress, [0, 1], ["12%", "-28%"]);
  const line = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <div ref={ref} data-shot={bot.id} className="relative h-[190vh]" aria-labelledby={`mind-${bot.id}`} role="group">
      <div className="safe-x safe-b sticky top-0 flex h-[100svh] w-full items-end overflow-hidden px-4 pb-6 sm:px-8 lg:items-center lg:!pb-0">
        {/* Giant outlined name drifting behind — pure atmosphere */}
        <motion.span
          aria-hidden="true"
          style={{ x: bigX, WebkitTextStroke: `1px ${a.color}` }}
          className="display pointer-events-none absolute bottom-[6%] left-0 select-none whitespace-nowrap text-[26vw] font-bold leading-none text-transparent opacity-[0.13] lg:bottom-[2%] lg:text-[19vw]"
        >
          {bot.shortName}
        </motion.span>

        {/* 2D fallback when WebGL is unavailable */}
        {webgl === false && (
          <div className="absolute inset-x-0 top-20 mx-auto h-[38vh] w-[38vh] lg:left-auto lg:right-[10%] lg:top-1/2 lg:h-[56vh] lg:w-[56vh] lg:-translate-y-1/2">
            <BotFigure id={bot.id} className="h-full w-full" title="" />
          </div>
        )}

        <motion.article
          style={{ opacity, y, filter: blur, ["--accent" as string]: a.color }}
          className="relative mx-auto w-full max-w-7xl"
        >
          <div className="max-w-[30rem] rounded-[26px] border border-white/10 bg-[rgb(5_7_18/0.62)] p-5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur-xl sm:p-7 [@media(max-height:740px)]:p-4 md:max-lg:mx-auto md:max-lg:max-w-xl">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.22em] text-dim">MIND 0{i + 1} / 03</span>
              <motion.span style={{ scaleX: line, background: a.color }} className="h-px flex-1 origin-left" />
            </div>
            <h3 id={`mind-${bot.id}`} className="display mt-3 text-[clamp(1.8rem,5vw,3.4rem)] font-bold [@media(max-height:740px)]:mt-2 [@media(max-height:740px)]:text-[1.7rem]" style={{ color: a.color }}>
              {bot.name}
            </h3>
            <p className="mt-1 text-base text-ink sm:text-lg">{bot.tagline}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5 [@media(max-height:740px)]:hidden" aria-label="Character">
              {bot.character.split(" · ").map((c) => (
                <li key={c} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-muted">
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4 [@media(max-height:740px)]:mt-3 [@media(max-height:740px)]:pt-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Proposed monthly target</p>
                <p className="mt-1 flex items-baseline gap-2">
                  <RangeCounter min={bot.min} max={bot.max} className="display text-4xl font-bold sm:text-5xl" />
                  <span className="text-sm text-muted">/ mo</span>
                </p>
                <p className="mt-1 text-xs font-semibold" style={{ color: a.color }}>
                  {TARGET_LABEL}
                </p>
              </div>
              <RiskMeter tier={bot.riskTier} color={a.color} label={bot.risk} />
            </div>

            <p className="mt-4 hidden text-sm leading-relaxed text-muted sm:block">{bot.description}</p>
            <p className="mt-3 rounded-xl border border-danger/25 bg-danger/[0.07] px-3.5 py-2.5 text-[13px] leading-relaxed text-ink/90">
              {bot.riskStatement}
            </p>

            <button
              type="button"
              onClick={(e) => open(bot.id, e.currentTarget)}
              aria-haspopup="dialog"
              className="btn btn-ghost mt-5 w-full justify-between [@media(max-height:740px)]:mt-3"
            >
              Open full profile
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </motion.article>
      </div>
    </div>
  );
}

export function Minds() {
  return (
    <section id="minds" aria-labelledby="minds-title" className="relative">
      <div className="safe-x px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-7xl max-lg:max-w-xl max-lg:rounded-3xl max-lg:border max-lg:border-white/10 max-lg:bg-void/60 max-lg:p-5 max-lg:backdrop-blur-md">
          <SectionHeading
            id="minds-title"
            eyebrow="Chapter 03 · The minds"
            title={
              <>
                Three minds. <span className="text-muted">Three temperaments.</span>
              </>
            }
            intro="Keep scrolling to meet each one up close. Every figure below is an illustrative target, not a promise."
          />
        </div>
      </div>
      {BOTS.map((b, i) => (
        <Chapter key={b.id} bot={b} i={i} />
      ))}
    </section>
  );
}
