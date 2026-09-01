import { useEffect, useState } from "react";

// Event starts 3rd October 2026 at 09:00 IST
const TARGET = new Date("2026-10-03T09:00:00+05:30").getTime();

function getRemaining() {
  const diff = Math.max(0, TARGET - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

const units: Array<{ key: keyof ReturnType<typeof getRemaining>; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export function Countdown() {
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto grid max-w-xl grid-cols-4 gap-3 sm:gap-5">
      <span
        className="animate-rune pointer-events-none absolute -inset-6 -z-10 rounded-full border border-primary/25"
        aria-hidden="true"
      />
      <span
        className="animate-rune-reverse pointer-events-none absolute -inset-3 -z-10 rounded-full border border-accent/20"
        aria-hidden="true"
      />
      {units.map(({ key, label }) => (
        <div
          key={key}
          className="rune-panel relative grid place-items-center rounded-xl px-2 py-4 sm:py-6"
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-xl opacity-60"
            style={{
              background:
                "radial-gradient(120% 100% at 50% -10%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%)",
            }}
            aria-hidden="true"
          />
          <span className="font-display text-glow relative text-3xl font-bold tabular-nums sm:text-5xl">
            {time ? String(time[key]).padStart(2, "0") : "--"}
          </span>
          <span className="relative mt-1.5 text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
