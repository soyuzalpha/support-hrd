import { apiGet, apiPost, apiPut } from "@/service/service";

export const createTypeleave = async (payload) => {
  const res = await apiPost("/createTypeleave", payload);

  return res;
};

export const updateTypeleave = async (payload) => {
  const res = await apiPut("/updateTypeleave", payload);

  return res;
};

export const getTypeleaves = async (params) => {
  const res = await apiGet("/getTypeleaves", {
    params: { ...params },
  });

  return res;
};
export const getTypeLeaveById = async (id: any) => {
  const response = await apiGet(`/getTypeleaveById`, {
    params: {
      id_typeleave: id,
    },
  });
  return response;
};

export const activateTypeleave = async (payload) => {
  const res = await apiPut("/activateTypeleave", payload);

  return res;
};

export const deleteTypeleave = async (payload) => {
  const res = await apiPut("/deleteTypeleave", payload);

  return res;
};
