import { apiGet } from "@/service/service";
import { useQuery } from "@tanstack/react-query";

// 🔹 API calls
async function fetchAgents() {
  return await apiGet("/dashboard/getDataAgents");
}
async function fetchVendors() {
  return await apiGet("/dashboard/getDataVendors");
}
async function fetchAirlines() {
  return await apiGet("/dashboard/getDataAirlines");
}
async function fetchUsers() {
  return await apiGet("/dashboard/getDataUsers");
}
async function fetchAirports() {
  return await apiGet("/dashboard/getDataAirports");
}
async function fetchTopDest() {
  return await apiGet("/dashboard/getTopDest");
}
async function fetchDailyUplift(params: any) {
  return await apiGet("/dashboard/getDailyUplift", {
    params: params,
  });
}

// 🔹 Hooks
export function useDashboardAgents() {
  return useQuery({
    queryKey: ["dashboard", "agents"],
    queryFn: fetchAgents,
    staleTime: 5 * 60 * 1000, // cache 5 menit
  });
}

export function useDashboardVendors() {
  return useQuery({
    queryKey: ["dashboard", "vendors"],
    queryFn: fetchVendors,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardAirlines() {
  return useQuery({
    queryKey: ["dashboard", "airlines"],
    queryFn: fetchAirlines,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardUsers() {
  return useQuery({
    queryKey: ["dashboard", "users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardAirports() {
  return useQuery({
    queryKey: ["dashboard", "airports"],
    queryFn: fetchAirports,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardTopDestination() {
  return useQuery({
    queryKey: ["dashboard", "airports"],
    queryFn: fetchTopDest,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardDailyUplift(date_from?: string, date_to?: string) {
  return useQuery({
    queryKey: ["dashboard", "daily-uplift", date_from, date_to],
    queryFn: () => fetchDailyUplift({ date_from, date_to }),
    enabled: !!date_from && !!date_to, // query hanya jalan kalau dua tanggal sudah diisi
    // staleTime: 5 * 60 * 1000,
  });
}
