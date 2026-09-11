import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { RuneRing } from "./RuneRing";
import { Countdown } from "./Countdown";

const VIDEO_MOBILE = "/portal-loop-original.mp4";
const VIDEO_DESKTOP = "/loop-desktop.mp4";
/** duration of the crossfade in seconds */
const CROSSFADE_DURATION = 1.2;

/** Wires up an infinite A/B crossfade loop between two video refs. */
function useCrossfadeLoop(
  vidA: React.RefObject<HTMLVideoElement | null>,
  vidB: React.RefObject<HTMLVideoElement | null>,
) {
  useEffect(() => {
    const a = vidA.current;
    const b = vidB.current;
    if (!a || !b) return;

    // B starts hidden; A starts visible
    a.style.opacity = "1";
    b.style.opacity = "0";

    /** Crossfade from `outgoing` to `incoming`, then clean up. */
    const crossfade = (outgoing: HTMLVideoElement, incoming: HTMLVideoElement) => {
      // Prepare incoming from the very first frame
      incoming.currentTime = 0;
      incoming.play().catch(() => {});

      // GPU-accelerated CSS opacity transition
      incoming.style.transition = `opacity ${CROSSFADE_DURATION}s ease-in-out`;
      outgoing.style.transition = `opacity ${CROSSFADE_DURATION}s ease-in-out`;

      // Double rAF so the browser commits the transition before we flip opacity
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          incoming.style.opacity = "1";
          outgoing.style.opacity = "0";
        });
      });

      // After the fade is done, pause and reset the outgoing video
      incoming.addEventListener(
        "transitionend",
        () => {
          outgoing.pause();
          outgoing.currentTime = 0;
          outgoing.style.transition = "";
          incoming.style.transition = "";
        },
        { once: true },
      );
    };

    // When A finishes → crossfade into B
    const onEndedA = () => crossfade(a, b);
    // When B finishes → crossfade back into A
    const onEndedB = () => crossfade(b, a);

    a.addEventListener("ended", onEndedA);
    b.addEventListener("ended", onEndedB);

    // Kick off
    a.currentTime = 0;
    a.play().catch(() => {});

    return () => {
      a.removeEventListener("ended", onEndedA);
      b.removeEventListener("ended", onEndedB);
    };
  }, [vidA, vidB]);
}

export function Hero() {
  const flashRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const [travelling, setTravelling] = useState(false);

  // Two independent video pairs, switched purely by CSS breakpoint (like the
  // rest of the site). This is SSR-safe (server and client always agree on
  // which src goes where) and reacts to resize/orientation change natively —
  // no JS media-query state, no hydration-mismatch races.
  const vidDesktopA = useRef<HTMLVideoElement>(null);
  const vidDesktopB = useRef<HTMLVideoElement>(null);
  const vidMobileA = useRef<HTMLVideoElement>(null);
  const vidMobileB = useRef<HTMLVideoElement>(null);

  useCrossfadeLoop(vidDesktopA, vidDesktopB);
  useCrossfadeLoop(vidMobileA, vidMobileB);

  const enterMultiverse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (travelling) return;
    setTravelling(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = document.querySelector("#about");

    if (reduced || !flashRef.current) {
      target?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      setTravelling(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setTravelling(false);
      },
    });

    tl.set(flashRef.current, { display: "block" })
      .fromTo(
        flashRef.current,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.45, ease: "power2.in" },
      )
      .add(() => {
        target?.scrollIntoView({ behavior: "auto" });
      })
      .to(flashRef.current, { opacity: 0, duration: 0.55, ease: "power2.out" })
      .set(flashRef.current, { display: "none" });
  };

  return (
    <section id="home" className="relative flex min-h-screen flex-col overflow-hidden pt-28">
      {/* Dual-video wrapper: crossfade between the A/B pair for seamless looping.
          Desktop and mobile pairs are both in the DOM; CSS breakpoints decide
          which one is visible, so the right file is always shown at any
          viewport size — including after a resize. */}
      <div ref={videoWrapRef} className="absolute inset-0 overflow-hidden">
        <video
          ref={vidDesktopA}
          src={VIDEO_DESKTOP}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 hidden h-full w-full object-contain object-top sm:block"
        />
        <video
          ref={vidDesktopB}
          src={VIDEO_DESKTOP}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 hidden h-full w-full object-contain object-top sm:block"
          style={{ opacity: 0 }}
        />
        <video
          ref={vidMobileA}
          src={VIDEO_MOBILE}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 block h-full w-full object-contain object-top sm:hidden"
        />
        <video
          ref={vidMobileB}
          src={VIDEO_MOBILE}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 block h-full w-full object-contain object-top sm:hidden"
          style={{ opacity: 0 }}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_42%,color-mix(in_oklab,var(--background)_55%,transparent)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--background)_100%)]" />
      <RuneRing className="animate-glow -top-24 -left-32 h-[34rem] w-[34rem] opacity-60" />

      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 z-[60] hidden"
        style={{
          background:
            "radial-gradient(circle, oklch(0.98 0.02 40) 0%, oklch(0.68 0.22 28) 28%, oklch(0.55 0.21 25) 55%, transparent 78%)",
        }}
        aria-hidden="true"
      />

      {/* flex-1 so the hero and the stat rail together fill exactly one screen —
          a fixed 100vh here pushed the stats permanently below the fold */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pb-6 text-center sm:pb-10">
        {/* Desktop-only tag */}
        <p className="hidden sm:inline-block font-tag rotate-2 text-sm tracking-[0.2em] text-accent uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] sm:text-lg">
          Code Beyond Reality
        </p>

        {/* Logo + tagline: absolutely centered on the ring for mobile, normal flow on desktop */}
        <div className="absolute top-[calc(80vw-7rem)] left-1/2 w-[62vw] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center sm:relative sm:top-auto sm:left-auto sm:w-auto sm:translate-x-0 sm:translate-y-0 sm:mt-4">
          <img
            src="/WhatsApp_Image_2026-09-05_at_17.48.35-removebg-preview.png"
            alt="Hero Image"
            className="w-full h-auto"
          />
          <p className="mt-[1.5vw] text-[2.2vw] tracking-[0.2em] text-foreground uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-base sm:mt-2 sm:tracking-[0.4em] font-bold">
            8-Hour Hack Beyond Logic
          </p>
        </div>

        {/* Buttons: stacked vertically on mobile (positioned above bottom), row on desktop */}
        <div className="absolute top-[68%] left-0 right-0 flex flex-col items-center gap-4 sm:relative sm:top-auto sm:left-auto sm:right-auto sm:mt-9 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">
          <a
            href="https://unstop.com/hackathons/paradox-hackathon-institute-of-engineering-management-kolkata-1747830?lb=m27rsItw&utm_medium=Share&utm_source=online_coding_challenge&utm_campaign=C12debra1531"
            target="_blank"
            rel="noopener noreferrer"
            className="graffiti-btn group inline-flex items-center gap-3 border-2 border-white/80 bg-[image:var(--gradient-mystic)] px-8 py-3.5 text-sm font-bold tracking-[0.2em] text-primary-foreground uppercase shadow-[var(--shadow-rune)]"
          >
            Register Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#about"
            onClick={enterMultiverse}
            className="graffiti-btn group inline-flex items-center gap-3 border-2 border-white/60 bg-black/30 px-8 py-3.5 text-sm font-bold tracking-[0.2em] text-foreground uppercase backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Enter the Multiverse
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

      </div>

      <div className="relative border-t border-white/10 bg-gradient-to-b from-transparent via-background/40 to-background/90">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-white/10 px-5 py-6 sm:grid-cols-4 sm:divide-x">
          {[
            ["1000+", "Hackers"],
            ["8", "Hours"],
            ["20+", "Mentors"],
            ["Exciting", "Prizes"],
          ].map(([value, label]) => (
            <div key={label} className="px-4 py-3 text-center">
              <dt className="font-display text-2xl font-bold text-glow sm:text-3xl">{value}</dt>
              <dd className="mt-1 text-xs tracking-[0.35em] text-muted-foreground uppercase">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
