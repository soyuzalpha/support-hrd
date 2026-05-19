"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  ALargeSmall,
  CaseSensitive,
  Check,
  ChevronDown,
  LayoutGrid,
  LayoutList,
  RotateCcw,
  Settings2,
  Space,
  Table2,
  Type,
  WholeWord,
} from "lucide-react";
import { AppGridContainer } from "./app-grid-container";
import { useAppSettings } from "@/context/settings-context";
import { fonts } from "@/lib/fonts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";

/* ─── helpers ────────────────────────────────────────────── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70 mb-3">{children}</p>
);

const ControlRow = ({
  label,
  icon: Icon,
  value,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  value?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {label}
      </label>
      {value && (
        <span className="text-xs tabular-nums font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {value}
        </span>
      )}
    </div>
    {children}
  </div>
);

/* ─── constants ──────────────────────────────────────────── */
const SPACING_OPTIONS = [
  { value: "compact", label: "Compact", desc: "Dense" },
  { value: "normal", label: "Normal", desc: "Default" },
  { value: "comfortable", label: "Comfortable", desc: "Relaxed" },
] as const;

const DISPLAY_MODE_OPTIONS = [
  { value: "table", label: "Table", desc: "Row-based list", Icon: Table2 },
  { value: "card", label: "Card", desc: "Grid of cards", Icon: LayoutGrid },
] as const;

const FONT_WEIGHT_OPTIONS = [
  { value: "300", label: "Light", tw: "font-light" },
  { value: "400", label: "Regular", tw: "font-normal" },
  { value: "500", label: "Medium", tw: "font-medium" },
  { value: "600", label: "Semi", tw: "font-semibold" },
  { value: "700", label: "Bold", tw: "font-bold" },
] as const;

const LINE_HEIGHT_OPTIONS = [
  { value: "tight", label: "Tight", lh: "leading-tight", preview: 1.25 },
  { value: "normal", label: "Normal", lh: "leading-normal", preview: 1.5 },
  { value: "relaxed", label: "Relaxed", lh: "leading-relaxed", preview: 1.75 },
] as const;

/* ─── component ──────────────────────────────────────────── */
const SettingProvider = () => {
  const { settings, updateSettings, resetSettings } = useAppSettings();
  const selectedFont = fonts.find((f) => f.font.className === settings.fontFamily);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs font-medium h-8 px-3 border-border/60 hover:border-border transition-all duration-200"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Preferences</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" size={useIsMobile() ? "full" : "35"} className=" flex flex-col gap-0 p-0">
        <SheetHeader className="px-5 pt-5 pb-4">
          <SheetTitle>Preferences</SheetTitle>
          <SheetDescription>Personalise your experience</SheetDescription>
        </SheetHeader>

        <Separator />

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <AppGridContainer className="p-5">
            <div className="space-y-8">
              {/* ══ TYPOGRAPHY ══════════════════════════════════ */}
              <section>
                <SectionLabel>Typography</SectionLabel>
                <div className="space-y-5">
                  {/* Font Family */}
                  <ControlRow label="Font family" icon={Type}>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 justify-between h-9 px-3 text-sm font-normal border-border/60"
                          >
                            <span className={selectedFont?.font.className ?? ""}>
                              {selectedFont?.name ?? "Select font…"}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                          {fonts.map((font) => {
                            const isActive = settings.fontFamily === font.font.className;
                            return (
                              <DropdownMenuItem
                                key={font.name}
                                onClick={() => updateSettings({ fontFamily: font.font.className })}
                                className="flex items-center justify-between cursor-pointer py-2"
                              >
                                <span className={`text-sm ${font.font.className}`}>{font.name}</span>
                                {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {selectedFont && (
                        <Badge variant="secondary" className="text-[10px] font-normal h-9 px-2 shrink-0">
                          <span className={selectedFont.font.className}>{selectedFont.name}</span>
                        </Badge>
                      )}
                    </div>
                  </ControlRow>

                  {/* Font Weight */}
                  <ControlRow label="Font weight" icon={WholeWord}>
                    <div className="grid grid-cols-5 gap-1">
                      {FONT_WEIGHT_OPTIONS.map(({ value, label, tw }) => {
                        const isActive = settings.fontWeight === value;
                        return (
                          <button
                            key={value}
                            onClick={() => updateSettings({ fontWeight: value as any })}
                            className={`
                              relative flex flex-col items-center gap-1.5 rounded-lg border py-2.5 px-1
                              text-center transition-all duration-150 cursor-pointer
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                              ${
                                isActive
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border/60 hover:border-border hover:bg-muted/50"
                              }
                            `}
                          >
                            {/* weight glyph preview */}
                            <span
                              className={`text-sm leading-none select-none ${tw} ${isActive ? "text-primary" : "text-foreground"}`}
                              style={{ fontWeight: Number(value) }}
                            >
                              Aa
                            </span>
                            <span
                              className={`text-[9px] leading-none ${isActive ? "text-primary" : "text-muted-foreground"}`}
                            >
                              {label}
                            </span>
                            {isActive && (
                              <span className="absolute top-1 right-1">
                                <Check className="h-2 w-2 text-primary" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </ControlRow>

                  {/* Font Size */}
                  <ControlRow label="Font size" icon={ALargeSmall} value={`${settings.fontSize}px`}>
                    <Slider
                      min={12}
                      max={20}
                      step={1}
                      value={[settings.fontSize]}
                      onValueChange={([v]) => updateSettings({ fontSize: v })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground/60 select-none -mt-1">
                      <span>12px</span>
                      <span>16px</span>
                      <span>20px</span>
                    </div>
                  </ControlRow>

                  {/* Letter Spacing */}
                  <ControlRow label="Letter spacing" icon={CaseSensitive} value={`${settings.letterSpacing ?? 0}em`}>
                    <Slider
                      min={-2}
                      max={8}
                      step={1}
                      value={[Math.round((settings.letterSpacing ?? 0) * 100)]}
                      onValueChange={([v]) => updateSettings({ letterSpacing: v / 100 })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground/60 select-none -mt-1">
                      <span>Tight</span>
                      <span>Normal</span>
                      <span>Wide</span>
                    </div>
                    {/* live preview */}
                    <p
                      className="text-xs text-muted-foreground/70 bg-muted/50 rounded px-2 py-1.5 text-center truncate"
                      style={{ letterSpacing: `${settings.letterSpacing ?? 0}em` }}
                    >
                      The quick brown fox
                    </p>
                  </ControlRow>

                  {/* Line Height */}
                  <ControlRow label="Line height" icon={LayoutList}>
                    <div className="grid grid-cols-3 gap-1.5">
                      {LINE_HEIGHT_OPTIONS.map(({ value, label, preview }) => {
                        const isActive = (settings.lineHeight ?? "normal") === value;
                        return (
                          <button
                            key={value}
                            onClick={() => updateSettings({ lineHeight: value as any })}
                            className={`
                              relative flex flex-col items-center gap-1.5 rounded-lg border py-2.5 px-1
                              text-center transition-all duration-150 cursor-pointer
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                              ${
                                isActive
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border/60 hover:border-border hover:bg-muted/50"
                              }
                            `}
                          >
                            <LineHeightPreview spacing={preview} active={isActive} />
                            <span
                              className={`text-[11px] font-medium leading-none ${isActive ? "text-primary" : "text-foreground"}`}
                            >
                              {label}
                            </span>
                            <span className="text-[9px] text-muted-foreground/70 leading-none">{preview}×</span>
                            {isActive && (
                              <span className="absolute top-1.5 right-1.5">
                                <Check className="h-2.5 w-2.5 text-primary" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </ControlRow>
                </div>
              </section>

              <Separator />

              {/* ══ LAYOUT ══════════════════════════════════════ */}
              <section>
                <SectionLabel>Layout</SectionLabel>
                <div className="space-y-5">
                  {/* Spacing */}
                  <ControlRow label="Spacing" icon={Space}>
                    <div className="grid grid-cols-3 gap-1.5">
                      {SPACING_OPTIONS.map(({ value, label, desc }) => {
                        const isActive = settings.spacing === value;
                        return (
                          <button
                            key={value}
                            onClick={() => updateSettings({ spacing: value as any })}
                            className={`
                              relative flex flex-col items-center gap-1 rounded-lg border py-2.5 px-1
                              text-center transition-all duration-150 cursor-pointer
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                              ${
                                isActive
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border/60 hover:border-border hover:bg-muted/50"
                              }
                            `}
                          >
                            <SpacingPreview density={value} active={isActive} />
                            <span
                              className={`text-[11px] font-medium leading-none ${isActive ? "text-primary" : "text-foreground"}`}
                            >
                              {label}
                            </span>
                            <span className="text-[9px] text-muted-foreground/70 leading-none">{desc}</span>
                            {isActive && (
                              <span className="absolute top-1.5 right-1.5">
                                <Check className="h-2.5 w-2.5 text-primary" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </ControlRow>

                  {/* Border Radius */}
                  <ControlRow label="Border radius" value={`${settings.radius}px`}>
                    <Slider
                      min={0}
                      max={20}
                      step={1}
                      value={[settings.radius]}
                      onValueChange={([v]) => updateSettings({ radius: v })}
                      className="w-full"
                    />
                    <div className="flex gap-2 pt-0.5">
                      {[0, 5, 10, 20].map((r) => (
                        <div
                          key={r}
                          style={{ borderRadius: r }}
                          className={`
                            h-7 flex-1 border-2 transition-all duration-150
                            ${settings.radius === r ? "border-primary bg-primary/10" : "border-border/50 bg-muted/40"}
                          `}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground/60 select-none">
                      <span>Square</span>
                      <span>Rounded</span>
                    </div>
                  </ControlRow>
                </div>
              </section>
            </div>
          </AppGridContainer>
        </div>

        <Separator />

        <SheetFooter className="px-5 py-3 gap-2 flex-row">
          <Button
            onClick={resetSettings}
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground flex-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset defaults
          </Button>
          <SheetClose asChild>
            <Button size="sm" className="flex-1 text-xs">
              Done
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

/* ─── previews ────────────────────────────────────────────── */

const SpacingPreview = ({ density, active }: { density: "compact" | "normal" | "comfortable"; active: boolean }) => {
  const lines = { compact: [1, 1, 1, 1], normal: [1, 2, 1, 2], comfortable: [2, 3, 2, 3] }[density];
  return (
    <div className="flex flex-col gap-px w-5">
      {lines.map((h, i) => (
        <div
          key={i}
          style={{ height: h * 2 }}
          className={`w-full rounded-sm transition-colors ${active ? "bg-primary/60" : "bg-muted-foreground/25"}`}
        />
      ))}
    </div>
  );
};

const LineHeightPreview = ({ spacing, active }: { spacing: number; active: boolean }) => {
  // render 3 "text lines" with gap proportional to line-height
  const gap = Math.round((spacing - 1) * 8);
  return (
    <div className="flex flex-col w-8" style={{ gap }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`h-1 rounded-sm ${i === 1 ? "w-5/6" : "w-full"} ${active ? "bg-primary/60" : "bg-muted-foreground/25"}`}
        />
      ))}
    </div>
  );
};

const DisplayDataModePreview = ({ mode, active }: { mode: "table" | "card"; active: boolean }) => {
  const base = active ? "bg-primary/60" : "bg-muted-foreground/25";
  const faint = active ? "bg-primary/20" : "bg-muted-foreground/10";

  if (mode === "table") {
    return (
      <div className="w-10 space-y-0.5">
        <div className={`flex gap-0.5 h-1.5 rounded-sm overflow-hidden ${active ? "opacity-100" : "opacity-70"}`}>
          <div className={`flex-2 rounded-sm ${base}`} />
          <div className={`flex-3 rounded-sm ${base}`} />
          <div className={`flex-2 rounded-sm ${base}`} />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-0.5 h-1.5 rounded-sm overflow-hidden">
            <div className={`flex-2 rounded-sm ${faint}`} />
            <div className={`flex-3 rounded-sm ${faint}`} />
            <div className={`flex-2 rounded-sm ${faint}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-10 grid grid-cols-2 gap-0.5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-4 rounded-sm border ${
            active ? "border-primary/40 bg-primary/10" : "border-border/50 bg-muted-foreground/10"
          } flex flex-col justify-end p-0.5 gap-0.5`}
        >
          <div className={`h-0.5 w-full rounded-full ${faint}`} />
          <div className={`h-0.5 w-2/3 rounded-full ${faint}`} />
        </div>
      ))}
    </div>
  );
};

export default SettingProvider;

// "use client";

// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "../ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Slider } from "@/components/ui/slider";
// import { Check, ChevronDown, LayoutGrid, LayoutList, RotateCcw, Settings2, Space, Table2, Type, X } from "lucide-react";
// import { AppGridContainer } from "./app-grid-container";
// import { useAppSettings } from "@/context/settings-context";
// import { fonts } from "@/lib/fonts";

// /* ─── tiny helper ─────────────────────────────────────────── */
// const SectionLabel = ({ children }: { children: React.ReactNode }) => (
//   <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70 mb-2">{children}</p>
// );

// const SPACING_OPTIONS = [
//   { value: "compact", label: "Compact", desc: "Dense layout" },
//   { value: "normal", label: "Normal", desc: "Default spacing" },
//   { value: "comfortable", label: "Comfortable", desc: "Relaxed layout" },
// ] as const;

// const DISPLAY_MODE_OPTIONS = [
//   { value: "table", label: "Table", desc: "Row-based list", Icon: Table2 },
//   { value: "card", label: "Card", desc: "Grid of cards", Icon: LayoutGrid },
// ] as const;

// /* ─── component ──────────────────────────────────────────── */
// const SettingProvider = () => {
//   const { settings, updateSettings, resetSettings } = useAppSettings();
//   const selectedFont = fonts.find((f) => f.font.className === settings.fontFamily);

//   return (
//     <Sheet>
//       {/* ── trigger ── */}
//       <SheetTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className="gap-2 text-xs font-medium h-8 px-3 border-border/60 hover:border-border transition-all duration-200"
//         >
//           <Settings2 className="h-3.5 w-3.5" />
//           <span className="hidden sm:inline">Preferences</span>
//         </Button>
//       </SheetTrigger>

//       {/* ── panel ── */}
//       <SheetContent side={"right"} className="xl:min-w-lg">
//         {/* header */}
//         <SheetHeader>
//           <SheetTitle>Preferences</SheetTitle>
//           <SheetDescription>Personalise your experience</SheetDescription>
//         </SheetHeader>

//         {/* <Separator /> */}

//         <AppGridContainer className="p-3">
//           {/* ── Typography ── */}
//           <section>
//             <SectionLabel>Typography</SectionLabel>

//             {/* Font Family */}
//             <div className="space-y-1.5 mb-4">
//               <div className="flex items-center justify-between">
//                 <label className="text-sm font-medium flex items-center gap-1.5">
//                   <Type className="h-3.5 w-3.5 text-muted-foreground" />
//                   Font family
//                 </label>
//                 {selectedFont && (
//                   <Badge variant="secondary" className="text-[10px] font-normal h-5 px-1.5">
//                     <span className={selectedFont.font.className}>{selectedFont.name}</span>
//                   </Badge>
//                 )}
//               </div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="w-full justify-between h-9 px-3 text-sm font-normal border-border/60"
//                   >
//                     <span className={selectedFont?.font.className ?? ""}>{selectedFont?.name ?? "Select font…"}</span>
//                     <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
//                   </Button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
//                   {fonts.map((font) => {
//                     const isActive = settings.fontFamily === font.font.className;
//                     return (
//                       <DropdownMenuItem
//                         key={font.name}
//                         onClick={() => updateSettings({ fontFamily: font.font.className })}
//                         className="flex items-center justify-between cursor-pointer py-2"
//                       >
//                         <span className={`text-sm ${font.font.className}`}>{font.name}</span>
//                         {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
//                       </DropdownMenuItem>
//                     );
//                   })}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             {/* Font Size */}
//             <div className="space-y-2.5">
//               <div className="flex items-center justify-between">
//                 <label className="text-sm font-medium">Font size</label>
//                 <span className="text-xs tabular-nums font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
//                   {settings.fontSize}px
//                 </span>
//               </div>
//               <Slider
//                 min={12}
//                 max={20}
//                 step={1}
//                 value={[settings.fontSize]}
//                 onValueChange={([v]) => updateSettings({ fontSize: v })}
//                 className="w-full"
//               />
//               <div className="flex justify-between text-[10px] text-muted-foreground/60 select-none">
//                 <span>12</span>
//                 <span>16</span>
//                 <span>20</span>
//               </div>
//             </div>
//           </section>

//           <Separator className="my-6" />

//           {/* ── Layout ── */}
//           <section>
//             <SectionLabel>Layout</SectionLabel>

//             <div className="space-y-6">
//               {/* Spacing */}
//               <div className="space-y-1.5 mb-4">
//                 <label className="text-sm font-medium flex items-center gap-1.5">
//                   <Space className="h-3.5 w-3.5 text-muted-foreground" />
//                   Spacing
//                 </label>
//                 <div className="grid grid-cols-3 gap-1.5">
//                   {SPACING_OPTIONS.map(({ value, label, desc }) => {
//                     const isActive = settings.spacing === value;
//                     return (
//                       <button
//                         key={value}
//                         onClick={() => updateSettings({ spacing: value as any })}
//                         className={`
//                             relative flex flex-col items-center gap-1 rounded-lg border py-2.5 px-1
//                             text-center transition-all duration-150 cursor-pointer
//                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
//                             ${
//                               isActive
//                                 ? "border-primary bg-primary/5 shadow-sm"
//                                 : "border-border/60 hover:border-border hover:bg-muted/50"
//                             }
//                           `}
//                       >
//                         <SpacingPreview density={value} active={isActive} />
//                         <span
//                           className={`text-[11px] font-medium leading-none ${isActive ? "text-primary" : "text-foreground"}`}
//                         >
//                           {label}
//                         </span>
//                         <span className="text-[9px] text-muted-foreground/70 leading-none">{desc}</span>
//                         {isActive && (
//                           <span className="absolute top-1.5 right-1.5">
//                             <Check className="h-2.5 w-2.5 text-primary" />
//                           </span>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Display Mode */}
//               <div className="space-y-1.5 mb-4">
//                 <label className="text-sm font-medium flex items-center gap-1.5">
//                   <LayoutList className="h-3.5 w-3.5 text-muted-foreground" />
//                   Display mode
//                 </label>
//                 <div className="grid grid-cols-2 gap-1.5">
//                   {DISPLAY_MODE_OPTIONS.map(({ value, label, desc }) => {
//                     const isActive = settings.displayDataMode === value;
//                     return (
//                       <button
//                         key={value}
//                         onClick={() => updateSettings({ displayDataMode: value as any })}
//                         className={`
//                             relative flex flex-col items-center gap-1.5 rounded-lg border py-3 px-2
//                             text-center transition-all duration-150 cursor-pointer
//                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
//                             ${
//                               isActive
//                                 ? "border-primary bg-primary/5 shadow-sm"
//                                 : "border-border/60 hover:border-border hover:bg-muted/50"
//                             }
//                           `}
//                       >
//                         <DisplayDataModePreview mode={value} active={isActive} />
//                         <span
//                           className={`text-[11px] font-medium leading-none ${isActive ? "text-primary" : "text-foreground"}`}
//                         >
//                           {label}
//                         </span>
//                         <span className="text-[9px] text-muted-foreground/70 leading-none">{desc}</span>
//                         {isActive && (
//                           <span className="absolute top-1.5 right-1.5">
//                             <Check className="h-2.5 w-2.5 text-primary" />
//                           </span>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Border Radius */}
//               <div className="space-y-2.5">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm font-medium">Border radius</label>
//                   <span className="text-xs tabular-nums font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
//                     {settings.radius}px
//                   </span>
//                 </div>
//                 <Slider
//                   min={0}
//                   max={20}
//                   step={1}
//                   value={[settings.radius]}
//                   onValueChange={([v]) => updateSettings({ radius: v })}
//                   className="w-full"
//                 />
//                 <div className="flex gap-2 pt-0.5">
//                   {[0, 5, 10, 20].map((r) => (
//                     <div
//                       key={r}
//                       style={{ borderRadius: r }}
//                       className={`
//                           h-7 flex-1 border-2 transition-all duration-150
//                           ${settings.radius === r ? "border-primary bg-primary/10" : "border-border/50 bg-muted/40"}
//                         `}
//                     />
//                   ))}
//                 </div>
//                 <div className="flex justify-between text-[10px] text-muted-foreground/60 select-none">
//                   <span>Square</span>
//                   <span>Rounded</span>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </AppGridContainer>

//         {/* footer */}
//         <SheetFooter className="px-5 py-3 gap-2 flex-row">
//           <Button
//             onClick={resetSettings}
//             variant="ghost"
//             size="sm"
//             className="gap-1.5 text-xs text-muted-foreground hover:text-foreground flex-1"
//           >
//             <RotateCcw className="h-3.5 w-3.5" />
//             Reset defaults
//           </Button>

//           <SheetClose asChild>
//             <Button size="sm" className="flex-1 text-xs">
//               Done
//             </Button>
//           </SheetClose>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// };

// /* ─── spacing preview ────────────────────────────────────── */
// const SpacingPreview = ({ density, active }: { density: "compact" | "normal" | "comfortable"; active: boolean }) => {
//   const lines = {
//     compact: [1, 1, 1, 1],
//     normal: [1, 2, 1, 2],
//     comfortable: [2, 3, 2, 3],
//   }[density];

//   return (
//     <div className="flex flex-col gap-px w-5">
//       {lines.map((h, i) => (
//         <div
//           key={i}
//           style={{ height: h * 2 }}
//           className={`w-full rounded-sm transition-colors ${active ? "bg-primary/60" : "bg-muted-foreground/25"}`}
//         />
//       ))}
//     </div>
//   );
// };

// /* ─── display mode preview ───────────────────────────────── */
// const DisplayDataModePreview = ({ mode, active }: { mode: "table" | "card"; active: boolean }) => {
//   const base = active ? "bg-primary/60" : "bg-muted-foreground/25";
//   const faint = active ? "bg-primary/20" : "bg-muted-foreground/10";

//   if (mode === "table") {
//     return (
//       <div className="w-10 space-y-0.5">
//         <div className={`flex gap-0.5 h-1.5 rounded-sm overflow-hidden ${active ? "opacity-100" : "opacity-70"}`}>
//           <div className={`flex-2 rounded-sm ${base}`} />
//           <div className={`flex-3 rounded-sm ${base}`} />
//           <div className={`flex-2 rounded-sm ${base}`} />
//         </div>
//         {[0, 1, 2].map((i) => (
//           <div key={i} className="flex gap-0.5 h-1.5 rounded-sm overflow-hidden">
//             <div className={`flex-2 rounded-sm ${faint}`} />
//             <div className={`flex-3 rounded-sm ${faint}`} />
//             <div className={`flex-2 rounded-sm ${faint}`} />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="w-10 grid grid-cols-1 xl:grid-cols-2 gap-0.5">
//       {[0, 1, 2, 3].map((i) => (
//         <div
//           key={i}
//           className={`h-4 rounded-sm border ${
//             active ? "border-primary/40 bg-primary/10" : "border-border/50 bg-muted-foreground/10"
//           } flex flex-col justify-end p-0.5 gap-0.5`}
//         >
//           <div className={`h-0.5 w-full rounded-full ${faint}`} />
//           <div className={`h-0.5 w-2/3 rounded-full ${faint}`} />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SettingProvider;
