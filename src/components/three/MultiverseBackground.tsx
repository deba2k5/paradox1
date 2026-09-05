import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { resolveCssColor } from "@/lib/resolve-css-color";

type Layer = {
  positions: Float32Array;
  color: THREE.Color;
  size: number;
  parallax: number;
  driftSpeed: number;
};

function useLayers(count: number, lowPower: boolean) {
  return useMemo<Layer[]>(() => {
    const scale = lowPower ? 0.4 : 1;
    const white = new THREE.Color().setStyle(resolveCssColor("--foreground", "#ffffff"));
    const red = new THREE.Color().setStyle(resolveCssColor("--primary", "#c9314f"));
    const blue = new THREE.Color().setStyle(resolveCssColor("--portal-blue", "#3d6bd6"));
    const gold = new THREE.Color().setStyle(resolveCssColor("--accent", "#c9a24c"));
    const make = (n: number, spread: number, depth: number) => {
      const arr = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        arr[i * 3] = (Math.random() - 0.5) * spread;
        arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
        arr[i * 3 + 2] = -Math.random() * depth;
      }
      return arr;
    };
    return [
      {
        positions: make(Math.round(count * 0.6 * scale), 24, 6),
        color: white,
        size: 0.012,
        parallax: 0.15,
        driftSpeed: 0.01,
      },
      {
        positions: make(Math.round(count * 0.25 * scale), 18, 10),
        color: red,
        size: 0.025,
        parallax: 0.4,
        driftSpeed: 0.03,
      },
      {
        positions: make(Math.round(count * 0.25 * scale), 18, 10),
        color: blue,
        size: 0.025,
        parallax: 0.45,
        driftSpeed: -0.025,
      },
      {
        positions: make(Math.round(count * 0.1 * scale), 16, 8),
        color: gold,
        size: 0.02,
        parallax: 0.6,
        driftSpeed: 0.018,
      },
    ];
  }, [count, lowPower]);
}

function ParticleLayer({ layer }: { layer: Layer }) {
  const ref = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * layer.driftSpeed;
    const targetX = pointer.x * layer.parallax;
    const targetY = pointer.y * layer.parallax;
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, targetX, 3, delta);
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, 3, delta);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[layer.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={layer.size}
        color={layer.color}
        transparent
        opacity={0.7}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

function Scene({ lowPower }: { lowPower: boolean }) {
  const layers = useLayers(lowPower ? 260 : 700, lowPower);
  return (
    <>
      {layers.map((layer, i) => (
        <ParticleLayer key={i} layer={layer} />
      ))}
    </>
  );
}

export function MultiverseBackground({ lowPower = false }: { lowPower?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 55 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <Scene lowPower={lowPower} />
      </Canvas>
    </div>
  );
}
