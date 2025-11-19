import { cn } from "@/lib/utils";
import * as React from "react";

interface AppGridContainerProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: number | string;
  fullHeight?: boolean; // kalau mau full height di parent
}

export function AppGridContainer({
  children,
  className,
  maxHeight = "100vh",
  fullHeight = false,
}: AppGridContainerProps) {
  return (
    <div
      className={cn(
        "w-full overflow-y-auto p-2",
        "[-webkit-overflow-scrolling:touch]", // biar smooth scroll di mobile Safari
        fullHeight && "h-full",
        className
      )}
      style={{
        maxHeight: fullHeight ? undefined : typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
        paddingBottom: "env(safe-area-inset-bottom)", // safe area iOS
      }}
    >
      {children}
    </div>
  );
}
