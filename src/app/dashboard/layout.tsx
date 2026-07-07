"use client";

import React from "react";
import { DockMenu } from "@/components/DockMenu";
import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />

      <main>
        <div className="container mx-auto pt-24 mb-24">{children}</div>
      </main>

      <DockMenu />
    </>
  );
}
