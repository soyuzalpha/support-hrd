"use client";

import { getToday } from "@/utils/dates";
import { Calendar, CalendarDays } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TextType from "./TextType";
import { Separator } from "./ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import Show from "./show";
import { usePermissions } from "@/hooks/useUserPermission";

const greetings = {
  morning: [
    "Wake up with intention. Today is another chance to move closer to the person you want to become.",
    "Good morning! Small actions done consistently today will shape a stronger tomorrow.",
    "Start the day focused and disciplined. Motivation fades, but habits will carry you forward.",
  ],
  afternoon: [
    "The day isn’t over yet. Stay sharp—what you do this afternoon still matters.",
    "Progress is built in moments like this. Keep pushing, even when energy drops.",
    "Discipline in the afternoon separates people who dream from people who achieve.",
  ],
  evening: [
    "Good evening. Take a moment to acknowledge what you’ve done today—growth doesn’t have to be loud.",
    "Slow down, but don’t switch off completely. Reflection tonight sharpens tomorrow’s execution.",
    "The evening is for evaluation: what worked, what didn’t, and what to fix next.",
  ],
  night: [
    "Good night. Rest is not quitting—it’s preparation for the next round.",
    "Let today end without regret. You showed up, and that already counts.",
    "Sleep with a clear mind. Tomorrow rewards those who are ready, not those who rush.",
  ],
};

function getGreetingMessage(name: string) {
  const hour = new Date().getHours();
  let timeOfDay: keyof typeof greetings = "morning";

  if (hour >= 5 && hour < 12) timeOfDay = "morning";
  else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
  else if (hour >= 17 && hour < 21) timeOfDay = "evening";
  else timeOfDay = "night";

  const messages = greetings[timeOfDay];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  const baseGreeting =
    timeOfDay === "morning"
      ? "Good morning"
      : timeOfDay === "afternoon"
      ? "Good afternoon"
      : timeOfDay === "evening"
      ? "Good evening"
      : "Good night";

  return { greeting: `${baseGreeting}, ${name}`, message: randomMessage };
}

export default function DashboardGreeting() {
  const isMobile = useIsMobile();
  const session = useSession();
  const permission = usePermissions();
  const [greet, setGreet] = useState<{ greeting: string; message: string }>();

  useEffect(() => {
    if (session) {
      setGreet(getGreetingMessage(session.data?.user?.name || ""));
    }
  }, [session]);

  if (!greet) return null;

  return (
    <div className="mt-4 space-y-3">
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          30% {
            transform: rotate(14deg);
          }
          40% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(10deg);
          }
          60% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        .wave {
          display: inline-block;
          transform-origin: 70% 70%;
          animation: wave 2s infinite;
        }
      `}</style>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            <span className="wave">👋</span> {greet.greeting}!
          </h2>

          <TextType
            text={greet.message}
            typingSpeed={75}
            pauseDuration={1000}
            showCursor={true}
            cursorCharacter="_"
            className="rounded p-1 text-base max-w-xl"
            textColors={["text-black"]}
          />
        </div>

        <Show.When isTrue={!isMobile}>
          <div className="space-y-2  rounded-lg p-2">
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-medium">{getToday("DD/MM/YYYY")}</h1>
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>
        </Show.When>
      </div>
    </div>
  );
}
