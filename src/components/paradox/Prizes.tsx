import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Crown } from "lucide-react";
import { SectionTitle } from "./RuneRing";
import { TiltCard } from "./TiltCard";
import { ScrollFrameSequence } from "./ScrollFrameSequence";
import cardRules from "@/assets/guide/card-rules.jpg";
import prize1st from "@/assets/guide/prize-1st.jpg";
import prize2nd from "@/assets/guide/prize-2nd.jpg";

gsap.registerPlugin(ScrollTrigger);

const prizes = [
  { place: "Winner", prize: "₹15,000", note: "The Sorcerer Supreme", big: true, image: cardRules },
  { place: "1st Runner Up", prize: "₹10,000", note: "Master of the Mystic Arts", image: prize1st },
  { place: "2nd Runner Up", prize: "₹5,000", note: "Keeper of the Time Stone", image: prize2nd },
];

export function Prizes() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    ScrollTrigger.refresh();

    return () => {
      st.kill();
    };
  }, []);

  // Card 1 (Left / Winner): comes from left during early scroll (0.0 to 0.33), stays left
  const t1 = Math.min(1, Math.max(0, scrollProgress / 0.33));
  const ease1 = 1 - Math.pow(1 - t1, 3);
  const card1Transform = `translateX(${(1 - ease1) * -120}%)`;
  const card1Opacity = ease1;

  // Card 2 (Middle / 1st Runner Up): comes from down during mid scroll (0.33 to 0.66), stays beside Card 1
  const t2 = Math.min(1, Math.max(0, (scrollProgress - 0.33) / 0.33));
  const ease2 = 1 - Math.pow(1 - t2, 3);
  const card2Transform = `translateY(${(1 - ease2) * 120}%)`;
  const card2Opacity = ease2;

  // Card 3 (Right / 2nd Runner Up): comes from right during late scroll (0.66 to 0.98), stays beside Card 2
  const t3 = Math.min(1, Math.max(0, (scrollProgress - 0.66) / 0.32));
  const ease3 = 1 - Math.pow(1 - t3, 3);
  const card3Transform = `translateX(${(1 - ease3) * 120}%)`;
  const card3Opacity = ease3;

  return (
    <section
      id="prizes"
      ref={sectionRef}
      className="relative h-[420vh]"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden pt-20 sm:pt-28">
        {/* the prize podium runs its own scroll-scrubbed reel over the main one */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.65) 12%, #000 26%, #000 74%, rgba(0,0,0,0.65) 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.65) 12%, #000 26%, #000 74%, rgba(0,0,0,0.65) 88%, transparent 100%)",
          }}
        >
          <ScrollFrameSequence
            triggerRef={sectionRef}
            basePath="/prize-frames"
            mobileBasePath="/prize-frames-mobile"
            frameCount={278}
            start="top top"
            end="bottom bottom"
            scrub={0.4}
            step={1}
            className="h-full w-full opacity-95"
            style={{ filter: "sepia(0.18) hue-rotate(-6deg) saturate(1.25) brightness(0.72) contrast(1.05)" }}
          />
          <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--background)_26%,transparent)]" />
          {/* fade into the sequence running behind the neighbouring sections */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_80%,var(--background)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_50%,transparent_0%,transparent_55%,color-mix(in_oklab,var(--background)_65%,transparent)_84%,var(--background)_100%)]" />
        </div>

        {/* Top: Header stays firmly at the top of the prize section */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="max-w-xl">
            <SectionTitle eyebrow="Glory for those who bend reality." align="left" title="Prize Pool" />
          </div>
        </div>

        {/* Cards container: centered vertically on mobile, shifted down on desktop */}
        <div className="relative z-10 mx-auto flex-1 flex items-center sm:items-end w-full max-w-[1540px] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-1.5 xs:px-2.5 sm:px-6 md:px-8 pt-10 sm:pt-2 pb-2 sm:pb-8 md:pb-10 lg:pb-12">
          <div className="w-full grid grid-cols-3 gap-1.5 xs:gap-3 sm:gap-3 md:gap-4 lg:gap-5 items-center">
            {prizes.map(({ place, prize, note, big, image }, index) => {
              let transform = "none";
              let opacity = 1;

              if (index === 0) {
                transform = card1Transform;
                opacity = card1Opacity;
              } else if (index === 1) {
                transform = card2Transform;
                opacity = card2Opacity;
              } else if (index === 2) {
                transform = card3Transform;
                opacity = card3Opacity;
              }

              return (
                <div
                  key={place}
                  className="will-change-transform"
                  style={{
                    transform,
                    opacity,
                    transition: "transform 0.15s ease-out, opacity 0.15s ease-out",
                    pointerEvents: opacity > 0.15 ? "auto" : "none",
                  }}
                >
                  <TiltCard
                    glowColor="var(--accent)"
                    sparkCount={7}
                    className="overflow-hidden rounded-xl sm:rounded-2xl"
                  >
                    <div
                      className="relative w-full h-[310px] xs:h-[360px] sm:h-[270px] md:h-[300px] lg:h-[340px] overflow-hidden rounded-xl sm:rounded-2xl border border-accent/25 shadow-[var(--shadow-deep)] transition-all duration-300 group-hover:border-accent/60 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                    >
                      {/* podium still — the realm's own champions stand in for the trophy */}
                      <img
                        src={image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        style={{ filter: "sepia(0.3) saturate(1.8) hue-rotate(-10deg) brightness(0.8)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                      {/* Yellow background on hover */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-amber-500/25 via-amber-400/12 to-amber-300/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100 mix-blend-screen" />
                      {big && (
                        <span
                          aria-hidden="true"
                          className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 text-[8px] xs:text-[10px] sm:text-[9px] md:text-[10px] lg:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-accent uppercase font-bold whitespace-nowrap"
                        >
                          ✦ Sorcerer Supreme ✦
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-2.5 xs:p-3.5 sm:p-3 md:p-4 lg:p-5 text-center">
                        <Crown className="relative mx-auto h-6 w-6 xs:h-7 xs:w-7 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-accent drop-shadow-[0_0_12px_color-mix(in_oklab,var(--accent)_70%,transparent)]" />
                        <p className="relative mt-1 text-[10px] xs:text-xs sm:text-[10px] md:text-xs lg:text-sm tracking-[0.18em] sm:tracking-[0.25em] text-muted-foreground uppercase font-semibold">
                          {place}
                        </p>
                        <p className="relative mt-0.5 sm:mt-1 font-display text-2xl xs:text-3xl sm:text-xl md:text-2xl lg:text-3xl font-black text-glow tracking-tight">
                          {prize}
                        </p>
                        <p className="relative mt-0.5 sm:mt-1 text-[8px] xs:text-[10px] sm:text-[11px] md:text-xs text-primary truncate sm:whitespace-normal">
                          {note}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
