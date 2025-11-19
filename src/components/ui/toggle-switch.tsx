import React from "react";
import { Label } from "./label";

type ToggleOption = {
  label: string;
  value: string | number | boolean;
};

type ToggleSwitchProps = {
  value: string | number | boolean;
  options: ToggleOption[];
  onChange: (value: string | number | boolean) => void;
  className?: string;
  label?: string;
  disable?: boolean;
  isRequired?: boolean;
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  options,
  onChange,
  className = "",
  label = "Status",
  disable = false,
  isRequired = false,
}) => {
  return (
    <div className="grid gap-3">
      <Label htmlFor="id_country" isRequired={isRequired}>
        {label}
      </Label>
      <div className={`flex items-center gap-2 ${className}`}>
        {options.map((opt) => {
          const isActive = value === opt.value;

          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onChange(opt.value)}
              disabled={disable}
              className={`px-4 py-1 rounded-sm border text-sm font-medium transition ${
                isActive
                  ? opt.value === false || opt.value === "inactive" || opt.value === 0
                    ? "bg-red-600 text-white border-red-600" // nonaktif
                    : opt.value === "approved"
                    ? "bg-green-600 text-white border-green-600" // approved
                    : opt.value === "rejected"
                    ? "bg-red-600 text-white border-red-600" // rejected
                    : "bg-green-800 text-white border-green-800" // default aktif
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
