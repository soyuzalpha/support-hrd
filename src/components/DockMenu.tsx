"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { menuItems, roleAccess } from "@/utils/menu";
import { LogOut, Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/app-context";
import { logoutService, setLogoutCallback } from "@/service/service";
import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { toastAlert } from "@/lib/toast";
import { isEmpty } from "@/utils";

interface DockMenuProps {
  // activeItem?: string;
  onItemClick?: (item: string) => void;
}

export function DockMenu({ onItemClick }: DockMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useRouter();
  const path = usePathname();

  const session = useSession();
  const { updateUser, user } = useUser();

  const role = user?.userDatas?.position.name_position ?? "staff"; // fallback biar aman

  const allowedMenu =
    roleAccess[role] === "all" ? menuItems : menuItems.filter((menu) => roleAccess[role]?.includes(menu.id));

  // Set up the logout callback for 401 auto-logout
  React.useEffect(() => {
    const logout401Callback = () => {
      updateUser({
        token: null,
        id: null,
        name: null,
        id_division: null,
        id_position: null,
        id_role: null,
        id_user: null,
        email: null,
        preferences: {
          language: "en",
          notifications: false,
          timezone: "UTC",
          dateFormat: "YYYY/MM/DD",
        },
        userDatas: null,
      });
    };

    setLogoutCallback(logout401Callback);
  }, [updateUser]);

  const mutation = useMutation({
    mutationFn: logoutService,
  });

  const handleSignOut = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        updateUser({
          token: null,
          id: null,
          name: null,
          id_division: null,
          id_position: null,
          id_role: null,
          id_user: null,
          email: null,
          preferences: {
            language: "en",
            notifications: false,
            timezone: "UTC",
            dateFormat: "YYYY/MM/DD",
          },
        });

        signOut({ callbackUrl: "/login" });
        toastAlert.success("Berhasil Logout");
      },
      onError: () => {
        toastAlert.error("Logout gagal, silahkan coba lagi");
      },
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center items-end pb-4 md:pb-5 pointer-events-none">
      <div
        className={cn(
          "flex items-center gap-3 md:gap-4 px-4 py-2.5 md:px-5 md:py-3 rounded-full pointer-events-auto",
          "backdrop-blur-2xl border border-white/10 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        )}
      >
        <div className="flex items-center gap-3 md:gap-4">
          {isEmpty(allowedMenu) ? null : (
            <>
              {allowedMenu?.map((item, index) => {
                const Icon = item.icon;
                const isActive = path === item.path;
                const isHovered = hoveredItem === item.id;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      onItemClick?.(item?.id);
                      navigate.push(item.path);
                    }}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      "relative flex flex-col items-center justify-center transition-all duration-200 group p-2 md:p-2.5",
                      "bg-transparent"
                    )}
                    aria-label={item.label}
                    title={item.label}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className={cn(
                        "text-white transition-all duration-200",
                        isActive ? "opacity-100 scale-110" : isHovered ? "opacity-90 scale-105" : "opacity-70"
                      )}
                    />

                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="absolute bottom-0 translate-y-[5px] w-1.5 h-1.5 rounded-full bg-white" />
                    )}

                    {/* Tooltip */}
                    <span
                      className={cn(
                        "absolute bottom-full mb-2 px-2 py-1 rounded-md text-xs font-medium",
                        "whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200",
                        "bg-white/20 text-white backdrop-blur-md border border-white/10",
                        "group-hover:opacity-100 hidden md:block"
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 md:h-8 bg-white/20 mx-2" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => onItemClick?.("create")}
            onMouseEnter={() => setHoveredItem("create")}
            onMouseLeave={() => setHoveredItem(null)}
            className="relative flex flex-col items-center justify-center p-2 md:p-2.5 bg-transparent group transition-all"
          >
            <Plus
              size={22}
              strokeWidth={1.5}
              className={cn(
                "text-white transition-all duration-200",
                hoveredItem === "create" ? "opacity-90 scale-105" : "opacity-70"
              )}
            />
          </button> */}

          <button
            onClick={() => {
              onItemClick?.("logout");
              handleSignOut();
            }}
            onMouseEnter={() => setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
            className="relative flex flex-col items-center justify-center p-2 md:p-2.5 bg-transparent group transition-all"
          >
            <LogOut
              size={22}
              strokeWidth={1.5}
              className={cn(
                "text-white transition-all duration-200",
                hoveredItem === "logout" ? "opacity-90 scale-105" : "opacity-70"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
