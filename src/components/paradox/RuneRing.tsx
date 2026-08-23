export function RuneRing({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="animate-rune h-full w-full text-primary opacity-40">
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="4 6"
        />
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="4"
            x2="100"
            y2="18"
            stroke="currentColor"
            strokeWidth="0.7"
            transform={`rotate(${i * 15} 100 100)`}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <polygon
            key={i}
            points="100,22 112,44 88,44"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            transform={`rotate(${i * 45} 100 100)`}
          />
        ))}
      </svg>
      <svg
        viewBox="0 0 200 200"
        className="animate-rune-reverse absolute inset-0 h-full w-full text-primary-glow opacity-30"
      >
        <circle
          cx="100"
          cy="100"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeDasharray="2 8"
        />
        <polygon
          points="100,58 136,121 64,121"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        />
        <polygon
          points="100,142 64,79 136,79"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow ? (
        <p className="text-xs tracking-[0.45em] text-primary uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-wide text-glow sm:text-5xl">{title}</h2>
      <div
        className={`mt-5 flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary sm:w-28" />
        <span className="h-2 w-2 rotate-45 bg-primary shadow-[var(--shadow-rune)]" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary sm:w-28" />
      </div>
    </div>
  );
}
