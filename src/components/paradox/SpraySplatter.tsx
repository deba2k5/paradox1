/** An original spray-paint splatter — a main blob with scattered droplets and a drip
 *  trail, drawn as vector shapes so it colors with `currentColor` and never looks
 *  pixelated at any size. Pure decoration, no photographic or copyrighted reference. */
export function SpraySplatter({
  className = "",
  color = "var(--primary)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ color }}
      aria-hidden="true"
      fill="currentColor"
    >
      <path
        d="M100 20c28 0 40 22 46 40 5 16 22 20 28 34 8 18-4 38-24 42-14 3-24-6-38-4-16 2-24 16-42 14-20-2-32-20-28-38 3-13 16-18 18-32 2-16-10-26-6-42C58 16 78 20 100 20Z"
        opacity="0.9"
      />
      <circle cx="168" cy="52" r="9" opacity="0.85" />
      <circle cx="182" cy="76" r="4" opacity="0.7" />
      <circle cx="24" cy="140" r="7" opacity="0.8" />
      <circle cx="14" cy="118" r="3.5" opacity="0.6" />
      <circle cx="150" cy="168" r="5" opacity="0.75" />
      <path d="M70 172c-1 12-3 20 1 24 4-3 4-12 5-22Z" opacity="0.7" />
      <path d="M132 178c0 9-1 15 2 18 3-2 3-9 3-16Z" opacity="0.6" />
    </svg>
  );
}
