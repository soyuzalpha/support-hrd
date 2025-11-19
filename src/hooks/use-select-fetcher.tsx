import { apiGet } from "@/service/service";
import { useCallback } from "react";

type UseSelectFetcherParams<T> = {
  endpoint: string;
  labelKey?: keyof T; // default: "label"
  valueKey?: keyof T; // default: "value"
  queryParam?: string; // default: "search"
  extraParams?: Record<string, any>;
};

type Option = {
  label: string;
  value: string | number;
};

export function useSelectFetcher<T extends Record<string, any>>({
  endpoint,
  labelKey = "label",
  valueKey = "value",
  queryParam = "searchKey",
  extraParams = {},
}: UseSelectFetcherParams<T>) {
  const loadOptions = useCallback(
    async (inputValue: string): Promise<Option[]> => {
      const params = {
        [queryParam]: inputValue,
        ...extraParams,
      };

      try {
        const res = await apiGet(endpoint, { params });

        // Cek apakah bentuk responsnya array langsung
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];

        return data.map((item: T) => ({
          ...item,
          label: String(item[labelKey]),
          value: item[valueKey],
        }));
      } catch (error) {
        console.error("SelectFetcher error:", error);
        return [];
      }
    },
    [endpoint, labelKey, valueKey, queryParam, extraParams]
  );

  return { loadOptions };
}
