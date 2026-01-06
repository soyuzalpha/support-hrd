import { apiGet, apiPost, apiPut } from "@/service/service";

export const createFlowapprovalleave = async (payload) => {
  const res = await apiPost("/createFlowapprovalleave", payload);

  return res;
};

export const updateFlowapprovalleave = async (payload) => {
  const res = await apiPut("/updateFlowapprovalleave", payload);

  return res;
};

export const getFlowapprovalleave = async (params) => {
  const res = await apiGet("/getFlowapprovalleave", {
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
