"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  glass?: boolean;
  glassDark?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "jumbo" | "ultra" | "mega" | "full"; // Expanded size options
};

function DialogContent({
  className,
  children,
  showCloseButton = true,
  glass = false,
  glassDark = false,
  size = "md", // Default size
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />

      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          // base animation & layout
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border p-6 shadow-xl duration-200",

          // Size variants (updated)
          size === "xs" && "max-w-xs",
          size === "sm" && "max-w-sm",
          size === "md" && "max-w-md",
          size === "lg" && "max-w-lg",
          size === "xl" && "max-w-xl",
          size === "xxl" && "max-w-3xl",
          size === "xxxl" && "max-w-4xl",
          size === "jumbo" && "max-w-5xl",
          size === "ultra" && "max-w-6xl",
          size === "mega" && "max-w-7xl",
          size === "full" && "max-w-full",

          // Default background (non-glass)
          !glass && !glassDark && "bg-background",

          // 🌟 GLASS WHITE (Vision Pro)
          glass &&
            "backdrop-blur-2xl bg-white/10 dark:bg-white/5 border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.15)]",

          // 🌑 GLASS DARK (Frosted Black)
          glassDark && "backdrop-blur-xl bg-black/30 border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.4)]",

          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-4 right-4 rounded-md opacity-70 transition-opacity hover:opacity-100 ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden"
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

// type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
//   showCloseButton?: boolean;
//   glass?: boolean;
//   glassDark?: boolean;
//   size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "full"; // Expanded size options
// };

// function DialogContent({
//   className,
//   children,
//   showCloseButton = true,
//   glass = false,
//   glassDark = false,
//   size = "md", // Default size
//   ...props
// }: DialogContentProps) {
//   return (
//     <DialogPortal data-slot="dialog-portal">
//       <DialogOverlay />

//       <DialogPrimitive.Content
//         data-slot="dialog-content"
//         className={cn(
//           // base animation & layout
//           "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border p-6 shadow-xl duration-200",

//           // Size variants
//           size === "xs" && "max-w-xs", // Extra small size
//           size === "sm" && "max-w-sm", // Small size
//           size === "md" && "max-w-md", // Medium size (default)
//           size === "lg" && "max-w-lg", // Large size
//           size === "xl" && "max-w-xl", // Extra large size
//           size === "xxl" && "max-w-2xl", // Double extra large size
//           size === "full" && "max-w-full", // Full screen size

//           // default background (non-glass)
//           !glass && !glassDark && "bg-background",

//           // 🌟 GLASS WHITE (Vision Pro)
//           glass &&
//             "backdrop-blur-2xl bg-white/10 dark:bg-white/5 border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.15)]",

//           // 🌑 GLASS DARK (Frosted Black)
//           glassDark && "backdrop-blur-xl bg-black/30 border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.4)]",

//           className
//         )}
//         {...props}
//       >
//         {children}

//         {showCloseButton && (
//           <DialogPrimitive.Close
//             data-slot="dialog-close"
//             className="absolute top-4 right-4 rounded-md opacity-70 transition-opacity hover:opacity-100 ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden"
//           >
//             <XIcon className="size-4" />
//             <span className="sr-only">Close</span>
//           </DialogPrimitive.Close>
//         )}
//       </DialogPrimitive.Content>
//     </DialogPortal>
//   );
// }

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
