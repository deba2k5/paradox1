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

    const isPortrait =
      typeof window !== "undefined" &&
      window.matchMedia("(orientation: portrait), (max-width: 639px)").matches;

    tl.set(zoomWrap, {
      scale: 1,
      force3D: true,
      transformOrigin: isPortrait ? "50% 55.5%" : "50% 56.2%",
    })
      // Phase 1: Subtle, pristine camera push as sparks form the circle
      .to(zoomWrap, {
        scale: 1.15,
        duration: 2.2,
        ease: "power1.inOut",
        force3D: true,
      })
      // Phase 2: Dynamic push into the portal as it expands
      .to(zoomWrap, {
        scale: 1.45,
        duration: 0.9,
        ease: "power2.in",
        force3D: true,
      })
      // Phase 3: Final threshold push as the portal opens wide
      .to(
        zoomWrap,
        {
          scale: 1.75,
          duration: 0.55,
          ease: "power2.in",
          force3D: true,
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

    // Keep transformOrigin in sync if device rotates or window resizes
    const onResize = () => {
      if (!zoomWrapRef.current) return;
      const isPortraitNow = window.matchMedia(
        "(orientation: portrait), (max-width: 639px)",
      ).matches;
      gsap.set(zoomWrapRef.current, {
        transformOrigin: isPortraitNow ? "50% 55.5%" : "50% 56.2%",
      });
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

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
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
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
      {/* Responsive position container: handles phones, tablets, and desktops in both portrait and landscape */}
      <div className="relative w-full flex items-center justify-center max-sm:h-full max-sm:-translate-y-[5vh] portrait:h-full portrait:-translate-y-[5vh] sm:landscape:h-[116%] sm:landscape:-translate-y-[7.2vh]">
        <div
          ref={zoomWrapRef}
          className="relative h-full w-full flex items-center justify-center will-change-transform"
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={dismiss}
            className="h-full w-full max-sm:object-contain portrait:object-contain sm:landscape:object-cover object-center pointer-events-none"
            style={{
              transform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Portrait devices (phones, tablets in portrait, narrow windows) */}
            <source
              src="/load-phone.mp4"
              type="video/mp4"
              media="(orientation: portrait), (max-width: 639px)"
            />
            {/* Landscape devices (desktops, laptops, tablets in landscape, phones in landscape) */}
            <source
              src="/load.mp4"
              type='video/mp4; codecs="av01.0.08M.10"'
              media="(orientation: landscape) and (min-width: 640px)"
            />
            <source
              src="/load-h264.mp4"
              type="video/mp4"
              media="(orientation: landscape) and (min-width: 640px)"
            />
            <source src="/load.mp4" type="video/mp4" />
            <source src="/load-phone.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Subtle mystic flash effect when portal opens */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 opacity-0 max-sm:-translate-y-[5vh] portrait:-translate-y-[5vh] sm:landscape:-translate-y-[7.2vh]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.98 0.02 40) 0%, var(--accent) 35%, var(--primary) 60%, transparent 80%)",
        }}
      />
    </div>
  );
}
