"use client";

import "../globals.css";
import { geist, inter, jetbrainsMono, literata, poppins } from "@/lib/fonts";
import React from "react";
import { DockMenu } from "@/components/DockMenu";
import { useAppContext, useUser } from "@/context/app-context";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { useMutation } from "@tanstack/react-query";
import { getUserById } from "./master/master-user/api/master-position-service";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { state } = useAppContext();
  const currentFont = state.ui?.font || "poppins";
  const { user, updateUser } = useUser();

  const mutationGetUser = useMutation({
    mutationFn: getUserById,
  });

  React.useEffect(() => {
    mutationGetUser.mutate(user.id_user, {
      onSuccess: (res) => {
        updateUser({
          ...user,
          userDatas: res?.data,
        });
      },
      onError: (err) => {
        console.log({ err });
      },
    });
  }, []);

  React.useEffect(() => {
    const map = {
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
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar transparent />

        <main className="flex-1">
          <div className="container mx-auto pt-20 mb-20">{children}</div>
        </main>

        <DockMenu />
      </div>
    </>
  );
}
