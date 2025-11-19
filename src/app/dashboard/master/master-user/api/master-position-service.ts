import { apiGet, apiPost, apiPut } from "@/service/service";

export const createUsers = async (payload) => {
  const res = await apiPost("/createUsers", payload);

  return res;
};

export const updateUser = async (payload) => {
  const res = await apiPut("/updateUser", payload);

  return res;
};

export const getUsers = async (params) => {
  const res = await apiGet("/getUsers", {
    params: { ...params },
  });

  return res;
};
export const getUserById = async (id: any) => {
  const response = await apiGet(`/getUserById`, {
    params: {
      id: id,
    },
  });
  return response;
};

// export const activatePosition = async (payload) => {
//   const res = await apiPut("/activatePosition", payload);

//   return res;
// };

export const deleteUser = async (payload) => {
  const res = await apiPut("/deleteUser", payload);

  return res;
};
