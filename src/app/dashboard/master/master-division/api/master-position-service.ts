import { apiGet, apiPost, apiPut } from "@/service/service";

export const createDivisions = async (payload) => {
  const res = await apiPost("/createDivisions", payload);

  return res;
};

export const updateDivision = async (payload) => {
  const res = await apiPut("/updateDivision", payload);

  return res;
};

export const getDivisions = async (params) => {
  const res = await apiGet("/getDivisions", {
    params: { ...params },
  });

  return res;
};

export const activateDivision = async (payload) => {
  const res = await apiPut("/activateDivision", payload);

  return res;
};

export const deleteDivision = async (payload) => {
  const res = await apiPut("/deleteDivision", payload);

  return res;
};
