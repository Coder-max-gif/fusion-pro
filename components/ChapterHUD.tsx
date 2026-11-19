"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const CHAPTERS = [
  ["top", "Origin"],
  ["story", "Platform"],
  ["minds", "The minds"],
  ["bots", "Plans"],
  ["compare", "Compare"],
  ["how", "Journey"],
  ["technology", "Technology"],
  ["risk", "Risk"],
  ["faq", "FAQ"],
] as const;

/** Game-style chapter tracker on the right edge (large screens only). */
export function ChapterHUD() {
  const [active, setActive] = useState("top");
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const show = useTransform(scrollY, [200, 500], [0, 1]);

  useEffect(() => {
    const els = CHAPTERS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const idx = CHAPTERS.findIndex(([id]) => id === active);

  return (
    <motion.nav
      aria-label="Chapters"
      style={{ opacity: show }}
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <div className="relative flex flex-col items-end gap-3.5">
        <span aria-hidden="true" className="absolute right-[5px] top-1 h-[calc(100%-8px)] w-px bg-white/10">
          <motion.span style={{ scaleY: progress }} className="block h-full w-full origin-top bg-gradient-to-b from-safe via-core to-nova" />
        </span>
        {CHAPTERS.map(([id, label], i) => {
          const on = id === active;
          return (
            <a key={id} href={`#${id}`} aria-current={on ? "true" : undefined} className="group relative flex items-center gap-3">
              <span
                className={`pointer-events-none whitespace-nowrap rounded-full border border-white/10 bg-void/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] backdrop-blur transition-all duration-300 ${
                  on ? "text-ink opacity-100" : "translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                <span className="text-dim">{String(i + 1).padStart(2, "0")}</span> {label}
              </span>
              <span
                className={`relative z-10 block h-[11px] w-[11px] rounded-full border transition-all duration-300 ${
                  on ? "scale-125 border-safe bg-safe shadow-[0_0_12px_#3fd8ff]" : i < idx ? "border-core bg-core/60" : "border-white/30 bg-void"
                }`}
              />
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}
