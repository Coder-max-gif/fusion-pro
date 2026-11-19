/**
 * The cinematography of the scroll story.
 *
 * Every page element with `data-shot="<name>"` is an anchor. As the reader scrolls,
 * the camera blends between the shots of the two anchors around the viewport centre,
 * holding steady while a section is centred and gliding during the gaps.
 */

export type V3 = [number, number, number];

export interface Shot {
  pos: V3;
  look: V3;
  fov: number;
  /** Focus weights for SAFE, CORE, NOVA (0–1). */
  focus: V3;
  /** 0–1: star streaks / hyperspace. */
  warp: number;
  /** 0–1: red gravity-well lighting for the risk chapter. */
  danger: number;
  /** 0–1: visibility of the three orbit rings. */
  rings: number;
  /** Where on screen (0 top → 1 bottom) the look point lands. Defaults to 0.5. */
  oy?: number;
}

// World layout
export const CORE_POS: V3 = [0, 0.35, -1.8];
export const BOT_POS: Record<"safe" | "core" | "nova", V3> = {
  safe: [-3.4, -0.8, 0.6],
  core: [0, -0.35, 1.0],
  nova: [3.4, -0.8, 0.6],
};
export const WELL_POS: V3 = [0, 0, -82];

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

function focusShot(target: V3, wide: boolean, focus: V3, side = 1): Shot {
  // Wide screens: copy sits on the left, so frame the bot right-of-centre.
  return wide
    ? {
        pos: add(target, [1.6 * side, 0.9, 7.4]),
        look: add(target, [-2.3, 0.35, 0]),
        fov: 40,
        focus,
        warp: 0,
        danger: 0,
        rings: 0.35,
      }
    : {
        pos: add(target, [0, 0.8, 13]),
        look: add(target, [0, -2.05, 0]),
        fov: 52,
        focus,
        warp: 0,
        danger: 0,
        rings: 0.35,
      };
}

export function getShots(aspect: number): Record<string, Shot> {
  const wide = aspect >= 1;
  const base = { focus: [0, 0, 0] as V3, warp: 0, danger: 0, rings: 0.35 };
  return {
    hero: wide
      ? { ...base, pos: [0, 1.0, 15.5], look: [0, 3.15, 0], fov: 45 }
      : { ...base, pos: [0, 1.0, 23], look: [0, 6.6, 0], fov: 55 },
    story: wide
      ? { ...base, pos: [2.2, 5.8, 11.5], look: [-3.6, 0.4, -1.2], fov: 45, rings: 1 }
      : { ...base, pos: [0, 9, 21], look: [0, 0.3, -1.8], fov: 55, rings: 1, oy: 0.8 },
    safe: focusShot(BOT_POS.safe, wide, [1, 0, 0], 1),
    core: focusShot(BOT_POS.core, wide, [0, 1, 0], 0.4),
    nova: focusShot(BOT_POS.nova, wide, [0, 0, 1], -0.2),
    plans: { ...base, pos: [0, 9, 9], look: [0, 16, -40], fov: 50, rings: 0.2 },
    compare: { ...base, pos: [0, 1.5, -8], look: [0, 0, -40], fov: 50, rings: 0 },
    how: { ...base, pos: [0.6, 0.2, -18], look: [0, 0, -48], fov: 55, rings: 0 },
    technology: { ...base, pos: [0, 0, -36], look: [0, 0, -82], fov: 62, rings: 0, warp: 1 },
    risk: { ...base, pos: [0, 1.4, wide ? -66 : -62], look: [0, 0, -82], fov: wide ? 45 : 58, rings: 0, danger: 1 },
    faq: { ...base, pos: wide ? [12, 6, -56] : [4, 9, -54], look: wide ? [11, 2.6, -82] : [1, -7, -82], fov: 50, rings: 0, danger: 0.3 },
  };
}

/** Mutable per-frame state shared between the camera rig and the scene objects. */
export const rig = {
  focus: [0, 0, 0] as V3,
  warp: 0,
  danger: 0,
  rings: 0.35,
  time: 0,
  reduce: false,
};
