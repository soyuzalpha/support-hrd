import { toast } from "sonner";
import { ToastIcons } from "./toast-icons";

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const toastAlert = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 2000,
      icon: ToastIcons.success,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      className: "toast-success text-white",
      style: {
        background: "rgba(255, 255, 255, 0.2)", // semi-transparent background
        border: "1px solid #22c55e",
        color: "#ffffff", // white text
        backdropFilter: "blur(10px)", // glassmorphism effect
      },
    });
  },

  error: (message: any, options?: ToastOptions) => {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      icon: ToastIcons.error,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      className: "toast-error text-white",
      style: {
        background: "rgba(255, 255, 255, 0.2)", // semi-transparent background
        border: "1px solid #ef4444",
        color: "#ffffff", // white text
        backdropFilter: "blur(10px)", // glassmorphism effect
      },
    });
  },

  errorList: (errors: string[], options?: ToastOptions) => {
    const errorListComponent = (
      <div>
        <ul className="list-disc list-inside space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="text-white">
              {error}
            </li>
          ))}
        </ul>
      </div>
    );

    return toast.error(options?.title || "Validation Errors", {
      description: errorListComponent,
      duration: options?.duration || 6000,
      icon: ToastIcons.error,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      className: "toast-error-list text-white",
      style: {
        background: "rgba(255, 255, 255, 0.2)", // semi-transparent background
        border: "1px solid #ef4444",
        color: "#ffffff", // white text
        backdropFilter: "blur(10px)", // glassmorphism effect
      },
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4500,
      icon: ToastIcons.warning,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      className: "toast-warning text-white",
      style: {
        background: "rgba(255, 255, 255, 0.2)", // semi-transparent background
        border: "1px solid #f59e0b",
        color: "#ffffff", // white text
        backdropFilter: "blur(10px)", // glassmorphism effect
      },
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: ToastIcons.info,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      className: "toast-info text-white",
      style: {
        background: "rgba(255, 255, 255, 0.2)", // semi-transparent background
        border: "1px solid #3b82f6",
        color: "#ffffff", // white text
        backdropFilter: "blur(10px)", // glassmorphism effect
      },
    });
  },

  // Custom toast with full control
  custom: (message: string, type: "success" | "error" | "warning" | "info", options?: ToastOptions) => {
    return toastAlert[type](message, options);
  },

  // Promise-based toast for async operations
  promise: (
    promise: Promise<any>,
    {
      loading,
      success,
      error,
    }: { loading: string; success: string | ((data: any) => string); error: string | ((error: any) => string) }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
      duration: 4000,
    });
  },

  // Dismiss all toasts
  dismiss: () => {
    toast.dismiss();
  },

  // Dismiss specific toast
  dismissById: (id: string | number) => {
    toast.dismiss(id);
  },
};

// import { toast } from "sonner";
// import { ToastIcons } from "./toast-icons";

// export interface ToastOptions {
//   title?: string;
//   description?: string;
//   duration?: number;
//   action?: {
//     label: string;
//     onClick: () => void;
//   };
// }

// export const toastAlert = {
//   success: (message: string, options?: ToastOptions) => {
//     return toast.success(message, {
//       description: options?.description,
//       duration: options?.duration || 2000,
//       icon: ToastIcons.success,
//       action: options?.action
//         ? {
//             label: options.action.label,
//             onClick: options.action.onClick,
//           }
//         : undefined,
//       className: "toast-success",
//       style: {
//         background: "#f0f9ff",
//         border: "1px solid #22c55e",
//         color: "#166534",
//       },
//     });
//   },

//   error: (message: any, options?: ToastOptions) => {
//     return toast.error(message, {
//       description: options?.description,
//       duration: options?.duration || 5000,
//       icon: ToastIcons.error,
//       action: options?.action
//         ? {
//             label: options.action.label,
//             onClick: options.action.onClick,
//           }
//         : undefined,
//       className: "toast-error",
//       style: {
//         background: "#fef2f2",
//         border: "1px solid #ef4444",
//         color: "#991b1b",
//       },
//     });
//   },

//   errorList: (errors: string[], options?: ToastOptions) => {
//     const errorListComponent = (
//       <div>
//         <ul className="list-disc list-inside space-y-1">
//           {errors.map((error, index) => (
//             <li key={index} className="">
//               {error}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );

//     return toast.error(options?.title || "Validation Errors", {
//       description: errorListComponent,
//       duration: options?.duration || 6000,
//       icon: ToastIcons.error,
//       action: options?.action
//         ? {
//             label: options.action.label,
//             onClick: options.action.onClick,
//           }
//         : undefined,
//       className: "toast-error-list",
//       style: {
//         background: "#fef2f2",
//         border: "1px solid #ef4444",
//         color: "#991b1b",
//       },
//     });
//   },

//   warning: (message: string, options?: ToastOptions) => {
//     return toast.warning(message, {
//       description: options?.description,
//       duration: options?.duration || 4500,
//       icon: ToastIcons.warning,
//       action: options?.action
//         ? {
//             label: options.action.label,
//             onClick: options.action.onClick,
//           }
//         : undefined,
//       className: "toast-warning",
//       style: {
//         background: "#fffbeb",
//         border: "1px solid #f59e0b",
//         color: "#92400e",
//       },
//     });
//   },

//   info: (message: string, options?: ToastOptions) => {
//     return toast.info(message, {
//       description: options?.description,
//       duration: options?.duration || 4000,
//       icon: ToastIcons.info,
//       action: options?.action
//         ? {
//             label: options.action.label,
//             onClick: options.action.onClick,
//           }
//         : undefined,
//       className: "toast-info",
//       style: {
//         background: "#eff6ff",
//         border: "1px solid #3b82f6",
//         color: "#1e40af",
//       },
//     });
//   },

//   // Custom toast with full control
//   custom: (message: string, type: "success" | "error" | "warning" | "info", options?: ToastOptions) => {
//     return toastAlert[type](message, options);
//   },

//   // Promise-based toast for async operations
//   promise: (
//     promise: Promise<any>,
//     {
//       loading,
//       success,
//       error,
//     }: { loading: string; success: string | ((data: any) => string); error: string | ((error: any) => string) }
//   ) => {
//     return toast.promise(promise, {
//       loading,
//       success,
//       error,
//       duration: 4000,
//     });
//   },

//   // Dismiss all toasts
//   dismiss: () => {
//     toast.dismiss();
//   },

//   // Dismiss specific toast
//   dismissById: (id: string | number) => {
//     toast.dismiss(id);
//   },
// };
