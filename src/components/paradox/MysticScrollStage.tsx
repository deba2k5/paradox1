import { useRef, type ReactNode } from "react";
import { RuneRing } from "./RuneRing";
import { ScrollFrameSequence } from "./ScrollFrameSequence";
import nebula from "@/assets/bg-nebula-cave.jpg";

/**
 * Pins a viewport-sized canvas behind its children and scrubs the frame
 * sequence across the full height of the stage, so a single continuous
 * "video" plays while the reader scrolls past every section inside it.
 */
export function MysticScrollStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={stageRef} className="relative">
      <div className="pointer-events-none sticky top-0 h-screen w-full overflow-hidden">
        <img
          src={nebula}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          style={{ filter: "sepia(0.6) saturate(2.2) hue-rotate(-30deg) brightness(0.6)" }}
        />

        <ScrollFrameSequence
          triggerRef={stageRef}
          basePath="/about-frames"
          frameCount={256}
          className="absolute inset-0 h-full w-full opacity-85"
          style={{ filter: "sepia(0.3) hue-rotate(-10deg) saturate(1.15) brightness(0.5) contrast(1.05)" }}
        />

        {/* flat veil — keeps the brightest frames from blowing out the type */}
        <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--background)_35%,transparent)]" />

        {/* filmic vignette — frames the backdrop, edges only */}
        <div className="absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_50%,transparent_0%,transparent_55%,color-mix(in_oklab,var(--background)_70%,transparent)_82%,var(--background)_100%)]" />
        {/* heading zone stays readable no matter which frame is on screen */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--background)_0%,color-mix(in_oklab,var(--background)_78%,transparent)_18%,color-mix(in_oklab,var(--background)_30%,transparent)_34%,transparent_48%,transparent_84%,var(--background)_100%)]" />

        <RuneRing className="animate-glow top-24 -right-40 h-[30rem] w-[30rem]" />
      </div>

      <div className="relative -mt-[100vh]">{children}</div>
    </div>
  );
}
