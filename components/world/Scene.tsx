"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CoreBot, NovaBot, SafeBot } from "./Bots3D";
import { glowTexture, hdr } from "./glow";
import { CORE_POS, getShots, rig, WELL_POS, type Shot } from "./shots";

/* ───────────── Deterministic random so the world is identical every visit ───────────── */
function prng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/* ───────────── Nebula sky dome ───────────── */
function Nebula() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uDanger: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform float uDanger;
          varying vec3 vDir;
          float lobe(vec3 d, vec3 c, float p) { return pow(max(dot(d, normalize(c)), 0.0), p); }
          void main() {
            vec3 d = normalize(vDir);
            vec3 col = vec3(0.006, 0.008, 0.022);
            col += vec3(0.10, 0.12, 0.40) * lobe(d, vec3(-0.45, 0.35, -1.0), 9.0) * 0.32;
            col += vec3(0.36, 0.16, 0.50) * lobe(d, vec3(0.75, -0.25, -0.7), 12.0) * 0.22;
            col += vec3(0.04, 0.28, 0.42) * lobe(d, vec3(0.0, 0.45, 1.0), 8.0) * 0.16;
            col += vec3(0.55, 0.10, 0.06) * lobe(d, vec3(0.0, 0.0, -1.0), 10.0) * 0.55 * uDanger;
            gl_FragColor = vec4(col, 1.0);
          }`,
      }),
    [],
  );
  useFrame(() => {
    mat.uniforms.uDanger.value = rig.danger;
  });
  return (
    <mesh material={mat} position={[0, 0, -40]}>
      <sphereGeometry args={[260, 32, 16]} />
    </mesh>
  );
}

/* ───────────── Starfield (twinkling points) ───────────── */
function Stars({ count }: { count: number }) {
  const { geo, mat } = useMemo(() => {
    const r = prng(3);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const palette = [new THREE.Color("#ffffff"), new THREE.Color("#a9c4ff"), new THREE.Color("#c7b6ff"), new THREE.Color("#8fe7ff")];
    for (let i = 0; i < count; i++) {
      const u = r() * 2 - 1;
      const th = r() * Math.PI * 2;
      const rad = 70 + r() * 150;
      const s = Math.sqrt(1 - u * u);
      pos.set([Math.cos(th) * s * rad, u * rad * 0.7, Math.sin(th) * s * rad - 40], i * 3);
      const c = palette[Math.floor(r() * palette.length)];
      col.set([c.r, c.g, c.b], i * 3);
      size[i] = 0.6 + Math.pow(r(), 3) * 2.6;
      phase[i] = r() * 6.28;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixel: { value: 1 } },
      vertexShader: /* glsl */ `
        attribute vec3 aColor; attribute float aSize; attribute float aPhase;
        uniform float uTime; uniform float uPixel;
        varying vec3 vColor; varying float vTw;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          vTw = 0.68 + 0.32 * sin(uTime * (0.7 + fract(aPhase) * 0.8) + aPhase);
          gl_PointSize = max(1.0, aSize * uPixel * (260.0 / -mv.z));
          vColor = aColor;
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vColor; varying float vTw;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor * 1.4, a * vTw);
        }`,
    });
    return { geo, mat };
  }, [count]);
  const { gl } = useThree();
  useFrame(() => {
    mat.uniforms.uTime.value = rig.time;
    mat.uniforms.uPixel.value = gl.getPixelRatio();
  });
  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

/* ───────────── Hyperspace streaks (Technology chapter) ───────────── */
function Warp({ count }: { count: number }) {
  const { geo, mat } = useMemo(() => {
    const r = prng(11);
    const pos = new Float32Array(count * 2 * 3);
    const end = new Float32Array(count * 2);
    const speed = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2;
      const rad = 2.5 + Math.pow(r(), 0.6) * 22;
      const x = Math.cos(a) * rad;
      const y = Math.sin(a) * rad;
      const z = -20 - r() * 100;
      const sp = 0.6 + r() * 0.8;
      for (let k = 0; k < 2; k++) {
        pos.set([x, y, z], (i * 2 + k) * 3);
        end[i * 2 + k] = k;
        speed[i * 2 + k] = sp;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aEnd", new THREE.BufferAttribute(end, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTravel: { value: 0 }, uWarp: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aEnd; attribute float aSpeed;
        uniform float uTravel; uniform float uWarp;
        varying float vA;
        void main() {
          vec3 p = position;
          p.z = -120.0 + mod(p.z + 120.0 + uTravel * aSpeed, 100.0);
          p.z -= aEnd * (0.4 + uWarp * 9.0) * aSpeed;
          vA = 1.0 - aEnd;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uWarp; varying float vA;
        void main() {
          vec3 c = mix(vec3(0.55, 0.45, 1.0), vec3(0.6, 0.95, 1.0), vA);
          gl_FragColor = vec4(c * 1.6, vA * uWarp * 0.75);
        }`,
    });
    return { geo, mat };
  }, [count]);
  useFrame((_, dt) => {
    mat.uniforms.uWarp.value = rig.warp;
    if (!rig.reduce) mat.uniforms.uTravel.value += dt * (2 + rig.warp * 46);
  });
  return <lineSegments geometry={geo} material={mat} frustumCulled={false} />;
}

/* ───────────── Asteroid field (one instanced mesh) ───────────── */
function Asteroids({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { geo, data } = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const h = Math.sin(v.x * 3.1 + v.y * 1.7) * Math.cos(v.z * 2.3 - v.x * 1.3);
      const h2 = Math.sin(v.x * 7.0 + v.z * 5.0) * 0.06;
      v.multiplyScalar(1 + h * 0.22 + h2);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    const r = prng(19);
    const data = Array.from({ length: count }, () => {
      const z = 8 - r() * 105;
      const minR = z > -14 ? 13 : 4.5;
      const a = r() * Math.PI * 2;
      const rad = minR + Math.pow(r(), 0.8) * 24;
      const big = r() > 0.94;
      return {
        p: new THREE.Vector3(Math.cos(a) * rad, Math.sin(a) * rad * 0.65, z),
        s: big ? 1.4 + r() * 1.8 : 0.12 + Math.pow(r(), 2) * 0.9,
        rot: new THREE.Euler(r() * 6, r() * 6, r() * 6),
        spin: new THREE.Vector3((r() - 0.5) * 0.4, (r() - 0.5) * 0.4, (r() - 0.5) * 0.2),
        stretch: new THREE.Vector3(0.8 + r() * 0.5, 0.7 + r() * 0.4, 0.8 + r() * 0.5),
      };
    });
    return { geo: g, data };
  }, [count]);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3a3e5c", roughness: 0.95, metalness: 0.08, flatShading: true }),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    const step = rig.reduce ? 0 : dt;
    data.forEach((d, i) => {
      d.rot.x += d.spin.x * step;
      d.rot.y += d.spin.y * step;
      d.rot.z += d.spin.z * step;
      dummy.position.copy(d.p);
      dummy.rotation.copy(d.rot);
      dummy.scale.copy(d.stretch).multiplyScalar(d.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geo, mat, count]} frustumCulled={false} />;
}

/* ───────────── The Fusion Core + orbit rings ───────────── */
function FusionCore() {
  const shell = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Sprite>(null);
  const sats = useRef<THREE.Group>(null);
  const wave = useRef<THREE.Sprite>(null);
  const waveMat = useRef<THREE.SpriteMaterial>(null);
  const fresnel = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color("#8fa6ff") } },
        vertexShader: /* glsl */ `
          varying vec3 vN; varying vec3 vV;
          void main() {
            vN = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
          void main() {
            float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.4);
            gl_FragColor = vec4(uColor * f * 3.0, f);
          }`,
      }),
    [],
  );
  const rings = useMemo(
    () =>
      [
        { r: 2.5, c: "#3fd8ff", sp: 0.35 },
        { r: 3.7, c: "#9478ff", sp: 0.55 },
        { r: 4.9, c: "#ff8a3d", sp: 0.85 },
      ].map((x) => ({
        ...x,
        mat: new THREE.MeshBasicMaterial({ color: hdr(x.c, 2.2), transparent: true, toneMapped: false, depthWrite: false }),
        dot: new THREE.MeshBasicMaterial({ color: hdr(x.c, 5), toneMapped: false }),
      })),
    [],
  );
  const white = useMemo(() => new THREE.MeshBasicMaterial({ color: hdr("#f2f4ff", 4.2), toneMapped: false }), []);

  useFrame(() => {
    const t = rig.time;
    const p = 1 + Math.sin(t * 0.9) * 0.02;
    shell.current?.scale.setScalar(p);
    glow.current?.scale.setScalar(6.0 + Math.sin(t * 0.9) * 0.2);
    rings.forEach((x) => (x.mat.opacity = 0.12 + rig.rings * 0.6));
    if (sats.current) sats.current.children.forEach((c, i) => (c.rotation.y = t * rings[i].sp));
    // Energy pulse: grows out of the core and fades — slow (one every 4.5 s), soft, never a hard flash
    if (wave.current && waveMat.current) {
      const ph = (t % 4.5) / 4.5;
      const e = 1 - Math.pow(1 - ph, 3);
      wave.current.scale.setScalar(1.5 + e * 11);
      waveMat.current.opacity = rig.reduce ? 0 : 0.32 * Math.sin(Math.min(1, ph * 1.15) * Math.PI) * (1 - ph);
    }
  });

  return (
    <group position={CORE_POS}>
      <pointLight color="#8fa6ff" intensity={14} distance={14} decay={1.6} />
      <mesh material={white}>
        <sphereGeometry args={[0.5, 32, 24]} />
      </mesh>
      <mesh ref={shell} material={fresnel}>
        <sphereGeometry args={[0.95, 48, 32]} />
      </mesh>
      <sprite ref={wave} scale={[1.5, 1.5, 1.5]}>
        <spriteMaterial ref={waveMat} map={glowTexture()} color="#9fb4ff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite ref={glow} scale={[6.5, 6.5, 6.5]}>
        <spriteMaterial map={glowTexture()} color="#7d8fff" transparent opacity={0.46} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <group rotation={[0.28, 0, 0.08]} ref={sats}>
        {rings.map((x) => (
          <group key={x.r}>
            <mesh material={x.mat} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[x.r, 0.012, 6, 200]} />
            </mesh>
            <mesh material={x.dot} position={[x.r, 0, 0]}>
              <sphereGeometry args={[0.07, 12, 8]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ───────────── Gravity well — the risk chapter ───────────── */
function GravityWell() {
  const disk = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uDanger: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec3 vPos;
          void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uTime; uniform float uDanger; varying vec3 vPos;
          void main() {
            float r = length(vPos.xy);
            float a = atan(vPos.y, vPos.x);
            float t = clamp((r - 2.7) / 5.3, 0.0, 1.0);
            float swirl = 0.5 + 0.5 * sin(a * 5.0 + r * 3.0 - uTime * 1.8);
            float swirl2 = 0.5 + 0.5 * sin(a * 11.0 - r * 5.0 - uTime * 2.6);
            float band = pow(1.0 - t, 1.6) * (0.45 + 0.35 * swirl + 0.2 * swirl2);
            vec3 col = mix(vec3(1.0, 0.86, 0.55), vec3(1.0, 0.28, 0.12), smoothstep(0.0, 0.5, t));
            col = mix(col, vec3(0.75, 0.15, 0.55), smoothstep(0.55, 1.0, t));
            float k = 0.35 + uDanger * 0.65;
            gl_FragColor = vec4(col * band * (1.4 + uDanger * 1.8), band * k);
          }`,
      }),
    [],
  );
  const glow = useRef<THREE.SpriteMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const ring = useMemo(() => new THREE.MeshBasicMaterial({ color: hdr("#ffb36b", 6), toneMapped: false }), []);
  useFrame(() => {
    disk.uniforms.uTime.value = rig.time;
    disk.uniforms.uDanger.value = rig.danger;
    if (glow.current) glow.current.opacity = 0.15 + rig.danger * 0.4;
    if (light.current) light.current.intensity = 10 + rig.danger * 60;
  });
  return (
    <group position={WELL_POS}>
      <pointLight ref={light} color="#ff5a3d" distance={40} decay={1.2} position={[0, 2, 6]} />
      <sprite scale={[22, 22, 22]}>
        <spriteMaterial ref={glow} map={glowTexture()} color="#ff4d3d" transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <group rotation={[Math.PI / 2 - 0.32, 0, 0.12]}>
        <mesh material={disk}>
          <ringGeometry args={[2.7, 8, 160, 1]} />
        </mesh>
      </group>
      <mesh>
        <sphereGeometry args={[2.45, 48, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh material={ring} rotation={[Math.PI / 2 - 0.32, 0, 0.12]}>
        <torusGeometry args={[2.6, 0.035, 8, 160]} />
      </mesh>
    </group>
  );
}

/* ───────────── Image-based lighting so the metal shells read as metal ───────────── */
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.16;
    return () => {
      env.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);
  return null;
}

/* ───────────── Scroll-driven camera ───────────── */
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function CameraRig() {
  const { camera, size, invalidate } = useThree();
  const anchors = useRef<{ name: string; center: number }[]>([]);
  const stage = useRef<{ cy: number; h: number } | null>(null);
  const oyCur = useRef(0.5);
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const cur = useRef<{ pos: THREE.Vector3; look: THREE.Vector3 } | null>(null);
  const intro = useRef(rig.reduce ? 1 : 0);
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), l: new THREE.Vector3(), b: new THREE.Vector3() }), []);

  useEffect(() => {
    const measure = () => {
      anchors.current = Array.from(document.querySelectorAll<HTMLElement>("[data-shot]"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { name: el.dataset.shot!, center: r.top + window.scrollY + Math.min(r.height, window.innerHeight * 1.2) / 2 };
        })
        .sort((a, b) => a.center - b.center);
      const st = document.querySelector<HTMLElement>("[data-stage]");
      if (st) {
        const r = st.getBoundingClientRect();
        stage.current = { cy: r.top + window.scrollY + r.height / 2, h: r.height };
      }
      invalidate();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => invalidate();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [invalidate]);

  useFrame((_, dt) => {
    const shots = getShots(size.width / size.height);

    // Hero: size and place the bot trio so it fills the empty stage under the copy on every device.
    if (stage.current && shots.hero) {
      const W = size.width;
      const H = size.height;
      const fov = shots.hero.fov;
      const tanH = Math.tan((fov * Math.PI) / 360);
      const ppu = Math.min((0.96 * W) / 9.6, (0.9 * stage.current.h) / 4.7); // px per world unit
      const D = H / (2 * tanH * ppu);
      shots.hero = { ...shots.hero, pos: [0, 0.45, D - 0.3], look: [0, -0.3, 0], oy: Math.min(1.15, stage.current.cy / H) };
    }
    const list = anchors.current.filter((a) => shots[a.name]);
    if (!list.length) return;

    // Find the two anchors around the viewport centre and blend between their shots.
    const probe = window.scrollY + window.innerHeight * 0.5;
    let i = 0;
    while (i < list.length - 1 && list[i + 1].center <= probe) i++;
    const A: Shot = shots[list[i].name];
    const B: Shot = shots[list[Math.min(i + 1, list.length - 1)].name];
    const span = (list[i + 1]?.center ?? list[i].center + 1) - list[i].center;
    const t = probe <= list[0].center ? 0 : smooth(0.18, 0.82, (probe - list[i].center) / span);

    tmp.p.fromArray(A.pos).lerp(tmp.b.fromArray(B.pos), t);
    tmp.l.fromArray(A.look).lerp(tmp.b.fromArray(B.look), t);
    const lerp = (a: number, b: number) => a + (b - a) * t;

    const k = rig.reduce ? 1 : 1 - Math.exp(-dt * 2.6);
    if (!cur.current) cur.current = { pos: tmp.p.clone(), look: tmp.l.clone() };
    cur.current.pos.lerp(tmp.p, k);
    cur.current.look.lerp(tmp.l, k);

    const cam = camera as THREE.PerspectiveCamera;
    const oy = lerp(A.oy ?? 0.5, B.oy ?? 0.5);
    oyCur.current += (oy - oyCur.current) * k;
    const shift = (oyCur.current - 0.5) * size.height;
    if (Math.abs(shift) > 0.5) cam.setViewOffset(size.width, size.height, 0, -shift, size.width, size.height);
    else if (cam.view?.enabled) cam.clearViewOffset();
    const fov = lerp(A.fov, B.fov);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov += (fov - cam.fov) * k;
      cam.updateProjectionMatrix();
    }
    for (let j = 0; j < 3; j++) rig.focus[j] += (lerp(A.focus[j], B.focus[j]) - rig.focus[j]) * k;
    rig.warp += (lerp(A.warp, B.warp) - rig.warp) * k;
    rig.danger += (lerp(A.danger, B.danger) - rig.danger) * k;
    rig.rings += (lerp(A.rings, B.rings) - rig.rings) * k;

    // Cinematic entrance: fly in from deep space on first load.
    if (intro.current < 1) intro.current = Math.min(1, intro.current + Math.min(dt, 1 / 30) / 4.5);
    const e = 1 - Math.pow(1 - intro.current, 3);

    // Gentle pointer parallax (fine pointers only; zero on touch since no pointermove)
    const pt = pointer.current;
    pt.sx += (pt.x - pt.sx) * 0.04;
    pt.sy += (pt.y - pt.sy) * 0.04;
    const par = rig.reduce ? 0 : 0.45;

    cam.position.copy(cur.current.pos);
    cam.position.x += pt.sx * par;
    cam.position.y -= pt.sy * par * 0.6;
    cam.position.z += (1 - e) * 14;
    cam.position.y += (1 - e) * 2.5;
    cam.lookAt(cur.current.look);
  }, -1);

  return null;
}

/**
 * Watches real frame times for the first few seconds and steps resolution down on
 * slow GPUs (older phones / budget Android tablets) so scrolling stays smooth.
 */
function AdaptiveQuality({ min }: { min: number }) {
  const setDpr = useThree((s) => s.setDpr);
  const dpr = useThree((s) => s.viewport.dpr);
  // Resizing the canvas clears it for a frame (a visible black blink), so: ignore the
  // first 5 s (shader compile + intro), then decide once, and only drop if clearly too slow.
  const acc = useRef({ warm: 0, t: 0, n: 0, done: false });
  useFrame((_, dt) => {
    const a = acc.current;
    if (a.done || rig.reduce) return;
    if (a.warm < 5) {
      a.warm += dt;
      return;
    }
    a.t += Math.min(dt, 0.25);
    a.n += 1;
    if (a.t < 3) return;
    const fps = a.n / a.t;
    a.done = true;
    if (fps < 30 && dpr > min) setDpr(min);
  });
  return null;
}

/** Reveal the canvas only after shaders have compiled and frames are flowing (no first-frame pop). */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const fired = useRef(false);
  const invalidate = useThree((s) => s.invalidate);
  useFrame(() => {
    if (fired.current) return;
    frames.current += 1;
    if (frames.current >= (rig.reduce ? 2 : 20)) {
      fired.current = true;
      onReady();
    } else if (rig.reduce) invalidate();
  });
  return null;
}

function Clock() {
  useFrame((state) => {
    rig.time = rig.reduce ? 2 : state.clock.elapsedTime;
  }, -2);
  return null;
}

/* ───────────── Canvas ───────────── */
export default function Scene({ onReady, onLost }: { onReady: () => void; onLost: () => void }) {
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  // Quality tier: phones < tablets / touch laptops < desktops.
  // NOTE: keep msaa at 0. Multisampled HDR render targets made the canvas strobe
  // (alternate blank frames) on Intel/ANGLE-D3D11 GPUs. Bloom softens edges anyway.
  const tier = useMemo<"phone" | "tablet" | "desktop">(() => {
    const w = Math.min(window.innerWidth, window.innerHeight);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (w < 600) return "phone";
    if (coarse || window.innerWidth < 1100) return "tablet";
    return "desktop";
  }, []);
  const mobile = tier === "phone";
  const q = {
    phone: { dpr: [1, 1.5] as [number, number], stars: 1500, warp: 240, rocks: 100, msaa: 0, bloom: 0.75 },
    tablet: { dpr: [1, 1.5] as [number, number], stars: 2400, warp: 420, rocks: 170, msaa: 0, bloom: 0.8 },
    desktop: { dpr: [1, 1.5] as [number, number], stars: 3600, warp: 650, rocks: 240, msaa: 0, bloom: 0.9 },
  }[tier];
  rig.reduce = reduce;

  return (
    <Canvas
      dpr={q.dpr}
      frameloop={reduce ? "demand" : "always"}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "high-performance" }}
      camera={{ fov: 45, near: 0.1, far: 600, position: [0, 6, 46] }}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#04050d");
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onLost();
        });
      }}
    >
      <fogExp2 attach="fog" args={["#05060f", 0.019]} />
      <Env />
      <Clock />
      <ambientLight intensity={0.08} />
      <hemisphereLight args={["#7d8cff", "#05060f", 0.25]} />
      <directionalLight position={[6, 9, 8]} intensity={1.1} color="#e6ecff" />
      <directionalLight position={[-6, 3, -8]} intensity={2.8} color="#9478ff" />

      <Nebula />
      <Stars count={q.stars} />
      <Warp count={q.warp} />
      <Asteroids count={q.rocks} />
      <FusionCore />
      <SafeBot />
      <CoreBot />
      <NovaBot />
      <GravityWell />
      <CameraRig />
      <ReadySignal onReady={onReady} />
      <AdaptiveQuality min={mobile ? 0.75 : 1} />

      <EffectComposer multisampling={q.msaa}>
        <Bloom mipmapBlur intensity={q.bloom} luminanceThreshold={1.1} luminanceSmoothing={0.25} radius={0.65} />
        <Vignette offset={0.22} darkness={0.85} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}
