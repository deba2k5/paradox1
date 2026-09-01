import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import portalRing from "@/assets/portal-ring.png";

// Plays on every load/refresh: a small mystic ring spins up out of the void,
// zooms toward the viewer, and its own hole tears the darkness open to
// reveal the site behind it — like a sling ring portal finishing its cast.
export function PortalIntro() {
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLImageElement>(null);
  const haloRef = useRef<HTMLImageElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMounted(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      // continuous circular revolve — the two rings spin in opposite
      // directions, like counter-turning halves of the same sigil.
      gsap.to(ringRef.current, { rotate: 360, duration: 9, ease: "none", repeat: -1 });
      gsap.to(haloRef.current, { rotate: -360, duration: 14, ease: "none", repeat: -1 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          document.body.style.overflow = prevOverflow;
          setMounted(false);
        },
      });

      tl.set([ringRef.current, haloRef.current], { opacity: 0, scale: 0.02 })
        .to([ringRef.current, haloRef.current], { opacity: 1, duration: 1, ease: "power1.out" }, 0)
        .to(ringRef.current, { scale: 1, duration: 3.2, ease: "power2.in" }, 0.1)
        .to(haloRef.current, { scale: 1.15, duration: 3.2, ease: "power2.in" }, 0.1)
        .to(flashRef.current, { opacity: 0.9, duration: 0.45, ease: "power2.in" }, "-=0.4")
        .to(curtainRef.current, { opacity: 0, duration: 1.3, ease: "power1.out" }, "-=0.2")
        .to(
          [ringRef.current, haloRef.current],
          { scale: "+=0.7", opacity: 0, duration: 1.5, ease: "power2.out" },
          "<",
        )
        .to(flashRef.current, { opacity: 0, duration: 1.1, ease: "power1.out" }, "-=1")
        .to(rootRef.current, { opacity: 0, duration: 0.6, ease: "power1.out" });
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] grid place-items-center overflow-hidden"
      aria-hidden="true"
    >
      <div ref={curtainRef} className="absolute inset-0 bg-background" />

      <img
        ref={haloRef}
        src={portalRing}
        alt=""
        className="absolute h-[80vmin] w-[80vmin] object-contain opacity-0 mix-blend-screen"
        style={{ filter: "hue-rotate(200deg) saturate(1.4) drop-shadow(0 0 50px var(--portal-blue))" }}
      />
      <img
        ref={ringRef}
        src={portalRing}
        alt=""
        className="absolute h-[58vmin] w-[58vmin] object-contain opacity-0"
        style={{ filter: "drop-shadow(0 0 40px var(--primary)) drop-shadow(0 0 90px var(--accent))" }}
      />

      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(circle, oklch(0.98 0.02 40) 0%, var(--accent) 30%, var(--primary) 55%, transparent 75%)",
        }}
      />
    </div>
  );
}
