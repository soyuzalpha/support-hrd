import { apiGet, apiPost, apiPut } from "@/service/service";

export const createEmployee = async (payload) => {
  const res = await apiPost("/createEmployee", payload);

  return res;
};

export const updateEmployee = async (payload) => {
  const res = await apiPut("/updateEmployee", payload);

  return res;
};

export const getEmployees = async (params) => {
  const res = await apiGet("/getEmployees", {
    params: { ...params },
  });

  return res;
};

export const getEmployeeById = async (id: any) => {
  const response = await apiGet(`/getEmployeeById`, {
    params: {
      id_employee: id,
    },
  });
  return response;
};
export const getEmployeeByUser = async (id: any) => {
  const response = await apiGet(`/getEmployeeByUser`, {
    params: {
      id_user: id,
    },
  });
  return response;
};

export const activateEmployee = async (payload) => {
  const res = await apiPut("/activatePosition", payload);

  return res;
};

export const deactivateEmployee = async (payload) => {
  const res = await apiPut("/deactivateEmployee", payload);

  return res;
};
