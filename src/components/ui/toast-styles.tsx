"use client";

import { useEffect } from "react";

export function ToastStyles() {
  useEffect(() => {
    // Inject custom CSS for toast styling
    const style = document.createElement("style");
    style.textContent = `
      .toast-success {
        border-left: 4px solid #10b981;
        background-color: #f0fdf4;
        color: #065f46;
      }
      
      .toast-success [data-icon] {
        color: #10b981;
      }
      
      .toast-error {
        border-left: 4px solid #ef4444;
        background-color: #fef2f2;
        color: #991b1b;
      }
      
      .toast-error [data-icon] {
        color: #ef4444;
      }
      
      .toast-warning {
        border-left: 4px solid #f59e0b;
        background-color: #fffbeb;
        color: #92400e;
      }
      
      .toast-warning [data-icon] {
        color: #f59e0b;
      }
      
      .toast-info {
        border-left: 4px solid #3b82f6;
        background-color: #eff6ff;
        color: #1e40af;
      }
      
      .toast-info [data-icon] {
        color: #3b82f6;
      }
      
      [data-sonner-toaster] [data-sonner-toast] {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      [data-sonner-toaster] [data-sonner-toast][data-styled] {
        padding: 16px;
      }
      
      [data-sonner-toaster] [data-sonner-toast] [data-content] {
        gap: 8px;
      }
      
      [data-sonner-toaster] [data-sonner-toast] [data-title] {
        font-weight: 600;
        font-size: 14px;
      }
      
      [data-sonner-toaster] [data-sonner-toast] [data-description] {
        font-size: 13px;
        opacity: 0.8;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
