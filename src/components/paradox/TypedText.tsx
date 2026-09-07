import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

interface TypedTextProps {
  text: string;
  /** Milliseconds per character. */
  speed?: number;
  startDelay?: number;
  className?: string;
}

/**
 * Types its text out one character at a time the first time it scrolls into
 * view. The full string is rendered invisibly underneath so the block never
 * reflows mid-type, and is exposed to assistive tech in one piece.
 */
export function TypedText({ text, speed = 24, startDelay = 300, className }: TypedTextProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || started) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (reducedMotion) {
      setCount(text.length);
      return;
    }

    let interval = 0;
    let typed = 0;
    const begin = window.setTimeout(() => {
      interval = window.setInterval(() => {
        typed += 1;
        setCount(typed);
        if (typed >= text.length) window.clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(begin);
      window.clearInterval(interval);
    };
  }, [started, reducedMotion, text, speed, startDelay]);

  const done = count >= text.length;

  return (
    <span ref={hostRef} className={`relative inline-block ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {text.slice(0, count)}
        <span
          className={`ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.08em] bg-primary align-middle shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_70%,transparent)] ${
            done ? "animate-caret-blink" : ""
          }`}
        />
      </span>
    </span>
  );
}
