"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Fragment, useRef } from "react";
import { useWebGL } from "@/lib/useWebGL";
import { BotCore, BotNova, BotSafe } from "./BotFigures";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const webgl = useWebGL();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // As the hero scrolls away the three minds drift apart and the core dims.
  const spread = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const negSpread = useTransform(spread, (v) => -v);
  const lift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const coreScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.25]);
  const coreOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const words = ["Three", "Minds.", "One", "Fusion."];

  return (
    <section
      ref={ref}
      id="top"
      data-shot="hero"
      aria-labelledby="hero-title"
      className="safe-x relative flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pt-28 [@media(max-height:700px)]:pt-24"
    >
      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-20 mx-auto max-w-4xl text-center">
        {/* Soft scrim keeps copy legible over the live 3D scene */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-24 -inset-y-16 -z-10"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, rgb(4 5 13 / 0.72), rgb(4 5 13 / 0.35) 55%, transparent 80%)" }}
        />
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.22em" }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
        >
          The next evolution of algorithmic trading
        </motion.p>
        <h1 id="hero-title" className="display mt-5 text-[clamp(2.1rem,7.6vw,5.4rem)] font-bold max-sm:mt-4">
          {words.map((w, i) => (
            <Fragment key={w}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className={`inline-block ${
                  i === 3 ? "bg-gradient-to-r from-safe via-core to-nova bg-clip-text text-transparent" : ""
                }`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: 0.25 + i * 0.09 }}
              >
                {w}
              </motion.span>
              {i < words.length - 1 && i !== 1 && <span>&nbsp;</span>}
            </span>
            {i === 1 && <br />}
            </Fragment>
          ))}
        </h1>
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted max-sm:mt-4 max-sm:text-[0.95rem] sm:text-lg"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.7 }}
        >
          Explore a new generation of AI-assisted trading strategies, designed around distinct approaches to risk and
          market participation.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-row items-center justify-center gap-2.5 max-sm:mt-6 sm:gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.85 }}
        >
          <a href="#minds" className="btn btn-primary flex-1 whitespace-nowrap max-sm:!px-3 max-sm:!text-[0.85rem] max-[380px]:!text-[0.78rem] sm:flex-none">
            Explore the Bots
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 max-[380px]:hidden">
              <path d="M10 4v12m0 0-5-5m5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
          <a href="#risk" className="btn btn-ghost flex-1 whitespace-nowrap max-sm:!px-3 max-sm:!text-[0.85rem] max-[380px]:!text-[0.78rem] sm:flex-none">
            Understand the Risk
          </a>
        </motion.div>
        <motion.p
          className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-dim max-sm:mt-4 max-sm:text-[9.5px] max-sm:tracking-[0.1em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Illustrative targets only · Capital at risk · Not investment advice
        </motion.p>
      </motion.div>

      {/* ── The fusion stage: real 3D bots render in the WebGL world behind; SVG is the fallback ── */}
      <div className="relative z-10 mt-2 flex w-full max-w-5xl flex-1 flex-col" aria-hidden="true">
        {webgl !== false ? (
          <div data-stage className="w-full flex-1 min-h-[190px] max-h-[620px]" />
        ) : (
        <div className="relative mx-auto aspect-[16/9] w-full max-w-[calc(clamp(300px,46svh,540px)*16/9)]">
          {/* Core + orbital rings */}
          <motion.div style={{ scale: coreScale, opacity: coreOpacity }} className="absolute inset-0">
            <motion.svg
              viewBox="0 0 800 450"
              className="absolute inset-0 h-full w-full"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, ease, delay: 0.2 }}
            >
              <defs>
                <radialGradient id="hero-core">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.18" stopColor="#c9d8ff" />
                  <stop offset="0.45" stopColor="#6a6bff" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#3fd8ff" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="hero-ring" x1="0" x2="1">
                  <stop offset="0" stopColor="#3fd8ff" />
                  <stop offset="0.5" stopColor="#9478ff" />
                  <stop offset="1" stopColor="#ff8a3d" />
                </linearGradient>
              </defs>
              <circle cx="400" cy="250" r="190" fill="url(#hero-core)" opacity="0.55" />
              <ellipse cx="400" cy="250" rx="360" ry="110" fill="none" stroke="url(#hero-ring)" strokeOpacity="0.45" />
              <ellipse cx="400" cy="250" rx="360" ry="110" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="40 1632" className="motion-safe:animate-[orbit-run_9s_linear_infinite]" />
              <ellipse cx="400" cy="250" rx="280" ry="78" fill="none" stroke="url(#hero-ring)" strokeOpacity="0.3" strokeDasharray="2 10" />
              <ellipse cx="400" cy="250" rx="200" ry="52" fill="none" stroke="#c9d8ff" strokeOpacity="0.18" className="flow" />
              <circle cx="400" cy="250" r="26" fill="#fff" opacity="0.9" />
            </motion.svg>
          </motion.div>

          {/* SAFE (left) */}
          <motion.div
            style={{ x: negSpread, y: lift }}
            className="absolute bottom-[4%] left-[2%] w-[34%] sm:left-[6%] sm:w-[30%]"
          >
            <motion.div
              initial={{ opacity: 0, x: -60, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.4, ease, delay: 0.55 }}
            >
              <BotSafe className="w-full" />
            </motion.div>
          </motion.div>

          {/* NOVA (right) */}
          <motion.div
            style={{ x: spread, y: lift }}
            className="absolute bottom-[4%] right-[2%] w-[34%] sm:right-[6%] sm:w-[30%]"
          >
            <motion.div
              initial={{ opacity: 0, x: 60, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.4, ease, delay: 0.75 }}
            >
              <BotNova className="w-full" />
            </motion.div>
          </motion.div>

          {/* CORE (centre, highest) */}
          <motion.div
            style={{ y: lift }}
            className="absolute bottom-[14%] left-1/2 w-[40%] -translate-x-1/2 sm:w-[36%]"
          >
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.5, ease, delay: 0.4 }}
            >
              <BotCore className="w-full" />
            </motion.div>
          </motion.div>
        </div>
        )}
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#story"
        style={{ opacity: cueOpacity }}
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted [@media(max-height:860px)]:hidden"
        aria-label="Scroll to begin the story"
      >
        Scroll to begin
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-safe motion-safe:animate-[cue_1.8s_ease-in-out_infinite]" />
        </span>
      </motion.a>

    </section>
  );
}
