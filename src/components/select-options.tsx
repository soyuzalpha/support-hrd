"use client";
import ReactSelect, { type GroupBase, type Props as SelectProps } from "react-select";
import AsyncSelect from "react-select/async";
import { useCallback, useRef } from "react";

// Define the type for your options
export type OptionType = {
  value: string;
  label: string;
};

interface SelectOptionsProps<
  Option extends OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends SelectProps<Option, IsMulti, Group> {
  isAsync?: boolean;
  loadOptions?: (inputValue: string) => Promise<Option[]>;
  debounceMs?: number;
}

export function SelectOptions<
  Option extends OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ isAsync, loadOptions, debounceMs = 500, ...props }: SelectOptionsProps<Option, IsMulti, Group>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedLoadOptions = useCallback(
    (inputValue: string, callback: (options: Option[]) => void) => {
      if (!loadOptions) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        const result = await loadOptions(inputValue);
        callback(result);
      }, debounceMs);
    },
    [loadOptions, debounceMs]
  );

  // === 🎨 Styling fully aligned with your color tokens ===
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "40px",
      borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--border))",
      boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring)/0.4)" : "none",
      "&:hover": {
        borderColor: "hsl(var(--primary)/0.5)",
        backgroundColor: "hsl(var(--card))",
      },
      backgroundColor: "hsl(var(--background))",
      borderRadius: "var(--radius)",
      color: "hsl(var(--foreground))",
      transition: "all 0.2s ease",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "hsl(var(--primary))"
        : state.isFocused
        ? "hsl(var(--accent)/0.2)"
        : "hsl(var(--popover))",
      color: state.isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--popover-foreground))",
      "&:hover": {
        backgroundColor: state.isSelected ? "hsl(var(--primary)/0.85)" : "hsl(var(--accent)/0.3)",
      },
      transition: "background-color 0.15s ease",
      cursor: "pointer",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "var(--radius)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      overflow: "hidden",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "hsl(var(--foreground))",
    }),
    input: (base: any) => ({
      ...base,
      color: "hsl(var(--foreground))",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "hsl(var(--muted-foreground))",
    }),
  };

  const classNames = {
    control: (state: { isFocused: boolean }) =>
      `!min-h-[40px] !rounded-[var(--radius)] !border !border-border !bg-background transition-all duration-200 ${
        state.isFocused ? "!border-primary !ring-2 !ring-ring/40" : ""
      } hover:!border-primary/50 hover:!bg-card`,
    option: (state: { isFocused: boolean; isSelected: boolean }) =>
      `!text-popover-foreground transition-colors duration-150 ${
        state.isSelected ? "!bg-primary !text-primary-foreground" : state.isFocused ? "!bg-accent/30" : "!bg-popover"
      }`,
    menu: () => "!bg-popover !border !border-border !rounded-[var(--radius)] !shadow-lg text-sm overflow-hidden",
    singleValue: () => "!text-foreground",
    input: () => "!text-foreground",
    placeholder: () => "!text-muted-foreground text-sm",
    indicatorSeparator: () => "!bg-border/50",
    dropdownIndicator: () => "!text-muted-foreground hover:!text-foreground transition-colors duration-150",
    clearIndicator: () => "!text-muted-foreground hover:!text-foreground transition-colors duration-150",
  };

  if (isAsync) {
    if (!loadOptions) {
      console.error("SelectOptions: 'loadOptions' prop is required when 'isAsync' is true.");
      return null;
    }
    return (
      <AsyncSelect
        loadOptions={debouncedLoadOptions}
        cacheOptions
        defaultOptions
        styles={customStyles}
        classNames={classNames}
        menuPlacement="auto"
        {...props}
      />
    );
  }

  return <ReactSelect styles={customStyles} classNames={classNames} menuPlacement="auto" {...props} />;
}
