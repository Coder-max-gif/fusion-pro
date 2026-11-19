"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type Ref, type RefObject } from "react";
import * as THREE from "three";
import { glowTexture, hdr } from "./glow";
import { BOT_POS, rig } from "./shots";

/* Shared helpers ------------------------------------------------------------ */

function Glow({ color, scale, opacity = 1, position = [0, 0, 0] as [number, number, number], refCb }: {
  color: string;
  scale: number;
  opacity?: number;
  position?: [number, number, number];
  refCb?: Ref<THREE.Sprite>;
}) {
  return (
    <sprite ref={refCb} position={position} scale={[scale, scale, scale]}>
      <spriteMaterial
        map={glowTexture()}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  );
}

function useBotMaterials(shell: string, accent: string, flat = false) {
  return useMemo(
    () => ({
      shell: new THREE.MeshStandardMaterial({ color: shell, metalness: 0.7, roughness: 0.3, flatShading: flat }),
      dark: new THREE.MeshStandardMaterial({ color: "#05070f", metalness: 0.9, roughness: 0.12 }),
      joint: new THREE.MeshStandardMaterial({ color: "#1a2350", metalness: 0.6, roughness: 0.4 }),
      glow: new THREE.MeshBasicMaterial({ color: hdr(accent, 3.2), toneMapped: false }),
      soft: new THREE.MeshBasicMaterial({ color: hdr(accent, 1.6), toneMapped: false }),
      flame: new THREE.MeshBasicMaterial({
        color: hdr(accent, 2.3),
        transparent: true,
        opacity: 0.68,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    }),
    [shell, accent, flat],
  );
}

/** Common idle: float, sway, focus scale-up, blink, thruster flicker, light boost. */
function useIdle(
  i: 0 | 1 | 2,
  base: readonly [number, number, number],
  refs: {
    g: RefObject<THREE.Group | null>;
    light: RefObject<THREE.PointLight | null>;
    thrust: RefObject<THREE.Group | null>;
    eyes: RefObject<THREE.Group | null>;
  },
  opts: { bob: number; speed: number; light: number; phase: number },
) {
  useFrame(() => {
    const t = rig.time + opts.phase;
    const f = rig.focus[i];
    const g = refs.g.current;
    if (g) {
      g.position.y = base[1] + Math.sin(t * opts.speed) * opts.bob;
      g.rotation.y = Math.sin(t * 0.4) * 0.18 * (1 - f) + f * (i === 0 ? 0.35 : i === 2 ? -0.35 : 0);
      g.rotation.z = Math.sin(t * opts.speed * 0.7) * 0.03;
      const s = 1 + f * 0.1;
      g.scale.setScalar(s);
    }
    if (refs.light.current) refs.light.current.intensity = opts.light * (0.6 + f * 1.6);
    if (refs.thrust.current) refs.thrust.current.scale.y = 0.9 + Math.sin(t * 3.2) * 0.05 + Math.sin(t * 6.4 + opts.phase) * 0.04 + f * 0.18;
    if (refs.eyes.current) refs.eyes.current.scale.y = (t % 5.2) > 5.05 ? 0.1 : 1;
  });
}

/* SAFE — the guardian -------------------------------------------------------- */

export function SafeBot() {
  const g = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const thrust = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const field = useRef<THREE.Group>(null);
  const m = useBotMaterials("#8ea3cf", "#3fd8ff");

  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.3);
    s.lineTo(0.25, 0.21);
    s.lineTo(0.25, 0.0);
    s.quadraticCurveTo(0.23, -0.21, 0, -0.33);
    s.quadraticCurveTo(-0.23, -0.21, -0.25, 0);
    s.lineTo(-0.25, 0.21);
    s.closePath();
    return {
      emblem: new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }),
      hex: new THREE.CylinderGeometry(1.8, 1.8, 3.1, 6, 1, true),
      hexEdges: new THREE.EdgesGeometry(new THREE.CylinderGeometry(1.8, 1.8, 3.1, 6, 1, false), 89).deleteAttribute("normal"),
      fieldMat: new THREE.MeshBasicMaterial({
        color: "#3fd8ff",
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      edgeMat: new THREE.LineBasicMaterial({ color: hdr("#3fd8ff", 1.6), transparent: true, opacity: 0.3, toneMapped: false }),
    };
  }, []);

  useIdle(0, BOT_POS.safe, { g, light, thrust, eyes }, { bob: 0.12, speed: 1.1, light: 9, phase: 0 });
  useFrame(() => {
    const t = rig.time;
    const f = rig.focus[0];
    if (field.current) {
      field.current.rotation.y = t * 0.15;
      const p = 1 + Math.sin(t * (1.6 + f * 2.5)) * 0.025;
      field.current.scale.set(p, 1, p);
    }
    geo.fieldMat.opacity = 0.04 + f * 0.06 + Math.sin(t * 1.6) * 0.015;
    geo.edgeMat.opacity = 0.18 + f * 0.45;
  });

  return (
    <group ref={g} position={BOT_POS.safe}>
      <pointLight ref={light} color="#3fd8ff" distance={7} decay={1.6} position={[0, 0.4, 1.6]} />

      <group ref={field} position={[0, 0.25, 0]}>
        <mesh geometry={geo.hex} material={geo.fieldMat} />
        <lineSegments geometry={geo.hexEdges} material={geo.edgeMat} />
      </group>

      {/* body */}
      <mesh material={m.shell} scale={[1.3, 1, 1.05]}>
        <capsuleGeometry args={[0.6, 0.5, 8, 28]} />
      </mesh>
      <mesh material={m.soft} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.42, 0]} scale={[1.3, 1.06, 1]}>
        <torusGeometry args={[0.6, 0.018, 8, 64]} />
      </mesh>
      <mesh geometry={geo.emblem} material={m.glow} position={[0, 0.05, 0.6]} />

      {/* head */}
      <mesh material={m.shell} position={[0, 1.08, 0]} scale={[1.3, 0.86, 1.05]}>
        <sphereGeometry args={[0.55, 32, 24]} />
      </mesh>
      <mesh material={m.dark} position={[0, 1.08, 0.46]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.6]}>
        <capsuleGeometry args={[0.17, 0.62, 6, 16]} />
      </mesh>
      <group ref={eyes} position={[0, 1.08, 0.59]}>
        <mesh material={m.glow} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.045, 0.4, 4, 12]} />
        </mesh>
      </group>
      {[-1, 1].map((s) => (
        <mesh key={s} material={m.joint} position={[s * 0.72, 1.08, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.08, 24]} />
        </mesh>
      ))}
      <mesh material={m.shell} position={[0, 1.66, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
      </mesh>
      <mesh material={m.glow} position={[0, 1.84, 0]}>
        <sphereGeometry args={[0.07, 16, 12]} />
      </mesh>

      {/* arms */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh material={m.shell} position={[s * 1.0, -0.05, 0]} rotation={[0, 0, s * 0.14]}>
            <capsuleGeometry args={[0.17, 0.45, 6, 16]} />
          </mesh>
          <mesh material={m.glow} position={[s * 1.06, -0.43, 0.06]}>
            <sphereGeometry args={[0.07, 12, 10]} />
          </mesh>
        </group>
      ))}

      {/* thruster */}
      <group ref={thrust} position={[0, -1.02, 0]}>
        <mesh material={m.flame} position={[0, -0.42, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.24, 0.85, 24, 1, true]} />
        </mesh>
      </group>
      <Glow color="#3fd8ff" scale={1.6} opacity={0.6} position={[0, -1.15, 0]} />
    </group>
  );
}

/* CORE — the strategist ------------------------------------------------------ */

export function CoreBot() {
  const g = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const thrust = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Sprite>(null);
  const m = useBotMaterials("#9d90d6", "#9478ff");
  const cyan = useMemo(() => new THREE.MeshBasicMaterial({ color: hdr("#6ad0ff", 3), toneMapped: false }), []);
  const white = useMemo(() => new THREE.MeshBasicMaterial({ color: hdr("#e9e2ff", 2.6), toneMapped: false }), []);

  useIdle(1, BOT_POS.core, { g, light, thrust, eyes }, { bob: 0.16, speed: 0.9, light: 10, phase: 1.3 });
  useFrame(() => {
    const t = rig.time;
    const f = rig.focus[1];
    const k = 1 + f * 1.8;
    if (r1.current) r1.current.rotation.set(Math.PI / 2 + Math.sin(t * 0.7) * 0.5, t * 1.1 * k, 0);
    if (r2.current) r2.current.rotation.set(t * 0.8 * k, Math.PI / 3, t * 0.4);
    if (orbit.current) orbit.current.rotation.y = t * 0.6 * k;
    if (heart.current) heart.current.scale.setScalar(1.25 + Math.sin(t * 1.6) * 0.1 + f * 0.4);
  });

  return (
    <group ref={g} position={BOT_POS.core}>
      <pointLight ref={light} color="#9478ff" distance={7} decay={1.6} position={[0, 0.3, 1.6]} />

      {/* torso + heart */}
      <mesh material={m.shell}>
        <capsuleGeometry args={[0.42, 0.55, 8, 28]} />
      </mesh>
      <mesh material={white} position={[0, 0.05, 0.4]}>
        <sphereGeometry args={[0.17, 24, 16]} />
      </mesh>
      <Glow refCb={heart} color="#b9a6ff" scale={1.3} position={[0, 0.05, 0.5]} />
      <mesh ref={r1} material={m.glow} position={[0, 0.05, 0]}>
        <torusGeometry args={[0.78, 0.02, 8, 96]} />
      </mesh>
      <mesh ref={r2} material={cyan} position={[0, 0.05, 0]}>
        <torusGeometry args={[0.98, 0.011, 8, 96]} />
      </mesh>

      {/* neck + head */}
      <mesh material={m.glow} position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.2, 16]} />
      </mesh>
      <mesh material={m.shell} position={[0, 1.32, 0]}>
        <sphereGeometry args={[0.58, 40, 28]} />
      </mesh>
      <mesh material={m.dark} position={[0, 1.33, 0.44]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.55]}>
        <capsuleGeometry args={[0.2, 0.42, 6, 16]} />
      </mesh>
      <group ref={eyes} position={[0, 1.33, 0.58]}>
        {[-1, 1].map((s) => (
          <mesh key={s} material={m.glow} position={[s * 0.16, 0, 0]}>
            <sphereGeometry args={[0.065, 16, 12]} />
          </mesh>
        ))}
      </group>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh material={m.shell} position={[s * 0.27, 1.98, 0]} rotation={[0, 0, -s * 0.38]}>
            <cylinderGeometry args={[0.018, 0.018, 0.5, 8]} />
          </mesh>
          <mesh material={s < 0 ? m.glow : cyan} position={[s * 0.37, 2.22, 0]}>
            <sphereGeometry args={[0.065, 14, 10]} />
          </mesh>
        </group>
      ))}

      {/* arms */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh material={m.shell} position={[s * 0.64, -0.05, 0]} rotation={[0, 0, s * 0.5]}>
            <capsuleGeometry args={[0.075, 0.55, 6, 12]} />
          </mesh>
          <mesh material={m.glow} position={[s * 0.84, -0.4, 0]}>
            <sphereGeometry args={[0.1, 14, 10]} />
          </mesh>
        </group>
      ))}

      {/* data orbit */}
      <group ref={orbit} rotation={[0.35, 0, 0.15]} position={[0, 0.2, 0]}>
        <mesh material={m.soft} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.75, 0.005, 6, 128]} />
        </mesh>
        <mesh material={cyan} position={[1.75, 0, 0]}>
          <sphereGeometry args={[0.05, 12, 8]} />
        </mesh>
      </group>

      <group ref={thrust} position={[0, -0.9, 0]}>
        <mesh material={m.flame} position={[0, -0.35, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.17, 0.7, 20, 1, true]} />
        </mesh>
      </group>
      <Glow color="#9478ff" scale={1.3} opacity={0.6} position={[0, -1.0, 0]} />
    </group>
  );
}

/* NOVA — the supernova ------------------------------------------------------- */

export function NovaBot() {
  const g = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const thrust = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const star = useRef<THREE.Mesh>(null);
  const flare = useRef<THREE.Sprite>(null);
  const shards = useRef<THREE.Group>(null);
  const m = useBotMaterials("#c78f9e", "#ff8a3d", true);
  const crown = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ff9a4d",
        emissive: "#d2459a",
        emissiveIntensity: 0.9,
        metalness: 0.4,
        roughness: 0.3,
        flatShading: true,
      }),
    [],
  );
  const gold = useMemo(() => new THREE.MeshBasicMaterial({ color: hdr("#ffcf6b", 3.6), toneMapped: false }), []);
  const rock = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#5a4258", roughness: 0.85, metalness: 0.1, flatShading: true }),
    [],
  );
  const shardData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        a: (i / 7) * Math.PI * 2,
        r: 1.55 + (i % 3) * 0.2,
        y: Math.sin(i * 2.1) * 0.6,
        s: 0.09 + (i % 4) * 0.035,
      })),
    [],
  );

  useIdle(2, BOT_POS.nova, { g, light, thrust, eyes }, { bob: 0.2, speed: 1.5, light: 11, phase: 2.6 });
  useFrame(() => {
    const t = rig.time;
    const f = rig.focus[2];
    if (star.current) star.current.rotation.set(t * 1.3, t * 2.1, 0);
    if (flare.current) {
      const p = 3.1 + Math.sin(t * 1.3) * 0.25 + Math.sin(t * 2.9) * 0.08 + f * 1.0;
      flare.current.scale.setScalar(p);
    }
    if (shards.current) {
      shards.current.rotation.y = t * (0.55 + f * 1.4);
      shards.current.rotation.x = Math.sin(t * 0.3) * 0.25;
    }
  });

  return (
    <group ref={g} position={BOT_POS.nova}>
      <pointLight ref={light} color="#ff8a3d" distance={7} decay={1.6} position={[0, 0.3, 1.6]} />
      <Glow refCb={flare} color="#ff7a3d" scale={3.0} opacity={0.38} position={[0, 0.1, -0.4]} />

      {/* torso */}
      <mesh material={m.shell} scale={[1.12, 1, 0.72]}>
        <octahedronGeometry args={[0.82, 0]} />
      </mesh>
      <mesh ref={star} material={gold} position={[0, 0.05, 0.5]}>
        <octahedronGeometry args={[0.16, 0]} />
      </mesh>
      <Glow color="#ffcf6b" scale={1.1} position={[0, 0.05, 0.6]} />
      {[-1, 1].map((s) => (
        <mesh key={s} material={crown} position={[s * 0.82, 0.48, 0]} rotation={[0, 0, -s * 1.15]}>
          <coneGeometry args={[0.22, 0.7, 4]} />
        </mesh>
      ))}

      {/* head + crown */}
      <mesh material={m.shell} position={[0, 1.22, 0]} scale={[1.2, 0.86, 1]}>
        <dodecahedronGeometry args={[0.5, 0]} />
      </mesh>
      <mesh material={m.dark} position={[0, 1.22, 0.38]}>
        <boxGeometry args={[0.74, 0.2, 0.12]} />
      </mesh>
      <group ref={eyes} position={[0, 1.23, 0.45]}>
        {[-1, 1].map((s) => (
          <mesh key={s} material={gold} position={[s * 0.17, 0, 0]} rotation={[0, 0, s * 0.28]}>
            <boxGeometry args={[0.2, 0.045, 0.04]} />
          </mesh>
        ))}
      </group>
      <mesh material={crown} position={[0, 1.88, 0]}>
        <coneGeometry args={[0.12, 0.75, 4]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} material={crown} position={[s * 0.3, 1.72, 0]} rotation={[0, 0, -s * 0.28]}>
          <coneGeometry args={[0.1, 0.5, 4]} />
        </mesh>
      ))}

      {/* blade arms */}
      {[-1, 1].map((s) => (
        <mesh key={s} material={m.shell} position={[s * 1.02, -0.25, 0]} rotation={[0, 0, Math.PI + s * 0.32]}>
          <coneGeometry args={[0.17, 0.95, 4]} />
        </mesh>
      ))}

      {/* twin thrusters */}
      <group ref={thrust} position={[0, -0.82, 0]}>
        {[-1, 1].map((s) => (
          <mesh key={s} material={m.flame} position={[s * 0.24, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.12, 0.6, 16, 1, true]} />
          </mesh>
        ))}
      </group>
      <Glow color="#ff8a3d" scale={1.4} opacity={0.6} position={[0, -0.95, 0]} />

      {/* orbiting shards */}
      <group ref={shards}>
        {shardData.map((d, i) => (
          <mesh
            key={i}
            material={rock}
            position={[Math.cos(d.a) * d.r, d.y + 0.2, Math.sin(d.a) * d.r]}
            rotation={[d.a, d.a * 2, 0]}
          >
            <dodecahedronGeometry args={[d.s, 0]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
