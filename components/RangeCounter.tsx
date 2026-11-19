"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Counts up to an illustrative range once visible. Screen readers get the static value. */
export function RangeCounter({ min, max, className }: { min: number; max: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState({ a: 0, b: 0 });

  useEffect(() => {
    // Reduced motion: show the real figures straight away, no count-up.
    if (reduce) {
      setV({ a: min, b: max });
      return;
    }
    if (!inView) return;
    const c = animate(0, 1, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (t) => setV({ a: Math.round(min * t), b: Math.round(max * t) }),
    });
    return () => c.stop();
  }, [inView, reduce, min, max]);

  return (
    <span ref={ref} className={className} aria-label={`${min} to ${max} percent per month, illustrative`}>
      <span aria-hidden="true" className="tabular-nums">
        {v.a}–{v.b}%
      </span>
    </span>
  );
}
