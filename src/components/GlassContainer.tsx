import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  scrollable?: boolean;
  children: React.ReactNode;
}

/**
 * GlassContainer — reusable frosted glass wrapper
 * cocok untuk setiap section/menu utama dengan efek blur elegan
 */
export function GlassContainer({
  title,
  description,
  actions,
  scrollable = false,
  children,
  className,
  ...props
}: GlassContainerProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-2xl border border-white/10 shadow-md",
        "rounded-2xl p-4 md:p-6  transition-all duration-300",
        className
      )}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            {title && <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>}
            {description && <p className="text-xs opacity-70 mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div
        className={cn(
          scrollable
            ? "max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            : ""
        )}
      >
        {children}
      </div>
    </div>
  );
}

// import * as React from "react";
// import { cn } from "@/lib/utils";

// interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
//   title?: string;
//   description?: string;
//   actions?: React.ReactNode;
//   scrollable?: boolean;
//   fullWidth?: boolean;
//   children: React.ReactNode;
// }

// /**
//  * GlassContainer — reusable frosted glass wrapper
//  * cocok untuk setiap section/menu utama dengan efek blur elegan
//  */
// export function GlassContainer({
//   title,
//   description,
//   actions,
//   scrollable = false,
//   fullWidth = false,
//   children,
//   className,
//   ...props
// }: GlassContainerProps) {
//   return (
//     <div
//       className={cn(
//         "backdrop-blur-2xl border border-white/10 bg-white/70 shadow-[0_0_15px_rgba(255,255,255,0.05)]",
//         "rounded-2xl p-4 md:p-6  transition-all duration-300",
//         fullWidth ? "w-full" : "container mx-auto",
//         className
//       )}
//       {...props}
//     >
//       {(title || actions) && (
//         <div className="flex items-center justify-between mb-4 md:mb-5">
//           <div>
//             {title && <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>}
//             {description && <p className="text-xs opacity-70 mt-1">{description}</p>}
//           </div>
//           {actions && <div className="flex items-center gap-2">{actions}</div>}
//         </div>
//       )}

//       <div
//         className={cn(
//           scrollable
//             ? "max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
//             : ""
//         )}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }
