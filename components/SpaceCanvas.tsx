"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed, full-viewport space environment: layered stars + procedurally shaded asteroids.
 * - Parallax is driven by scroll and (on fine pointers) the cursor, eased every frame.
 * - Drift is intentionally very slow so nothing competes with body copy.
 * - Pauses when the tab is hidden; renders a single still frame for reduced-motion users.
 */

type Star = { x: number; y: number; z: number; r: number; tw: number };
type Rock = {
  x: number;
  y: number;
  z: number;
  size: number;
  rot: number;
  spin: number;
  vx: number;
  pts: [number, number][];
  craters: [number, number, number][];
  tint: string;
};

function rand(seed: number) {
  // Deterministic PRNG so layouts are stable between renders
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function SpaceCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // CSS nebula background remains as the fallback

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const r = rand(7);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let rocks: Rock[] = [];
    const tints = ["#3fd8ff", "#9478ff", "#ff8a3d"];

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const build = () => {
      size();

      const mobile = w < 768;
      const starCount = Math.min(mobile ? 110 : 260, Math.round((w * h) / 5200));
      stars = Array.from({ length: starCount }, () => ({
        x: r() * w,
        y: r() * h * 3,
        z: 0.15 + r() * 0.85,
        r: 0.3 + r() * 1.2,
        tw: r() * Math.PI * 2,
      }));

      const rockCount = mobile ? 5 : 11;
      rocks = Array.from({ length: rockCount }, (_, i) => {
        const z = 0.25 + r() * 0.75;
        const rs = (mobile ? 14 : 18) + r() * (mobile ? 30 : 52) * z;
        const n = 9 + Math.floor(r() * 5);
        const pts: [number, number][] = [];
        for (let k = 0; k < n; k++) {
          const a = (k / n) * Math.PI * 2;
          const rr = 0.72 + r() * 0.32;
          pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
        }
        const craters: [number, number, number][] = Array.from({ length: 2 + Math.floor(r() * 3) }, () => [
          (r() - 0.5) * 0.9,
          (r() - 0.5) * 0.9,
          0.08 + r() * 0.16,
        ]);
        // Keep the very centre of the first screen clear for the hero composition
        let x = r() * w;
        if (x > w * 0.3 && x < w * 0.7) x = x < w / 2 ? x - w * 0.25 : x + w * 0.25;
        return {
          x,
          y: r() * h * 2.4,
          z,
          size: rs,
          rot: r() * Math.PI * 2,
          spin: (r() - 0.5) * 0.0025,
          vx: (r() - 0.5) * 0.04,
          pts,
          craters,
          tint: tints[i % 3],
        };
      });
    };

    let scrollY = window.scrollY;
    let sy = scrollY;
    let px = 0;
    let py = 0;
    let mx = 0;
    let my = 0;
    let t = 0;

    const drawRock = (k: Rock, x: number, y: number) => {
      const s = k.size;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(k.rot);
      ctx.beginPath();
      k.pts.forEach(([a, b], i) => (i ? ctx.lineTo(a * s, b * s) : ctx.moveTo(a * s, b * s)));
      ctx.closePath();
      const g = ctx.createLinearGradient(-s, -s, s, s);
      g.addColorStop(0, "#5b5f86");
      g.addColorStop(0.45, "#262a4a");
      g.addColorStop(1, "#090b1a");
      ctx.fillStyle = g;
      ctx.globalAlpha = 0.35 + k.z * 0.6;
      ctx.fill();
      // Accent rim light (the "energy" of the world)
      ctx.strokeStyle = k.tint;
      ctx.globalAlpha = 0.18 + k.z * 0.25;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 0.35 * k.z + 0.15;
      ctx.fillStyle = "#05060f";
      k.craters.forEach(([cx, cy, cr]) => {
        ctx.beginPath();
        ctx.arc(cx * s, cy * s, cr * s, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      t += 1;
      sy += (scrollY - sy) * 0.08;
      px += (mx - px) * 0.04;
      py += (my - py) * 0.04;

      ctx.clearRect(0, 0, w, h);

      const span = h * 3;
      for (const s of stars) {
        const y = (((s.y - sy * s.z * 0.35 + py * s.z * 12) % span) + span) % span;
        if (y > h) continue;
        const x = s.x + px * s.z * 14;
        const a = reduce ? 0.7 : 0.45 + Math.sin(t * 0.02 + s.tw) * 0.3;
        ctx.globalAlpha = a * (0.4 + s.z * 0.6);
        ctx.fillStyle = s.z > 0.8 ? "#dfe8ff" : "#9fb0e6";
        ctx.fillRect(x, y, s.r * (0.6 + s.z), s.r * (0.6 + s.z));
      }
      ctx.globalAlpha = 1;

      const rspan = h * 2.4;
      for (const k of rocks) {
        if (!reduce) {
          k.rot += k.spin;
          k.x += k.vx;
          if (k.x < -80) k.x = w + 80;
          if (k.x > w + 80) k.x = -80;
        }
        const y = (((k.y - sy * k.z * 0.6 + py * k.z * 24) % rspan) + rspan) % rspan - 80;
        if (y < -120 || y > h + 120) continue;
        drawRock(k, k.x + px * k.z * 28, y);
      }
    };

    let raf = 0;
    let running = false;
    const loop = () => {
      frame();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      if (reduce) {
        sy = scrollY;
        frame();
      }
    };
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / w - 0.5) * 2;
      my = (e.clientY / h - 0.5) * 2;
    };
    const onResize = () => {
      // Mobile URL-bar show/hide only changes height: resize without reshuffling the field
      if (window.innerWidth === w) size();
      else build();
      frame();
    };
    const onVis = () => (document.hidden ? stop() : start());

    build();
    sy = scrollY;
    frame();
    start();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    if (finePointer && !reduce) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* Nebula base — also the fallback if canvas is unavailable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, rgb(56 64 160 / 0.28), transparent 70%)," +
            "radial-gradient(40% 40% at 85% 75%, rgb(148 120 255 / 0.12), transparent 70%)," +
            "radial-gradient(35% 35% at 10% 85%, rgb(63 216 255 / 0.08), transparent 70%)," +
            "linear-gradient(180deg, #04050d, #070a1c 50%, #04050d)",
        }}
      />
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  );
}
