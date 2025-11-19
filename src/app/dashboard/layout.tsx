"use client";

import "../globals.css";
import Head from "../head";
import { geist, inter, jetbrainsMono, literata, poppins } from "@/lib/fonts";
import React from "react";
import { DockMenu } from "@/components/DockMenu";
import { useAppContext } from "@/context/app-context";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { state } = useAppContext();
  const currentFont = state.ui?.font || "poppins";

  React.useEffect(() => {
    const map: Record<string, string> = {
      literata: literata.className,
      inter: inter.className,
      poppins: poppins.className,
      geist: geist.className,
      "jetbrains-mono": jetbrainsMono.className,
    };

    document.body.classList.remove(
      literata.className,
      poppins.className,
      jetbrainsMono.className,
      inter.className,
      geist.className
    );
    document.body.classList.add(map[currentFont]);
  }, [currentFont]);

  return (
    <>
      <div className={`antialiased ${poppins.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />

            <div className="flex-1 overflow-hidden">
              <div className="h-[calc(100vh-5rem)] overflow-y-auto px-2 pt-2 pb-4">{children}</div>
            </div>

            <DockMenu />
          </div>
        </ThemeProvider>
      </div>
    </>
  );
}
