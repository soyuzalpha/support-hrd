import { apiGet, apiPost, apiPut } from "@/service/service";
import { id } from "date-fns/locale";

export const getProvinces = async (params) => {
  const res = await apiGet("/getProvinces", {
    params: { ...params },
  });

  return res;
};

export const getCityByProvince = async (params) => {
  const res = await apiGet("/getCities", {
    params: { ...params, id_province: params.id_province, onEmployeeAddress: params.onEmployeeAddress },
  });

  return res;
};

// export const createFlowapprovalleave = async (payload) => {
//   const res = await apiPost("/createFlowapprovalleave", payload);

//   return res;
// };

// export const updateFlowapprovalleave = async (payload) => {
//   const res = await apiPut("/updateFlowapprovalleave", payload);

//   return res;
// };

// export const activateCompany = async (payload) => {
//   const res = await apiPut("/activateCompany", payload);

//   return res;
// };

// export const deleteCompany = async (payload) => {
//   const res = await apiPut("/deleteCompany", payload);

//   return res;
// };
