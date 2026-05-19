import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { toastAlert } from "@/lib/toast";
import { getSession } from "next-auth/react";
import { logoutAction } from "@/lib/action/auth-action";

export interface ApiError {
  message: string;
  status?: boolean;
  code?: string | number;
}

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
}

// Configuration
const DEFAULT_CONFIG: Required<ApiClientConfig> = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  timeout: 30000,
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: DEFAULT_CONFIG.baseURL,
  timeout: DEFAULT_CONFIG.timeout,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession(); // ambil session client-side
    const token = session?.accessToken;

    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toastAlert.error("Session expired. Logging out...");
      logoutAction();
      return Promise.reject(error);
    }

    // const message = error.response?.data?.message || error.message || "Something went wrong";
    // toastAlert.error(message);
    return Promise.reject(error);
  },
);

export const apiGet = async <T = any,>(url: string, config?: AxiosRequestConfig & { silent?: boolean }): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  } catch (error: any) {
    if (!config?.silent) {
      toastAlert.error(error.message);
    }
    throw error;
  }
};

export const apiPost = async <T = any,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<any> = await axiosInstance.post(url, data, config);

  if (response.data?.meta_data?.code !== 200 && response.data?.meta_data?.code !== 201) {
    const error: any = {
      status: false,
      message: response.data?.meta_data?.errors || "An error occurred",
      code: response.data?.meta_data?.code,
    };
    return error;
  } else {
    return {
      ...response.data,
      status: true,
    };
  }
};

export const apiPut = async <T = any,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<any> = await axiosInstance.put(url, data, config);
  const { meta_data } = response.data;

  if (![200, 201].includes(meta_data?.code)) {
    throw {
      status: false,
      message: meta_data?.errors || meta_data?.message || "An error occurred",
      code: meta_data?.code,
    };
  }

  return {
    ...response.data,
    status: true,
  };
};

export const apiPatch = async <T = any,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await axiosInstance.patch(url, data, config);
  return response.data;
};

export const apiDelete = async <T = any,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<any> = await axiosInstance.delete(url, {
    ...config,
    data,
  });

  const { meta_data } = response.data;

  if (![200, 201].includes(meta_data?.code)) {
    throw {
      status: false,
      message: meta_data?.errors || meta_data?.message || "An error occurred",
      code: meta_data?.code,
    };
  }

  return {
    ...response.data,
    status: true,
  };
};

export const logoutService = async () => {
  const response = await apiPost("/logout");
  return response;
};

export { axiosInstance };
export default axiosInstance;
