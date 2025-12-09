"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { menuItems, roleAccess } from "@/utils/menu";
import { LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/app-context";
import { logoutService, setLogoutCallback } from "@/service/service";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { toastAlert } from "@/lib/toast";
import { isEmpty } from "@/utils";

export function DockMenu({ onItemClick }: { onItemClick?: (item: string) => void }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();
  const path = usePathname();
  const { updateUser, user } = useUser();

  useEffect(() => {
    setIsReady(true);
  }, []);

  const role = user?.userDatas?.position.name_position ?? "staff";
  const allowedMenu =
    roleAccess[role] === "all" ? menuItems : menuItems.filter((menu) => roleAccess[role]?.includes(menu.id));

  // ⛔ FIX: Prevent SSR mismatch
  if (!isReady) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center items-end pb-4 pointer-events-none">
      <div
        className={cn(
          "flex items-center gap-4 px-5 py-3 rounded-full pointer-events-auto",
          "backdrop-blur-2xl border border-white/10 bg-white/10 shadow-lg"
        )}
      >
        {/* Menu */}
        <div className="flex items-center gap-4">
          {!isEmpty(allowedMenu) &&
            allowedMenu.map((item) => {
              const Icon = item.icon;
              const isActive = path === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onItemClick?.(item.id);
                    router.push(item.path);
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative p-2 group transition-all"
                  aria-label={item.label}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className={cn(
                      "text-white transition-all",
                      isActive
                        ? "opacity-100 scale-110"
                        : hoveredItem === item.id
                        ? "opacity-90 scale-105"
                        : "opacity-70"
                    )}
                  />

                  {isActive && (
                    <span className="absolute bottom-0 translate-y-[5px] w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
        </div>

        {/* <div className="w-px h-8 bg-white/20" /> */}

        {/* Logout */}
        {/* <button
          onClick={() => {
            onItemClick?.("logout");
            handleSignOut();
          }}
          onMouseEnter={() => setHoveredItem("logout")}
          onMouseLeave={() => setHoveredItem(null)}
          className="p-2 group"
        >
          <LogOut
            size={22}
            strokeWidth={1.5}
            className={cn(
              "text-white transition-all",
              hoveredItem === "logout" ? "opacity-90 scale-105" : "opacity-70"
            )}
          />
        </button> */}
      </div>
    </div>
  );
}
