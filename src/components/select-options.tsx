"use client";

import { GroupBase, Props as SelectProps } from "react-select";
import ReactSelect from "react-select";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useCallback, useRef } from "react";

export type OptionType = {
  value: string | number;
  label: string;
};

interface SelectOptionsProps<
  Option extends OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends SelectProps<Option, IsMulti, Group> {
  create?: boolean;
  isAsync?: boolean;
  loadOptions?: (inputValue: string) => Promise<Option[]>;
  debounceMs?: number;
  onCreateOption?: (inputValue: string) => Promise<Option>;
}

export function SelectOptions<
  Option extends OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  isAsync,
  create,
  loadOptions,
  debounceMs = 400,
  onCreateOption,
  ...props
}: SelectOptionsProps<Option, IsMulti, Group>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedLoad = useCallback(
    (value: string, callback: (options: Option[]) => void) => {
      if (!loadOptions) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        const results = await loadOptions(value);
        callback(results);
      }, debounceMs);
    },
    [loadOptions, debounceMs],
  );

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
      cursor: "pointer",
    }),

    menu: (base: any) => ({
      ...base,
      backgroundColor: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "var(--radius)",
      overflow: "hidden",
      boxShadow: "0 4px 16px rgba(0,0,0,.4)",
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
      `!min-h-[40px] !rounded-[var(--radius)] !border !border-border !bg-background transition-all ${
        state.isFocused ? "!border-primary !ring-2 !ring-ring/40" : ""
      }`,

    option: (state: { isFocused: boolean; isSelected: boolean }) =>
      state.isSelected ? "!bg-primary !text-primary-foreground" : state.isFocused ? "!bg-accent/30" : "!bg-popover",

    menu: () => "!bg-popover !border !border-border !rounded-[var(--radius)] overflow-hidden",

    singleValue: () => "!text-foreground text-xs",
    input: () => "!text-foreground text-xs",
    placeholder: () => "!text-muted-foreground text-xs",
    indicatorSeparator: () => "!bg-border/50",
    dropdownIndicator: () => "!text-muted-foreground hover:!text-foreground",
    clearIndicator: () => "!text-muted-foreground hover:!text-foreground",
  };

  const handleCreate = async (inputValue: string) => {
    if (!onCreateOption) return;

    const newOption = await onCreateOption(inputValue);

    props.onChange?.(
      newOption as any,
      {
        action: "select-option",
        option: newOption,
      } as any,
    );
  };

  const baseProps = {
    ...props,
    styles: customStyles,
    classNames,
  };

  // Async + Create
  if (isAsync && create) {
    return (
      <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        loadOptions={debouncedLoad}
        onCreateOption={handleCreate}
        formatCreateLabel={(input) => `Tambah "${input}"`}
        {...baseProps}
      />
    );
  }

  // Async Only
  if (isAsync) {
    return <AsyncSelect cacheOptions defaultOptions loadOptions={debouncedLoad} {...baseProps} />;
  }

  // Create Only
  if (create) {
    return (
      <CreatableSelect
        onCreateOption={handleCreate}
        formatCreateLabel={(input) => `Tambah "${input}"`}
        {...baseProps}
      />
    );
  }

  // Normal Select
  return <ReactSelect {...baseProps} />;
}

// "use client";

// import ReactSelect, { GroupBase, MenuListProps, Props as SelectProps } from "react-select";
// import AsyncSelect from "react-select/async";
// import { useCallback, useRef, useState } from "react";

// export type OptionType = {
//   value: string | number;
//   label: string;
// };

// interface SelectOptionsProps<
//   Option extends OptionType,
//   IsMulti extends boolean = false,
//   Group extends GroupBase<Option> = GroupBase<Option>
// > extends SelectProps<Option, IsMulti, Group> {
//   create?: boolean;
//   isAsync?: boolean;
//   loadOptions?: (inputValue: string) => Promise<Option[]>;
//   debounceMs?: number;
//   onCreateOption?: (input: string) => Promise<Option>;
//   onCreate?: (value: string) => Promise<any>;
// }

// export function SelectOptions<
//   Option extends OptionType,
//   IsMulti extends boolean = false,
//   Group extends GroupBase<Option> = GroupBase<Option>
// >({ isAsync, loadOptions, debounceMs = 400, onCreateOption, ...props }: SelectOptionsProps<Option, IsMulti, Group>) {
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [inputValue, setInputValue] = useState("");
//   const [showCreate, setShowCreate] = useState(false);

//   const debouncedLoad = useCallback(
//     (value: string, callback: (options: Option[]) => void) => {
//       if (!loadOptions) return;
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);

//       timeoutRef.current = setTimeout(async () => {
//         const results = await loadOptions(value);
//         setShowCreate(results.length === 0 && value.trim().length > 0);
//         callback(results);
//       }, debounceMs);
//     },
//     [loadOptions, debounceMs]
//   );

//   const handleCreate = async () => {
//     if (!onCreateOption || !inputValue) return;
//     const newOption = await onCreateOption(inputValue);

//     props.onChange?.(newOption as any, {
//       action: "select-option",
//       option: newOption,
//     });

//     setShowCreate(false);
//   };

//   // === 🎨 Styling fully aligned with your color tokens ===
//   const customStyles = {
//     control: (base: any, state: any) => ({
//       ...base,
//       minHeight: "40px",
//       borderColor: state.isFocused ? "hsl(var(--primary))" : "hsl(var(--border))",
//       boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring)/0.4)" : "none",
//       "&:hover": {
//         borderColor: "hsl(var(--primary)/0.5)",
//         backgroundColor: "hsl(var(--card))",
//       },
//       backgroundColor: "hsl(var(--background))",
//       borderRadius: "var(--radius)",
//       color: "hsl(var(--foreground))",
//       transition: "all 0.2s ease",
//     }),
//     option: (base: any, state: any) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "hsl(var(--primary))"
//         : state.isFocused
//         ? "hsl(var(--accent)/0.2)"
//         : "hsl(var(--popover))",
//       color: state.isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--popover-foreground))",
//       "&:hover": {
//         backgroundColor: state.isSelected ? "hsl(var(--primary)/0.85)" : "hsl(var(--accent)/0.3)",
//       },
//       transition: "background-color 0.15s ease",
//       cursor: "pointer",
//     }),
//     menu: (base: any) => ({
//       ...base,
//       backgroundColor: "hsl(var(--popover))",
//       border: "1px solid hsl(var(--border))",
//       borderRadius: "var(--radius)",
//       boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
//       overflow: "hidden",
//     }),
//     singleValue: (base: any) => ({
//       ...base,
//       color: "hsl(var(--foreground))",
//     }),
//     input: (base: any) => ({
//       ...base,
//       color: "hsl(var(--foreground))",
//     }),
//     placeholder: (base: any) => ({
//       ...base,
//       color: "hsl(var(--muted-foreground))",
//     }),
//   };

//   const classNames = {
//     control: (state: { isFocused: boolean }) =>
//       `!min-h-[16px] !rounded-[var(--radius)] !border !border-border !bg-background transition-all duration-200 ${
//         state.isFocused ? "!border-primary !ring-2 !ring-ring/40" : ""
//       } hover:!border-primary/50 hover:!bg-card`,
//     option: (state: { isFocused: boolean; isSelected: boolean }) =>
//       `!text-popover-foreground transition-colors duration-150 ${
//         state.isSelected ? "!bg-primary !text-primary-foreground" : state.isFocused ? "!bg-accent/30" : "!bg-popover"
//       }`,
//     menu: () => "!bg-popover !border !border-border !rounded-[var(--radius)] !shadow-lg text-xs overflow-hidden",
//     singleValue: () => "!text-foreground text-xs",
//     input: () => "!text-foreground text-xs",
//     placeholder: () => "!text-muted-foreground text-xs",
//     indicatorSeparator: () => "!bg-border/50",
//     dropdownIndicator: () => "!text-muted-foreground hover:!text-foreground transition-colors duration-150",
//     clearIndicator: () => "!text-muted-foreground hover:!text-foreground transition-colors duration-150",
//   };

//   const baseProps = {
//     ...props,
//     styles: customStyles,
//     classNames,
//     components: {
//       // MenuList: CustomMenuList,
//       ...(props.components || {}),
//     },
//     onInputChange: (val: string) => setInputValue(val),
//   };

//   return isAsync ? (
//     <AsyncSelect loadOptions={debouncedLoad} cacheOptions defaultOptions {...baseProps} />
//   ) : (
//     <ReactSelect {...baseProps} />
//   );
// }
