import { apiGet, apiPost, apiPut } from "@/service/service";

export const createEmployeeWarning = async (payload) => {
  const res = await apiPost("/createEmployeeWarning", payload);

  return res;
};

export const updateEmployeeWarning = async (payload) => {
  const res = await apiPut("/updateEmployeeWarning", payload);

  return res;
};

export const getEmployeeWarnings = async (params) => {
  const res = await apiGet("/getEmployeeWarnings", {
    params: { ...params },
  });

  return res;
};

export const getEmployeeWarningById = async (id: any) => {
  const response = await apiGet(`/getEmployeeWarningById`, {
    params: {
      id_employee_warning: id,
    },
  });
  return response;
};

export const restoreEmployeeWarning = async (payload) => {
  const res = await apiPut("/restoreEmployeeWarning", payload);

  return res;
};

export const deleteEmployeeWarning = async (payload) => {
  const res = await apiPut("/deleteEmployeeWarning", payload);

  return res;
};
