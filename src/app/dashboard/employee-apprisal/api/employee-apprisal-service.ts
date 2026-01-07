import { apiGet, apiPost, apiPut } from "@/service/service";

export const createEmployeeAppraisal = async (payload) => {
  const res = await apiPost("/createEmployeeAppraisal", payload);

  return res;
};

export const updateEmployeeAppraisal = async (payload) => {
  const res = await apiPut("/updateEmployeeAppraisal", payload);

  return res;
};

export const getEmployeeAppraisals = async (params) => {
  const res = await apiGet("/getEmployeeAppraisals", {
    params: { ...params },
  });

  return res;
};

export const getEmployeeAppraisalById = async (id: any) => {
  const response = await apiGet(`/getEmployeeAppraisalById`, {
    params: {
      id_employee_appraisal: id,
    },
  });
  return response;
};

export const restoreEmployeeAppraisal = async (payload) => {
  const res = await apiPut("/restoreEmployeeAppraisal", payload);

  return res;
};

export const deleteEmployeeAppraisal = async (payload) => {
  const res = await apiPut("/deleteEmployeeAppraisal", payload);

  return res;
};
