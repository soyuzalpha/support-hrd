"use client";

import { LoginForm } from "@/components/login-form";
import Show from "@/components/show";
import Silk from "@/components/Silk";
import { useIsMobile } from "@/hooks/use-mobile";
import { geist } from "@/lib/fonts";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative min-h-svh overflow-hidden">
      {/* FULL BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Silk speed={10} scale={1} color="#ffffff" noiseIntensity={1.7} rotation={0} />
      </div>

      {/* CENTER LOGIN CARD */}
      <div className="flex items-center justify-center min-h-svh px-6 ">
        {/* <div className="bg-white/40 backdrop-blur-lgrounded-2xl shadow-xl max-w-xl w-full border border-white/20"> */}
        {/* LOGO INSIDE CARD */}

        <LoginForm />
        {/* </div> */}
      </div>

      {/* BOTTOM LEFT TEXT */}
      {/* <div className={`${geist.className} absolute bottom-10 left-10 text-white max-w-sm pointer-events-none`}>
        <h1 className="text-4xl font-semibold leading-snug mb-3">Manage shipments with precision</h1>
        <p className="text-zinc-300 text-sm">Simplify your logistics process and track every order in real-time.</p>
      </div> */}
    </div>
  );
}

// <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
//   <div className="flex w-full max-w-sm flex-col gap-6">
//     <LoginForm />
//   </div>
// </div>
