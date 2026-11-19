import * as THREE from "three";

let tex: THREE.Texture | null = null;

/** Soft radial sprite used for every additive glow in the scene (generated once, no image assets). */
export function glowTexture() {
  if (tex) return tex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.2, "rgba(255,255,255,0.55)");
  grd.addColorStop(0.5, "rgba(255,255,255,0.12)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** HDR colour (>1) so the bloom pass picks it up. */
export function hdr(hex: string, k: number) {
  return new THREE.Color(hex).multiplyScalar(k);
}
