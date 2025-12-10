"use client";

import { useUI } from "@/context/app-context";

export function useBackground() {
  const { ui, updateUI } = useUI();

  // Set solid background from schema color
  const setSolidFromSchema = (hexColor: string) => {
    // Kalau animated → paksa hilang
    //@ts-ignore
    updateUI({ background: hexColor });
  };

  // Set animated bg (silk, beams, colorbends)
  const setAnimatedBackground = (key: string) => {
    //@ts-ignore
    updateUI({ background: key });
  };

  const isAnimated = ui?.background === "silk" || ui?.background === "beams" || ui?.background === "colorbends";

  return {
    background: ui?.background,
    isAnimated,
    setSolidFromSchema,
    setAnimatedBackground,
  };
}
