"use client";
import { useEffect, useState } from "react";

export function useScreenHeight() {
  const [height, setHeight] = useState<number>(typeof window !== "undefined" ? window.innerHeight : 0);

  useEffect(() => {
    function handleResize() {
      setHeight(window.innerHeight);
    }

    window.addEventListener("resize", handleResize);

    // In case SSR mismatch
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return height;
}
