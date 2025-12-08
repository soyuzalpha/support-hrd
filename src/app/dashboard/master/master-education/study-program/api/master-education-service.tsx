import { apiGet, apiPost, apiPut } from "@/service/service";

export const getMasterEducation = async (params) => {
  const res = await apiGet("/getStudyprograms", {
    params: { ...params },
  });

  return res;
};

export const createMasterEducation = async (payload) => {
  const res = await apiPost("/createStudyprogram", payload);

  return res;
};

export const updateMasterEducation = async (payload) => {
  const res = await apiPut("/updateStudyprogram", payload);

  return res;
};

export const deleteMasterEducation = async (payload) => {
  const res = await apiPut("/deleteStudyprogram", payload);

  return res;
};

export const restoreMasterEducation = async (payload) => {
  const res = await apiPut("/activateStudyprogram", payload);

  return res;
};
