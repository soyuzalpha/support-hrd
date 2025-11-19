import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export const ToastIcons = {
  success: <CheckCircle size={20} className="text-green-600" />,
  error: <XCircle size={20} className="text-red-600" />,
  warning: <AlertTriangle size={20} className="text-yellow-600" />,
  info: <Info size={20} className="text-blue-600" />,
};
