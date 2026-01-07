"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] text-xs",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        destructive: "bg-red-200 text-red-800 hover:bg-red-300 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700",

        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",

        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost: "hover:bg-accent hover:text-accent-foreground",

        link: "text-primary underline-offset-4 hover:underline",

        // 🌿 Pastel Bold
        success: "bg-[#66bb6a] text-white hover:bg-[#57a05a] dark:bg-[#388e3c] dark:hover:bg-[#2e7d32]",
        warning: "bg-[#fbc02d] text-black hover:bg-[#f9a825] dark:bg-[#f9a825] dark:text-black dark:hover:bg-[#f57f17]",
        error: "bg-[#ef5350] text-white hover:bg-[#e53935] dark:bg-[#c62828] dark:hover:bg-[#b71c1c]",
        info: "bg-[#42a5f5] text-white hover:bg-[#1e88e5] dark:bg-[#1565c0] dark:hover:bg-[#0d47a1]",

        // 🌿 Pastel Outline
        outlineSuccess:
          "border border-[#66bb6a] text-[#388e3c] hover:bg-[#e8f5e9] dark:border-[#81c784] dark:text-[#c8e6c9] dark:hover:bg-[#2e7d32]/20",
        outlineWarning:
          "border border-[#fbc02d] text-[#f57f17] hover:bg-[#fffde7] dark:border-[#ffe082] dark:text-[#ffeb3b] dark:hover:bg-[#fbc02d]/20",
        outlineError:
          "border border-[#ef5350] text-[#c62828] hover:bg-[#ffebee] dark:border-[#ef9a9a] dark:text-[#ffcdd2] dark:hover:bg-[#b71c1c]/20",
        outlineInfo:
          "border border-[#42a5f5] text-[#1565c0] hover:bg-[#e3f2fd] dark:border-[#90caf9] dark:text-[#bbdefb] dark:hover:bg-[#1565c0]/20",

        // 🌟 Solid Minimalist
        solid: "bg-muted text-foreground/90 border border-border hover:bg-muted/80",

        /* --------------------------------------------------------------
         🌈 GLASS VARIANTS — based on each variant
        -------------------------------------------------------------- */

        // default glass
        glass:
          "backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.08)] text-primary-foreground hover:bg-white/15",

        // destructive glass
        glassDestructive:
          "backdrop-blur-xl bg-red-500/10 border border-red-200/30 shadow-[0_0_20px_rgba(255,0,0,0.12)] text-red-600 dark:text-red-300 hover:bg-red-500/20",

        // success glass
        glassSuccess:
          "backdrop-blur-xl bg-[#66bb6a]/10 border border-[#66bb6a]/30 shadow-[0_0_20px_rgba(0,255,0,0.12)] text-[#2e7d32] dark:text-[#a5d6a7] hover:bg-[#66bb6a]/20",

        // warning glass
        glassWarning:
          "backdrop-blur-xl bg-[#fbc02d]/10 border border-[#fbc02d]/30 shadow-[0_0_20px_rgba(255,200,0,0.12)] text-[#c88719] hover:bg-[#fbc02d]/20",

        // error glass
        glassError:
          "backdrop-blur-xl bg-[#ef5350]/10 border border-[#ef5350]/30 shadow-[0_0_20px_rgba(255,0,0,0.12)] text-[#b71c1c] hover:bg-[#ef5350]/20",

        // info glass
        glassInfo:
          "backdrop-blur-xl bg-[#42a5f5]/10 border border-[#42a5f5]/30 shadow-[0_0_20px_rgba(0,120,255,0.12)] text-[#1565c0] hover:bg-[#42a5f5]/20",

        // secondary glass
        glassSecondary:
          "backdrop-blur-xl bg-secondary/10 border border-secondary/20 shadow-[0_0_20px_rgba(255,255,255,0.08)] text-secondary-foreground hover:bg-secondary/20",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xs: "h-8 rounded-md px-2",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  loadingIcon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = "xs",
      asChild = false,
      loading = false,
      loadingText,
      loadingIcon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Default loading icon
    const defaultLoadingIcon = <Loader2 className="animate-spin" />;
    // Use custom loading icon or default
    const spinnerIcon = loadingIcon || defaultLoadingIcon;
    // Determine what text to show
    const displayText = loading && loadingText ? loadingText : children;
    // Determine if button should be disabled
    const isDisabled = disabled || loading;
    // If asChild is true and we have loading states, we should not use Slot
    // because Slot expects a single child and loading states create multiple children
    const shouldUseSlot = asChild && !loading;

    const Comp = shouldUseSlot ? Slot : "button";

    // Create the content
    const content = (
      <>
        {loading && iconPosition === "left" && spinnerIcon}
        {displayText}
        {loading && iconPosition === "right" && spinnerIcon}
      </>
    );

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={isDisabled} {...props}>
        {shouldUseSlot ? children : content}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
