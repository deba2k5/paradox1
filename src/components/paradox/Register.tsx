import { ArrowRight, Instagram, Linkedin, Mail, Globe } from "lucide-react";
import { RuneRing } from "./RuneRing";

export function Register() {
  return (
    <section id="register" className="relative overflow-hidden py-24 sm:py-32">
      <RuneRing className="animate-glow top-1/2 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <p className="text-xs tracking-[0.5em] text-primary uppercase">The portal is open</p>
        <h2 className="mt-4 text-4xl font-bold tracking-wide gradient-text sm:text-6xl">
          Enter the Paradox
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-foreground/85 sm:text-lg">
          1000+ hackers. 48 hours. One reality to rewrite. Registrations close 15th September, 2026
          — secure your seat in the sanctum.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:paradox@iem.edu.in?subject=PARADOX%20Registration"
            className="group inline-flex items-center gap-3 rounded-md bg-[image:var(--gradient-mystic)] px-8 py-4 text-sm font-bold tracking-[0.2em] text-primary-foreground uppercase shadow-[var(--shadow-rune)] transition-transform hover:scale-105"
          >
            Register Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#guide"
            className="inline-flex items-center gap-3 rounded-md border border-primary/60 px-8 py-4 text-sm font-bold tracking-[0.2em] uppercase transition-colors hover:bg-primary/15"
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
    <footer className="border-t border-border bg-background/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold tracking-[0.2em]">PARADOX</p>
          <p className="mt-2 text-sm text-muted-foreground">
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
      <div className="border-t border-border py-5 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
        © 2026 PARADOX · IEEE Student Branch · Terms &amp; Support · Privacy Policy
      </div>
    </footer>
  );
}
