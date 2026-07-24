import { apiGet, apiPost, apiPut } from "@/service/service";

export const createCity = async (payload) => {
  const res = await apiPost("/createCity", payload);

  return res;
};

export const updateCity = async (payload) => {
  const res = await apiPut("/updateCity", payload);

  return res;
};

export const getCities = async (params) => {
  const res = await apiGet("/getCities", {
    params: { ...params },
  });

  return res;
};

export const getCityById = async (params) => {
  const res = await apiGet("/getCityById", {
    params: { ...params },
  });

  return res;
};

export const activateCity = async (payload) => {
  const res = await apiPut("/activateCity", payload);

  return res;
};

export const deleteCity = async (payload) => {
  const res = await apiPut("/deleteCity", payload);

  return res;
};
