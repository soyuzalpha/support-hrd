"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUser } from "@/app/dashboard/master/master-user/api/master-position-service";
import { useMutation } from "@tanstack/react-query";
import { logoutService, setLogoutCallback } from "@/service/service";
import { signOut } from "next-auth/react";
import { toastAlert } from "@/lib/toast";
import { FontSwitcher } from "./font-switcher";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  transparent?: boolean;
}

export function Navbar({ transparent = true, className, ...props }: NavbarProps) {
  const session = useSession();

  const userInitials =
    session?.data?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const userEmail = session?.data?.user?.email || "-";
  const userName = session?.data?.user?.name
    ? session.data.user.name.charAt(0).toUpperCase() + session.data.user.name.slice(1)
    : "User";

  React.useEffect(() => {
    setLogoutCallback(() => {
      updateUser({});
    });
  }, [updateUser]);

  const mutation = useMutation({ mutationFn: logoutService });

  const handleSignOut = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        updateUser({});
        signOut({ callbackUrl: "/login" });
        toastAlert.success("Berhasil Logout");
      },
      onError: () => toastAlert.error("Logout gagal, silahkan coba lagi"),
    });
  };

  return (
    <header className={cn("sticky top-0 z-5 transition-all w-full mt-4", className)} {...props}>
      <div
        className={cn(
          "container mx-auto flex items-center justify-between px-4 py-3 backdrop-blur-2xl border-white/10 duration-300 rounded-full",
          transparent
            ? "bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            : "bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.08)]"
        )}
      >
        <Link href={"/dashboard"} className="flex items-center gap-2">
          <Image src={"/logo.svg"} width={100} height={100} className="w-12 flex" alt="logo" loading="lazy" />
          <h1 className="text-xl font-medium">Transtama</h1>
        </Link>

        <div className="flex items-center gap-3">
          <FontSwitcher />

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="bg-transparent! cursor-pointer">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={session?.data?.user?.image || undefined} alt={userName} />
                  <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="">
                <DropdownMenuLabel className="flex items-center gap-3 pb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session?.data?.user?.image || undefined} alt={userName} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                {/* <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Help & Support</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    handleSignOut();
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
