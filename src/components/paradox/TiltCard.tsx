import { useMemo, useRef, type ReactNode, type CSSProperties } from "react";

const SPARK_COLORS = ["#ff3355", "#3d7bff", "#e8b64c"];

export function TiltCard({
  children,
  className = "",
  glowColor = "var(--primary)",
  sparkCount = 5,
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  sparkCount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg) translateZ(10px) translateY(-4px)`;
    el.style.setProperty("--glow-x", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--glow-y", `${(py + 0.5) * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0) translateY(0)";
  };

  // Deterministic per-index placement (not Math.random) so SSR and client markup match exactly.
  const sparks = useMemo(
    () =>
      Array.from({ length: sparkCount }).map((_, i) => {
        const angle = (i / sparkCount) * Math.PI * 2 + i * 0.7;
        const dist = 24 + ((i * 37) % 18);
        const style: CSSProperties = {
          left: `${50 + Math.cos(angle) * 10}%`,
          top: `${50 + Math.sin(angle) * 10}%`,
          // @ts-expect-error custom properties
          "--spark-x": `${Math.cos(angle) * dist}px`,
          "--spark-y": `${Math.sin(angle) * dist}px`,
          "--spark-color": SPARK_COLORS[i % SPARK_COLORS.length],
          animationDelay: `${i * 0.22}s`,
        };
        return <span key={i} className="spark opacity-0 group-hover:opacity-100" style={style} />;
      }),
    [sparkCount],
  );

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`tilt-card group relative ${className}`}
      style={
        {
          "--glow-color": glowColor,
        } as CSSProperties
      }
    >
      <span
        className="tilt-card-glow pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        style={{
          background: `radial-gradient(180px circle at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in oklab, var(--glow-color) 35%, transparent), transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <span
        className="tilt-card-glow pointer-events-none absolute inset-0 -z-10 rounded-[inherit] border"
        style={{ borderColor: `color-mix(in oklab, var(--glow-color) 70%, transparent)` }}
        aria-hidden="true"
      />
      <span className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
        {sparks}
      </span>
      {children}
    </div>
  );
}
