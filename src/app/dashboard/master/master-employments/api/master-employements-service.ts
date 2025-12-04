import { apiGet, apiPost, apiPut } from "@/service/service";

export const createEmployment = async (payload) => {
  const res = await apiPost("/createEmployment", payload);

  return res;
};

export const updateEmployment = async (payload) => {
  const res = await apiPut("/updateEmployment", payload);

  return res;
};

export const getEmployments = async (params) => {
  const res = await apiGet("/getEmployments", {
    params: { ...params },
  });

  return res;
};

export const getEmploymentById = async (id: any) => {
  const response = await apiGet(`/getEmploymentById`, {
    params: {
      id_employment: id,
    },
  });
  return response;
};
export const getEmploymentByUser = async (id: any) => {
  const response = await apiGet(`/getEmploymentByUser`, {
    params: {
      id_user: id,
    },
  });
  return response;
};

export const activateEmployment = async (payload) => {
  const res = await apiPut("/activateEmployment", payload);

  return res;
};

export const deleteEmployment = async (payload) => {
  const res = await apiPut("/deleteEmployment", payload);

  return res;
};
