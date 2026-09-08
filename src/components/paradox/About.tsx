import { useRef } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { SectionTitle } from "./RuneRing";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const ABOUT_COPY =
  "PARADOX is an 8-hour hackathon where reality bends to your code. On 3rd October 2026, a thousand brilliant minds converge at IEM Saltlake to question conventions, break every boundary, and build the impossible before the clock runs out. One day. Eight hours. Infinite timelines. Dare to be the exception.";

const facts = [
  { icon: CalendarDays, label: "03 October 2026", tilt: "-rotate-2" },
  { icon: Clock, label: "8 Hours Straight", tilt: "rotate-1" },
  { icon: MapPin, label: "IEM Saltlake", tilt: "-rotate-1" },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex min-h-[210vh] flex-col justify-start pt-36 sm:pt-44 pb-32"
    >
      <div className="relative mx-auto w-full max-w-6xl px-5">
        <div className="reveal reveal-target">
          <SectionTitle eyebrow="One reality. Limitless possibilities." align="left" title="About PARADOX" />
        </div>

        {/* key facts, tagged on like stickers before the story starts */}
        <ul className="reveal reveal-target mt-8 flex flex-wrap gap-3">
          {facts.map(({ icon: Icon, label, tilt }) => (
            <li
              key={label}
              className={`graffiti-panel flex items-center gap-2 border-2 border-primary/50 bg-[color-mix(in_oklab,var(--background)_78%,transparent)] px-4 py-2 backdrop-blur-sm transition-transform duration-300 hover:rotate-0 ${tilt}`}
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              <span className="font-tag text-sm tracking-[0.14em] text-foreground/90 uppercase">
                {label}
              </span>
            </li>
          ))}
        </ul>

        <p
          className="font-display font-medium mt-8 max-w-3xl text-base leading-relaxed tracking-wide text-foreground/90 sm:text-lg sm:leading-[1.85]"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 0 42px rgba(0,0,0,0.75)" }}
        >
          {ABOUT_COPY}
        </p>
      </div>
    </section>
  );
}
