import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rotate-45 border border-primary shadow-[var(--shadow-rune)]">
            <span className="-rotate-45 font-display text-sm font-bold text-primary">P</span>
          </span>
          <span className="font-display text-lg font-bold tracking-[0.3em]">IEEE</span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-sm font-semibold tracking-wide text-foreground/85 transition-colors hover:text-primary after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#register"
          className="hidden rounded-md bg-[image:var(--gradient-mystic)] px-5 py-2 text-sm font-bold tracking-widest text-primary-foreground uppercase shadow-[var(--shadow-rune)] transition-transform hover:scale-105 md:inline-block"
        >
          Register
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-foreground md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open ? (
        <ul className="space-y-1 border-t border-border bg-background/95 px-5 pb-5 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm font-semibold tracking-wide text-foreground/85"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#register"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-md bg-[image:var(--gradient-mystic)] px-4 py-2.5 text-center text-sm font-bold tracking-widest text-primary-foreground uppercase"
            >
              Register Now
            </a>
          </li>
        </ul>
      ) : null}
    </header>
  );
}
