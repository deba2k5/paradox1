import { useRef, useEffect, useState } from "react";
import { Atom, BookOpen, Target, Users, Play, Pause, Volume, VolumeX } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RuneRing, SectionTitle } from "./RuneRing";
import { TiltCard } from "./TiltCard";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import nebula from "@/assets/bg-nebula-cave.jpg";

const pillars = [
  { icon: Atom, title: "Innovate", copy: "Build futuristic solutions that defy the ordinary." },
  { icon: Users, title: "Collaborate", copy: "Team up with brilliant minds across realms." },
  { icon: BookOpen, title: "Learn", copy: "Gain insights from experts who've mastered the craft." },
  { icon: Target, title: "Impact", copy: "Create real-world impact with your innovation." },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!videoRef.current || !sectionRef.current) return;
    if (!(gsap as any).utils) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        videoRef.current,
        { scale: 0.94 },
        {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "bottom 20%",
            scrub: 0.6,
          },
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Pause/play based on visibility and provide controls
  useEffect(() => {
    if (!wrapperRef.current || !videoRef.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            if (!paused) videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.5] },
    );

    io.observe(wrapperRef.current);
    return () => io.disconnect();
  }, [paused]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden py-24 sm:py-32">
      <img
        src={nebula}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        style={{ filter: "sepia(0.6) saturate(2.2) hue-rotate(-30deg) brightness(0.6)" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--background),color-mix(in_oklab,var(--background)_75%,transparent)_40%,var(--background))]" />
      <RuneRing className="animate-glow top-24 -right-40 h-[30rem] w-[30rem]" />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="reveal reveal-target">
          <SectionTitle eyebrow="One reality. Limitless possibilities." title="About PARADOX" />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6 text-base leading-relaxed text-foreground/85 sm:text-lg">
            <p className="reveal reveal-target">
              PARADOX is more than a hackathon — it&apos;s a gateway to infinite possibilities.
              Inspired by the mystic arts of bending reality, this hackathon challenges you to
              question conventions, explore the unknown, and build solutions that create impact.
            </p>
            <p className="reveal reveal-target">
              Across dimensions of technology and creativity, come together to solve real-world
              problems with extraordinary ideas. The only limit is your imagination.
            </p>
            <p className="reveal reveal-target font-display text-lg font-semibold tracking-widest text-primary uppercase">
              One reality. Limitless possibilities.
            </p>

            <div className="grid gap-5 pt-4 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, title, copy }, i) => (
                <TiltCard
                  key={title}
                  className={`reveal reveal-target transition-transform duration-300 hover:rotate-0 ${
                    i % 2 === 0 ? "-rotate-2" : "rotate-2"
                  }`}
                >
                  <div className="graffiti-panel group/card relative overflow-hidden border-2 border-primary/45 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--card)_92%,transparent),color-mix(in_oklab,var(--background)_92%,transparent))] p-6 shadow-[var(--shadow-deep)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_20px_45px_rgba(0,0,0,0.55)]">
                    {/* spray splatter blob in the corner */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-5 -right-5 h-20 w-20 rounded-full bg-primary/25 blur-xl transition-opacity duration-300 group-hover/card:opacity-80"
                    />
                    {/* paint drip that runs down from the top on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-6 top-0 h-2 origin-top scale-y-0 rounded-b-full bg-gradient-to-b from-primary via-primary/70 to-transparent opacity-0 transition-transform duration-300 ease-out group-hover/card:scale-y-100 group-hover/card:opacity-100"
                    />
                    <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-primary/40 bg-primary/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 group-hover/card:rotate-[18deg] group-hover/card:border-primary/70 group-hover/card:bg-primary/15">
                      <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover/card:scale-110" />
                    </div>
                    <h3 className="font-tag mt-4 inline-block -rotate-1 text-lg tracking-[0.15em] text-primary uppercase">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          <div className="reveal reveal-target relative">
            <div className="rune-panel relative flex aspect-square items-center justify-center overflow-hidden rounded-xl shadow-[var(--shadow-deep)]">
              {/* framed video wrapper — fills the placeholder edge-to-edge */}
              <div
                ref={wrapperRef}
                className="group absolute inset-0 rounded-xl"
                style={{
                  padding: "4px",
                  background:
                    "linear-gradient(135deg, rgba(255,190,110,0.5), rgba(255,90,30,0.15) 45%, rgba(255,190,110,0.35))",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,170,90,0.08)",
                }}
              >
                <div
                  className="relative h-full w-full overflow-hidden rounded-[0.9rem] bg-black/20"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  {/* video is rendered at swapped dimensions so the -90deg rotation
                      fills the square frame exactly with no letterboxing */}
                  <video
                    ref={videoRef}
                    autoPlay
                    muted={muted}
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: "translate(-50%, -50%) rotate(-90deg)",
                      transformOrigin: "center",
                      display: "block",
                    }}
                  >
                    <source src="/custom-portal.mp4" type="video/mp4" />
                  </video>

                  {/* soft inner glow ring for depth */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[0.9rem]"
                    style={{ boxShadow: "inset 0 0 40px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)" }}
                  />

                  {/* Controls: center play/pause, bottom-right mute toggle */}
                  <button
                    onClick={togglePlay}
                    aria-label={paused ? "Play video" : "Pause video"}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-16 w-16 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-black/55 focus:opacity-100"
                    style={{ border: "1px solid rgba(255,190,110,0.3)", boxShadow: "0 0 24px rgba(255,150,60,0.25)" }}
                  >
                    {paused ? <Play className="h-7 w-7 translate-x-0.5" /> : <Pause className="h-7 w-7" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute video" : "Mute video"}
                    className="absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white opacity-80 backdrop-blur-md transition-all duration-300 hover:opacity-100 hover:scale-105 focus:opacity-100"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="rune-panel animate-float mt-6 rounded-lg p-6 text-center">
              <p className="font-display text-lg tracking-wide">
                &ldquo;In a world of cause and effect,{" "}
                <span className="text-primary">dare to be the exception.</span>&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
