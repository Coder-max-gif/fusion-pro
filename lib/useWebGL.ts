"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

function detect(): boolean {
  if (cached !== null) return cached;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    cached = !!gl;
    // Free the probe context immediately
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

const subscribe = () => () => {};

/**
 * `null` during SSR / first paint, then `true`/`false` once the browser is probed.
 * Lets components render a 2D fallback when WebGL is unavailable.
 */
export function useWebGL(): boolean | null {
  return useSyncExternalStore(subscribe, detect, () => null);
}
