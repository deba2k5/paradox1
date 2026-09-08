import { useRef, type ReactNode } from "react";
import { ScrollFrameSequence } from "./ScrollFrameSequence";

/**
 * Pins a viewport-sized canvas behind its children (About and Hacker's Guide)
 * and scrubs the full Doctor Strange animation seamlessly across both sections.
 */
export function MysticScrollStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <div id="mystic-stage" ref={stageRef} className="relative bg-background">
      <div className="pointer-events-none sticky top-0 h-screen h-[100dvh] w-full overflow-hidden">
        <ScrollFrameSequence
          triggerRef={stageRef}
          triggerSelector="#mystic-stage"
          basePath="/about-frames"
          mobileBasePath="/about frames mobile"
          mobilePrefix="ezgif-frame-"
          mobilePadLength={3}
          frameCount={173}
          mobileFrameCount={172}
          start="top top"
          end="bottom bottom"
          scrub={0.4}
          step={1}
          className="h-full w-full"
        />

        {/* Seamless blend with Hero above and Hacker's Guide below */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-background via-background/60 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_0%,transparent_65%,color-mix(in_oklab,var(--background)_50%,transparent)_85%,var(--background)_100%)] z-10" />
      </div>

      <div className="relative -mt-[100vh] -mt-[100dvh]">{children}</div>
    </div>
  );
}
