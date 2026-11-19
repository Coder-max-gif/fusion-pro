"use client";

import { useId } from "react";
import type { BotId } from "@/lib/bots";

/**
 * Original FUSION AI bot family. Shared DNA: dark glass visor, metallic shell,
 * thruster flame and accent-lit core. Distinct silhouettes:
 *  SAFE — wide, rounded, shielded.   CORE — floating sphere head, orbiting data rings.
 *  NOVA — angular, crowned, star-burst core with orbiting shards.
 */

interface BotProps {
  className?: string;
  title?: string;
}

/** An empty title marks the figure as decorative. */
function a11y(title?: string) {
  return title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };
}

function useIds() {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (k: string) => `${raw}-${k}`;
}

function Thruster({ x, y, w, id, color }: { x: number; y: number; w: number; id: string; color: string }) {
  return (
    <g className="b-thrust">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.95" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${x - w / 2} ${y} Q${x} ${y + w * 2.6} ${x + w / 2} ${y} Z`} fill={`url(#${id})`} />
      <path d={`M${x - w / 4} ${y} Q${x} ${y + w * 1.3} ${x + w / 4} ${y} Z`} fill="#fff" opacity="0.8" />
    </g>
  );
}

function GroundGlow({ id, color }: { id: string; color: string }) {
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={color} stopOpacity="0.45" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="384" rx="110" ry="12" fill={`url(#${id})`} />
    </>
  );
}

function Glow({ id }: { id: string }) {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

/* ───────────────────────────── SAFE ───────────────────────────── */
export function BotSafe({ className, title = "FUSION SAFE bot" }: BotProps) {
  const id = useIds();
  return (
    <svg viewBox="0 0 400 400" className={`bot bot-safe ${className ?? ""}`} {...a11y(title)}>
      <defs>
        <linearGradient id={id("shell")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#eef5ff" />
          <stop offset="0.45" stopColor="#7d97c9" />
          <stop offset="1" stopColor="#152049" />
        </linearGradient>
        <radialGradient id={id("field")} cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#3fd8ff" stopOpacity="0" />
          <stop offset="0.75" stopColor="#3fd8ff" stopOpacity="0.07" />
          <stop offset="1" stopColor="#3fd8ff" stopOpacity="0.28" />
        </radialGradient>
        <linearGradient id={id("emblem")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c6f6ff" />
          <stop offset="1" stopColor="#1fa9d6" />
        </linearGradient>
        <Glow id={id("glow")} />
      </defs>

      <GroundGlow id={id("ground")} color="#3fd8ff" />

      <g className="b-float">
        {/* Hexagonal energy field */}
        <g className="b-shield">
          <path
            d="M200 30 L352 118 V292 L200 380 L48 292 V118 Z"
            fill={`url(#${id("field")})`}
            stroke="#3fd8ff"
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
          <path
            d="M200 52 L333 129 V281 L200 358 L67 281 V129 Z"
            fill="none"
            stroke="#3fd8ff"
            strokeOpacity="0.22"
            strokeDasharray="3 9"
          />
        </g>

        <Thruster x={200} y={300} w={46} id={id("th")} color="#3fd8ff" />

        {/* Arms */}
        <rect x="88" y="190" width="38" height="80" rx="19" fill={`url(#${id("shell")})`} stroke="#fff" strokeOpacity="0.2" />
        <rect x="274" y="190" width="38" height="80" rx="19" fill={`url(#${id("shell")})`} stroke="#fff" strokeOpacity="0.2" />
        <circle cx="107" cy="258" r="6" fill="#3fd8ff" opacity="0.8" />
        <circle cx="293" cy="258" r="6" fill="#3fd8ff" opacity="0.8" />

        {/* Body */}
        <rect x="118" y="168" width="164" height="136" rx="50" fill={`url(#${id("shell")})`} stroke="#fff" strokeOpacity="0.28" />
        <path d="M140 290 Q200 312 260 290" stroke="#3fd8ff" strokeOpacity="0.5" strokeWidth="2" fill="none" />

        {/* Chest shield emblem */}
        <g filter={`url(#${id("glow")})`}>
          <path
            d="M200 202 L234 214 V240 C234 262 217 275 200 281 C183 275 166 262 166 240 V214 Z"
            fill={`url(#${id("emblem")})`}
            className="b-pulse"
          />
        </g>
        <path d="M186 240 L197 251 L216 228" stroke="#04263a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Head */}
        <line x1="200" y1="96" x2="200" y2="72" stroke="#9fb4e0" strokeWidth="4" />
        <circle cx="200" cy="68" r="7" fill="#3fd8ff" filter={`url(#${id("glow")})`} />
        <rect x="132" y="94" width="136" height="94" rx="42" fill={`url(#${id("shell")})`} stroke="#fff" strokeOpacity="0.3" />
        <circle cx="132" cy="141" r="11" fill="#0d3e5c" stroke="#3fd8ff" strokeOpacity="0.7" />
        <circle cx="268" cy="141" r="11" fill="#0d3e5c" stroke="#3fd8ff" strokeOpacity="0.7" />
        <rect x="148" y="117" width="104" height="48" rx="24" fill="#040d1a" stroke="#3fd8ff" strokeOpacity="0.6" />
        <g filter={`url(#${id("glow")})`}>
          <ellipse className="b-eye" cx="200" cy="141" rx="28" ry="8" fill="#7fe8ff" />
        </g>
        <path d="M156 124 Q175 119 190 121" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/* ───────────────────────────── CORE ───────────────────────────── */
export function BotCore({ className, title = "FUSION CORE bot" }: BotProps) {
  const id = useIds();
  return (
    <svg viewBox="0 0 400 400" className={`bot bot-core ${className ?? ""}`} {...a11y(title)}>
      <defs>
        <linearGradient id={id("shell")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#efeaff" />
          <stop offset="0.45" stopColor="#8676d0" />
          <stop offset="1" stopColor="#1c1650" />
        </linearGradient>
        <radialGradient id={id("head")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f5f2ff" />
          <stop offset="0.5" stopColor="#8676d0" />
          <stop offset="1" stopColor="#1c1650" />
        </radialGradient>
        <radialGradient id={id("core")}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#c9bbff" />
          <stop offset="1" stopColor="#6a4bff" stopOpacity="0" />
        </radialGradient>
        <Glow id={id("glow")} />
      </defs>

      <GroundGlow id={id("ground")} color="#9478ff" />

      <g className="b-float">
        {/* Outer data orbit */}
        <g className="b-spin">
          <circle cx="200" cy="232" r="150" fill="none" stroke="#9478ff" strokeOpacity="0.28" strokeDasharray="2 14" strokeWidth="3" />
          <circle cx="350" cy="232" r="5" fill="#c9bbff" />
        </g>

        <Thruster x={200} y={306} w={34} id={id("th")} color="#9478ff" />

        {/* Arms — slim, articulated */}
        <path d="M164 206 L128 236 L118 276" stroke="#6f62b8" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M236 206 L272 236 L282 276" stroke="#6f62b8" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M164 206 L128 236 L118 276" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M236 206 L272 236 L282 276" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="128" cy="236" r="8" fill="#2c2370" stroke="#9478ff" />
        <circle cx="272" cy="236" r="8" fill="#2c2370" stroke="#9478ff" />
        <circle cx="118" cy="280" r="10" fill="#9478ff" opacity="0.85" />
        <circle cx="282" cy="280" r="10" fill="#9478ff" opacity="0.85" />

        {/* Torso capsule */}
        <rect x="156" y="190" width="88" height="122" rx="44" fill={`url(#${id("shell")})`} stroke="#fff" strokeOpacity="0.28" />

        {/* Neck */}
        <rect x="189" y="172" width="22" height="22" rx="6" fill="#9478ff" opacity="0.9" filter={`url(#${id("glow")})`} />

        {/* Energy core + counter-rotating data rings */}
        <circle cx="200" cy="244" r="34" fill={`url(#${id("core")})`} className="b-pulse" />
        <circle cx="200" cy="244" r="11" fill="#fff" />
        <g className="b-spin">
          <circle cx="200" cy="244" r="50" fill="none" stroke="#c9bbff" strokeWidth="2.5" strokeDasharray="22 10 4 10" />
        </g>
        <g className="b-spin-rev">
          <circle cx="200" cy="244" r="66" fill="none" stroke="#6ad0ff" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="1 7" />
          <circle cx="266" cy="244" r="4.5" fill="#6ad0ff" />
        </g>

        {/* Antennae */}
        <path d="M172 76 L158 44" stroke="#a99cdf" strokeWidth="4" strokeLinecap="round" />
        <path d="M228 76 L242 44" stroke="#a99cdf" strokeWidth="4" strokeLinecap="round" />
        <circle cx="157" cy="41" r="6" fill="#c9bbff" filter={`url(#${id("glow")})`} />
        <circle cx="243" cy="41" r="6" fill="#6ad0ff" filter={`url(#${id("glow")})`} />

        {/* Sphere head */}
        <circle cx="200" cy="122" r="58" fill={`url(#${id("head")})`} stroke="#fff" strokeOpacity="0.3" />
        <rect x="154" y="104" width="92" height="36" rx="18" fill="#0a0722" stroke="#9478ff" strokeOpacity="0.7" />
        <g filter={`url(#${id("glow")})`}>
          <circle className="b-eye" cx="183" cy="122" r="7.5" fill="#d9ceff" />
          <circle className="b-eye" cx="217" cy="122" r="7.5" fill="#d9ceff" />
        </g>
        <path d="M168 84 Q188 72 210 74" stroke="#fff" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/* ───────────────────────────── NOVA ───────────────────────────── */
function star(cx: number, cy: number, ro: number, ri: number, n: number) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? ro : ri;
    const a = (Math.PI / n) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}
const NOVA_BURST = star(200, 236, 150, 46, 8);
const NOVA_CORE = star(200, 238, 30, 9, 4);

export function BotNova({ className, title = "FUSION NOVA bot" }: BotProps) {
  const id = useIds();
  return (
    <svg viewBox="0 0 400 400" className={`bot bot-nova ${className ?? ""}`} {...a11y(title)}>
      <defs>
        <linearGradient id={id("shell")} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#ffe9d9" />
          <stop offset="0.42" stopColor="#c0687c" />
          <stop offset="1" stopColor="#2a0f38" />
        </linearGradient>
        <linearGradient id={id("crown")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf6b" />
          <stop offset="1" stopColor="#d2459a" />
        </linearGradient>
        <radialGradient id={id("burst")}>
          <stop offset="0" stopColor="#ffcf6b" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#ff8a3d" stopOpacity="0.35" />
          <stop offset="1" stopColor="#b8379e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("rock")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6a7e" />
          <stop offset="1" stopColor="#24142e" />
        </linearGradient>
        <Glow id={id("glow")} />
      </defs>

      <GroundGlow id={id("ground")} color="#ff8a3d" />

      {/* Orbiting asteroid shards */}
      <g className="b-shards">
        <polygon points="40,190 54,178 70,186 66,204 48,206" fill={`url(#${id("rock")})`} stroke="#ff8a3d" strokeOpacity="0.6" />
        <polygon points="330,90 346,86 352,100 338,110" fill={`url(#${id("rock")})`} stroke="#ffcf6b" strokeOpacity="0.6" />
        <polygon points="300,330 318,324 326,340 310,350 298,344" fill={`url(#${id("rock")})`} stroke="#ff8a3d" strokeOpacity="0.6" />
        <polygon points="110,60 120,54 128,64 118,72" fill={`url(#${id("rock")})`} stroke="#d2459a" strokeOpacity="0.7" />
      </g>

      <g className="b-float">
        {/* Star-burst flare */}
        <g className="b-flare">
          <polygon points={NOVA_BURST} fill={`url(#${id("burst")})`} />
        </g>

        <Thruster x={182} y={300} w={26} id={id("th1")} color="#ff8a3d" />
        <Thruster x={218} y={300} w={26} id={id("th2")} color="#ff8a3d" />

        {/* Arms — angular blades */}
        <polygon points="128,196 92,236 104,292 120,250 146,222" fill={`url(#${id("shell")})`} stroke="#fff" strokeOpacity="0.22" />
        <polygon points="272,196 308,236 296,292 280,250 254,222" fill={`url(#${id("shell")})`} stroke="#fff" strokeOpacity="0.22" />
        <polygon points="104,292 96,312 112,300" fill="#ffcf6b" />
        <polygon points="296,292 304,312 288,300" fill="#ffcf6b" />

        {/* Torso */}
        <polygon points="138,184 262,184 282,224 230,306 170,306 118,224" fill={`url(#${id("shell")})`} stroke="#fff" strokeOpacity="0.28" />
        {/* Pauldrons */}
        <polygon points="138,184 96,164 118,224" fill={`url(#${id("crown")})`} opacity="0.9" />
        <polygon points="262,184 304,164 282,224" fill={`url(#${id("crown")})`} opacity="0.9" />

        {/* Star core */}
        <g filter={`url(#${id("glow")})`} className="b-pulse">
          <polygon points={NOVA_CORE} fill="#ffe2a0" />
        </g>
        <circle cx="200" cy="238" r="6" fill="#fff" />

        {/* Crown */}
        <polygon points="160,114 172,66 188,112" fill={`url(#${id("crown")})`} />
        <polygon points="184,112 200,40 216,112" fill={`url(#${id("crown")})`} />
        <polygon points="212,112 228,66 240,114" fill={`url(#${id("crown")})`} />

        {/* Head */}
        <polygon points="148,108 252,108 266,148 240,184 160,184 134,148" fill={`url(#${id("shell")})`} stroke="#fff" strokeOpacity="0.3" />
        <polygon points="156,128 244,128 236,160 164,160" fill="#14051c" stroke="#ff8a3d" strokeOpacity="0.75" />
        <g filter={`url(#${id("glow")})`}>
          <polygon className="b-eye" points="170,138 194,144 192,152 172,148" fill="#ffcf6b" />
          <polygon className="b-eye" points="230,138 206,144 208,152 228,148" fill="#ffcf6b" />
        </g>
      </g>
    </svg>
  );
}

export function BotFigure({ id, className, title }: { id: BotId } & BotProps) {
  if (id === "safe") return <BotSafe className={className} title={title} />;
  if (id === "core") return <BotCore className={className} title={title} />;
  return <BotNova className={className} title={title} />;
}
