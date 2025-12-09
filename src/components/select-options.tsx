"use client";

import ReactSelect, { GroupBase, MenuListProps, Props as SelectProps } from "react-select";
import AsyncSelect from "react-select/async";
import { useCallback, useRef, useState } from "react";

export type OptionType = {
  value: string | number;
  label: string;
};

interface SelectOptionsProps<
  Option extends OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends SelectProps<Option, IsMulti, Group> {
  create?: boolean;
  isAsync?: boolean;
  loadOptions?: (inputValue: string) => Promise<Option[]>;
  debounceMs?: number;
  onCreateOption?: (input: string) => Promise<Option>;
  onCreate?: (value: string) => Promise<any>;
}

export function SelectOptions<
  Option extends OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ isAsync, loadOptions, debounceMs = 400, onCreateOption, ...props }: SelectOptionsProps<Option, IsMulti, Group>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const debouncedLoad = useCallback(
    (value: string, callback: (options: Option[]) => void) => {
      if (!loadOptions) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        const results = await loadOptions(value);
        setShowCreate(results.length === 0 && value.trim().length > 0);
        callback(results);
      }, debounceMs);
    },
    [loadOptions, debounceMs]
  );

  const handleCreate = async () => {
    if (!onCreateOption || !inputValue) return;
    const newOption = await onCreateOption(inputValue);

    props.onChange?.(newOption as any, {
      action: "select-option",
      option: newOption,
    });

    setShowCreate(false);
  };

  /** FIX: menu override clean, no access `components` */
  const CustomMenuList = (menuProps: MenuListProps<Option, IsMulti, Group>) => (
    <div>
      {menuProps.children}

      {showCreate && onCreateOption && (
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          className="cursor-pointer px-3 py-2 text-white/80 text-sm 
       hover:bg-white/15 rounded-lg mt-1 transition backdrop-blur-md"
        >
          ➕ Create “{inputValue}”
        </div>
      )}
    </div>
  );

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backdropFilter: "blur(10px)",
      background: "rgba(255,255,255,0.06)",
      borderRadius: "12px",
      padding: "4px 6px",
      border: state.isFocused ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.15)",
      boxShadow: state.isFocused ? "0 0 20px rgba(255,255,255,0.08)" : "none",
      transition: "0.25s ease",
      "&:hover": {
        border: "1px solid rgba(255,255,255,0.25)",
        background: "rgba(255,255,255,0.10)",
      },
    }),

    menu: (base) => ({
      ...base,
      backdropFilter: "blur(24px)",
      background: "#1d1d1d",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: "14px",
      padding: "6px",
      marginTop: "6px",
      boxShadow: "0 0 24px rgba(0,0,0,0.25)",
    }),

    menuList: (base: any) => ({
      ...base,
      padding: "4px",
      // background: "rgba(255,255,255,0.06)",
      // backdropFilter: "blur(25px)",
    }),

    option: (base: any, state: any) => ({
      ...base,
      padding: "10px 12px",
      borderRadius: "8px",
      fontSize: "14px",
      transition: "0.15s",
      cursor: "pointer",
      background: state.isSelected
        ? "rgba(255,255,255,0.20)"
        : state.isFocused
        ? "rgba(255,255,255,0.12)"
        : "transparent",
      color: state.isSelected ? "#fff" : "rgba(255,255,255,0.85)",
      "&:active": {
        background: "rgba(255,255,255,0.25)",
      },
    }),

    placeholder: (base: any) => ({
      ...base,
      color: "rgba(255,255,255,0.45)",
      fontSize: "14px",
    }),

    singleValue: (base: any) => ({
      ...base,
      color: "rgba(255,255,255,0.9)",
      fontSize: "14px",
    }),

    input: (base: any) => ({
      ...base,
      color: "rgba(255,255,255,0.9) !important",
    }),
  };

  const classNames = {
    control: () => "!rounded-xl !border-transparent text-sm",
    menu: () => "!rounded-xl backdrop-blur-xl",
    option: () => "transition text-sm",
    placeholder: () => "!text-white/40",
  };

  const baseProps = {
    ...props,
    styles: customStyles,
    classNames,
    components: {
      MenuList: CustomMenuList,
      ...(props.components || {}),
    },
    onInputChange: (val: string) => setInputValue(val),
  };

  return isAsync ? (
    <AsyncSelect loadOptions={debouncedLoad} cacheOptions defaultOptions {...baseProps} />
  ) : (
    <ReactSelect {...baseProps} />
  );
}

// "use client";
// import ReactSelect, { type GroupBase, type Props as SelectProps } from "react-select";
// import AsyncSelect from "react-select/async";
// import { useCallback, useRef } from "react";

// // Define the type for your options
// export type OptionType = {
//   value: string;
//   label: string;
// };

// interface SelectOptionsProps<
//   Option extends OptionType,
//   IsMulti extends boolean = false,
//   Group extends GroupBase<Option> = GroupBase<Option>
// > extends SelectProps<Option, IsMulti, Group> {
//   isAsync?: boolean;
//   loadOptions?: (inputValue: string) => Promise<Option[]>;
//   debounceMs?: number;
// }

// export function SelectOptions<
//   Option extends OptionType,
//   IsMulti extends boolean = false,
//   Group extends GroupBase<Option> = GroupBase<Option>
// >({ isAsync, loadOptions, debounceMs = 500, ...props }: SelectOptionsProps<Option, IsMulti, Group>) {
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const debouncedLoadOptions = useCallback(
//     (inputValue: string, callback: (options: Option[]) => void) => {
//       if (!loadOptions) return;
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);

//       timeoutRef.current = setTimeout(async () => {
//         const result = await loadOptions(inputValue);
//         callback(result);
//       }, debounceMs);
//     },
//     [loadOptions, debounceMs]
//   );

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
//       // backgroundColor: state.isSelected
//       //   ? "hsl(var(--primary))"
//       //   : state.isFocused
//       //   ? "hsl(var(--accent)/0.2)"
//       //   : "hsl(var(--popover))",
//       // color: state.isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--popover-foreground))",
//       // "&:hover": {
//       //   backgroundColor: state.isSelected ? "hsl(var(--primary)/0.85)" : "hsl(var(--accent)/0.3)",
//       // },
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
//       `!min-h-[40px] !rounded-[var(--radius)] !border !border-border !bg-background transition-all duration-200 ${
//         state.isFocused ? "!border-primary !ring-2 !ring-ring/40" : ""
//       } hover:!border-primary/50 hover:!bg-card`,
//     option: (state: { isFocused: boolean; isSelected: boolean }) =>
//       `!text-popover-foreground transition-colors duration-150 ${
//         state.isSelected ? "!bg-primary !text-primary-foreground" : state.isFocused ? "!bg-accent/30" : "!bg-popover"
//       }`,
//     menu: () =>
//       "!bg-popover !border !border-border !rounded-[var(--radius)] !shadow-lg text-sm overflow-hidden !backdrop-blur-xl",
//     singleValue: () => "!text-foreground",
//     input: () => "!text-foreground",
//     placeholder: () => "!text-muted-foreground text-sm",
//     indicatorSeparator: () => "!bg-border/50",
//     dropdownIndicator: () => "!text-muted-foreground hover:!text-foreground transition-colors duration-150",
//     clearIndicator: () => "!text-muted-foreground hover:!text-foreground transition-colors duration-150",
//   };

//   if (isAsync) {
//     if (!loadOptions) {
//       console.error("SelectOptions: 'loadOptions' prop is required when 'isAsync' is true.");
//       return null;
//     }
//     return (
//       <AsyncSelect
//         loadOptions={debouncedLoadOptions}
//         cacheOptions
//         defaultOptions
//         styles={customStyles}
//         classNames={classNames}
//         menuPlacement="auto"
//         {...props}
//       />
//     );
//   }

//   return <ReactSelect styles={customStyles} classNames={classNames} menuPlacement="auto" {...props} />;
// }
