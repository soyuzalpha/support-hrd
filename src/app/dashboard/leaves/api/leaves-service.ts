import { apiGet, apiPost, apiPut } from "@/service/service";

export const createLeaveRequest = async (payload) => {
  const res = await apiPost("/createLeaveRequest", payload);

  return res;
};

export const updateLeaveRequest = async (payload) => {
  const res = await apiPut("/updateLeaveRequest", payload);

  return res;
};

export const getLeaveRequests = async (params) => {
  const res = await apiGet("/getLeaveRequests", {
    params: { ...params },
  });

  return res;
};

export const getLeaveRequestById = async (id: any) => {
  const response = await apiGet(`/getLeaveRequestById`, {
    params: {
      id_leaverequest: id,
    },
  });
  return response;
};

export const activateLeaveRequest = async (payload) => {
  const res = await apiPut("/activateLeaveRequest", payload);

  return res;
};

export const deleteLeaveRequest = async (payload) => {
  const res = await apiPut("/deleteLeaveRequest", payload);

  return res;
};

export const actionLeaveRequest = async (payload) => {
  const res = await apiPut("/actionLeaveRequest", payload);

  return res;
};
