import { useRef } from "react";
import { Crown } from "lucide-react";
import { SectionTitle } from "./RuneRing";
import { TiltCard } from "./TiltCard";
import { ScrollFrameSequence } from "./ScrollFrameSequence";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import cardRules from "@/assets/guide/card-rules.jpg";
import prize1st from "@/assets/guide/prize-1st.jpg";
import prize2nd from "@/assets/guide/prize-2nd.jpg";

const prizes = [
  { place: "Winner", prize: "₹15,000", note: "The Sorcerer Supreme", big: true, image: cardRules },
  { place: "1st Runner Up", prize: "₹10,000", note: "Master of the Mystic Arts", image: prize1st },
  { place: "2nd Runner Up", prize: "₹5,000", note: "Keeper of the Time Stone", image: prize2nd },
];

export function Prizes() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      id="prizes"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden py-20 sm:py-32"
    >
      {/* The podium runs its own reel, graded to the same palette as the one
          behind the rest of the page and masked at both ends so the two
          dissolve into each other instead of cutting at the section edge. */}
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
          frameCount={99}
          className="h-full w-full opacity-85"
          style={{ filter: "sepia(0.3) hue-rotate(-10deg) saturate(1.15) brightness(0.62) contrast(1.05)" }}
        />
        <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--background)_32%,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_50%,transparent_0%,transparent_55%,color-mix(in_oklab,var(--background)_60%,transparent)_86%,color-mix(in_oklab,var(--background)_85%,transparent)_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5">
        <div className="reveal reveal-target">
          <SectionTitle eyebrow="Glory for those who bend reality." align="left" title="Prize Pool" />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {prizes.map(({ place, prize, note, big, image }) => (
            <TiltCard
              key={place}
              glowColor="var(--accent)"
              sparkCount={7}
              className={`reveal reveal-target overflow-hidden rounded-2xl ${big ? "sm:-translate-y-3 sm:scale-105" : ""}`}
            >
              <div
                className={`relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[var(--shadow-deep)] sm:aspect-[3/4] ${
                  big ? "ring-2 ring-accent/70" : "border border-accent/25"
                }`}
              >
                {/* podium still — the realm's own champions stand in for the trophy */}
                <img
                  src={image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: "sepia(0.3) saturate(1.8) hue-rotate(-10deg) brightness(0.8)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
                {big && (
                  <span
                    aria-hidden="true"
                    className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] text-accent uppercase"
                  >
                    ✦ Sorcerer Supreme ✦
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                  <Crown className="relative mx-auto h-7 w-7 text-accent drop-shadow-[0_0_10px_color-mix(in_oklab,var(--accent)_70%,transparent)]" />
                  <p className="relative mt-3 text-xs tracking-[0.35em] text-muted-foreground uppercase">
                    {place}
                  </p>
                  <p className="relative mt-2 font-display text-3xl font-bold text-glow">{prize}</p>
                  <p className="relative mt-2 text-sm text-primary">{note}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
