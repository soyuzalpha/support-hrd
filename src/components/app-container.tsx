"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AppContainerProps {
  children: React.ReactNode;
  title?: string;
  fullHeight?: boolean;
  scrollable?: boolean;
  className?: string;
  navbarHeight?: number;
  dockOffset?: number;
  fullWidth?: boolean;
  variant?: "default" | "glass"; // NEW
}

export function AppContainer({
  children,
  title,
  fullHeight = false,
  scrollable = true,
  className,
  navbarHeight = 60,
  dockOffset = 80,
  fullWidth = false,
  variant = "default",
}: AppContainerProps) {
  // GLASS STYLE
  const glassStyles = "backdrop-blur-2xl border border-white/10 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]";

  return (
    <div
      className={cn(
        // width rules
        fullWidth ? "w-full" : "max-w-5xl mx-auto",

        // scrolling
        scrollable && "overflow-y-auto",

        // variant
        variant === "glass" && glassStyles,

        // misc className override
        "p-2",
        className
      )}
      style={{
        height: fullHeight ? `calc(100vh - ${dockOffset}px - ${navbarHeight}px)` : "auto",
      }}
    >
      {/* Title */}
      {title && <h1 className="text-lg lg:text-2xl font-semibold mb-4">{title}</h1>}

      {children}
    </div>
  );
}
