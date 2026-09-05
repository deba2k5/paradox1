import { useEffect, useRef } from "react";

type Trail = { x: number; y: number; life: number };

/** A small glowing energy point that follows the cursor, with a light particle trail
 *  and a ripple on interactive elements. Skipped on touch devices and reduced-motion. */
export function EnergyCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trails = useRef<Trail[]>([]);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.body.classList.add("energy-cursor-active");

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      trails.current.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trails.current.length > 18) trails.current.shift();

      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, .rune-panel",
      );
      ringRef.current?.classList.toggle("energy-cursor-hover", Boolean(interactive));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trails.current.forEach((t) => {
        t.life -= 0.06;
      });
      trails.current = trails.current.filter((t) => t.life > 0);
      trails.current.forEach((t) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2.2 * t.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 182, 76, ${t.life * 0.35})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("energy-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
        aria-hidden="true"
      />
      <div ref={ringRef} className="energy-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="energy-cursor-dot" aria-hidden="true" />
    </>
  );
}
