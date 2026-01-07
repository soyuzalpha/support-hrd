import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";
import { apiGet } from "@/service/service";

export type Menu = {
  id_menu_user: number;
  id_position: number;
  position_name: string;
  id_division: number;
  division_name: string;
  id_listmenu: number;
  name: string;
  icon: string;
  path: string;
  status: number;
  created_at: string;
  updated_at: string;
  can_create: number;
  can_read: number;
  can_update: number;
  can_delete: number;
  can_approve: number;
  can_reject: number;
  can_print: number;
  can_export: number;
  can_import: number;
};

export type MenuResponse = {
  status: boolean;
  message: string;
  data: Menu[];
};

export const useMenus = () => {
  const [userSession] = useLocalStorage<any>("app-state", {});

  const position = userSession?.user?.id_position;
  const division = userSession?.user?.id_division;

  const isReady = !!position && !!division;

  return useQuery({
    queryKey: ["menus-user", position, division],
    queryFn: () => {
      // getMenusUser({ id_position: position, id_division: division });
    },
    enabled: isReady,
  });
};

export const getMenusUser = async ({
  id_position,
  id_division,
}: {
  id_position?: number;
  id_division?: number;
}): Promise<MenuResponse[]> => {
  const response = await apiGet(`/getMenuUser?id_position=${id_position}&id_division=${id_division}&limit=100`);
  return response.data;
};
