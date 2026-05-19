import { getUserById } from "@/app/dashboard/master/master-user/api/master-position-service";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const query = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
