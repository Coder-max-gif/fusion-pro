import type Lenis from "lenis";

/** Shared handle to the smooth-scroll engine (null when disabled, e.g. reduced motion). */
let lenis: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenis = l;
}

export function lockScroll() {
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  document.documentElement.style.overflow = "";
  lenis?.start();
}

/** Scroll to a section by id, then move keyboard focus there for accessibility. */
export function scrollToId(id: string, pushHash = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) {
    // Lenis already honours the CSS scroll-padding-top (nav height), so no extra offset here.
    lenis.scrollTo(el, { duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  if (pushHash) history.pushState(null, "", `#${id}`);
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
