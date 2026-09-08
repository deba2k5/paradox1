import { useRef } from "react";
import { ArrowRight, Instagram, Linkedin, Mail, Globe } from "lucide-react";
import { RuneRing } from "./RuneRing";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SpraySplatter } from "./SpraySplatter";
import crystalTunnel from "@/assets/bg-crystal-tunnel.jpg";
import fireRing from "@/assets/frame-fire-ring.png";

export function Register() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="register" ref={sectionRef} className="relative overflow-hidden py-24 sm:py-32">
      <img
        src={crystalTunnel}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.14]"
        style={{ filter: "saturate(1.3) brightness(0.55)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,var(--background)_58%)]" />
      <RuneRing className="animate-glow top-1/2 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2" />
      <SpraySplatter
        className="pointer-events-none absolute top-10 right-[8%] h-24 w-24 rotate-12 opacity-50"
        color="var(--accent)"
      />
      <div className="reveal reveal-target relative mx-auto max-w-3xl px-5 text-center">
        <p className="font-tag inline-block -rotate-2 text-sm tracking-[0.3em] text-accent uppercase">
          The portal is open
        </p>
        <h2 className="font-graffiti stencil-text mt-4 text-5xl font-normal sm:text-7xl">
          Enter the Paradox
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-foreground/85 sm:text-lg">
          1000+ hackers. 8 hours. One reality to rewrite. Registrations close 15th September, 2026
          — secure your seat in the sanctum.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <a
            href="mailto:paradox@iem.edu.in?subject=PARADOX%20Registration"
            className="graffiti-btn group inline-flex items-center gap-3 border-2 border-white/80 bg-[image:var(--gradient-mystic)] px-8 py-4 text-sm font-bold tracking-[0.2em] text-primary-foreground uppercase shadow-[var(--shadow-rune)]"
          >
            Register Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#guide"
            className="graffiti-btn inline-flex items-center gap-3 border-2 border-primary/70 px-8 py-4 text-sm font-bold tracking-[0.2em] uppercase transition-colors hover:bg-primary/15"
          >
            Read the Guide
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background/80">
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 opacity-70"
        aria-hidden="true"
      >
        <img
          src={fireRing}
          alt=""
          className="animate-rune-reverse absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 opacity-50 mix-blend-screen"
          style={{ filter: "hue-rotate(-15deg) saturate(1.3)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,var(--background)_100%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pt-24 pb-14 sm:grid-cols-3">
        <div>
          <p className="font-graffiti flame-text -rotate-1 text-3xl font-normal">PARADOX</p>
          <p className="font-tag mt-2 text-sm text-primary/80">One reality was never enough.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            A hackathon beyond logic, presented by IEEE IEM–UEM Student Branch, ComSoc, AP-S and
            WIE.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.35em] text-primary uppercase">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {[
              ["Home", "#home"],
              ["About", "#about"],
              ["Hackers Guide", "#guide"],
              ["Schedule", "#schedule"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="transition-colors hover:text-primary">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.35em] text-primary uppercase">Reach the Sanctum</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Gurukul Building, IEM Saltlake, Kolkata
          </p>
          <div className="mt-4 flex gap-4 text-muted-foreground">
            <a href="mailto:paradox@iem.edu.in" aria-label="Email" className="hover:text-primary">
              <Mail className="h-5 w-5" />
            </a>
            <a href="#home" aria-label="Instagram" className="hover:text-primary">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#home" aria-label="LinkedIn" className="hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#home" aria-label="Website" className="hover:text-primary">
              <Globe className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="relative border-t border-border py-5 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
        © 2026 PARADOX · IEEE Student Branch · Terms &amp; Support · Privacy Policy
      </div>
    </footer>
  );
}
