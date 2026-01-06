"use client";

import type React from "react";
import { createContext, useContext, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLocalStorage } from "@/hooks/use-local-storage";

// Define the shape of your app state (removed theme from user preferences)
export interface AppState {
  user: {
    token: string | null;
    id: string | null;
    name: string | null;
    email: string | null;
    id_division: string | null;
    id_position: string | null;
    id_role: string | null;
    id_user: string | null;
    preferences: {
      language: string;
      notifications: boolean;
      timezone: string;
      dateFormat: string;
    };
    userDatas?: any;
    employee_datas?: any;
  };
  ui?: {
    sidebarCollapsed?: boolean; // 👈 kasih tanda tanya semua
    activeTab?: string;
    recentItems?: string[];
    layout?: "grid" | "list";
    density?: "compact" | "comfortable" | "spacious";
    font?: "literata" | "poppins" | "jetbrains-mono" | "inter" | "geist-mono";
    background: string;
  };
  settings?: {
    autoSave: boolean;
    showTutorial: boolean;
    lastLoginDate: string | null;
    soundEnabled: boolean;
    animationsEnabled: boolean;
  };
}

const defaultAppState: AppState = {
  user: {
    token: null,
    id: null,
    name: null,
    email: null,
    id_division: null,
    id_position: null,
    id_role: null,
    id_user: null,
    preferences: {
      language: "en",
      notifications: true,
      timezone: "UTC",
      dateFormat: "YYYY/MM/DD",
    },
  },
  ui: {
    sidebarCollapsed: false,
    activeTab: "dashboard",
    recentItems: [],
    layout: "grid",
    density: "comfortable",
    font: "poppins", // 👈 kasih default font
    background: "silk",
  },
  settings: {
    autoSave: true,
    showTutorial: true,
    lastLoginDate: null,
    soundEnabled: true,
    animationsEnabled: true,
  },
};

// Context type
interface AppContextType {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  updateUser: (updates: Partial<AppState["user"]>) => void;
  updateUI?: (updates: Partial<AppState["ui"]>) => void;
  updateSettings?: (updates: Partial<AppState["settings"]>) => void;
  clearState: () => void;
  resetToDefaults: () => void;
  // Theme-related methods using next-themes
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  themes: string[];
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState, clearState] = useLocalStorage("app-state", defaultAppState, "localStorage");

  // Use next-themes hook
  const { theme, setTheme, resolvedTheme, themes } = useTheme();

  // Update entire state
  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Update user data
  const updateUser = (updates: Partial<AppState["user"]>) => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...updates,
        preferences: {
          ...prev.user.preferences,
          ...(updates.preferences || {}),
        },
      },
    }));
  };

  // Update UI state
  const updateUI = (updates: Partial<AppState["ui"]>) => {
    setState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        ...updates,
        background: updates?.background ?? "silk",
      },
    }));
  };

  // Update settings
  // const updateSettings = (updates: Partial<AppState["settings"]>) => {
  //   setState((prev) => ({
  //     ...prev,
  //     settings: {
  //       ...prev.settings,
  //       ...updates,
  //     },
  //   }));
  // };

  // Reset to defaults
  const resetToDefaults = () => {
    setState(defaultAppState);
  };

  // Auto-save last activity
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateSettings({ lastLoginDate: new Date().toISOString() });
  //   }, 60000); // Update every minute

  //   return () => clearInterval(interval);
  // }, []);

  const contextValue: AppContextType = {
    state,
    updateState,
    updateUser,
    updateUI,
    // updateSettings,
    clearState,
    resetToDefaults,
    // next-themes integration
    theme,
    setTheme,
    resolvedTheme,
    themes,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// Hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// Specific hooks for different parts of the state
export function useUser() {
  const { state, updateUser } = useAppContext();
  return {
    user: state.user,
    updateUser,
  };
}

export function useUI() {
  const { state, updateUI } = useAppContext();
  return {
    ui: state.ui,
    updateUI,
  };
}

export function useSettings() {
  const { state, updateSettings } = useAppContext();
  return {
    settings: state.settings,
    updateSettings,
  };
}

// Theme hook that uses next-themes
export function useAppTheme() {
  const { theme, setTheme, resolvedTheme, themes } = useAppContext();
  return {
    theme,
    setTheme,
    resolvedTheme,
    themes,
  };
}
