/** An original tiled sigil pattern — geometric rune marks scattered across a grid,
 *  evoking a page of spellcraft without depicting any specific book, prop or artwork. */
export function ArcaneWeave({ className = "" }: { className?: string }) {
  const cell = 90;
  const cols = 8;
  const rows = 5;
  const marks = Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const seed = (col * 7 + row * 13) % 5;
    return { col, row, seed };
  });

  return (
    <svg
      viewBox={`0 0 ${cols * cell} ${rows * cell}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="var(--primary)" strokeWidth="1" fill="none">
        {marks.map(({ col, row, seed }, i) => {
          const cx = col * cell + cell / 2;
          const cy = row * cell + cell / 2;
          const r = 20;
          if (seed === 0) {
            return <circle key={i} cx={cx} cy={cy} r={r} opacity="0.35" />;
          }
          if (seed === 1) {
            return (
              <polygon
                key={i}
                points={`${cx},${cy - r} ${cx + r * 0.87},${cy + r * 0.5} ${cx - r * 0.87},${cy + r * 0.5}`}
                opacity="0.3"
              />
            );
          }
          if (seed === 2) {
            return (
              <rect
                key={i}
                x={cx - r * 0.7}
                y={cy - r * 0.7}
                width={r * 1.4}
                height={r * 1.4}
                transform={`rotate(45 ${cx} ${cy})`}
                opacity="0.3"
              />
            );
          }
          if (seed === 3) {
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r * 0.6} opacity="0.3" />
                <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} opacity="0.25" />
                <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} opacity="0.25" />
              </g>
            );
          }
          return null;
        })}
      </g>
    </svg>
  );
}
