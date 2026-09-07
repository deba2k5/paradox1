import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useLowPowerDevice } from "@/hooks/use-device-tier";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFrameSequenceProps {
  /** Element whose scroll position drives the frame scrub. */
  triggerRef: React.RefObject<HTMLElement | null>;
  basePath: string;
  frameCount: number;
  padLength?: number;
  extension?: string;
  className?: string;
  style?: React.CSSProperties;
}

// A decoded frame costs width*height*4 bytes, so the whole sequence can never
// be held at once. Only a window around the playhead stays resident.
const WINDOW_AHEAD = 28;
const WINDOW_BEHIND = 8;
const EVICT_MARGIN = 2;
const MAX_IN_FLIGHT = 6;

function padIndex(index: number, padLength: number) {
  return String(index).padStart(padLength, "0");
}

/**
 * Renders a video-derived image sequence to a canvas and scrubs the frames as
 * the trigger element moves through the viewport — a scroll-driven "video"
 * without decoding a real <video> per frame.
 */
export function ScrollFrameSequence({
  triggerRef,
  basePath,
  frameCount,
  padLength = 4,
  extension = "jpg",
  className,
  style,
}: ScrollFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const lowPower = useLowPowerDevice();

  useEffect(() => {
    const canvas = canvasRef.current;
    const trigger = triggerRef.current;
    if (!canvas || !trigger) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sample the sequence more coarsely on constrained devices.
    const step = lowPower ? 3 : 1;
    const images = new Map<number, HTMLImageElement>();
    const pending = new Set<number>();
    const queue: number[] = [];
    let inFlight = 0;
    let currentIndex = 0;
    let lastDrawnIndex = -1;
    let cancelled = false;

    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const imgRatio = img.width / img.height;
      const canvasRatio = cw / ch;
      let dw: number, dh: number, dx: number, dy: number;
      if (imgRatio > canvasRatio) {
        dh = ch;
        dw = ch * imgRatio;
        dx = (cw - dw) / 2;
        dy = 0;
      } else {
        dw = cw;
        dh = cw / imgRatio;
        dx = 0;
        dy = (ch - dh) / 2;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const draw = (index: number, force = false) => {
      if (!force && index === lastDrawnIndex) return;
      // Fall back to the nearest resident neighbour so scrubbing never flashes
      // a blank frame while the exact frame is still in flight.
      for (let offset = 0; offset <= 8; offset++) {
        const ahead = images.get(index + offset);
        if (ahead) {
          drawCover(ahead);
          lastDrawnIndex = index;
          return;
        }
        const behind = images.get(index - offset);
        if (behind) {
          drawCover(behind);
          lastDrawnIndex = index;
          return;
        }
      }
    };

    const pump = () => {
      while (!cancelled && inFlight < MAX_IN_FLIGHT && queue.length) {
        const index = queue.shift()!;
        if (images.has(index) || pending.has(index)) continue;

        pending.add(index);
        inFlight += 1;
        const img = new Image();
        img.decoding = "async";
        const settle = () => {
          inFlight -= 1;
          pending.delete(index);
          pump();
        };
        img.onload = () => {
          if (!cancelled) {
            images.set(index, img);
            if (Math.abs(index - currentIndex) <= 3) draw(currentIndex, true);
          }
          settle();
        };
        img.onerror = settle;
        img.src = `${basePath}/frame_${padIndex(index + 1, padLength)}.${extension}`;
      }
    };

    /** Queue the frames near `center` and drop the ones far behind/ahead. */
    const ensureWindow = (center: number) => {
      const hi = Math.min(frameCount - 1, center + WINDOW_AHEAD);
      const lo = Math.max(0, center - WINDOW_BEHIND);

      queue.length = 0;
      for (let i = center; i <= hi; i += step) if (!images.has(i)) queue.push(i);
      for (let i = center - step; i >= lo; i -= step) if (!images.has(i)) queue.push(i);

      const keepHi = Math.min(frameCount - 1, center + WINDOW_AHEAD * EVICT_MARGIN);
      const keepLo = Math.max(0, center - WINDOW_BEHIND * EVICT_MARGIN);
      for (const index of images.keys()) {
        if (index < keepLo || index > keepHi) images.delete(index);
      }

      pump();
    };

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      draw(currentIndex, true);
    };

    ensureWindow(0);
    resize();
    const raf = requestAnimationFrame(resize);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let scrollTrigger: ScrollTrigger | undefined;
    if (!reducedMotion) {
      const proxy = { frame: 0 };
      const tween = gsap.to(proxy, {
        frame: frameCount - 1,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
        },
        onUpdate: () => {
          const next = Math.round(proxy.frame);
          if (next === currentIndex) return;
          currentIndex = next;
          ensureWindow(next);
          draw(next);
        },
      });
      scrollTrigger = tween.scrollTrigger;
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      scrollTrigger?.kill();
      images.clear();
      queue.length = 0;
    };
  }, [triggerRef, basePath, frameCount, padLength, extension, reducedMotion, lowPower]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={style} />;
}
