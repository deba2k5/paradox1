import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Box, CalendarDays, Lightbulb, Rocket, Code2, Trophy, Crown, ArrowLeft, ArrowRight } from "lucide-react";
import { RuneRing, SectionTitle } from "./RuneRing";
import { TiltCard } from "./TiltCard";
import { ArcaneWeave } from "./ArcaneWeave";
import { SpraySplatter } from "./SpraySplatter";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import parchment from "@/assets/texture-parchment.jpg";
import cardRules from "@/assets/guide/card-rules.jpg";
import cardResources from "@/assets/guide/card-resources.png";
import cardTimeline from "@/assets/guide/card-timeline.png";
import cardTips from "@/assets/guide/card-tips.png";
import quoteBg from "@/assets/guide/quote-bg.png";
import introAccent from "@/assets/guide/intro-accent.png";
import stepRegister from "@/assets/guide/step-register.png";
import stepIdeate from "@/assets/guide/step-ideate.png";
import stepBuild from "@/assets/guide/step-build.png";
import stepPresent from "@/assets/guide/step-present.png";
import stepWin from "@/assets/guide/step-win.png";
import prizeWinner from "@/assets/guide/prize-winner.jpg";
import prize1st from "@/assets/guide/prize-1st.jpg";
import prize2nd from "@/assets/guide/prize-2nd.jpg";

const cards = [
  {
    icon: BookOpen,
    title: "Rules & Guidelines",
    copy: "Know the rules of the game. Eligibility, team size, code of conduct and more.",
    points: ["Teams of 2 – 4 sorcerers", "Original code written on-site", "Any stack, any realm"],
    image: prizeWinner,
  },
  {
    icon: Box,
    title: "Resources",
    copy: "APIs, developer tools, datasets and platforms to power your ideas to life.",
    points: ["Free API & cloud credits", "Starter kits & datasets", "24/7 mentor sanctum"],
    image: cardResources,
  },
  {
    icon: CalendarDays,
    title: "Timeline",
    copy: "Important dates, deadlines and key event milestones. Stay ahead, always.",
    points: ["Registration closes 15 Sept", "Idea submission 18 Sept", "Finals 5 Oct"],
    image: cardTimeline,
  },
  {
    icon: Lightbulb,
    title: "Tips & Tricks",
    copy: "Pro tips, past learnings and insights to help you hack smarter, not harder.",
    points: ["Scope small, ship complete", "Demo beats slides", "Sleep is a valid strategy"],
    image: cardTips,
  },
];

const journey = [
  {
    icon: BookOpen,
    step: "01",
    title: "Register",
    copy: "Form your team and step into the realm.",
    sticker: stepRegister,
  },
  {
    icon: Lightbulb,
    step: "02",
    title: "Ideate",
    copy: "Brainstorm. Break boundaries. Find your paradox.",
    sticker: stepIdeate,
  },
  {
    icon: Code2,
    step: "03",
    title: "Build",
    copy: "Code. Create. Conjure. Turn your idea into reality.",
    sticker: stepBuild,
  },
  {
    icon: Rocket,
    step: "04",
    title: "Present",
    copy: "Showcase your solution to the council. Impress the judges.",
    sticker: stepPresent,
  },
  {
    icon: Trophy,
    step: "05",
    title: "Win & Impact",
    copy: "Claim glory. Create impact. Be the exception.",
    sticker: stepWin,
  },
];

const prizes = [
  { place: "Winner", prize: "₹50,000", note: "The Sorcerer Supreme", big: true, image: cardRules },
  { place: "1st Runner Up", prize: "₹30,000", note: "Master of the Mystic Arts", image: prize1st },
  { place: "2nd Runner Up", prize: "₹20,000", note: "Keeper of the Time Stone", image: prize2nd },
];

export function Guide() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const scrollTo = useCallback((i: number) => api?.scrollTo(i), [api]);

  return (
    <section id="guide" ref={sectionRef} className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0">
        <img
          src={parchment}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.1]"
          style={{ filter: "sepia(0.3) saturate(1.6) hue-rotate(-20deg)" }}
        />
        <ArcaneWeave className="absolute inset-0 h-full w-full opacity-[0.15]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--background),color-mix(in_oklab,var(--background)_78%,transparent)_45%,var(--background))]" />
      </div>
      <SpraySplatter
        className="pointer-events-none absolute top-8 right-6 h-20 w-20 rotate-6 opacity-50 sm:h-28 sm:w-28"
        color="var(--primary)"
      />
      <img
        src={introAccent}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-24 hidden h-80 w-80 -scale-x-100 object-contain opacity-[0.14] mix-blend-luminosity lg:block"
        style={{ filter: "drop-shadow(0 0 40px var(--primary)) grayscale(0.3)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="reveal reveal-target">
            <SectionTitle
              eyebrow="Your spellbook to innovate."
              title="Hackers Guide"
              align="left"
            />
            <p className="mt-7 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg">
              Everything you need to know. All in one place. Rules, resources, timelines and tips to
              help you focus on what truly matters — building the impossible.
            </p>
          </div>

          <div className="rune-panel reveal reveal-target relative overflow-hidden rounded-xl p-8 text-center">
            <img
              src={quoteBg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-top opacity-25"
              style={{ filter: "sepia(0.4) saturate(1.8) hue-rotate(-20deg) brightness(0.55)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-background/85" />
            <RuneRing className="animate-glow -top-10 -right-10 h-32 w-32" />
            <p className="relative font-display text-lg leading-relaxed tracking-wide">
              In the multiverse of ideas, you are the anomaly that{" "}
              <span className="text-primary">changes everything.</span>
            </p>
          </div>
        </div>

        <div className="reveal reveal-target mt-16">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="relative"
          >
            <CarouselContent>
              {cards.map(({ icon: Icon, title, copy, points, image }) => (
                <CarouselItem key={title} className="sm:basis-1/2 lg:basis-1/4">
                  <TiltCard className="h-full overflow-hidden rounded-2xl">
                    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-[var(--shadow-deep)]">
                      {/* poster panel — a card-sized still of the realm this section covers */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden">
                        <img
                          src={image}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                          style={{ filter: "sepia(0.35) saturate(1.7) hue-rotate(-15deg) brightness(0.75)" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,var(--card)_94%)]" />
                        <div className="absolute top-3 left-3 grid h-11 w-11 place-items-center rounded-xl border border-primary/40 bg-background/60 shadow-[0_0_16px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="relative -mt-14 flex flex-1 flex-col p-5">
                        <h3 className="font-display text-base font-semibold tracking-[0.18em] uppercase text-glow">
                          {title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
                        <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                          {points.map((p) => (
                            <li key={p} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  </TiltCard>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                aria-label="Previous card"
                className="grid h-10 w-10 place-items-center rounded-full border border-primary/30 bg-primary/5 text-primary transition-all hover:scale-110 hover:border-primary/60 hover:bg-primary/15"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                {cards.map((c, i) => (
                  <button
                    key={c.title}
                    type="button"
                    onClick={() => scrollTo(i)}
                    aria-label={`Go to card ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      selected === i ? "w-6 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => api?.scrollNext()}
                aria-label="Next card"
                className="grid h-10 w-10 place-items-center rounded-full border border-primary/30 bg-primary/5 text-primary transition-all hover:scale-110 hover:border-primary/60 hover:bg-primary/15"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Carousel>
        </div>

        <div className="mt-24">
          <div className="reveal reveal-target flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
            <h3 className="text-center text-sm tracking-[0.4em] text-primary uppercase">
              The Hackathon Journey
            </h3>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
          </div>

          <div className="relative mt-14">
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {journey.map(({ icon: Icon, step, title, copy, sticker }, i) => (
                <TiltCard
                  key={step}
                  sparkCount={6}
                  className={`reveal reveal-target rounded-xl ${i === journey.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  <li className="relative h-full overflow-hidden rounded-xl p-7 text-center rune-panel">
                    <span
                      className="pointer-events-none absolute inset-0 opacity-70"
                      style={{
                        background:
                          "linear-gradient(120deg, transparent 20%, color-mix(in oklab, var(--primary) 20%, transparent) 45%, transparent 70%)",
                        backgroundSize: "220% 220%",
                      }}
                      aria-hidden="true"
                    />
                    {/* ghostly character watermark tied to this step of the journey */}
                    <img
                      src={sticker}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-4 -bottom-4 h-28 w-28 object-contain opacity-[0.16] grayscale transition-all duration-500 group-hover:opacity-30 group-hover:scale-110"
                    />
                    <p className="relative font-display text-xs tracking-[0.35em] text-primary">
                      {step}
                    </p>
                    <div className="animate-glow relative mx-auto mt-4 grid h-14 w-14 place-items-center rounded-full border border-primary/50 bg-primary/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <Icon className="h-6 w-6 text-primary drop-shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_70%,transparent)]" />
                    </div>
                    <h4 className="relative mt-4 font-display text-sm font-semibold tracking-[0.2em] uppercase">
                      {title}
                    </h4>
                    <p className="relative mt-2 text-sm text-muted-foreground">{copy}</p>
                  </li>
                </TiltCard>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {prizes.map(({ place, prize, note, big, image }) => (
            <TiltCard
              key={place}
              glowColor="var(--accent)"
              sparkCount={7}
              className={`reveal reveal-target overflow-hidden rounded-2xl ${big ? "sm:-translate-y-3 sm:scale-105" : ""}`}
            >
              <div
                className={`relative aspect-[3/4] overflow-hidden rounded-2xl shadow-[var(--shadow-deep)] ${
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
