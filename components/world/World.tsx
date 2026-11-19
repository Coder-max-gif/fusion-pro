"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useWebGL } from "@/lib/useWebGL";
import { SpaceCanvas } from "../SpaceCanvas";

// The 3D bundle loads after first paint so text is interactive immediately.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * The persistent WebGL world behind the whole page.
 * Falls back to the 2D canvas when WebGL is unavailable or the GPU context is lost.
 */
export function World() {
  const webgl = useWebGL();
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);

  if (webgl === false || lost) return <SpaceCanvas />;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-void">
      {/* Shown while the 3D scene boots — matches the scene's colours */}
      <div
        className={`absolute inset-0 transition-opacity delay-300 duration-[2400ms] ease-out ${ready ? "opacity-0" : "opacity-100"}`}
        style={{
          background:
            "radial-gradient(60% 50% at 50% 35%, rgb(40 46 120 / 0.14), transparent 70%), linear-gradient(180deg, #04050d, #05060f 50%, #04050d)",
        }}
      />
      {webgl && (
        <div className={`absolute inset-0 transition-opacity delay-300 duration-[2400ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}>
          <Scene onReady={() => setReady(true)} onLost={() => setLost(true)} />
        </div>
      )}
    </div>
  );
}
