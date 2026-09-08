import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useLowPowerDevice } from "@/hooks/use-device-tier";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFrameSequenceProps {
  /** Element whose scroll position drives the frame scrub. */
  triggerRef?: React.RefObject<HTMLElement | null>;
  triggerSelector?: string;
  basePath: string;
  mobileBasePath?: string;
  frameCount: number;
  mobileFrameCount?: number;
  padLength?: number;
  mobilePadLength?: number;
  prefix?: string;
  mobilePrefix?: string;
  extension?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  step?: number;
  className?: string;
  style?: React.CSSProperties;
}

const EVICT_MARGIN = 2;

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
  triggerSelector,
  basePath,
  mobileBasePath,
  frameCount,
  mobileFrameCount,
  padLength = 4,
  mobilePadLength,
  prefix = "frame_",
  mobilePrefix,
  extension = "jpg",
  start = "top bottom",
  end = "bottom top",
  scrub = 0.4,
  step: forcedStep,
  className,
  style,
}: ScrollFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const lowPower = useLowPowerDevice();

  useEffect(() => {
    const canvas = canvasRef.current;
    const trigger = triggerRef?.current ?? (triggerSelector ? (document.querySelector(triggerSelector) as HTMLElement | null) : null);
    if (!canvas || !trigger) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
    const activeBasePath = isMobile && mobileBasePath ? mobileBasePath : basePath;
    const activePrefix = isMobile && mobilePrefix !== undefined ? mobilePrefix : prefix;
    const activePadLength = isMobile && mobilePadLength !== undefined ? mobilePadLength : padLength;
    const totalFrames = isMobile && mobileFrameCount !== undefined ? mobileFrameCount : frameCount;

    const getFrameSrc = (index: number) => {
      const filename = `${activePrefix}${padIndex(index + 1, activePadLength)}.${extension}`;
      return `${encodeURI(activeBasePath)}/${encodeURIComponent(filename)}`;
    };

    const activeScrub =
      typeof scrub === "number" && isMobile ? Math.min(scrub, 0.3) : scrub;
    const windowAhead = isMobile ? 40 : 50;
    const windowBehind = isMobile ? 16 : 20;
    const maxInFlight = 6;

    // Sample the sequence more coarsely on constrained devices unless forced or using mobileBasePath.
    const step = forcedStep ?? (mobileBasePath && isMobile ? 1 : lowPower ? 2 : 1);
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
      if (images.has(index)) {
        drawCover(images.get(index)!);
        lastDrawnIndex = index;
        return;
      }
      // Check nearest neighbour within range
      for (let offset = 1; offset <= 16; offset++) {
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
      // Global fallback to nearest loaded frame
      let closest: HTMLImageElement | null = null;
      let minDiff = Infinity;
      for (const [idx, img] of images.entries()) {
        const diff = Math.abs(idx - index);
        if (diff < minDiff) {
          minDiff = diff;
          closest = img;
        }
      }
      if (closest) {
        drawCover(closest);
      }
    };

    const pump = () => {
      while (!cancelled && inFlight < maxInFlight && queue.length) {
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
        img.src = getFrameSrc(index);
      }
    };

    /** Queue the frames near `center` and drop the ones far behind/ahead. */
    const ensureWindow = (center: number) => {
      const hi = Math.min(totalFrames - 1, center + windowAhead);
      const lo = Math.max(0, center - windowBehind);

      queue.length = 0;
      for (let i = center; i <= hi; i += step) if (!images.has(i)) queue.push(i);
      for (let i = center - step; i >= lo; i -= step) if (!images.has(i)) queue.push(i);

      // Don't evict frames if mobile or if sequence has <= 400 frames, so the full sequence stays resident for instant scrubbing
      if (!isMobile && (!mobileBasePath || totalFrames > 400)) {
        const keepHi = Math.min(totalFrames - 1, center + windowAhead * EVICT_MARGIN);
        const keepLo = Math.max(0, center - windowBehind * EVICT_MARGIN);
        for (const index of images.keys()) {
          if (index < keepLo || index > keepHi) images.delete(index);
        }
      }

      pump();
    };

    // Background preloader: progressively loads the full sequence
    const preloadAll = () => {
      let nextIdx = 0;
      const concurrency = isMobile ? 6 : 4;
      let inFlightPreload = 0;

      const stepPreload = () => {
        if (cancelled) return;
        while (inFlightPreload < concurrency && nextIdx < totalFrames) {
          const idx = nextIdx++;
          if (images.has(idx) || pending.has(idx)) continue;
          inFlightPreload++;
          const pImg = new Image();
          pImg.decoding = "async";
          const done = () => {
            inFlightPreload--;
            stepPreload();
          };
          pImg.onload = () => {
            if (!cancelled) {
              images.set(idx, pImg);
              if (Math.abs(idx - currentIndex) <= 2) draw(currentIndex, true);
            }
            done();
          };
          pImg.onerror = done;
          pImg.src = getFrameSrc(idx);
        }
      };

      stepPreload();
    };

    let dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const isMob = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
      dpr = isMob ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      draw(currentIndex, true);
    };

    ensureWindow(0);
    preloadAll();
    resize();
    const raf = requestAnimationFrame(resize);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let scrollTrigger: ScrollTrigger | undefined;
    if (!reducedMotion) {
      const proxy = { frame: 0 };
      const tween = gsap.to(proxy, {
        frame: totalFrames - 1,
        ease: "none",
        scrollTrigger: {
          trigger,
          start,
          end,
          scrub: activeScrub,
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
  }, [triggerRef, triggerSelector, basePath, mobileBasePath, frameCount, mobileFrameCount, padLength, mobilePadLength, prefix, mobilePrefix, extension, start, end, scrub, forcedStep, reducedMotion, lowPower]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={style} />;
}
