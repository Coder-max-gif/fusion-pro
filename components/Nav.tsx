"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
import { lockScroll, scrollToId, unlockScroll } from "@/lib/scroll";
import { Logo } from "./Logo";

const LINKS = [
  { href: "#top", label: "Home", section: "top" },
  { href: "#technology", label: "Technology", section: "technology" },
  { href: "#minds", label: "AI Bots", section: "minds" },
  { href: "#risk", label: "Risk", section: "risk" },
  { href: "#faq", label: "FAQ", section: "faq" },
];

/** `base` is "" on the home page and "/" on sub-pages so anchors resolve to the home page. */
export function Nav({ base = "" }: { base?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view (home page only)
  useEffect(() => {
    if (base) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [base]);

  // Mobile menu: lock scroll and close on Escape
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  // Mobile links: release the scroll lock *before* jumping, then move focus to the section.
  const go = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    setOpen(false);
    if (base) return; // sub-page: let the browser navigate to the home page
    if (!document.getElementById(hash.slice(1))) return;
    e.preventDefault();
    unlockScroll();
    requestAnimationFrame(() => scrollToId(hash.slice(1)));
  };

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? "border-b border-line bg-void/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-safe focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className={`safe-x mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-500 sm:px-8 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <a href={`${base}#top`} aria-label="FUSION AI — home" onClick={close}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const isActive = !base && active === l.section;
            return (
              <li key={l.href}>
                <a
                  href={`${base}${l.href}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-line"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <a href={`${base}#bots`} className="btn btn-primary hidden !min-h-10 !px-5 !text-sm md:inline-flex">
            Explore Plans
          </a>
          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-white/[0.04] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span
              className={`absolute h-0.5 w-5 rounded bg-ink transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span className={`absolute h-0.5 w-5 rounded bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`absolute h-0.5 w-5 rounded bg-ink transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 pt-6">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={`${base}${l.href}`}
                    onClick={(e) => go(e, l.href)}
                    className="display flex items-center justify-between border-b border-line py-5 text-2xl font-semibold"
                  >
                    {l.label}
                    <span aria-hidden="true" className="font-mono text-xs text-dim">
                      0{i + 1}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="px-5 pt-8">
              <a href={`${base}#bots`} onClick={(e) => go(e, "#bots")} className="btn btn-primary w-full">
                Explore Plans
              </a>
              <p className="mt-6 text-sm leading-relaxed text-dim">
                Trading involves substantial risk, including the possible loss of all capital allocated to trading.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
