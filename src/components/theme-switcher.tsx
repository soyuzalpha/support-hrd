"use client";

import { useTheme } from "@/context/app-theme-context";
import { Check, Moon, Palette, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { baseTheme, setBaseTheme, colorTheme, setColorTheme, availableThemes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs" className="rounded-md">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Base Theme</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setBaseTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {baseTheme === "light" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setBaseTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {baseTheme === "dark" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setBaseTheme("system")}>
          <span>System</span>
          {baseTheme === "system" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setColorTheme("default")}>
          <span>Default</span>
          {colorTheme === "default" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        {availableThemes.map((theme) => (
          <DropdownMenuItem key={theme.name} onClick={() => setColorTheme(theme.name)} className="flex items-center">
            <div
              className="mr-2 h-4 w-4 rounded-full border"
              style={{
                backgroundColor: `rgb(${theme.colors["--card"]})`,
                borderColor: `rgb(${theme.colors["--border"]})`,
              }}
            />
            <span>{theme.label}</span>
            {colorTheme === theme.name && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
