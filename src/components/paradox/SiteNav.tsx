import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import apsLogo from "@/assets/logo-ieee-aps.jpeg";
import wieLogo from "@/assets/logo-ieee-wie.jpeg";
import comsocLogo from "@/assets/logo-ieee-comsoc.jpeg";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Hackers Guide", href: "#guide" },
  { label: "Schedule", href: "#schedule" },
  { label: "FAQ", href: "#faq" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  // close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="relative mx-auto max-w-6xl">
        <span
          className={`pointer-events-none absolute inset-x-6 -bottom-1 h-3 rounded-full bg-[image:var(--gradient-mystic)] blur-xl transition-opacity duration-500 ${
            scrolled ? "opacity-25" : "opacity-0"
          }`}
          aria-hidden="true"
        />
        <nav
          role="navigation"
          aria-label="Main"
          className={`relative flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-500 sm:px-6 ${
            scrolled
              ? "border-border bg-background/75 shadow-[var(--shadow-deep)] backdrop-blur-xl"
              : "border-white/10 bg-background/35 backdrop-blur-md"
          }`}
        >
          <a href="#home" className="group flex items-center gap-3 sm:gap-4">
            <img
              src="/WhatsApp_Image_2026-09-05_at_17.48.35-removebg-preview.png"
              alt="Paradox Logo"
              className="h-12 w-auto"
            />

            <span className="hidden h-8 w-px bg-white/15 lg:block" aria-hidden="true" />

            <span className="hidden flex-col items-start gap-1 lg:flex">
              <span className="text-[0.55rem] tracking-[0.3em] text-muted-foreground uppercase">
                Presented by
              </span>
              <span className="flex items-center gap-2">
                <img
                  src={apsLogo}
                  alt="IEEE Antennas and Propagation Society"
                  className="h-7 w-auto mix-blend-screen"
                />
                <img
                  src={comsocLogo}
                  alt="IEEE Communications Society"
                  className="h-6 w-auto mix-blend-screen"
                />
                <img
                  src={wieLogo}
                  alt="IEEE Women in Engineering"
                  className="h-6 w-auto mix-blend-screen"
                />
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {links.map((l) => {
              const isActive = active === l.href;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`relative flex items-center gap-2 text-sm font-semibold tracking-wide transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:text-primary hover:after:w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActive ? "text-primary after:w-full" : "text-foreground/85"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] transition-opacity ${
                        isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"
                      }`}
                      aria-hidden="true"
                    />
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="#register"
            className="graffiti-btn hidden rounded-lg border-0 bg-[image:var(--gradient-mystic)] px-5 py-2.5 text-sm font-bold tracking-widest text-primary-foreground uppercase shadow-[var(--shadow-rune)] transform transition-transform hover:scale-105 md:inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Register
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-foreground transition-colors hover:border-primary/60 hover:text-primary md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open ? (
          <div
            id="mobile-menu"
            className="mt-2 origin-top-right rounded-2xl border border-border bg-background/95 px-5 py-4 shadow-[var(--shadow-deep)] backdrop-blur-xl md:hidden transform transition-all duration-200 ease-out scale-100 opacity-100"
          >
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 py-2.5 text-sm font-semibold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active === l.href ? "text-primary" : "text-foreground/85"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] transition-opacity ${
                        active === l.href ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#register"
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-md bg-[image:var(--gradient-mystic)] px-4 py-2.5 text-center text-sm font-bold tracking-widest text-primary-foreground uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Register Now
                </a>
              </li>
            </ul>

            <div className="mt-4 flex flex-col items-center gap-2 border-t border-white/10 pt-4">
              <span className="text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
                Presented by
              </span>
              <span className="flex items-center gap-3">
                <img
                  src={apsLogo}
                  alt="IEEE Antennas and Propagation Society"
                  className="h-7 w-auto mix-blend-screen"
                />
                <img
                  src={comsocLogo}
                  alt="IEEE Communications Society"
                  className="h-6 w-auto mix-blend-screen"
                />
                <img
                  src={wieLogo}
                  alt="IEEE Women in Engineering"
                  className="h-6 w-auto mix-blend-screen"
                />
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
