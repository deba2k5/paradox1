/** An original circular tracery window — radial mullions dividing panes of light,
 *  in the spirit of gothic sanctum architecture. Pure geometry, no photographic or
 *  copyrighted reference — a backdrop for the portal glow, not a depiction of any
 *  specific place or character. */
const round = (n: number) => Math.round(n * 1000) / 1000;

export function StainedGlassWindow({ className = "" }: { className?: string }) {
  const spokes = Array.from({ length: 8 });
  const innerSpokes = Array.from({ length: 12 });

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="glass-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="45%" stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="glass-frame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="200" r="190" fill="url(#glass-glow)" />

      <circle cx="200" cy="200" r="182" fill="none" stroke="url(#glass-frame)" strokeWidth="3" />
      <circle
        cx="200"
        cy="200"
        r="164"
        fill="none"
        stroke="url(#glass-frame)"
        strokeWidth="1"
        opacity="0.6"
      />
      <circle
        cx="200"
        cy="200"
        r="60"
        fill="none"
        stroke="url(#glass-frame)"
        strokeWidth="1.5"
        opacity="0.8"
      />

      {spokes.map((_, i) => {
        const angle = (i / spokes.length) * Math.PI * 2;
        const x1 = round(200 + Math.cos(angle) * 60);
        const y1 = round(200 + Math.sin(angle) * 60);
        const x2 = round(200 + Math.cos(angle) * 182);
        const y2 = round(200 + Math.sin(angle) * 182);
        const cx = round(200 + Math.cos(angle + 0.18) * 120);
        const cy = round(200 + Math.sin(angle + 0.18) * 120);
        return (
          <path
            key={i}
            d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`}
            fill="none"
            stroke="url(#glass-frame)"
            strokeWidth="2"
            opacity="0.85"
          />
        );
      })}

      {innerSpokes.map((_, i) => {
        const angle = (i / innerSpokes.length) * Math.PI * 2;
        const x1 = round(200 + Math.cos(angle) * 164);
        const y1 = round(200 + Math.sin(angle) * 164);
        const x2 = round(200 + Math.cos(angle) * 182);
        const y2 = round(200 + Math.sin(angle) * 182);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#glass-frame)"
            strokeWidth="1.5"
            opacity="0.5"
          />
        );
      })}

      <circle cx="200" cy="200" r="8" fill="var(--accent)" opacity="0.9" />
    </svg>
  );
}
