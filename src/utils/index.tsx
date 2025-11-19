import { useFormContext } from "react-hook-form";

/**
 * Cek apakah value adalah array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Convert value ke array jika belum array
 */
export function toArray<T>(value: T | T[]): T[] {
  return isArray(value) ? value : [value];
}

/**
 * Convert object ke array jika belum array
 */
export function objectToArray<T>(obj: Record<string, T> | null | undefined): T[] {
  return obj ? Object.values(obj) : [];
}

/**
 * Cek apakah value adalah object (dan bukan null atau array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Cek apakah value kosong:
 * - string: kosong/tanpa isi
 * - array: panjangnya 0
 * - object: tidak punya key
 * - null/undefined: true
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;

  if (typeof value === "string") return value.trim().length === 0;

  if (isArray(value)) return value.length === 0;

  if (isObject(value)) return Object.keys(value).length === 0;

  return false;
}

export type OptionType = {
  label: string;
  value: string | number;
};

/**
 * ini untuk membuat opsi select, outputnya object dengan label dan value
 * @param label label atau judul dai opsi
 * @param value value dari opsi
 * @returns
 */

export function createInputOptions(label: string, value: string | number | null): any {
  return { label, value };
}

/**
 *
 * @param status string status shipping instructions
 * @returns formated readable status shipping instructions
 */
export const toDisplayStatusShipping = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 *
 * @param value melakukan formating text menjadi capitalize dari param string yang dikirim
 * @returns
 */

export const toCapitalized = (value: string | null | undefined): string => {
  if (!value) return "";

  return value
    ?.toLowerCase()
    ?.replace(/_/g, " ")
    ?.replace(/\b\w/g, (char) => char.toUpperCase());
};
/**
 *
 * @param err error response api from service, convert into readable error message
 * @returns
 */

export const generateErrorMessage = (err: any): string[] => {
  const response = err?.response?.data;

  // Prioritas utama: jika ada `errors` object
  if (response?.errors && typeof response.errors === "object") {
    return extractMessagesFromObject(response.errors);
  }

  // Cek jika ada `meta_data.errors` object
  if (response?.meta_data?.errors && typeof response.meta_data.errors === "object") {
    return extractMessagesFromObject(response.meta_data.errors);
  }

  if (typeof response?.meta_data?.errors === "string") {
    return [response.meta_data.errors];
  }

  // Jika ada message fallback
  if (typeof response?.meta_data?.message === "string") {
    return [response.meta_data.message];
  }

  if (typeof response?.message === "string") {
    return [response.message];
  }

  // Fallback terakhir
  return ["Terjadi kesalahan yang tidak diketahui"];
};

// Helper untuk ekstraksi error
const extractMessagesFromObject = (errorsObj: Record<string, any>): string[] => {
  return Object.entries(errorsObj).flatMap(([_, value]) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return [value];
    return [];
  });
};

// export const generateSuccessMessage = (res: any): any => {
//   const successMessage = res?.meta_data?.message;

//   if (successMessage && typeof successMessage === "object") {
//     return Object.entries(successMessage).flatMap(([key, value]) => {
//       if (Array.isArray(value)) return value;
//       if (typeof value === "string") return [value];
//       return [];
//     });
//   }

//   if (typeof res?.message === "string") {
//     return [res.message];
//   }

//   return ["Success"];
// };

export const generateSuccessMessage = (res: any): any => {
  const message = res?.meta_data?.message;

  if (typeof message === "string") {
    return [message];
  }

  if (message && typeof message === "object") {
    return Object.entries(message).flatMap(([_, value]) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") return [value];
      return [];
    });
  }

  if (typeof res?.message === "string") {
    return [res.message];
  }

  return ["Success"];
};
