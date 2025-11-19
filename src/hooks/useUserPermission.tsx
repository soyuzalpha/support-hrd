import { useState, useEffect } from "react";
import { useMenus } from "./use-menus";
import { usePathname } from "next/navigation";

// Permissions interface
export interface Permissions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReject: boolean;
  canPrint: boolean;
  canExport: boolean;
  canImport: boolean;
  hasAccess: boolean;
  isLoading: boolean;
  menuData: any | null;
}

interface UsePermissionsOptions {
  exactMatch?: boolean;
  customPath?: string;
}

export const usePermissions = (options: UsePermissionsOptions = {}): Permissions => {
  const { exactMatch = false, customPath } = options;
  const pathname = usePathname();
  const { data: menuData, isLoading: menuLoading, error } = useMenus();

  const [permissions, setPermissions] = useState<Permissions>({
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canApprove: false,
    canReject: false,
    canPrint: false,
    canExport: false,
    canImport: false,
    hasAccess: false,
    isLoading: true,
    menuData: null,
  });

  // Function to normalize paths for comparison
  const normalizePath = (path: string): string => {
    return path?.toLowerCase()?.replace(/\/$/, ""); // Remove trailing slash and convert to lowercase
  };

  // Function to check if paths match
  const pathMatches = (menuPath: string, currentPath: string): boolean => {
    const normalizedMenuPath = normalizePath(menuPath);
    const normalizedCurrentPath = normalizePath(currentPath);

    if (exactMatch) {
      return normalizedMenuPath === normalizedCurrentPath;
    } else {
      // For nested routes, check if the current path starts with the menu path
      // or if the menu path is contained in the current path
      return normalizedCurrentPath.includes(normalizedMenuPath) || normalizedCurrentPath.startsWith(normalizedMenuPath);
    }
  };

  useEffect(() => {
    // If still loading menu data, keep loading state
    if (menuLoading) {
      setPermissions((prev) => ({ ...prev, isLoading: true }));
      return;
    }

    // If there's an error or no data, set no permissions
    //@ts-ignore
    if (error || !menuData?.data) {
      setPermissions({
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
        canApprove: false,
        canReject: false,
        canPrint: false,
        canExport: false,
        canImport: false,
        hasAccess: false,
        isLoading: false,
        menuData: null,
      });
      return;
    }

    // Use custom path or current pathname
    const pathToCheck = customPath || pathname;

    // Find matching menu item based on path
    //@ts-ignore
    const matchingMenu = menuData.data.find((menu: any) => {
      // Skip menus with # path (parent menus)
      if (menu.path === "#") return false;

      return pathMatches(menu.path, pathToCheck);
    });

    if (matchingMenu) {
      setPermissions({
        canCreate: Boolean(matchingMenu.can_create),
        canRead: Boolean(matchingMenu.can_read),
        canUpdate: Boolean(matchingMenu.can_update),
        canDelete: Boolean(matchingMenu.can_delete),
        canApprove: Boolean(matchingMenu.can_approve),
        canReject: Boolean(matchingMenu.can_reject),
        canPrint: Boolean(matchingMenu.can_print),
        canExport: Boolean(matchingMenu.can_export),
        canImport: Boolean(matchingMenu.can_import),
        hasAccess: Boolean(matchingMenu.status && matchingMenu.can_read),
        isLoading: false,
        menuData: matchingMenu,
      });
    } else {
      // No matching menu found - no permissions
      setPermissions({
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
        canApprove: false,
        canReject: false,
        canPrint: false,
        canExport: false,
        canImport: false,
        hasAccess: false,
        isLoading: false,
        menuData: null,
      });
    }
  }, [menuData, menuLoading, error, pathname, customPath, exactMatch]);

  return permissions;
};

// Utility hook for checking specific permission on any path
export const usePermissionForPath = (path: string, exactMatch = false): Permissions => {
  return usePermissions({ customPath: path, exactMatch });
};

// Utility hook for checking if user has any of the specified permissions
export const useHasAnyPermission = (
  requiredPermissions: (keyof Omit<Permissions, "hasAccess" | "isLoading" | "menuData">)[]
): boolean => {
  const permissions = usePermissions();

  return requiredPermissions.some((permission) => permissions[permission]);
};

// Utility hook for checking if user has all specified permissions
export const useHasAllPermissions = (
  requiredPermissions: (keyof Omit<Permissions, "hasAccess" | "isLoading" | "menuData">)[]
): boolean => {
  const permissions = usePermissions();

  return requiredPermissions.every((permission) => permissions[permission]);
};
