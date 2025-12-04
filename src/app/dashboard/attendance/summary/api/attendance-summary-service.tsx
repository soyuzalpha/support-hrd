import { apiGet, apiPost, apiPut } from "@/service/service";

export const createAttendanceSummary = async (payload) => {
  const res = await apiPost("/createAttendanceSummary", payload);

  return res;
};

export const updateAttendanceSummary = async (payload) => {
  const res = await apiPut("/updateAttendanceSummary", payload);

  return res;
};

export const getAttendanceSummaries = async (params) => {
  const res = await apiGet("/getAttendanceSummaries", {
    params: { ...params },
  });

  return res;
};

export const getAttendanceSummaryById = async (id: any) => {
  const response = await apiGet(`/getAttendanceSummaryById`, {
    params: {
      id_periodattendance: id,
    },
  });
  return response;
};

export const deleteAttendanceSummary = async (payload) => {
  const res = await apiPut("/deleteAttendanceSummary", payload);

  return res;
};
