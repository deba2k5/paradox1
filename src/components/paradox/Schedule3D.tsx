import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Edges, Line, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { resolveCssColor } from "@/lib/resolve-css-color";
import type { ScheduleItem } from "./schedule-data";

const MARKER_FONT = "/fonts/permanent-marker.ttf";
const LABEL_FONT = "/fonts/rajdhani-600.ttf";

type Palette = { primary: string; accent: string; foreground: string; muted: string };

type Layout = {
  /** Portrait screens run a single lane; wide ones alternate side to side. */
  narrow: boolean;
  laneX: number;
  gap: number;
  textWidth: number;
  textOffset: number;
  timeSize: number;
  titleSize: number;
  copySize: number;
  nodeSize: number;
};

/**
 * The rail has to fit the viewport in world units, not CSS pixels — a phone in
 * portrait sees barely a third of the width a laptop does at the same camera
 * distance, so it gets one lane with the text hanging off the right of each node.
 */
function buildLayout(viewportWidth: number, aspect: number): Layout {
  const narrow = aspect < 1.05;

  if (narrow) {
    const laneX = -Math.min(1.55, viewportWidth * 0.4);
    return {
      narrow,
      laneX,
      gap: 2.7,
      textWidth: Math.max(1.9, viewportWidth * 0.76),
      textOffset: 0.34,
      timeSize: 0.17,
      titleSize: 0.34,
      copySize: 0.15,
      nodeSize: 0.26,
    };
  }

  return {
    narrow,
    laneX: 1.25,
    gap: 3.1,
    textWidth: 3.3,
    textOffset: 0.4,
    timeSize: 0.2,
    titleSize: 0.44,
    copySize: 0.17,
    nodeSize: 0.32,
  };
}

function railPoints(count: number, layout: Layout) {
  return Array.from({ length: count }, (_, i) => {
    const x = layout.narrow ? layout.laneX : i % 2 === 0 ? -layout.laneX : layout.laneX;
    return new THREE.Vector3(x, -i * layout.gap, Math.sin(i * 0.9) * (layout.narrow ? 0.4 : 0.8));
  });
}

function EventNode({
  item,
  point,
  side,
  diff,
  isFinale,
  palette,
  layout,
}: {
  item: ScheduleItem;
  point: THREE.Vector3;
  side: "left" | "right";
  diff: number;
  isFinale: boolean;
  palette: Palette;
  layout: Layout;
}) {
  const anchorX = side === "left" ? "right" : "left";
  const textX = side === "left" ? -layout.textOffset : layout.textOffset;
  const nodeColor = isFinale ? palette.primary : palette.accent;
  const visible = 1 - diff;

  // Titles wrap at roughly this many glyphs, so the blurb below has to drop by
  // however many lines the marker font ends up taking.
  const charsPerLine = Math.max(6, Math.floor(layout.textWidth / (layout.titleSize * 0.52)));
  const titleLines = Math.max(1, Math.ceil(item.title.length / charsPerLine));
  const copyY = -0.16 - titleLines * layout.titleSize * 1.18;

  return (
    <group position={point}>
      <Box args={[layout.nodeSize, layout.nodeSize, layout.nodeSize]} scale={Math.max(0.001, visible)}>
        <meshBasicMaterial color={nodeColor} wireframe toneMapped={false} />
        <Edges color={nodeColor} lineWidth={1.5} />
      </Box>

      <group position={[textX, 0, 0]}>
        <Text
          font={LABEL_FONT}
          anchorX={anchorX}
          anchorY="middle"
          fontSize={layout.timeSize}
          letterSpacing={0.12}
          color={palette.accent}
          fillOpacity={visible}
          position={[0, layout.narrow ? 0.1 : 0.12, 0]}
        >
          {item.time.toUpperCase()}
        </Text>

        <Text
          font={MARKER_FONT}
          anchorX={anchorX}
          anchorY="top"
          fontSize={layout.titleSize}
          maxWidth={layout.textWidth}
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
          fontSize={layout.copySize}
          maxWidth={layout.textWidth}
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

  const layout = useMemo(
    () => buildLayout(viewport.width, viewport.aspect),
    [viewport.width, viewport.aspect],
  );

  const palette = useMemo<Palette>(
    () => ({
      primary: resolveCssColor("--primary", "#c9314f"),
      accent: resolveCssColor("--accent", "#c9a24c"),
      foreground: resolveCssColor("--foreground", "#f4ece4"),
      muted: resolveCssColor("--muted-foreground", "#b3a49c"),
    }),
    [],
  );

  const points = useMemo(() => railPoints(items.length, layout), [items.length, layout]);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false), [points]);
  const curvePoints = useMemo(() => curve.getPoints(400), [curve]);

  // Scroll drives a ref; the frame loop damps the camera and only pushes a
  // React update when the value has moved enough to change what's drawn.
  useFrame((_, delta) => {
    const target = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    const head = curve.getPoint(target);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, head.y, 4, delta);
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      layout.narrow ? 0 : head.x * 0.3,
      4,
      delta,
    );
    if (Math.abs(target - progress) > 0.004) setProgress(target);
  });

  const traveled = useMemo(() => {
    const count = Math.max(2, Math.ceil(progress * curvePoints.length));
    return curvePoints.slice(0, count);
  }, [curvePoints, progress]);

  const active = progress * (items.length - 1);

  return (
    <group>
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
      <Line points={traveled} color={palette.primary} lineWidth={layout.narrow ? 2 : 3} />

      {items.map((item, i) => (
        <EventNode
          key={item.index}
          item={item}
          point={points[i]!}
          side={layout.narrow ? "right" : i % 2 === 0 ? "left" : "right"}
          diff={THREE.MathUtils.clamp(2 * Math.max(i - active, 0), 0, 1)}
          isFinale={i === items.length - 1}
          palette={palette}
          layout={layout}
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
    <div ref={trackRef} className="relative h-[260vh] sm:h-[300vh]">
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
