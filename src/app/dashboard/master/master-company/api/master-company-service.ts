import { apiGet, apiPost, apiPut } from "@/service/service";

export const createCompany = async (payload) => {
  const res = await apiPost("/createCompany", payload);

  return res;
};

export const updateCompany = async (payload) => {
  const res = await apiPut("/updateCompany", payload);

  return res;
};

export const getCompany = async (params) => {
  const res = await apiGet("/getCompany", {
    params: { ...params },
  });

  return res;
};

export const activateCompany = async (payload) => {
  const res = await apiPut("/activateCompany", payload);

  return res;
};

export const deleteCompany = async (payload) => {
  const res = await apiPut("/deleteCompany", payload);

  return res;
};
