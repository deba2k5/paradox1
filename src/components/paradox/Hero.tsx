import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RuneRing } from "./RuneRing";
import { Countdown } from "./Countdown";

let scrollTriggerRegistered = false;

export function Hero() {
  const flashRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const [travelling, setTravelling] = useState(false);

  useEffect(() => {
    if (!scrollTriggerRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerRegistered = true;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !videoWrapRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(videoWrapRef.current, {
        scale: 1.25,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    });

    return () => ctx.revert();
  }, []);

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
    <section id="home" className="relative min-h-screen overflow-hidden pt-28">
      <div ref={videoWrapRef} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          style={{ filter: "saturate(1.25) brightness(0.75) contrast(1.05)" }}
        >
          <source src="/portal-loop.mp4" type="video/mp4" />
        </video>
        {/* Optional custom video can be placed on the About section instead. */}
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

      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl flex-col items-center justify-center px-5 pb-24 text-center">
        <p className="font-tag inline-block rotate-2 text-sm tracking-[0.2em] text-accent uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] sm:text-lg">
          Code Beyond Reality
        </p>
        <h1 className="font-graffiti flame-text mt-4 max-w-full text-[clamp(2.3rem,11vw,3.5rem)] leading-none font-normal break-words sm:text-8xl lg:text-9xl">
          PARADOX
        </h1>
        <p className="mt-4 text-sm tracking-[0.4em] text-foreground uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-base">
          8-Hour Hack Beyond Logic
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-5">
          <a
            href="#register"
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

        <div className="mt-12">
          <p className="mb-4 text-xs tracking-[0.4em] text-foreground/90 uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            The portal closes in
          </p>
          <Countdown />
        </div>

        {/* mobile: date/venue sit in normal flow so they can't collide with
            the countdown or CTAs on short screens */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:hidden">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm font-semibold text-foreground drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              3 October, 2026
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm font-semibold text-foreground drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Gurukul Building, IEM, Saltlake
            </p>
          </div>
        </div>
      </div>

      {/* desktop/tablet: pinned to the corner, out of the way of the centered content */}
      <div className="absolute right-5 bottom-28 z-10 hidden space-y-3 text-right sm:right-10 sm:bottom-32 sm:block">
        <div className="flex items-center justify-end gap-3">
          <div>
            <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">Date</p>
            <p className="font-semibold text-foreground drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              3 October, 2026
            </p>
          </div>
          <CalendarDays className="h-6 w-6 shrink-0 text-primary" />
        </div>
        <div className="flex items-center justify-end gap-3">
          <div>
            <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">Venue</p>
            <p className="font-semibold text-foreground drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Gurukul Building, IEM, Saltlake
            </p>
          </div>
          <MapPin className="h-6 w-6 shrink-0 text-primary" />
        </div>
      </div>

      <div className="relative border-t border-white/10">
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
    </section>
  );
}
