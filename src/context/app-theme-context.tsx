"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { getTheme, themes, type ThemeColors } from "@/lib/themes";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
// import { usePersistentState } from "@/hooks/use-persistance";

type BaseTheme = "light" | "dark" | "system";

interface ThemeContextType {
  baseTheme: BaseTheme;
  setBaseTheme: (theme: BaseTheme) => void;
  actualTheme: "light" | "dark"; // The actual theme being applied
  colorTheme: string;
  setColorTheme: (theme: string) => void;
  availableThemes: ThemeColors[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [baseTheme, setBaseTheme] = useLocalStorage<BaseTheme>("base-theme", "system", "localStorage");
  const [colorTheme, setColorTheme] = useLocalStorage<string>("color-theme", "default", "localStorage");
  const [availableThemes] = useState<ThemeColors[]>(themes);

  // Get the actual theme based on system preference
  const getActualTheme = (): "light" | "dark" => {
    if (baseTheme === "system") {
      return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return baseTheme;
  };

  const actualTheme = getActualTheme();

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(actualTheme);
  }, [actualTheme]);

  // Apply color theme
  useEffect(() => {
    // Clean up any existing theme first
    const cleanupPreviousTheme = () => {
      // Get all CSS variables that might be set by themes
      const cssVars = [
        "--background", "--foreground", "--card", "--card-foreground",
        "--popover", "--popover-foreground", "--primary", "--primary-foreground",
        "--secondary", "--secondary-foreground", "--muted", "--muted-foreground",
        "--accent", "--accent-foreground", "--destructive", "--destructive-foreground",
        "--border", "--input", "--ring", "--sidebar", "--sidebar-foreground",
        "--sidebar-primary", "--sidebar-primary-foreground", "--sidebar-accent",
        "--sidebar-accent-foreground", "--sidebar-border", "--sidebar-ring",
        "--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"
      ];
      
      // Remove all theme-related CSS variables
      cssVars.forEach(property => {
        document.documentElement.style.removeProperty(property);
      });
    };
    
    cleanupPreviousTheme();
    
    if (colorTheme === "default") return;
    
    // Get the appropriate theme based on the current color theme and actual theme
    const themeToApply = colorTheme.includes('-') 
      ? colorTheme // If theme already has base (like nord-dark)
      : `${colorTheme}-${actualTheme}`; // Combine theme with current base
    
    const selectedTheme = getTheme(themeToApply) || getTheme(colorTheme);
    if (!selectedTheme) return;
    
    // Apply CSS variables
    Object.entries(selectedTheme.colors).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    
    return cleanupPreviousTheme;
  }, [colorTheme, actualTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (baseTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(getActualTheme());
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [baseTheme]);

  return (
    <ThemeContext.Provider 
      value={{ 
        baseTheme, 
        setBaseTheme, 
        actualTheme, 
        colorTheme, 
        setColorTheme,
        availableThemes
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
