import { apiGet, apiPost, apiPut } from "@/service/service";

export const createProvince = async (payload) => {
  const res = await apiPost("/createProvince", payload);

  return res;
};

export const updateProvince = async (payload) => {
  const res = await apiPut("/updateProvince", payload);

  return res;
};

export const getProvinces = async (params) => {
  const res = await apiGet("/getProvinces", {
    params: { ...params },
  });

  return res;
};

export const getProvinceById = async (params) => {
  const res = await apiGet("/getProvinceById", {
    params: { ...params },
  });

  return res;
};

export const activateProvince = async (payload) => {
  const res = await apiPut("/activateProvince", payload);

  return res;
};

export const deleteProvince = async (payload) => {
  const res = await apiPut("/deleteProvince", payload);

  return res;
};
