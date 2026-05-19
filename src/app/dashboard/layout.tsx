"use client";

import React from "react";
import { DockMenu } from "@/components/DockMenu";
import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Navbar transparent />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto pt-24 mb-24">{children}</div>
      </main>

      <DockMenu />
    </div>
  );
}
