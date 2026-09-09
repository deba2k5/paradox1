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

/** A hand-sprayed underline in place of a ruled line — a rough wavy stroke with a
 *  paint drip hanging off it, like a can dragged once under a freshly tagged word. */
function SprayUnderline({
  align,
  className = "",
  svgClassName = "",
}: {
  align: "center" | "left";
  className?: string;
  svgClassName?: string;
}) {
  return (
    <div className={`mt-4 ${align === "center" ? "flex justify-center" : ""} ${className}`}>
      <svg
        viewBox="0 0 220 34"
        className={`spray-stroke h-7 w-40 text-primary sm:w-56 ${svgClassName}`}
        aria-hidden="true"
      >
        <path
          d="M4 14 Q 34 4, 62 13 T 120 11 T 178 15 T 216 9"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M4 21 Q 40 27, 90 20 T 216 18"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          className="animate-drip"
          style={{ transformOrigin: "104px 16px", animationDelay: "0.4s" }}
          d="M102 16c0 8 0 14 2 18 3-3 3-11 2-18Z"
          fill="var(--primary)"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  align = "center",
  className = "",
  titleClassName = "",
  eyebrowClassName = "",
  underlineClassName = "",
  svgClassName = "",
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
  eyebrowClassName?: string;
  underlineClassName?: string;
  svgClassName?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {eyebrow ? (
        <p
          className={`font-tag inline-block -rotate-2 text-xs tracking-[0.3em] text-accent uppercase ${eyebrowClassName}`}
          style={{ textShadow: "2px 2px 0 color-mix(in oklab, var(--primary) 70%, black)" }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`font-graffiti stencil-text mt-3 text-4xl leading-tight font-normal sm:text-6xl ${titleClassName}`}>
        {title}
      </h2>
      <SprayUnderline align={align} className={underlineClassName} svgClassName={svgClassName} />
    </div>
  );
}
