import { SectionTitle } from "./RuneRing";

const days = [
  {
    day: "Day 01",
    date: "24 September, 2026",
    items: [
      ["09:00 AM", "Gates Open · Check-in", "Collect your kit and enter the sanctum."],
      ["10:30 AM", "Opening Ceremony", "Keynote from the council of judges and sponsors."],
      ["12:00 PM", "Hacking Begins", "The clock bends. 48 hours start now."],
      ["04:00 PM", "Workshop: Bending APIs", "Hands-on session with mentors."],
      ["09:00 PM", "Midnight Mystic Meetup", "Snacks, music and rapid-fire quizzes."],
    ],
  },
  {
    day: "Day 02",
    date: "25 September, 2026",
    items: [
      ["09:00 AM", "Mentor Rounds I", "One-on-one guidance on your build."],
      ["01:00 PM", "Checkpoint Submission", "Share progress and get scored feedback."],
      ["05:00 PM", "Tech Talk: Multiverse Scaling", "Industry speakers on real-world systems."],
      ["10:00 PM", "Mentor Rounds II", "Late-night debugging rituals."],
    ],
  },
  {
    day: "Day 03",
    date: "26 September, 2026",
    items: [
      ["12:00 PM", "Hacking Ends", "Final commits locked in the timeline."],
      ["01:30 PM", "Round 1 Judging", "Demo to the panel at your table."],
      ["04:00 PM", "Grand Finale Pitches", "Top 10 teams present on the main stage."],
      ["06:00 PM", "Prize Distribution", "Glory, prizes and the closing ceremony."],
    ],
  },
];

export function Schedule() {
  return (
    <section id="schedule" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5">
        <SectionTitle eyebrow="48 hours across three dimensions" title="Schedule" />

        <div className="mt-16 space-y-12">
          {days.map(({ day, date, items }) => (
            <div key={day}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="font-display text-2xl font-bold tracking-[0.2em] text-primary uppercase">
                  {day}
                </h3>
                <p className="text-sm tracking-[0.25em] text-muted-foreground uppercase">{date}</p>
              </div>

              <ol className="mt-6 border-l border-border pl-6">
                {items.map(([time, title, copy]) => (
                  <li key={title} className="relative pb-8 last:pb-0">
                    <span className="absolute top-1.5 -left-[1.9rem] h-3 w-3 rotate-45 border border-primary bg-background shadow-[var(--shadow-rune)]" />
                    <p className="text-xs tracking-[0.3em] text-primary uppercase">{time}</p>
                    <h4 className="mt-1 font-display text-lg font-semibold">{title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
