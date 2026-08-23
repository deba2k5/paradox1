import { Atom, BookOpen, Target, Users } from "lucide-react";
import sanctum from "@/assets/sanctum.jpg";
import { RuneRing, SectionTitle } from "./RuneRing";

const pillars = [
  { icon: Atom, title: "Innovate", copy: "Build futuristic solutions that defy the ordinary." },
  { icon: Users, title: "Collaborate", copy: "Team up with brilliant minds across realms." },
  { icon: BookOpen, title: "Learn", copy: "Gain insights from experts who've mastered the craft." },
  { icon: Target, title: "Impact", copy: "Create real-world impact with your innovation." },
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32">
      <RuneRing className="animate-glow top-24 -right-40 h-[30rem] w-[30rem]" />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionTitle eyebrow="One reality. Limitless possibilities." title="About PARADOX" />

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6 text-base leading-relaxed text-foreground/85 sm:text-lg">
            <p>
              PARADOX is more than a hackathon — it&apos;s a gateway to infinite possibilities.
              Inspired by the mystic arts of bending reality, this hackathon challenges you to
              question conventions, explore the unknown, and build solutions that create impact.
            </p>
            <p>
              Across dimensions of technology and creativity, come together to solve real-world
              problems with extraordinary ideas. The only limit is your imagination.
            </p>
            <p className="font-display text-lg font-semibold tracking-widest text-primary uppercase">
              One reality. Limitless possibilities.
            </p>

            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, title, copy }) => (
                <div
                  key={title}
                  className="rune-panel group rounded-lg p-5 transition-transform hover:-translate-y-1"
                >
                  <Icon className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                  <h3 className="mt-3 text-lg font-semibold tracking-[0.2em] text-primary uppercase">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-primary/40 shadow-[var(--shadow-deep)]">
              <img
                src={sanctum}
                alt="Sorcerer standing before the Sanctum Sanctorum window"
                loading="lazy"
                className="h-full w-full object-cover"
              />
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
