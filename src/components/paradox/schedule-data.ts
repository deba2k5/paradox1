import {
  DoorOpen,
  Sparkles,
  Code2,
  Users,
  UtensilsCrossed,
  Award,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type ScheduleItem = {
  index: string;
  time: string;
  /** Elapsed minutes since 08:00 — spaces events by real duration, not index. */
  minutes: number;
  title: string;
  copy: string;
  icon: LucideIcon;
};

// One day, 3rd October 2026 — doors at 8 AM, prizes by 7 PM.
export const scheduleItems: ScheduleItem[] = [
  {
    index: "01",
    time: "8:00 – 8:45 AM",
    minutes: 0,
    title: "Registration",
    copy: "Gates open. Collect your kit and enter the sanctum.",
    icon: DoorOpen,
  },
  {
    index: "02",
    time: "8:45 – 9:00 AM",
    minutes: 45,
    title: "Session 1",
    copy: "Opening address from the council of judges and mentors.",
    icon: Sparkles,
  },
  {
    index: "03",
    time: "9:00 AM",
    minutes: 60,
    title: "Hackathon Starts",
    copy: "The clock bends. Eight hours start now.",
    icon: Code2,
  },
  {
    index: "04",
    time: "12:00 – 1:00 PM",
    minutes: 240,
    title: "Mentoring Round 1",
    copy: "One-on-one guidance to keep your build on track.",
    icon: Users,
  },
  {
    index: "05",
    time: "1:30 – 3:00 PM",
    minutes: 330,
    title: "Lunch",
    copy: "Refuel with the realm before the final stretch.",
    icon: UtensilsCrossed,
  },
  {
    index: "06",
    time: "5:00 – 6:00 PM",
    minutes: 540,
    title: "Final Judgement",
    copy: "Present your build live to the panel.",
    icon: Award,
  },
  {
    index: "07",
    time: "6:00 – 7:00 PM",
    minutes: 600,
    title: "Winners & Prizes",
    copy: "Glory, prizes and the closing ceremony.",
    icon: Trophy,
  },
];
