const cache = new Map<string, string>();

/** Converts oklch(L C H [/ A]) to an "rgb(r, g, b)" string, via the standard
 *  oklab -> linear sRGB matrices (Björn Ottosson) and the sRGB transfer function.
 *  Pure arithmetic — no canvas, no GPU round-trip. */
function oklchToRgbString(oklch: string): string | null {
  const match = oklch.match(
    /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?)?\s*\)/i,
  );
  if (!match) return null;

  const lRaw = match[1]!;
  const cRaw = match[2]!;
  const hRaw = match[3]!;
  const l = lRaw.endsWith("%") ? parseFloat(lRaw) / 100 : parseFloat(lRaw);
  const c = parseFloat(cRaw);
  const hRad = (parseFloat(hRaw) * Math.PI) / 180;

  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const lCubed = l_ ** 3;
  const mCubed = m_ ** 3;
  const sCubed = s_ ** 3;

  const rLin = 4.0767416621 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed;
  const gLin = -1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed;
  const bLin = -0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.707614701 * sCubed;

  const toSrgb = (v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    const encoded = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, encoded)) * 255);
  };

  return `rgb(${toSrgb(rLin)}, ${toSrgb(gLin)}, ${toSrgb(bLin)})`;
}

/** Resolves a CSS custom property to an "rgb(r, g, b)" string three.js can parse.
 *  Our theme variables are all defined in oklch(), which THREE.Color.setStyle()
 *  can't read directly — this converts oklch to sRGB with plain arithmetic so it
 *  stays cheap (previously this round-tripped through a canvas readback, which
 *  forces a GPU pipeline flush and was blocking the main thread for seconds on
 *  some machines, delaying unrelated component effects across the page). Falls
 *  back to the provided hex/rgb fallback for any value that isn't oklch(). */
export function resolveCssColor(varName: string, fallback: string): string {
  if (typeof window === "undefined" || typeof document === "undefined") return fallback;

  const cached = cache.get(varName);
  if (cached) return cached;

  const probe = document.createElement("span");
  probe.style.color = `var(${varName})`;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const cssColor = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  if (!cssColor) return fallback;

  const resolved = oklchToRgbString(cssColor) ?? (cssColor.startsWith("rgb") ? cssColor : fallback);
  cache.set(varName, resolved);
  return resolved;
}
