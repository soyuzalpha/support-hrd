"use client";

import type React from "react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (remark?: string) => void; // remark ikut dikirim
  onCancel?: () => void;
  isLoading?: boolean;
  variant?: "default" | "destructive";
  children?: React.ReactNode;
  additionalForm?: boolean; // ✅ props tambahan
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title = "Change Data",
  message = "Are you sure want to update this data?",
  confirmLabel = "Yes, Continue",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "default",
  children,
  additionalForm,
}: ConfirmationDialogProps) {
  const [remark, setRemark] = useState("");

  const handleConfirm = () => {
    onConfirm(additionalForm ? remark : undefined);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange?.(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {message}
            {children && <div className="mt-4">{children}</div>}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {additionalForm && (
          <div className="mt-4">
            <Label htmlFor="remark" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Remark
            </Label>
            <Textarea
              id="remark"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Tambahkan catatan di sini..."
            />
          </div>
        )}
        <AlertDialogFooter>
          <Button type="button" loading={isLoading} variant={"outlineError"} onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" loading={isLoading} variant={"outlineSuccess"} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// "use client";

// import type React from "react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Loader2 } from "lucide-react";
// import { Button } from "./ui/button";

// interface ConfirmationDialogProps {
//   open: boolean;
//   onOpenChange?: (open: boolean) => void;
//   title?: string;
//   message?: string;
//   confirmLabel?: string;
//   cancelLabel?: string;
//   onConfirm: () => void;
//   onCancel?: () => void;
//   isLoading?: boolean;
//   variant?: "default" | "destructive";
//   children?: React.ReactNode;
// }

// export function ConfirmationDialog({
//   open,
//   onOpenChange,
//   title = "Konfirmasi Tindakan",
//   message = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
//   confirmLabel = "Ya, Lanjutkan",
//   cancelLabel = "Batal",
//   onConfirm,
//   onCancel,
//   isLoading = false,
//   variant = "default",
//   children,
// }: ConfirmationDialogProps) {
//   const handleConfirm = () => {
//     onConfirm();
//   };

//   const handleCancel = () => {
//     if (onCancel) {
//       onCancel();
//     }
//     onOpenChange?.(false);
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>{title}</AlertDialogTitle>
//           <AlertDialogDescription>
//             {message}
//             {children && <div className="mt-4">{children}</div>}
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <Button type="button" loading={isLoading} variant={"outlineError"} onClick={handleCancel}>
//             {cancelLabel}
//           </Button>
//           <Button type="button" loading={isLoading} variant={"outlineSuccess"} onClick={handleConfirm}>
//             {confirmLabel}
//           </Button>
//           {/* <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
//             {cancelLabel}
//           </AlertDialogCancel> */}
//           {/* <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
//             <Button type="button" loading={isLoading} variant={"outlineSuccess"}>
//               {confirmLabel}
//             </Button>
//           </AlertDialogAction> */}
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
