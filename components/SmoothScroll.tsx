"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { scrollToId, setLenis } from "@/lib/scroll";

/**
 * Inertial smooth scrolling (wheel/trackpad only — touch keeps native momentum).
 * Disabled entirely for reduced-motion users. Same-page anchor links are routed
 * through Lenis so they glide instead of jumping.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.9 });
    setLenis(lenis);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const hash = href.startsWith("#") ? href : href.startsWith("/#") && location.pathname === "/" ? href.slice(1) : null;
      if (!hash || hash.length < 2 || !document.getElementById(hash.slice(1))) return;
      e.preventDefault();
      scrollToId(hash.slice(1));
    };
    document.addEventListener("click", onClick);

    // Honour a hash on first load (e.g. /#risk)
    if (location.hash.length > 1) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) lenis.scrollTo(el, { immediate: true });
      });
    }

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
