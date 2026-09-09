import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
  type CSSProperties,
} from "react";
import { scheduleItems as items } from "./schedule-data";

const HOUR_MARKS = ["8", "9", "10", "11", "12", "1", "2", "3", "4", "5", "6", "7"];
const LANE_LEFT = 10;
const LANE_RIGHT = 54;
const GUTTER_WIDTH = 64;
const BASE_GAP = 64;
const MINUTE_PX = 0.55;
const TOTAL_FRAMES = 148;

/** Preload all timeline frames as Image objects for smooth scrubbing. */
function preloadFrames(): HTMLImageElement[] {
  const imgs: HTMLImageElement[] = [];
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const padded = String(i).padStart(3, "0");
    img.src = `/timeline-frames-opt/frame-${padded}.jpg`;
    imgs.push(img);
  }
  return imgs;
}

/** Flat, no-WebGL rendering of the day — used for reduced motion and low-power devices. */
export function ScheduleTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [path, setPath] = useState("");
  const [segments, setSegments] = useState<string[]>([]);
  const [height, setHeight] = useState(0);
  const [framesReady, setFramesReady] = useState(false);

  // ── Preload frames once ────────────────────────────────────────────────────
  useEffect(() => {
    const imgs = preloadFrames();
    framesRef.current = imgs;
    // Wait for the first frame so we can paint immediately
    if (imgs[0]) {
      imgs[0].onload = () => setFramesReady(true);
      if (imgs[0].complete) setFramesReady(true);
    }
  }, []);

  // ── Draw a specific frame to the canvas ──────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = framesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  // ── Scroll-driven frame scrubbing ─────────────────────────────────────────
  useEffect(() => {
    if (!framesReady) return;
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress: 0 when section top hits bottom of viewport, 1 when section bottom hits top
      const progress = Math.min(
        1,
        Math.max(0, (viewH - rect.top) / (rect.height + viewH))
      );
      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(targetFrame));
      }
    };

    // Draw initial frame
    drawFrame(0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Run immediately in case section is visible
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [framesReady, drawFrame]);

  // ── Resize canvas to match section dimensions ─────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const updateCanvas = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
      drawFrame(currentFrameRef.current);
    };

    updateCanvas();
    const ro = new ResizeObserver(updateCanvas);
    ro.observe(section);
    return () => ro.disconnect();
  }, [drawFrame]);

  // ── SVG path recompute ────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const recompute = () => {
      const containerRect = container.getBoundingClientRect();
      const points = dotRefs.current
        .filter((el): el is HTMLSpanElement => !!el)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - containerRect.left,
            y: r.top + r.height / 2 - containerRect.top,
          };
        });

      if (points.length < 2) {
        setPath("");
        setSegments([]);
        setHeight(containerRect.height);
        return;
      }

      const first = points[0]!;
      let d = `M ${first.x} ${first.y}`;
      const segs: string[] = [];
      const NODE_GAP = 17;
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1]!;
        const p1 = points[i]!;
        const midY = (p0.y + p1.y) / 2;
        d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;

        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const len = Math.hypot(dx, dy) || 1;
        const ex = p1.x - (dx / len) * NODE_GAP;
        const ey = p1.y - (dy / len) * NODE_GAP;
        segs.push(`M ${p0.x} ${p0.y} C ${p0.x} ${midY}, ${p1.x} ${midY}, ${ex} ${ey}`);
      }
      setPath(d);
      setSegments(segs);
      setHeight(containerRect.height);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative mx-auto max-w-6xl px-5">
      {/* ── Scroll-driven frame animation background ── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ objectFit: "cover" }}
      />

      {/* Dark overlay so timeline content stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* Timeline content — positioned above the canvas */}
      <div className="relative z-10">
        <div ref={containerRef} className="relative mx-auto mt-16 max-w-5xl">
          {/* hour ruler ticking down the 8-hour sprint — desktop only */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 hidden -translate-x-1/2 flex-col justify-between text-[10px] tracking-widest text-muted-foreground/50 sm:flex"
            style={{ height, width: GUTTER_WIDTH * 2.4 }}
          >
            {HOUR_MARKS.map((h) => (
              <span key={h} className="text-center">
                {h}
              </span>
            ))}
          </div>

          {/* curved rune-path with a mystic spark traveling its length */}
          <svg
            className="pointer-events-none absolute top-0 left-1/2 hidden -translate-x-1/2 sm:block"
            width={GUTTER_WIDTH}
            height={height}
            viewBox={`0 0 ${GUTTER_WIDTH} ${height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* faint backbone line */}
            <path d={path} fill="none" stroke="url(#zigzag-gradient)" strokeWidth="1" strokeOpacity="0.35" />

            {/* lit, directional arrow links */}
            {segments.map((seg, i) => (
              <path
                key={i}
                d={seg}
                fill="none"
                stroke="url(#arrow-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
                style={{
                  filter:
                    "drop-shadow(0 0 4px color-mix(in oklab, var(--accent) 80%, transparent)) drop-shadow(0 0 9px color-mix(in oklab, var(--primary) 60%, transparent))",
                }}
              />
            ))}

            {path && (
              <>
                <circle
                  r="5"
                  fill="var(--accent)"
                  className="animate-spark-travel"
                  style={{ offsetPath: `path('${path}')`, filter: "drop-shadow(0 0 6px var(--accent))" }}
                />
                <circle
                  r="3"
                  fill="var(--primary-foreground)"
                  className="animate-spark-travel"
                  style={{
                    offsetPath: `path('${path}')`,
                    animationDelay: "-4s",
                    filter: "drop-shadow(0 0 8px var(--primary))",
                  }}
                />
              </>
            )}
            <defs>
              <linearGradient id="zigzag-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
                <stop offset="50%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="arrow-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
              <marker
                id="arrowhead"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="5.5"
                markerHeight="5.5"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
              </marker>
            </defs>
          </svg>

          {/* mobile fallback: simple straight guide line */}
          <span
            className="absolute top-0 bottom-0 left-3 w-px bg-[image:var(--gradient-mystic)] shadow-[0_0_8px_var(--accent)] sm:hidden"
            aria-hidden="true"
          />

          <ol className="flex flex-col">
            {items.map(({ time, minutes, title, copy, icon: Icon }, i) => {
              const isLeft = i % 2 === 0;
              const gap = i === 0 ? 0 : BASE_GAP + (minutes - items[i - 1]!.minutes) * MINUTE_PX;
              return (
                <li
                  key={title}
                  className="group relative flex sm:min-h-[7rem] sm:items-center"
                  style={{ marginTop: gap }}
                >
                  <span
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    className="absolute top-3 left-3 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border-2 border-primary bg-background shadow-[var(--shadow-rune)] transition-transform duration-300 group-hover:scale-110 sm:top-1/2 sm:left-[var(--dot-left)] sm:-translate-y-1/2 sm:translate-x-0"
                    style={
                      {
                        "--dot-left": `calc(50% - ${GUTTER_WIDTH / 2}px + ${isLeft ? LANE_LEFT : LANE_RIGHT}px)`,
                      } as CSSProperties
                    }
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="pointer-events-none absolute inset-0 -z-10 animate-glow rounded-full bg-primary/25 blur-sm" />
                  </span>

                  <div
                    className={`w-full pl-14 sm:w-[calc(50%-2.5rem)] sm:pl-0 ${
                      isLeft ? "sm:mr-auto sm:pr-10 sm:text-right" : "sm:ml-auto sm:pl-10 sm:text-left"
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-lg border border-primary/25 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--card)_92%,transparent),color-mix(in_oklab,var(--background)_92%,transparent))] p-4 shadow-[var(--shadow-deep)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/60">
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-0 w-1 bg-gradient-to-b from-primary via-accent to-transparent opacity-70 ${
                          isLeft ? "right-0 sm:left-auto" : "left-0"
                        }`}
                      />
                      <p className="font-tag inline-block -rotate-1 text-xs tracking-[0.3em] text-accent uppercase">
                        {time}
                      </p>
                      <h4 className="mt-1 font-display text-lg font-semibold">{title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
