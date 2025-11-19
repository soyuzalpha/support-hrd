import { apiGet, apiPost, apiPut } from "@/service/service";

export const createPositions = async (payload) => {
  const res = await apiPost("/createPositions", payload);

  return res;
};

export const updatePosition = async (payload) => {
  const res = await apiPut("/updatePosition", payload);

  return res;
};

export const getPositions = async (params) => {
  const res = await apiGet("/getPositions", {
    params: { ...params },
  });

  return res;
};

export const activatePosition = async (payload) => {
  const res = await apiPut("/activatePosition", payload);

  return res;
};

export const deletePosition = async (payload) => {
  const res = await apiPut("/deletePosition", payload);

  return res;
};
