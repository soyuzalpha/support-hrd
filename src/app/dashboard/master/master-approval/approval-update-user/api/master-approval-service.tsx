import { apiGet, apiPost, apiPut } from "@/service/service";

// export const createFlowapprovalleave = async (payload) => {
//   const res = await apiPost("/createFlowapprovalleave", payload);

//   return res;
// };

export const approveEmployeeUpdateRequest = async (payload) => {
  const res = await apiPut("/approveEmployeeUpdateRequest", payload);

  return res;
};
export const rejectEmployeeUpdateRequest = async (payload) => {
  const res = await apiPut("/rejectEmployeeUpdateRequest", payload);

  return res;
};

export const getEmployeeUpdateRequests = async (params) => {
  const res = await apiGet("/getEmployeeUpdateRequests", {
    params: { ...params },
  });

  return res;
};

// export const activateCompany = async (payload) => {
//   const res = await apiPut("/activateCompany", payload);

//   return res;
// };

// export const deleteCompany = async (payload) => {
//   const res = await apiPut("/deleteCompany", payload);

//   return res;
// };
