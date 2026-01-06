import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CurrencyInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  currency?: "USD" | "IDR";
  locale?: string;
  maxValue?: number;
  disabled?: boolean;
  className?: string;
  error?: string;
}

interface CurrencyFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  name: string;
  placeholder: string;
  disabled: boolean;
  error?: string;
  currency: "USD" | "IDR";
  locale: string;
  maxValue: number;
}

const CurrencyField: React.FC<CurrencyFieldProps> = ({
  value,
  onChange,
  onBlur,
  name,
  placeholder,
  disabled,
  error,
  currency,
  locale,
  maxValue,
}) => {
  const symbol = currency === "USD" ? "$" : "Rp";

  // --- Format untuk IDR ---
  const formatIDR = (val: string): string => {
    const clean = val.replace(/\D/g, ""); // hapus non digit
    if (!clean) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(parseInt(clean, 10));
  };

  // --- Format untuk USD ---
  const formatUSD = (val: string): string => {
    const clean = val.replace(/[^0-9.,]/g, "").replace(",", ".");
    const [integer, decimal] = clean.split(".");
    const formattedInt = integer
      ? new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(parseInt(integer, 10))
      : "0";
    return decimal !== undefined ? `${formattedInt}.${decimal.slice(0, 2)}` : formattedInt;
  };

  // --- Parser ke value mentah ---
  const parseValue = (formatted: string): string => {
    if (currency === "IDR") {
      return formatted.replace(/\D/g, "");
    } else {
      return formatted.replace(/,/g, "");
    }
  };

  const formatDisplay = (val: string): string => {
    if (!val) return "";
    return currency === "IDR" ? formatIDR(val) : formatUSD(val);
  };

  const [displayValue, setDisplayValue] = React.useState(formatDisplay(value));

  React.useEffect(() => {
    setDisplayValue(formatDisplay(value));
  }, [value, currency]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Izinkan input kosong
    if (input === "") {
      setDisplayValue("");
      onChange("");
      return;
    }

    // Beda logika per currency
    const formatted = currency === "IDR" ? formatIDR(input) : formatUSD(input);
    setDisplayValue(formatted);

    const rawValue = parseValue(formatted);

    // Batasi nilai maksimum
    const num = parseFloat(rawValue.replace(/[^\d.]/g, "")) || 0;
    if (num > maxValue) return;

    onChange(rawValue);
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium pointer-events-none">
        {symbol}
      </div>
      <Input
        id={name}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        className={cn("pl-10 pr-12", error && "border-destructive focus-visible:ring-destructive")}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium pointer-events-none">
        {currency}
      </div>
    </div>
  );
};

export function CurrencyInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "0",
  currency = "USD",
  locale,
  maxValue = 999999999999,
  disabled = false,
  className,
  error,
}: CurrencyInputProps<T>) {
  const finalLocale = locale || (currency === "USD" ? "en-US" : "id-ID");

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className={error ? "text-destructive" : ""}>
          {label}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <CurrencyField
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            error={error}
            currency={currency}
            locale={finalLocale}
            maxValue={maxValue}
          />
        )}
      />
      {error && (
        <p id={`${name}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// import React from "react";
// import { Control, Controller, FieldValues, Path } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/clasExtension";

// interface CurrencyInputProps<T extends FieldValues> {
//   control: Control<T>;
//   name: Path<T>;
//   label?: string;
//   placeholder?: string;
//   currency?: string;
//   locale?: string;
//   maxValue?: number;
//   disabled?: boolean;
//   className?: string;
//   error?: string;
// }

// interface CurrencyFieldProps {
//   value: string;
//   onChange: (value: string) => void;
//   onBlur: () => void;
//   name: string;
//   placeholder: string;
//   disabled: boolean;
//   error?: string;
//   currency: string;
//   locale: string;
//   maxValue: number;
// }

// // Internal component to handle the input state
// const CurrencyField: React.FC<CurrencyFieldProps> = ({
//   value,
//   onChange,
//   onBlur,
//   name,
//   placeholder,
//   disabled,
//   error,
//   currency,
//   locale,
//   maxValue,
// }) => {
//   const formatCurrency = (val: string): string => {
//     // Remove all non-digit and non-decimal characters
//     const numericValue = val.replace(/[^\d.]/g, "");

//     // Prevent multiple decimal points
//     const parts = numericValue.split(".");
//     if (parts.length > 2) {
//       return parts[0] + "." + parts.slice(1).join("");
//     }

//     // Limit to 2 decimal places
//     if (parts[1] && parts[1].length > 2) {
//       return parts[0] + "." + parts[1].slice(0, 2);
//     }

//     return numericValue;
//   };

//   const formatDisplay = (val: string): string => {
//     if (!val || val === "") return "";

//     // Handle cases where user is typing decimal point
//     if (val.endsWith(".")) return val;
//     if (val.endsWith(".0")) return val;
//     if (val.endsWith(".00")) return val;

//     const numericValue = parseFloat(val);
//     if (isNaN(numericValue)) return "";

//     // Split into integer and decimal parts
//     const parts = val.split(".");
//     const integerPart = parts[0];
//     const decimalPart = parts[1];

//     // Format integer part with thousands separator
//     const formattedInteger = new Intl.NumberFormat(locale, {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(parseInt(integerPart) || 0);

//     // Return with decimal part if exists
//     if (decimalPart !== undefined) {
//       return `${formattedInteger}.${decimalPart}`;
//     }

//     return formattedInteger;
//   };

//   const [displayValue, setDisplayValue] = React.useState<string>(value ? formatDisplay(value) : "");

//   React.useEffect(() => {
//     if (value) {
//       setDisplayValue(formatDisplay(value));
//     } else {
//       setDisplayValue("");
//     }
//   }, [value, locale]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const inputValue = e.target.value;

//     // Allow empty value
//     if (inputValue === "") {
//       setDisplayValue("");
//       onChange("");
//       return;
//     }

//     const cleaned = formatCurrency(inputValue);

//     // Check max value
//     const numValue = parseFloat(cleaned);
//     if (!isNaN(numValue) && numValue > maxValue) {
//       return;
//     }

//     // Format and display in real-time
//     const formatted = formatDisplay(cleaned);
//     setDisplayValue(formatted);
//     onChange(cleaned);
//   };

//   return (
//     <div className="relative">
//       <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium pointer-events-none">
//         $
//       </div>
//       <Input
//         id={name}
//         type="text"
//         inputMode="decimal"
//         placeholder={placeholder}
//         value={displayValue}
//         onChange={handleChange}
//         onBlur={onBlur}
//         disabled={disabled}
//         className={cn("pl-8 pr-16", error && "border-destructive focus-visible:ring-destructive")}
//         aria-invalid={!!error}
//         aria-describedby={error ? `${name}-error` : undefined}
//       />
//       <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium pointer-events-none">
//         {currency}
//       </div>
//     </div>
//   );
// };

// export function CurrencyInput<T extends FieldValues>({
//   control,
//   name,
//   label,
//   placeholder = "0.00",
//   currency = "USD",
//   locale = "en-US",
//   maxValue = 999999999.99,
//   disabled = false,
//   className,
//   error,
// }: CurrencyInputProps<T>) {
//   return (
//     <div className={cn("space-y-2", className)}>
//       {label && (
//         <Label htmlFor={name} className={error ? "text-destructive" : ""}>
//           {label}
//         </Label>
//       )}
//       <Controller
//         control={control}
//         name={name}
//         render={({ field }) => (
//           <CurrencyField
//             value={field.value || ""}
//             onChange={field.onChange}
//             onBlur={field.onBlur}
//             name={name}
//             placeholder={placeholder}
//             disabled={disabled}
//             error={error}
//             currency={currency}
//             locale={locale}
//             maxValue={maxValue}
//           />
//         )}
//       />
//       {error && (
//         <p id={`${name}-error`} className="text-xs text-destructive">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }
