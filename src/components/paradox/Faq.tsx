import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionTitle } from "./RuneRing";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const faqs = [
  {
    q: "Who can participate in PARADOX?",
    a: "Any undergraduate or postgraduate student with a valid college ID can join. Beginners are welcome — mentors are around the clock to help you cast your first spell.",
  },
  {
    q: "What is the team size?",
    a: "Teams of 2 to 4 members. Cross-college and cross-department teams are allowed and encouraged.",
  },
  {
    q: "Is there a registration fee?",
    a: "No. Participation in PARADOX is completely free, including meals, refreshments and swag for all selected teams.",
  },
  {
    q: "Do I need to come with an idea?",
    a: "Not at all. Problem statements and tracks are revealed at the opening ceremony, though you may build on a pre-planned idea as long as no code is written before the event.",
  },
  {
    q: "What should I bring?",
    a: "Your laptop, chargers, extension cords, college ID and anything else your build needs. Sleeping bags are welcome — the sanctum stays open all night.",
  },
  {
    q: "How are projects judged?",
    a: "Innovation, technical depth, real-world impact, design and the quality of your final demo. Round 1 is table judging; the top 10 pitch on the main stage.",
  },
];

export function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="faq" ref={sectionRef} className="relative overflow-hidden py-24 sm:py-32">
      {/* Seamless blend with Schedule above and Register below */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-background via-background/60 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,color-mix(in_oklab,var(--accent)_6%,transparent)_0%,transparent_70%)] -z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />

      <div className="mx-auto max-w-3xl px-5">
        <div className="reveal reveal-target">
          <SectionTitle eyebrow="Answers from the ancient one" title="FAQ" />
        </div>

        <Accordion type="single" collapsible className="mt-14 space-y-4">
          {faqs.map(({ q, a }, i) => (
            <AccordionItem
              key={q}
              value={`item-${i}`}
              className="rune-panel reveal reveal-target rounded-lg border-b-0 px-5"
            >
              <AccordionTrigger className="text-left font-display text-base font-semibold tracking-wide hover:text-primary hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
