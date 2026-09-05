import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
let refreshBound = false;

/** ScrollTrigger caches each trigger's start/end pixel positions at creation time.
 *  With many sections mounting independently (each behind its own useEffect) and
 *  async images shifting layout after that, cached positions can go stale and a
 *  trigger's "top 88%" never lines up with where the element actually ended up —
 *  it just silently never fires. Refreshing once everything (fonts, images) has
 *  settled re-measures every trigger against final layout. */
function scheduleGlobalRefresh() {
  if (refreshBound) return;
  refreshBound = true;
  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === "complete") {
    requestAnimationFrame(refresh);
  } else {
    window.addEventListener("load", () => requestAnimationFrame(refresh), { once: true });
  }
}

/** Wires GSAP ScrollTrigger to reveal every `.reveal-target` inside `scopeRef` as it
 *  enters the viewport, and (optionally) scrubs `.reveal-progress` fill elements. */
export function useScrollReveal(scopeRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    scheduleGlobalRefresh();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = scopeRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const targets = root.querySelectorAll<HTMLElement>(".reveal-target");
      targets.forEach((el, i) => {
        if (reduced) {
          el.classList.add("reveal-in");
          return;
        }
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            el.style.transitionDelay = `${(i % 4) * 0.08}s`;
            el.classList.add("reveal-in");
          },
        });
      });

      const progressBars = root.querySelectorAll<HTMLElement>(".reveal-progress");
      progressBars.forEach((progress) => {
        if (reduced) return;
        const horizontal = progress.dataset["direction"] === "x";
        const triggerSelector = progress.dataset["trigger"];
        gsap.fromTo(progress, horizontal ? { scaleX: 0 } : { scaleY: 0 }, {
          [horizontal ? "scaleX" : "scaleY"]: 1,
          ease: "none",
          transformOrigin: horizontal ? "left" : "top",
          scrollTrigger: {
            trigger: triggerSelector ? (root.querySelector(triggerSelector) ?? root) : root,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [scopeRef]);
}
