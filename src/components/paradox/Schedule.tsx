import { Component, Suspense, lazy, useRef, useState, type ReactNode } from "react";
import { SectionTitle } from "./RuneRing";
import { ScheduleTimeline } from "./ScheduleTimeline";
import { scheduleItems } from "./schedule-data";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useLowPowerDevice } from "@/hooks/use-device-tier";
import { ClientOnly } from "@/components/three/ClientOnly";

// The WebGL rail drags in three.js and drei, so it is fetched on its own and
// only in the browser — a static import would put all of it in the entry graph.
const Schedule3D = lazy(() =>
  import("./Schedule3D").then((m) => ({ default: m.Schedule3D })),
);

/** If the 3D rail fails to load or throws, show the flat timeline instead. */
class RailBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function Schedule() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const reducedMotion = usePrefersReducedMotion();
  const lowPower = useLowPowerDevice();
  const [webglLost, setWebglLost] = useState(false);
  const flat = reducedMotion || lowPower || webglLost;

  return (
    <section id="schedule" ref={sectionRef} className="relative pt-24 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="reveal reveal-target">
          <SectionTitle
            eyebrow="3rd October 2026 · 8 AM – 7 PM · No time to waste"
            align="left"
            title="Schedule"
          />
        </div>
      </div>

      {/* The WebGL rail paints text into a canvas, so the running order also
          lives in the DOM for screen readers and search engines. */}
      {!flat && (
        <ol className="sr-only">
          {scheduleItems.map((item) => (
            <li key={item.index}>
              {item.time} — {item.title}. {item.copy}
            </li>
          ))}
        </ol>
      )}

      {flat ? (
        <ScheduleTimeline />
      ) : (
        <ClientOnly fallback={<ScheduleTimeline />}>
          <RailBoundary fallback={<ScheduleTimeline />}>
            <Suspense fallback={<div className="h-screen" />}>
              <Schedule3D items={scheduleItems} onContextLost={() => setWebglLost(true)} />
            </Suspense>
          </RailBoundary>
        </ClientOnly>
      )}
    </section>
  );
}
