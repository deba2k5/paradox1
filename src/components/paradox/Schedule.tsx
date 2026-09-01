import { useLayoutEffect, useRef, useState } from "react";
import {
  DoorOpen,
  Sparkles,
  Code2,
  Users,
  ClipboardCheck,
  Flag,
  Award,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { SectionTitle } from "./RuneRing";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

type Item = { time: string; minutes: number; title: string; copy: string; icon: LucideIcon };

// A single 8-hour sprint — 10 AM to 6 PM. `minutes` is elapsed minutes since
// 10:00, used to space events on the rail by real duration, not just index.
const items: Item[] = [
  { time: "10:00 AM", minutes: 0, title: "Gates Open · Check-in", copy: "Collect your kit and enter the sanctum.", icon: DoorOpen },
  { time: "10:30 AM", minutes: 30, title: "Opening Ceremony", copy: "Keynote from the council of judges and sponsors.", icon: Sparkles },
  { time: "11:00 AM", minutes: 60, title: "Hacking Begins", copy: "The clock bends. 8 hours start now.", icon: Code2 },
  { time: "01:00 PM", minutes: 180, title: "Mentor Rounds", copy: "One-on-one guidance to keep your build on track.", icon: Users },
  { time: "02:30 PM", minutes: 270, title: "Checkpoint Review", copy: "Show progress, get scored feedback, recalibrate.", icon: ClipboardCheck },
  { time: "04:00 PM", minutes: 360, title: "Hacking Ends", copy: "Final commits locked in the timeline.", icon: Flag },
  { time: "04:30 PM", minutes: 390, title: "Judging & Demos", copy: "Present your build live to the panel.", icon: Award },
  { time: "05:30 PM", minutes: 450, title: "Prize Distribution & Closing", copy: "Glory, prizes and the closing ceremony.", icon: Trophy },
];

const HOUR_MARKS = ["10", "11", "12", "1", "2", "3", "4", "5", "6"];
const LANE_LEFT = 10;
const LANE_RIGHT = 54;
const GUTTER_WIDTH = 64;
const BASE_GAP = 64;
const MINUTE_PX = 0.55;

export function Schedule() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [path, setPath] = useState("");
  const [segments, setSegments] = useState<string[]>([]);
  const [height, setHeight] = useState(0);

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
      const NODE_GAP = 17; // keep the arrowhead clear of the next node's icon circle
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
    <section id="schedule" ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5">
        <div className="reveal reveal-target">
          <SectionTitle eyebrow="10 AM – 6 PM · One day, no time to waste" title="Schedule" />
        </div>

        <div className="reveal reveal-target mt-10 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary" />
          <p className="font-tag -rotate-1 text-sm tracking-[0.3em] text-accent uppercase">
            8 hours. One sanctum. Infinite possibilities.
          </p>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary" />
        </div>

        <div ref={containerRef} className="relative mt-16">
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
            {/* faint backbone line, just to seat the glowing arrow links */}
            <path d={path} fill="none" stroke="url(#zigzag-gradient)" strokeWidth="1" strokeOpacity="0.35" />

            {/* a lit, directional arrow linking each event to the next */}
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

          {/* mobile fallback: simple straight guide line, lit end to end */}
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
                    className="absolute top-3 left-3 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border-2 border-primary bg-background shadow-[var(--shadow-rune)] transition-transform duration-300 group-hover:scale-110 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0"
                    style={{ left: `calc(50% - ${GUTTER_WIDTH / 2}px + ${isLeft ? LANE_LEFT : LANE_RIGHT}px)` }}
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
    </section>
  );
}
