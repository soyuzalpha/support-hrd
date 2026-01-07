import { apiGet } from "@/service/service";
import { useQuery } from "@tanstack/react-query";

// ================= API =================
async function getDashboardUsersActive() {
  return apiGet("/getUsersActive");
}

async function getDashboardUsersByEducation() {
  return apiGet("/getUsersByEducation");
}

async function getDashboardUsersByCompany() {
  return apiGet("/getUsersByCompany");
}

async function getDashboardUsersByCompanyDivision() {
  return apiGet("/getUsersByCompanyAndDivision");
}

async function getDashboardUsersByCompanyPosition() {
  return apiGet("/getUsersByCompanyAndPosition");
}

async function getDashboardUsersByPosition() {
  return apiGet("/getUsersByPosition");
}

async function getDashboardUsersByProvince() {
  return apiGet("/getUsersByProvince");
}

async function getDashboardUsersByCity() {
  return apiGet("/getUsersByCity");
}

async function getDashboardUsersByGender() {
  return apiGet("/getUsersByGender");
}

async function getDashboardUsersByAgeGroup() {
  return apiGet("/getUsersByAgeGroup");
}

async function getDashboardUsersByYearsOfService() {
  return apiGet("/getUsersByYearsOfService");
}

async function getDashboardUsersNotActive() {
  return apiGet("/getUsersNotActive");
}

// ================= HOOKS =================
export function useDashboardUsersActive() {
  return useQuery({
    queryKey: ["dashboard", "users", "active"],
    queryFn: getDashboardUsersActive,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersByEducation() {
  return useQuery({
    queryKey: ["dashboard", "users", "education"],
    queryFn: getDashboardUsersByEducation,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersByCompany() {
  return useQuery({
    queryKey: ["dashboard", "users", "company"],
    queryFn: getDashboardUsersByCompany,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersByCompanyDivision() {
  return useQuery({
    queryKey: ["dashboard", "users", "companyDivision"],
    queryFn: getDashboardUsersByCompanyDivision,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersByCompanyPosition() {
  return useQuery({
    queryKey: ["dashboard", "users", "companyPosition"],
    queryFn: getDashboardUsersByCompanyPosition,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersByPosition() {
  return useQuery({
    queryKey: ["dashboard", "users", "position"],
    queryFn: getDashboardUsersByPosition,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersByProvince() {
  return useQuery({
    queryKey: ["dashboard", "users", "province"],
    queryFn: getDashboardUsersByProvince,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersByCity() {
  return useQuery({
    queryKey: ["dashboard", "users", "city"],
    queryFn: getDashboardUsersByCity,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersByGender() {
  return useQuery({
    queryKey: ["dashboard", "users", "gender"],
    queryFn: getDashboardUsersByGender,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersByAgeGroup() {
  return useQuery({
    queryKey: ["dashboard", "users", "ageGroup"],
    queryFn: getDashboardUsersByAgeGroup,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersByYearsOfService() {
  return useQuery({
    queryKey: ["dashboard", "users", "yearsOfService"],
    queryFn: getDashboardUsersByYearsOfService,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsersNotActive() {
  return useQuery({
    queryKey: ["dashboard", "users", "inactive"],
    queryFn: getDashboardUsersNotActive,
    staleTime: 5 * 60 * 1000,
  });
}

// // 🔹 API calls
// async function getUsersActive() {
//   return await apiGet("/getUsersActive");
// }
// async function getUsersByEducation() {
//   return await apiGet("/getUsersByEducation");
// }
// async function getUsersByCompany() {
//   return await apiGet("/getUsersByCompany");
// }
// async function getUsersByCompanyAndDivision() {
//   return await apiGet("/getUsersByCompanyAndDivision");
// }
// async function getUsersByCompanyAndPosition() {
//   return await apiGet("/getUsersByCompanyAndPosition");
// }
// async function getUsersByPosition() {
//   return await apiGet("/getUsersByPosition");
// }
// async function getUsersNotActive() {
//   return await apiGet("/getUsersNotActive");
// }
// async function getUsersByProvince() {
//   return await apiGet("/getUsersByProvince");
// }
// async function getUsersByCity() {
//   return await apiGet("/getUsersByCity");
// }
// async function getUsersByGender() {
//   return await apiGet("/getUsersByGender");
// }
// async function getUsersByAgeGroup() {
//   return await apiGet("/getUsersByAgeGroup");
// }
// async function getUsersByYearsOfService() {
//   return await apiGet("/getUsersByYearsOfService");
// }

// // 🔹 Hooks
// export function useDashboardActiveUser() {
//   return useQuery({
//     queryKey: ["dashboard", "activeUser"],
//     queryFn: getUsersActive,
//     staleTime: 5 * 60 * 1000, // cache 5 menit
//   });
// }
// export function useDashboardUserByEducation() {
//   return useQuery({
//     queryKey: ["dashboard", "userByEducation"],
//     queryFn: getUsersByEducation,
//     staleTime: 5 * 60 * 1000,
//   });
// }
// export function useDashboardUserByCompany() {
//   return useQuery({
//     queryKey: ["dashboard", "userByCompany"],
//     queryFn: getUsersByCompany,
//     staleTime: 5 * 60 * 1000,
//   });
// }
// export function useDashboardUserByCompanyDivision() {
//   return useQuery({
//     queryKey: ["dashboard", "userByCompanyDivision"],
//     queryFn: getUsersByCompanyAndDivision,
//     staleTime: 5 * 60 * 1000,
//   });
// }
// export function useDashboardUserByCompanyPosition() {
//   return useQuery({
//     queryKey: ["dashboard", "userByCompanyPosition"],
//     queryFn: getUsersByCompanyAndPosition,
//     staleTime: 5 * 60 * 1000,
//   });
// }
// export function useDashboardUserByPosition() {
//   return useQuery({
//     queryKey: ["dashboard", "userByPosition"],
//     queryFn: getUsersByPosition,
//     staleTime: 5 * 60 * 1000,
//   });
// }
// export function useDashboardUserByProvince() {
//   return useQuery({
//     queryKey: ["dashboard", "userByProvince"],
//     queryFn: getUsersByProvince,
//     staleTime: 5 * 60 * 1000,
//   });
// }
// export function useDashboardUserByCity() {
//   return useQuery({
//     queryKey: ["dashboard", "userByCity"],
//     queryFn: getUsersByCity,
//     staleTime: 5 * 60 * 1000,
//   });
// }
// export function useDashboardUserByGender() {
//   return useQuery({
//     queryKey: ["dashboard", "userByGender"],
//     queryFn: getUsersByGender,
//     staleTime: 5 * 60 * 1000,
//   });
// }
// export function useDashboardUserByAge() {
//   return useQuery({
//     queryKey: ["dashboard", "userByAge"],
//     queryFn: getUsersByAgeGroup,
//     staleTime: 5 * 60 * 1000,
//   });
// }
// export function useDashboardUserNotActive() {
//   return useQuery({
//     queryKey: ["dashboard", "userNotActive"],
//     queryFn: getUsersNotActive,
//     staleTime: 5 * 60 * 1000,
//   });
// }
// export function useDashboardUserYearService() {
//   return useQuery({
//     queryKey: ["dashboard", "userYearService"],
//     queryFn: getUsersByYearsOfService,
//     staleTime: 5 * 60 * 1000,
//   });
// }
