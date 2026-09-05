import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/paradox/SiteNav";
import { Hero } from "@/components/paradox/Hero";
import { About } from "@/components/paradox/About";
import { Guide } from "@/components/paradox/Guide";
import { Schedule } from "@/components/paradox/Schedule";
import { Faq } from "@/components/paradox/Faq";
import { Register, SiteFooter } from "@/components/paradox/Register";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PARADOX 2026 — A Hackathon Beyond Logic | IEEE IEM" },
      {
        name: "description",
        content:
          "PARADOX is a 48-hour hackathon at IEM Saltlake, Kolkata. 1000+ hackers, 20+ mentors, exciting prizes. Step into the multiverse of innovation.",
      },
      { property: "og:title", content: "PARADOX 2026 — A Hackathon Beyond Logic" },
      {
        property: "og:description",
        content:
          "48 hours. 1000+ hackers. One reality to rewrite. Join PARADOX at Gurukul Building, IEM Saltlake.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main>
        <Hero />
        <About />
        <Guide />
        <Schedule />
        <Faq />
        <Register />
      </main>
      <SiteFooter />
    </div>
  );
}
