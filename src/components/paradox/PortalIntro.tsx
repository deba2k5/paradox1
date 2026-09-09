import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

// Plays on every load/refresh: the mystic sling ring portal video plays out
// of the void, gradually zooming in as the portal creates and opens, then
// bursting through to reveal the hero section behind it.
export function PortalIntro() {
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const dismissedRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;

    timelineRef.current?.kill();

    const root = rootRef.current;
    if (!root) {
      document.body.style.overflow = "";
      setMounted(false);
      return;
    }

    gsap.to(root, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.out",
      onComplete: () => {
        document.body.style.overflow = "";
        setMounted(false);
      },
    });
  }, []);

  const startZoomTransition = useCallback(() => {
    const zoomWrap = zoomWrapRef.current;
    const root = rootRef.current;
    const flash = flashRef.current;
    if (!zoomWrap || !root) return;

    timelineRef.current?.kill();

    // The video footage itself already grows the portal from a small spark to full size.
    // We calibrate the camera push (max 1.75x) so the 4K video stays pin-sharp
    // with zero pixel degradation, banding, or blur artifacts.
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setMounted(false);
      },
    });
    timelineRef.current = tl;

    tl.set(zoomWrap, { scale: 1, transformOrigin: "50% 50%" })
      // Phase 1: Subtle, pristine camera push as sparks form the circle
      .to(zoomWrap, {
        scale: 1.15,
        duration: 2.2,
        ease: "power1.inOut",
      })
      // Phase 2: Dynamic push into the portal as it expands
      .to(zoomWrap, {
        scale: 1.45,
        duration: 0.9,
        ease: "power2.in",
      })
      // Phase 3: Final threshold push as the portal opens wide
      .to(
        zoomWrap,
        {
          scale: 1.75,
          duration: 0.55,
          ease: "power2.in",
        },
        "-=0.1",
      );

    // Flash flare right as we cross the threshold (at ~3.15s)
    if (flash) {
      tl.to(
        flash,
        {
          opacity: 0.9,
          duration: 0.3,
          ease: "power2.in",
        },
        3.15,
      ).to(
        flash,
        {
          opacity: 0,
          duration: 0.55,
          ease: "power1.out",
        },
        3.45,
      );
    }

    // Dissolve the intro overlay to reveal the Hero section seamlessly
    tl.to(
      root,
      {
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
      },
      3.3,
    );
  }, []);

  useEffect(() => {
    // Remove the server-side pre-curtain now that the JS overlay is ready
    document.getElementById("pre-curtain")?.remove();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMounted(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const video = videoRef.current;
    if (video) {
      // Start zoom in lockstep as soon as video starts playing
      const onPlaying = () => {
        startZoomTransition();
      };
      video.addEventListener("playing", onPlaying, { once: true });

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocks autoplay or video fails, fallback gracefully
          dismiss();
        });
      }
    } else {
      startZoomTransition();
    }

    // Safety timeout in case onEnded doesn't fire or video is stalled
    const safetyTimer = setTimeout(() => {
      dismiss();
    }, 4500);

    return () => {
      clearTimeout(safetyTimer);
      timelineRef.current?.kill();
      document.body.style.overflow = prevOverflow;
    };
  }, [dismiss, startZoomTransition]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden select-none cursor-pointer"
      onClick={dismiss}
      role="button"
      tabIndex={0}
      aria-label="Loading animation - click anywhere to skip"
    >
      {/* Position offset container: shifts video a bit up so the portal creation is centered on screen */}
      <div className="relative h-[114%] w-full flex items-center justify-center -translate-y-[5.5vh]">
        <div
          ref={zoomWrapRef}
          className="relative h-full w-full flex items-center justify-center will-change-transform"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={dismiss}
            className="h-full w-full object-cover object-center pointer-events-none"
            style={{
              filter: "contrast(1.08) brightness(1.04)",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <source src="/load.mp4" type='video/mp4; codecs="av01.0.08M.10"' />
            <source src="/load-h264.mp4" type="video/mp4" />
            <source src="/load.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Subtle mystic flash effect when portal opens */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 opacity-0 -translate-y-[5.5vh]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.98 0.02 40) 0%, var(--accent) 35%, var(--primary) 60%, transparent 80%)",
        }}
      />

      {/* Skip button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        className="absolute bottom-6 right-6 z-20 text-[10px] tracking-[0.25em] text-muted-foreground/70 hover:text-accent uppercase transition-colors px-3.5 py-1.5 rounded-full border border-white/10 hover:border-accent/40 bg-black/50 backdrop-blur-sm cursor-pointer"
      >
        Skip ➔
      </button>
    </div>
  );
}
