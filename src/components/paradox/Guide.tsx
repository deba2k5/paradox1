import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Box, CalendarDays, Lightbulb } from "lucide-react";
import { SectionTitle } from "./RuneRing";
import { TiltCard } from "./TiltCard";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import cardRules from "@/assets/guide/card-rules.jpg";
import cardResources from "@/assets/guide/card-resources.png";
import cardTimeline from "@/assets/guide/card-timeline.png";
import cardTips from "@/assets/guide/card-tips.png";

const cards = [
  {
    icon: BookOpen,
    title: "Rules & Guidelines",
    copy: "Know the rules of the game. Eligibility, team size, code of conduct and more.",
    points: ["Teams of 2 – 4 sorcerers", "Original code written on-site", "Any stack, any realm"],
    image: cardRules,
  },
  {
    icon: Box,
    title: "Resources",
    copy: "APIs, developer tools, datasets and platforms to power your ideas to life.",
    points: ["Free API & cloud credits", "Starter kits & datasets", "Mentors on the floor"],
    image: cardResources,
  },
  {
    icon: CalendarDays,
    title: "Timeline",
    copy: "Important dates, deadlines and key event milestones. Stay ahead, always.",
    points: ["Registration closes 25 Sept", "Teams confirmed 30 Sept", "Hack day 3 Oct 2026"],
    image: cardTimeline,
  },
  {
    icon: Lightbulb,
    title: "Tips & Tricks",
    copy: "Pro tips, past learnings and insights to help you hack smarter, not harder.",
    points: ["Scope small, ship complete", "Demo beats slides", "Eight hours goes fast"],
    image: cardTips,
  },
];

const AUTO_ADVANCE_MS = 2600;

export function Guide() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const reducedMotion = usePrefersReducedMotion();

  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

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

  // Only spend frames on the rail while it is actually on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cards keep travelling left → right on their own, and yield the moment a
  // reader hovers, focuses, or leaves the tab.
  useEffect(() => {
    if (!api || reducedMotion || !inView || hovered) return;

    const interval = window.setInterval(() => {
      if (document.hidden) return;
      api.scrollNext();
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [api, reducedMotion, inView, hovered]);

  const scrollTo = useCallback((i: number) => api?.scrollTo(i), [api]);

  return (
    <section
      id="guide"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center py-24 sm:py-32"
    >
      <div className="relative mx-auto w-full max-w-6xl px-5">
        <div className="reveal reveal-target">
          <SectionTitle eyebrow="Your spellbook to innovate." align="left" title="Hackers Guide" />
        </div>

        <div
          className="reveal reveal-target mt-12"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
        >
          <Carousel setApi={setApi} opts={{ align: "start", loop: true, duration: 32 }}>
            <CarouselContent>
              {cards.map(({ icon: Icon, title, copy, points, image }) => (
                <CarouselItem key={title} className="basis-[82%] sm:basis-1/2 lg:basis-1/3">
                  <TiltCard className="h-full overflow-hidden rounded-2xl">
                    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-[var(--shadow-deep)]">
                      {/* poster panel — a card-sized still of the realm this section covers */}
                      <div className="relative h-56 w-full overflow-hidden sm:h-64">
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

            <div className="mt-8 flex items-center justify-center gap-2">
              {cards.map((card, i) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to ${card.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    selected === i ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
