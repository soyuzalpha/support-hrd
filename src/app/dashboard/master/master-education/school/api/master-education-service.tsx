import { apiGet, apiPost, apiPut } from "@/service/service";

export const getMasterEducation = async (params) => {
  const res = await apiGet("/getSchools", {
    params: { ...params },
  });

  return res;
};

export const createMasterEducation = async (payload) => {
  const res = await apiPost("/createSchool", payload);

  return res;
};

export const updateMasterEducation = async (payload) => {
  const res = await apiPut("/updateSchool", payload);

  return res;
};

export const deleteMasterEducation = async (payload) => {
  const res = await apiPut("/deleteSchool", payload);

  return res;
};

export const restoreMasterEducation = async (payload) => {
  const res = await apiPut("/activateSchool", payload);

  return res;
};
