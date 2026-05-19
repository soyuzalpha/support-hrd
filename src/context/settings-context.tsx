"use client";

import { fonts } from "@/lib/fonts";
import React, { createContext, useContext, useEffect, useState } from "react";

/* ─── types ──────────────────────────────────────────────── */
export type AppSettings = {
  fontFamily: string;
  fontSize: number;
  fontWeight: "300" | "400" | "500" | "600" | "700";
  letterSpacing: number;
  lineHeight: "tight" | "normal" | "relaxed";
  spacing: "compact" | "normal" | "comfortable";
  radius: number;
  displayDataMode: "table" | "card";
};

type SettingsContextType = {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
};

/* ─── defaults ───────────────────────────────────────────── */
const defaultSettings: AppSettings = {
  fontFamily: "poppins",
  fontSize: 14,
  fontWeight: "400",
  letterSpacing: 0,
  lineHeight: "normal",
  spacing: "normal",
  radius: 8,
  displayDataMode: "table",
};

/* ─── line-height map ────────────────────────────────────── */
const lineHeightMap: Record<AppSettings["lineHeight"], string> = {
  tight: "1.25",
  normal: "1.5",
  relaxed: "1.75",
};

/* ─── context ────────────────────────────────────────────── */
const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ Always start with defaultSettings so SSR and the initial client
  //    render produce identical HTML — no hydration mismatch.
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // ✅ Hydrate from localStorage only after the component has mounted.
  //    This runs exclusively on the client, after React has finished
  //    reconciling the server-rendered HTML.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("app-settings");
      if (!stored) return;

      const parsed = { ...defaultSettings, ...JSON.parse(stored) };

      // defer update supaya React gak anggap cascading render
      queueMicrotask(() => {
        setSettings(parsed);
      });
    } catch {}
  }, []);

  /* ── sync to localStorage + DOM on every settings change ── */
  useEffect(() => {
    localStorage.setItem("app-settings", JSON.stringify(settings));

    const root = document.documentElement;

    root.style.setProperty("--app-font-size", `${settings.fontSize}px`);
    root.style.setProperty("--app-font-weight", settings.fontWeight);
    root.style.setProperty("--app-letter-spacing", `${settings.letterSpacing}em`);
    root.style.setProperty("--app-line-height", lineHeightMap[settings.lineHeight]);
    root.style.setProperty("--app-radius", `${settings.radius}px`);

    root.setAttribute("data-font", settings.fontFamily);
    root.setAttribute("data-spacing", settings.spacing);
    root.setAttribute("data-display", settings.displayDataMode);

    root.classList.remove(...fonts.map((f) => f.font.className));
    root.classList.add(settings.fontFamily);
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => setSettings((prev) => ({ ...prev, ...newSettings }));

  const resetSettings = () => setSettings(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>{children}</SettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used inside SettingsProvider");
  return ctx;
};
