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
    async (inputValue: string, currentValue?: Option | Option[] | null): Promise<Option[]> => {
      const params = {
        [queryParam]: inputValue,
        limit: inputValue ? 100 : 10,
        ...extraParams,
      };

      try {
        const res = await apiGet(endpoint, { params });

        // Cek apakah bentuk responsnya array langsung
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];

        const options = data.map((item: T) => ({
          ...item,
          label: String(item[labelKey]),
          value: item[valueKey],
        }));

        // Jika tidak ada input dan ada currentValue, pastikan currentValue ada di options
        if (!inputValue && currentValue) {
          const selectedValues = Array.isArray(currentValue) 
            ? currentValue.map(v => v.value) 
            : [currentValue.value];

          const hasSelected = selectedValues.every(val => 
            options.some(opt => opt.value === val)
          );

          // Jika selected value belum ada di options, tambahkan di awal
          if (!hasSelected && !Array.isArray(currentValue) && currentValue) {
            return [currentValue, ...options.slice(0, 9)];
          }
        }

        return options;
      } catch (error) {
        console.error("SelectFetcher error:", error);
        return [];
      }
    },
    [endpoint, labelKey, valueKey, queryParam, extraParams]
  );

  return { loadOptions };
}
