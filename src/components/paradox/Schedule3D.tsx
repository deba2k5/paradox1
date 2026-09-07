import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Edges, Line, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { resolveCssColor } from "@/lib/resolve-css-color";
import type { ScheduleItem } from "./schedule-data";

const MARKER_FONT = "/fonts/permanent-marker.ttf";
const LABEL_FONT = "/fonts/rajdhani-600.ttf";

const NODE_GAP = 3.1;
const LANE_X = 1.25;
const TEXT_WIDTH = 3.3;

/** Alternating rail — each event steps to the opposite side as the day descends. */
function railPoints(count: number) {
  return Array.from(
    { length: count },
    (_, i) => new THREE.Vector3(i % 2 === 0 ? -LANE_X : LANE_X, -i * NODE_GAP, Math.sin(i * 0.9) * 0.8),
  );
}

type Palette = { primary: string; accent: string; foreground: string; muted: string };

function EventNode({
  item,
  point,
  side,
  diff,
  isFinale,
  palette,
}: {
  item: ScheduleItem;
  point: THREE.Vector3;
  side: "left" | "right";
  diff: number;
  isFinale: boolean;
  palette: Palette;
}) {
  const anchorX = side === "left" ? "right" : "left";
  const textX = side === "left" ? -0.4 : 0.4;
  const nodeColor = isFinale ? palette.primary : palette.accent;
  const visible = 1 - diff;
  // Titles wrap at roughly this many glyphs, so the blurb below has to drop by
  // however many lines the marker font ends up taking.
  const titleLines = Math.max(1, Math.ceil(item.title.length / 15));
  const copyY = -0.16 - titleLines * 0.52;

  return (
    <group position={point}>
      <Box args={[0.32, 0.32, 0.32]} scale={Math.max(0.001, 1 - diff)}>
        <meshBasicMaterial color={nodeColor} wireframe toneMapped={false} />
        <Edges color={nodeColor} lineWidth={1.5} />
      </Box>

      <group position={[textX, 0, 0]}>
        <Text
          font={LABEL_FONT}
          anchorX={anchorX}
          anchorY="middle"
          fontSize={0.2}
          letterSpacing={0.12}
          color={palette.accent}
          fillOpacity={visible}
          position={[0, 0.12, 0]}
        >
          {item.time.toUpperCase()}
        </Text>

        <Text
          font={MARKER_FONT}
          anchorX={anchorX}
          anchorY="top"
          fontSize={0.44}
          maxWidth={TEXT_WIDTH}
          lineHeight={1.15}
          color={isFinale ? palette.primary : palette.foreground}
          outlineWidth={0.012}
          outlineColor="#000000"
          fillOpacity={visible}
          outlineOpacity={visible}
          position={[0, -0.14 - diff * 0.3, 0]}
        >
          {item.title}
        </Text>

        <Text
          font={LABEL_FONT}
          anchorX={anchorX}
          anchorY="top"
          fontSize={0.17}
          maxWidth={TEXT_WIDTH}
          lineHeight={1.35}
          color={palette.muted}
          fillOpacity={visible * 0.85}
          position={[0, copyY - diff * 0.4, 0]}
        >
          {item.copy}
        </Text>
      </group>
    </group>
  );
}

function Rail({ items, progressRef }: { items: ScheduleItem[]; progressRef: React.RefObject<number> }) {
  const { camera, viewport } = useThree();
  const [progress, setProgress] = useState(0);

  // A node plus its text spans ~2 * (LANE_X + TEXT_WIDTH) world units, so shrink
  // the whole rail on narrow viewports instead of letting titles run off frame.
  const fit = THREE.MathUtils.clamp(viewport.width / (2 * (LANE_X + TEXT_WIDTH + 0.5)), 0.45, 1);

  const palette = useMemo<Palette>(
    () => ({
      primary: resolveCssColor("--primary", "#c9314f"),
      accent: resolveCssColor("--accent", "#c9a24c"),
      foreground: resolveCssColor("--foreground", "#f4ece4"),
      muted: resolveCssColor("--muted-foreground", "#b3a49c"),
    }),
    [],
  );

  const points = useMemo(() => railPoints(items.length), [items.length]);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false), [points]);
  const curvePoints = useMemo(() => curve.getPoints(400), [curve]);

  // Scroll drives a ref; the frame loop damps the camera and only pushes a
  // React update when the value has moved enough to change what's drawn.
  useFrame((_, delta) => {
    const target = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    const head = curve.getPoint(target);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, head.y * fit, 4, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, head.x * fit * 0.3, 4, delta);
    if (Math.abs(target - progress) > 0.004) setProgress(target);
  });

  const traveled = useMemo(() => {
    const count = Math.max(2, Math.ceil(progress * curvePoints.length));
    return curvePoints.slice(0, count);
  }, [curvePoints, progress]);

  const active = progress * (items.length - 1);

  return (
    <group scale={fit}>
      {/* the path still ahead — the day as the schedule promises it */}
      <Line
        points={curvePoints}
        color={palette.foreground}
        lineWidth={0.6}
        transparent
        opacity={0.25}
        dashed
        dashSize={0.22}
        gapSize={0.22}
      />
      {/* the path already walked */}
      <Line points={traveled} color={palette.primary} lineWidth={3} />

      {items.map((item, i) => (
        <EventNode
          key={item.index}
          item={item}
          point={points[i]!}
          side={i % 2 === 0 ? "left" : "right"}
          diff={THREE.MathUtils.clamp(2 * Math.max(i - active, 0), 0, 1)}
          isFinale={i === items.length - 1}
          palette={palette}
        />
      ))}
    </group>
  );
}

export function Schedule3D({
  items,
  onContextLost,
}: {
  items: ScheduleItem[];
  onContextLost?: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      progressRef.current = distance <= 0 ? 0 : THREE.MathUtils.clamp(-rect.top / distance, 0, 1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={trackRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 8.5], fov: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (event) => {
              event.preventDefault();
              onContextLost?.();
            });
          }}
        >
          <Rail items={items} progressRef={progressRef} />
        </Canvas>
      </div>
    </div>
  );
}
