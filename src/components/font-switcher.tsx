"use client";

import * as React from "react";
import { Check, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { literata, poppins, jetbrainsMono, inter, geist } from "@/lib/fonts";
import Show from "./show";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "./ui/separator";

const fonts = [
  {
    name: "Literata",
    value: "literata",
    className: literata.className,
    description: "Serif - Reading focused",
  },
  {
    name: "Inter",
    value: "inter",
    className: inter.className,
    description: "Sans-serif - Modern & clean",
  },
  {
    name: "Poppins",
    value: "poppins",
    className: poppins.className,
    description: "Sans-serif - Modern",
  },
  {
    name: "JetBrains Mono",
    value: "jetbrains-mono",
    className: jetbrainsMono.className,
    description: "Monospace - Code friendly",
  },
  {
    name: "Geist Mono",
    value: "geist-mono",
    className: geist.className,
    description: "Monospace - Code friendly",
  },
] as const;

export function FontSwitcher() {
  const { state, updateUI } = useAppContext();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentFont = state.ui?.font || "literata";
  const selectedFont = fonts.find((font) => font.value === currentFont);

  if (!mounted) {
    // ✅ render tombol kosong biar gak mismatch
    return (
      <Button variant="outline" size="sm" className="text-xs" disabled>
        <Type className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-fit p-2 text-xs bg-transparent! hover:bg-transparent">
          <Type className="h-2 w-2" />
          <div className="hidden lg:flex">
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            {selectedFont?.name}
          </div>
          <span className="sr-only">Switch font</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {fonts.map((font) => (
          <DropdownMenuItem
            key={font.value}
            onClick={() => updateUI?.({ font: font.value })}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className={`font-medium ${font.className}`}>{font.name}</span>
              <span className="text-xs text-muted-foreground">{font.description}</span>
            </div>
            {currentFont === font.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
