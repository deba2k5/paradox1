import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/paradox/SiteNav";
import { Hero } from "@/components/paradox/Hero";
import { About } from "@/components/paradox/About";
import { Guide } from "@/components/paradox/Guide";
import { Prizes } from "@/components/paradox/Prizes";
import { MysticScrollStage } from "@/components/paradox/MysticScrollStage";
import { Schedule } from "@/components/paradox/Schedule";
import { Faq } from "@/components/paradox/Faq";
import { Register, EventPartners, SiteFooter } from "@/components/paradox/Register";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PARADOX 2026 — A Hackathon Beyond Logic | IEEE IEM" },
      {
        name: "description",
        content:
          "PARADOX is an 8-hour hackathon on 3rd October 2026 at IEM Saltlake, Kolkata. 1000+ hackers, 20+ mentors, exciting prizes. Step into the multiverse of innovation.",
      },
      { property: "og:title", content: "PARADOX 2026 — A Hackathon Beyond Logic" },
      {
        property: "og:description",
        content:
          "8 hours. 1000+ hackers. One reality to rewrite. Join PARADOX on 3rd October 2026 at Gurukul Building, IEM Saltlake.",
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
        <MysticScrollStage>
          <About />
        </MysticScrollStage>
        <Guide />
        <Prizes />
        <Schedule />
        <Faq />
        <EventPartners />
        <Register />
      </main>
      <SiteFooter />
    </div>
  );
}
