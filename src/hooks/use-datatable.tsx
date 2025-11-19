"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type UseDatatableOptions<TParams extends object, TResult> = {
  /**
   * Unique query key
   */
  queryKey: string;

  /**
   * Function to call API, sudah kamu buat di folder /api
   */
  queryFn: (params: TParams) => Promise<TResult>;

  /**
   * Initial state (pagination, filter, etc.)
   */
  initialParams: TParams;

  /**
   * Optional: aktifkan/disabel fetch
   */
  enabled?: boolean;
};

export function useDatatable<TParams extends object, TResult>({
  queryKey,
  queryFn,
  initialParams,
  enabled = true,
}: UseDatatableOptions<TParams, TResult>) {
  const [currentState, setCurrentState] = useState<TParams>(initialParams);

  const query = useQuery({
    queryKey: [queryKey, currentState],
    queryFn: () => queryFn(currentState),
    enabled,
    // keepPreviousData: true,
  });

  return {
    ...query,
    currentState,
    setCurrentState,
  };
}
