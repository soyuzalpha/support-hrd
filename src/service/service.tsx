import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { toastAlert } from "@/lib/toast";
import { signOut } from "next-auth/react";

export interface ApiError {
  message: string;
  status?: boolean;
  code?: string | number;
}
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
export interface UploadConfig extends Omit<AxiosRequestConfig, "onUploadProgress"> {
  onProgress?: (progress: UploadProgress) => void;
}
export interface DownloadConfig extends Omit<AxiosRequestConfig, "onDownloadProgress"> {
  onProgress?: (progress: UploadProgress) => void;
  filename?: string;
}
export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  tokenStorageType?: any;
  refreshTokenStorageType?: any;
  enableTokenRefresh?: boolean;
}

// Configuration
const DEFAULT_CONFIG: Required<ApiClientConfig> = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  timeout: 30000,
  tokenStorageType: "localStorage",
  refreshTokenStorageType: "localStorage",
  enableTokenRefresh: false,
};

export class TokenManager {
  static readonly APP_STATE_KEY = "app-state";

  // Get the full app state from localStorage
  private static getAppState(): any {
    try {
      const raw = localStorage.getItem(this.APP_STATE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      console.error("Failed to parse app-state:", error);
      return null;
    }
  }

  // Save the updated app state to localStorage
  private static setAppState(updatedState: any): void {
    try {
      localStorage.setItem(this.APP_STATE_KEY, JSON.stringify(updatedState));
    } catch (error) {
      console.error("Failed to store app-state:", error);
    }
  }

  static getToken(): string | null {
    const state = this.getAppState();
    return state?.user?.token ?? null;
  }

  static getRefreshToken(): string | null {
    const state = this.getAppState();
    return state?.user?.refreshToken ?? null;
  }

  static setToken(token: string): void {
    const state = this.getAppState() || {};
    const updated = {
      ...state,
      user: {
        ...state.user,
        token,
      },
    };
    this.setAppState(updated);
  }

  static setRefreshToken(refreshToken: string): void {
    const state = this.getAppState() || {};
    const updated = {
      ...state,
      user: {
        ...state.user,
        refreshToken,
      },
    };
    this.setAppState(updated);
  }

  static clear(): void {
    const state = this.getAppState();
    if (!state) return;

    const updated = {
      ...state,
      user: {
        ...state.user,
        token: null,
        refreshToken: null,
      },
    };
    this.setAppState(updated);
  }
}

// Store logout callback to update user context
let logoutCallback: (() => void) | null = null;

// Function to set the logout callback from your components
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Logout function that can be called from anywhere
export const performLogout = async () => {
  try {
    // Clear tokens from storage
    TokenManager.clear();

    // Call the logout callback to update user context
    if (logoutCallback) {
      logoutCallback();
    }

    // Sign out from NextAuth
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });

    // Show success message
    toastAlert.success("Session expired. Please login again.");
  } catch (error) {
    console.error("Error during logout:", error);
    // Even if logout fails, redirect to login
    window.location.href = "/login";
  }
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

// Request interceptor - Add Bearer token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  async (error) => {
    // Check if error status is 401 (Unauthorized)
    if (error.response?.status === 401) {
      console.log("401 error detected, performing logout...");

      // Perform logout logic
      await performLogout();

      // Return a rejected promise to stop further processing
      return Promise.reject(error);
    }

    // For other errors, just reject normally
    return Promise.reject(error);
  }
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

// === FILE UPLOAD ===
export const apiUpload = async <T = any,>(
  url: string,
  file: File | Blob,
  options: {
    fieldName?: string;
    extraData?: Record<string, any>;
    config?: UploadConfig;
  } = {}
): Promise<T> => {
  const { fieldName = "file", extraData = {}, config = {} } = options;

  const formData = new FormData();
  formData.append(fieldName, file);

  Object.entries(extraData).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  const uploadConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: config.onProgress
      ? (progressEvent) => {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total || 0,
            percentage: progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0,
          };
          config.onProgress!(progress);
        }
      : undefined,
  };

  const response: AxiosResponse<T> = await axiosInstance.post(url, formData, uploadConfig);
  return response.data;
};

export const apiUploadMultiple = async <T = any,>(
  url: string,
  files: File[],
  options: {
    fieldName?: string;
    extraData?: Record<string, any>;
    config?: UploadConfig;
  } = {}
): Promise<T> => {
  const { fieldName = "files", extraData = {}, config = {} } = options;

  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append(`${fieldName}[${index}]`, file);
  });

  Object.entries(extraData).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  const uploadConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: config.onProgress
      ? (progressEvent) => {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total || 0,
            percentage: progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0,
          };
          config.onProgress!(progress);
        }
      : undefined,
  };

  const response: AxiosResponse<T> = await axiosInstance.post(url, formData, uploadConfig);
  return response.data;
};

// === FILE DOWNLOAD ===
export const apiDownload = async (url: string, options: DownloadConfig = {}): Promise<Blob> => {
  const { filename, onProgress, ...config } = options;

  const downloadConfig: AxiosRequestConfig = {
    ...config,
    responseType: "blob",
    onDownloadProgress: onProgress
      ? (progressEvent) => {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total || 0,
            percentage: progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0,
          };
          onProgress(progress);
        }
      : undefined,
  };

  const response: AxiosResponse<Blob> = await axiosInstance.get(url, downloadConfig);

  if (filename && typeof window !== "undefined") {
    const downloadUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  return response.data;
};

export const logoutService = async () => {
  const response = await apiPost("/logout");
  return response;
};

// Export the axios instance for advanced usage
export { axiosInstance };
export default axiosInstance;

// import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
// import { toastAlert } from "@/lib/toast";

// export interface ApiError {
//   message: string;
//   status?: boolean;
//   code?: string | number;
// }
// export interface UploadProgress {
//   loaded: number;
//   total: number;
//   percentage: number;
// }
// export interface UploadConfig extends Omit<AxiosRequestConfig, "onUploadProgress"> {
//   onProgress?: (progress: UploadProgress) => void;
// }
// export interface DownloadConfig extends Omit<AxiosRequestConfig, "onDownloadProgress"> {
//   onProgress?: (progress: UploadProgress) => void;
//   filename?: string;
// }
// export interface ApiClientConfig {
//   baseURL?: string;
//   timeout?: number;
//   tokenStorageType?: any;
//   refreshTokenStorageType?: any;
//   enableTokenRefresh?: boolean;
// }
// // Configuration
// const DEFAULT_CONFIG: Required<ApiClientConfig> = {
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
//   timeout: 30000,
//   tokenStorageType: "localStorage",
//   refreshTokenStorageType: "localStorage",
//   enableTokenRefresh: false,
// };

// export class TokenManager {
//   static readonly APP_STATE_KEY = "app-state";

//   // Get the full app state from localStorage
//   private static getAppState(): any {
//     try {
//       const raw = localStorage.getItem(this.APP_STATE_KEY);
//       if (!raw) return null;
//       return JSON.parse(raw);
//     } catch (error) {
//       console.error("Failed to parse app-state:", error);
//       return null;
//     }
//   }

//   // Save the updated app state to localStorage
//   private static setAppState(updatedState: any): void {
//     try {
//       localStorage.setItem(this.APP_STATE_KEY, JSON.stringify(updatedState));
//     } catch (error) {
//       console.error("Failed to store app-state:", error);
//     }
//   }

//   static getToken(): string | null {
//     const state = this.getAppState();
//     return state?.user?.token ?? null;
//   }

//   static getRefreshToken(): string | null {
//     const state = this.getAppState();
//     return state?.user?.refreshToken ?? null;
//   }

//   static setToken(token: string): void {
//     const state = this.getAppState() || {};
//     const updated = {
//       ...state,
//       user: {
//         ...state.user,
//         token,
//       },
//     };
//     this.setAppState(updated);
//   }

//   static setRefreshToken(refreshToken: string): void {
//     const state = this.getAppState() || {};
//     const updated = {
//       ...state,
//       user: {
//         ...state.user,
//         refreshToken,
//       },
//     };
//     this.setAppState(updated);
//   }

//   static clear(): void {
//     const state = this.getAppState();
//     if (!state) return;

//     const updated = {
//       ...state,
//       user: {
//         ...state.user,
//         token: null,
//         refreshToken: null,
//       },
//     };
//     this.setAppState(updated);
//   }
// }

// // Create axios instance
// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: DEFAULT_CONFIG.baseURL,
//   timeout: DEFAULT_CONFIG.timeout,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor - Add Bearer token to every request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = TokenManager.getToken();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export const apiGet = async <T = any,>(url: string, config?: AxiosRequestConfig & { silent?: boolean }): Promise<T> => {
//   try {
//     const response: AxiosResponse<T> = await axiosInstance.get(url, config);
//     return response.data;
//   } catch (error: any) {
//     if (!config?.silent) {
//       toastAlert.error(error.message);
//     }
//     throw error;
//   }
// };

// export const apiPost = async <T = any,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
//   const response: AxiosResponse<any> = await axiosInstance.post(url, data, config);

//   if (response.data?.meta_data?.code !== 200 && response.data?.meta_data?.code !== 201) {
//     const error: any = {
//       status: false,
//       message: response.data?.meta_data?.errors || "An error occurred",
//       code: response.data?.meta_data?.code,
//     };
//     return error;
//   } else {
//     return {
//       ...response.data,
//       status: true,
//     };
//   }
// };

// export const apiPut = async <T = any,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
//   const response: AxiosResponse<any> = await axiosInstance.put(url, data, config);
//   const { meta_data } = response.data;

//   if (![200, 201].includes(meta_data?.code)) {
//     throw {
//       status: false,
//       message: meta_data?.errors || meta_data?.message || "An error occurred",
//       code: meta_data?.code,
//     };
//   }

//   return {
//     ...response.data,
//     status: true,
//   };
// };

// export const apiPatch = async <T = any,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
//   const response: AxiosResponse<T> = await axiosInstance.patch(url, data, config);
//   return response.data;
// };

// export const apiDelete = async <T = any,>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
//   const response: AxiosResponse<any> = await axiosInstance.delete(url, {
//     ...config,
//     data,
//   });

//   const { meta_data } = response.data;

//   if (![200, 201].includes(meta_data?.code)) {
//     throw {
//       status: false,
//       message: meta_data?.errors || meta_data?.message || "An error occurred",
//       code: meta_data?.code,
//     };
//   }

//   return {
//     ...response.data,
//     status: true,
//   };
// };

// // === FILE UPLOAD ===
// export const apiUpload = async <T = any,>(
//   url: string,
//   file: File | Blob,
//   options: {
//     fieldName?: string;
//     extraData?: Record<string, any>;
//     config?: UploadConfig;
//   } = {}
// ): Promise<T> => {
//   const { fieldName = "file", extraData = {}, config = {} } = options;

//   const formData = new FormData();
//   formData.append(fieldName, file);

//   Object.entries(extraData).forEach(([key, value]) => {
//     formData.append(key, String(value));
//   });

//   const uploadConfig: AxiosRequestConfig = {
//     ...config,
//     headers: {
//       ...config.headers,
//       "Content-Type": "multipart/form-data",
//     },
//     onUploadProgress: config.onProgress
//       ? (progressEvent) => {
//           const progress: UploadProgress = {
//             loaded: progressEvent.loaded,
//             total: progressEvent.total || 0,
//             percentage: progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0,
//           };
//           config.onProgress!(progress);
//         }
//       : undefined,
//   };

//   const response: AxiosResponse<T> = await axiosInstance.post(url, formData, uploadConfig);
//   return response.data;
// };

// export const apiUploadMultiple = async <T = any,>(
//   url: string,
//   files: File[],
//   options: {
//     fieldName?: string;
//     extraData?: Record<string, any>;
//     config?: UploadConfig;
//   } = {}
// ): Promise<T> => {
//   const { fieldName = "files", extraData = {}, config = {} } = options;

//   const formData = new FormData();

//   files.forEach((file, index) => {
//     formData.append(`${fieldName}[${index}]`, file);
//   });

//   Object.entries(extraData).forEach(([key, value]) => {
//     formData.append(key, String(value));
//   });

//   const uploadConfig: AxiosRequestConfig = {
//     ...config,
//     headers: {
//       ...config.headers,
//       "Content-Type": "multipart/form-data",
//     },
//     onUploadProgress: config.onProgress
//       ? (progressEvent) => {
//           const progress: UploadProgress = {
//             loaded: progressEvent.loaded,
//             total: progressEvent.total || 0,
//             percentage: progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0,
//           };
//           config.onProgress!(progress);
//         }
//       : undefined,
//   };

//   const response: AxiosResponse<T> = await axiosInstance.post(url, formData, uploadConfig);
//   return response.data;
// };

// // === FILE DOWNLOAD ===
// export const apiDownload = async (url: string, options: DownloadConfig = {}): Promise<Blob> => {
//   const { filename, onProgress, ...config } = options;

//   const downloadConfig: AxiosRequestConfig = {
//     ...config,
//     responseType: "blob",
//     onDownloadProgress: onProgress
//       ? (progressEvent) => {
//           const progress: UploadProgress = {
//             loaded: progressEvent.loaded,
//             total: progressEvent.total || 0,
//             percentage: progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0,
//           };
//           onProgress(progress);
//         }
//       : undefined,
//   };

//   const response: AxiosResponse<Blob> = await axiosInstance.get(url, downloadConfig);

//   if (filename && typeof window !== "undefined") {
//     const downloadUrl = window.URL.createObjectURL(response.data);
//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(downloadUrl);
//   }

//   return response.data;
// };

// export const logoutService = async () => {
//   const response = await apiPost("/logout");
//   return response;
// };

// // Export the axios instance for advanced usage
// export { axiosInstance };
// export default axiosInstance;
