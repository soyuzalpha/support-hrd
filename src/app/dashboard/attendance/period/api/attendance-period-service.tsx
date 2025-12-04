import { apiGet, apiPost, apiPut } from "@/service/service";

export const createPeriodAttendance = async (payload) => {
  const res = await apiPost("/createPeriodAttendance", payload);

  return res;
};

export const updatePeriodAttendance = async (payload) => {
  const res = await apiPut("/updatePeriodAttendance", payload);

  return res;
};

export const getPeriodAttendances = async (params) => {
  const res = await apiGet("/getPeriodAttendances", {
    params: { ...params },
  });

  return res;
};

export const getPeriodAttendanceById = async (id: any) => {
  const response = await apiGet(`/getPeriodAttendanceById`, {
    params: {
      id_periodattendance: id,
    },
  });
  return response;
};

export const deletePeriodAttendance = async (payload) => {
  const res = await apiPut("/deletePeriodAttendance", payload);

  return res;
};
