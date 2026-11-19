"use client";

import { motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { BOT_ACCENT, BOTS, TARGET_LABEL, type BotId } from "@/lib/bots";
import { lockScroll, scrollToId, unlockScroll } from "@/lib/scroll";
import { BotFigure } from "./BotFigures";
import { RiskMeter } from "./RiskMeter";

const ease = [0.16, 1, 0.3, 1] as const;

type Ctx = { open: (id: BotId, trigger?: HTMLElement | null) => void };
const BotDialogContext = createContext<Ctx>({ open: () => {} });
export const useBotDialog = () => useContext(BotDialogContext);

/** One shared, accessible detail dialog for every "explore this bot" trigger on the page. */
export function BotDialogProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<BotId | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const open = useCallback((next: BotId, el?: HTMLElement | null) => {
    trigger.current = el ?? null;
    setId(next);
  }, []);
  const onClose = useCallback(() => {
    setId(null);
    trigger.current?.focus({ preventScroll: true });
  }, []);
  return (
    <BotDialogContext.Provider value={{ open }}>
      {children}
      <BotDialog id={id} onClose={onClose} onSwitch={setId} />
    </BotDialogContext.Provider>
  );
}

function BotDialog({
  id,
  onClose,
  onSwitch,
}: {
  id: BotId | null;
  onClose: () => void;
  onSwitch: (id: BotId) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (id && !d.open) {
      d.showModal();
      lockScroll();
    }
    if (!id && d.open) d.close();
  }, [id]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const handle = () => {
      unlockScroll();
      onClose();
    };
    d.addEventListener("close", handle);
    return () => d.removeEventListener("close", handle);
  }, [onClose]);

  const bot = id ? BOTS.find((b) => b.id === id)! : null;
  const idx = bot ? BOTS.indexOf(bot) : 0;
  const prev = BOTS[(idx + BOTS.length - 1) % BOTS.length];
  const next = BOTS[(idx + 1) % BOTS.length];

  const jump = (hash: string) => {
    ref.current?.close();
    requestAnimationFrame(() => scrollToId(hash));
  };

  return (
    <dialog
      ref={ref}
      className="bot-dialog"
      data-lenis-prevent
      aria-labelledby="dialog-title"
      onClick={(e) => {
        // click on backdrop closes
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      {bot && (
        <motion.div
          key={bot.id}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="panel max-h-[calc(100dvh-24px)] overflow-y-auto bg-deep"
          style={{ ["--accent" as string]: BOT_ACCENT[bot.id].color }}
        >
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div
              className="bot-host is-active relative flex min-h-64 items-center justify-center overflow-hidden p-6 md:min-h-full"
              style={{
                background: `radial-gradient(80% 70% at 50% 60%, ${BOT_ACCENT[bot.id].soft}, transparent 75%)`,
              }}
            >
              <BotFigure id={bot.id} className="h-64 w-auto md:h-[22rem]" />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow" style={{ color: BOT_ACCENT[bot.id].color }}>
                    Strategy profile 0{idx + 1}
                  </p>
                  <h2 id="dialog-title" className="display mt-2 text-3xl font-semibold sm:text-4xl">
                    {bot.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{bot.character}</p>
                </div>
                <button
                  type="button"
                  onClick={() => ref.current?.close()}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-white/5 transition hover:bg-white/10"
                  aria-label="Close details"
                  autoFocus
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                    <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                <div className="bg-deep p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Proposed monthly target</dt>
                  <dd className="display mt-1 text-3xl font-bold">
                    {bot.min}–{bot.max}%
                  </dd>
                  <dd className="mt-1 text-xs font-semibold" style={{ color: BOT_ACCENT[bot.id].color }}>
                    {TARGET_LABEL}
                  </dd>
                </div>
                <div className="bg-deep p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">Risk level</dt>
                  <dd className="mt-3">
                    <RiskMeter tier={bot.riskTier} color={BOT_ACCENT[bot.id].color} label={bot.risk} />
                  </dd>
                </div>
              </dl>

              <h3 className="mt-7 text-sm font-bold uppercase tracking-[0.12em] text-ink">Strategy profile</h3>
              <p className="mt-2 leading-relaxed text-muted">
                {bot.profile}
              </p>

              <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-danger">Potential downside</h3>
              <p className="mt-2 leading-relaxed text-ink/90">
                {bot.riskStatement}
              </p>

              <div className="mt-6 rounded-xl border border-line bg-white/[0.02] p-4 text-sm leading-relaxed text-muted">
                <p className="font-semibold text-ink">Not yet published</p>
                <p className="mt-1">
                  Verified performance, pricing, account requirements and onboarding details have not been published
                  for this profile. Nothing on this page is an offer or a forecast.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="btn btn-primary" onClick={() => jump("risk")}>
                  Read the risk disclosure
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => jump("compare")}>
                  Compare all three
                </button>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-line pt-5 text-sm">
                <button
                  type="button"
                  onClick={() => onSwitch(prev.id)}
                  className="rounded-full px-3 py-2 font-semibold text-muted transition hover:bg-white/5 hover:text-ink"
                >
                  ← {prev.name}
                </button>
                <button
                  type="button"
                  onClick={() => onSwitch(next.id)}
                  className="rounded-full px-3 py-2 font-semibold text-muted transition hover:bg-white/5 hover:text-ink"
                >
                  {next.name} →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </dialog>
  );
}
