"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FontSwitcher } from "./font-switcher";
import { ColorSchemaToggle } from "./color-schema-toggle";
import Link from "next/link";
import { useUser } from "@/context/app-context";
import { toCapitalized } from "@/utils";
import { useSession } from "next-auth/react";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  transparent?: boolean;
}

export function Navbar({ transparent = true, className, ...props }: NavbarProps) {
  const { user } = useUser();
  const session = useSession();

  return (
    <header className={cn("sticky top-0 z-5 transition-all w-full mt-4", className)} {...props}>
      <div
        className={cn(
          "container mx-auto flex items-center justify-between px-4 py-1 backdrop-blur-2xl border-white/10 duration-300 rounded-full",
          transparent
            ? "bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            : "bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.08)]"
        )}
      >
        <Link href={"/dashboard"} className="flex items-center gap-2">
          <Image src={"/logo.svg"} width={100} height={100} className="w-12 flex" alt="logo" loading="lazy" />
          <h1 className="text-xl font-medium">Transtama</h1>
        </Link>

        <div className="flex flex-col lg:flex-row items-center gap-3">
          <FontSwitcher />
          <div>
            <h1 className="">{toCapitalized(session?.data?.user?.name) ?? "-"}</h1>
          </div>

          {/* <ColorSchemaToggle /> */}
        </div>
      </div>
    </header>
  );
}
