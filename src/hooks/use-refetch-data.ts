import { useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook untuk invalidate query React Query secara konsisten
 */
export const useAppRefreshQuery = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidate satu atau lebih query keys
   * @param keys - array of query keys, contoh: [['customers'], ['user', 1]]
   */
  const invalidate = async (keys: readonly unknown[][]) => {
    await Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: key })));
  };

  return { invalidate };
};
