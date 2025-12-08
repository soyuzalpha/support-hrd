import { apiGet, apiPost, apiPut } from "@/service/service";

export const getMasterEducation = async (params) => {
  const res = await apiGet("/getDegrees", {
    params: { ...params },
  });

  return res;
};

export const createMasterEducation = async (payload) => {
  const res = await apiPost("/createDegree", payload);

  return res;
};

export const updateMasterEducation = async (payload) => {
  const res = await apiPut("/updateDegree", payload);

  return res;
};

export const deleteMasterEducation = async (payload) => {
  const res = await apiPut("/deleteDegree", payload);

  return res;
};

export const restoreMasterEducation = async (payload) => {
  const res = await apiPut("/activateDegree", payload);

  return res;
};
