import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import heroArt from "@/assets/paradox-hero.jpg";
import { RuneRing } from "./RuneRing";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-28">
      <img
        src={heroArt}
        alt="Doctor Strange multiverse artwork for the PARADOX hackathon"
        className="absolute inset-0 h-full w-full object-cover object-right"
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--background)_18%,color-mix(in_oklab,var(--background)_82%,transparent)_45%,transparent_78%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,var(--background)_100%)]" />
      <RuneRing className="animate-glow -top-24 -left-32 h-[34rem] w-[34rem]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center px-5 pb-20">
        <div className="max-w-2xl">
          <p className="text-[0.7rem] tracking-[0.55em] text-primary uppercase sm:text-xs">
            Code. Create. Defy Reality.
          </p>
          <h1 className="mt-4 text-6xl font-bold tracking-[0.06em] gradient-text sm:text-8xl">
            PARADOX
          </h1>
          <p className="mt-3 text-sm tracking-[0.35em] text-foreground/80 uppercase sm:text-base">
            A Hackathon Beyond Logic
          </p>

          <p className="mt-8 max-w-lg text-base leading-relaxed text-foreground/85 sm:text-lg">
            Step into the multiverse of innovation. Where impossible ideas become real solutions.
            Break the limits. Rewrite what&apos;s possible.
          </p>

          <div className="mt-9 grid max-w-xl gap-4 rune-panel rounded-lg px-6 py-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">Date</p>
                <p className="font-semibold">24 – 26 September, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:border-l sm:border-border sm:pl-6">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">Venue</p>
                <p className="font-semibold">Gurukul Building, IEM, Saltlake</p>
              </div>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#register"
              className="group inline-flex items-center gap-3 rounded-md bg-[image:var(--gradient-mystic)] px-7 py-3.5 text-sm font-bold tracking-[0.2em] text-primary-foreground uppercase shadow-[var(--shadow-rune)] transition-transform hover:scale-105"
            >
              Register Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#about"
              className="group inline-flex items-center gap-3 rounded-md border border-primary/60 px-7 py-3.5 text-sm font-bold tracking-[0.2em] text-foreground uppercase transition-colors hover:bg-primary/15"
            >
              Explore More
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-y border-border bg-background/80 backdrop-blur">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-border px-5 py-6 sm:grid-cols-4 sm:divide-x">
          {[
            ["1000+", "Hackers"],
            ["48", "Hours"],
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
