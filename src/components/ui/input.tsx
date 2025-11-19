import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "h-9 w-full min-w-0 rounded-md border px-3 py-5 text-base md:text-sm outline-none transition-[color,box-shadow,border] shadow-xs disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Warna dasar putih transparan lembut
        "bg-white/10 border-white/30 text-white placeholder:text-white/70 file:text-white selection:bg-white/30 selection:text-white",
        // Fokus — putih 40% biar halus
        "focus-visible:border-white/40 focus-visible:ring-white/40 focus-visible:ring-[3px]",
        // Invalid tetap putih redup
        "aria-invalid:border-white/30 aria-invalid:ring-white/30",
        className
      )}
      {...props}
    />
  );
}

export { Input };

// import * as React from "react";

// import { cn } from "@/lib/utils";

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "file:text-foreground placeholder:tex-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-5 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// export { Input };
