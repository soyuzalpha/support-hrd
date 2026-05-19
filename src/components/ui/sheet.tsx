"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

interface SheetContentProps extends React.ComponentProps<typeof SheetPrimitive.Content> {
  size?: "full" | "98" | "95" | "90" | "70" | "50" | "35" | "20";
  side?: "top" | "right" | "bottom" | "left";
}

function SheetContent({ className, children, side = "right", size = "35", ...props }: SheetContentProps) {
  const isHorizontal = side === "left" || side === "right";
  const isVertical = side === "top" || side === "bottom";

  const sizeMapHorizontal: Record<string, string> = {
    full: "w-screen max-w-none",
    "98": "w-[98vw] max-w-[98vw]",
    "95": "w-[95vw] max-w-[95vw]",
    "90": "w-[90vw] max-w-[90vw]",
    "70": "w-[70vw] max-w-[70vw]",
    "50": "w-[50vw] max-w-[50vw]",
    "35": "w-[35vw] max-w-[35vw]",
    "20": "w-[20vw] max-w-[20vw]",
  };

  const sizeMapVertical: Record<string, string> = {
    full: "h-screen max-h-none",
    "98": "h-[98vh] max-h-[98vh]",
    "95": "h-[95vh] max-h-[95vh]",
    "90": "h-[90vh] max-h-[90vh]",
    "70": "h-[70vh] max-h-[70vh]",
    "50": "h-[50vh] max-h-[50vh]",
    "35": "h-[35vh] max-h-[35vh]",
    "20": "h-[20vh] max-h-[20vh]",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-300 data-[state=open]:duration-500",

          // Position + animation
          side === "right" &&
            "inset-y-0 right-0 border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          side === "left" &&
            "inset-y-0 left-0 border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
          side === "top" &&
            "inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
          side === "bottom" &&
            "inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",

          // Size
          isHorizontal && sizeMapHorizontal[size],
          isVertical && sizeMapVertical[size],

          className,
        )}
        {...props}
      >
        {children}

        <SheetPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
