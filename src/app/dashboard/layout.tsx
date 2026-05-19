"use client";

import React from "react";
import { DockMenu } from "@/components/DockMenu";
import { useAppContext, useUser } from "@/context/app-context";
import { Navbar } from "@/components/Navbar";
import { useMutation } from "@tanstack/react-query";
import { getUserById } from "./master/master-user/api/master-position-service";
import { SettingsProvider } from "@/context/settings-context";

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

  return (
    <>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar transparent />

        <main className="flex-1">
          <div className="max-w-5xl mx-auto pt-24 mb-24">{children}</div>
        </main>

        <DockMenu />
      </div>
    </>
  );
}
