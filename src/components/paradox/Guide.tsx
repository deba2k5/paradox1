import { BookOpen, Box, CalendarDays, Lightbulb, Rocket, Code2, Trophy, Crown } from "lucide-react";
import spellbook from "@/assets/spellbook.jpg";
import { RuneRing, SectionTitle } from "./RuneRing";

const cards = [
  {
    icon: BookOpen,
    title: "Rules & Guidelines",
    copy: "Know the rules of the game. Eligibility, team size, code of conduct and more.",
    points: ["Teams of 2 – 4 sorcerers", "Original code written on-site", "Any stack, any realm"],
  },
  {
    icon: Box,
    title: "Resources",
    copy: "APIs, developer tools, datasets and platforms to power your ideas to life.",
    points: ["Free API & cloud credits", "Starter kits & datasets", "24/7 mentor sanctum"],
  },
  {
    icon: CalendarDays,
    title: "Timeline",
    copy: "Important dates, deadlines and key event milestones. Stay ahead, always.",
    points: ["Registration closes 15 Sept", "Idea submission 18 Sept", "Finals 26 Sept"],
  },
  {
    icon: Lightbulb,
    title: "Tips & Tricks",
    copy: "Pro tips, past learnings and insights to help you hack smarter, not harder.",
    points: ["Scope small, ship complete", "Demo beats slides", "Sleep is a valid strategy"],
  },
];

const journey = [
  { icon: BookOpen, step: "01", title: "Register", copy: "Form your team and step into the realm." },
  { icon: Lightbulb, step: "02", title: "Ideate", copy: "Brainstorm. Break boundaries. Find your paradox." },
  { icon: Code2, step: "03", title: "Build", copy: "Code. Create. Conjure. Turn your idea into reality." },
  { icon: Rocket, step: "04", title: "Present", copy: "Showcase your solution to the council. Impress the judges." },
  { icon: Trophy, step: "05", title: "Win & Impact", copy: "Claim glory. Create impact. Be the exception." },
];

export function Guide() {
  return (
    <section id="guide" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0">
        <img
          src={spellbook}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--background),color-mix(in_oklab,var(--background)_78%,transparent)_45%,var(--background))]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <SectionTitle
              eyebrow="Your spellbook to innovate."
              title="Hackers Guide"
              align="left"
            />
            <p className="mt-7 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg">
              Everything you need to know. All in one place. Rules, resources, timelines and tips
              to help you focus on what truly matters — building the impossible.
            </p>
          </div>

          <div className="rune-panel relative rounded-xl p-8 text-center">
            <RuneRing className="animate-glow -top-10 -right-10 h-32 w-32" />
            <p className="font-display text-lg leading-relaxed tracking-wide">
              In the multiverse of ideas, you are the anomaly that{" "}
              <span className="text-primary">changes everything.</span>
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, copy, points }) => (
            <article
              key={title}
              className="rune-panel group rounded-xl p-6 transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-rune)]"
            >
              <Icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <h3 className="mt-4 font-display text-base font-semibold tracking-[0.18em] uppercase">
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
            </article>
          ))}
        </div>

        <div className="mt-24">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
            <h3 className="text-center text-sm tracking-[0.4em] text-primary uppercase">
              The Hackathon Journey
            </h3>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {journey.map(({ icon: Icon, step, title, copy }) => (
              <li key={step} className="rune-panel rounded-xl p-6 text-center">
                <span className="font-display text-xs tracking-[0.35em] text-primary">{step}</span>
                <div className="mx-auto mt-3 grid h-12 w-12 place-items-center rounded-full border border-primary/50">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="mt-4 font-display text-sm font-semibold tracking-[0.2em] uppercase">
                  {title}
                </h4>
                <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {[
            { place: "Winner", prize: "₹50,000", note: "The Sorcerer Supreme" },
            { place: "1st Runner Up", prize: "₹30,000", note: "Master of the Mystic Arts" },
            { place: "2nd Runner Up", prize: "₹20,000", note: "Keeper of the Time Stone" },
          ].map(({ place, prize, note }) => (
            <div key={place} className="rune-panel rounded-xl p-7 text-center">
              <Crown className="mx-auto h-7 w-7 text-accent" />
              <p className="mt-3 text-xs tracking-[0.35em] text-muted-foreground uppercase">
                {place}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-glow">{prize}</p>
              <p className="mt-2 text-sm text-primary">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
