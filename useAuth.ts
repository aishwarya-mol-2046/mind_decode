import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: (failureCount, error) => {
      // Don't retry on 401 errors - user is just not logged in
      if (error instanceof Error && isUnauthorizedError(error)) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
    refetchOnWindowFocus: true, // Refetch when user returns to the page (after login)
    refetchOnMount: true, // Always refetch when component mounts
    staleTime: 0, // Consider data stale immediately so it refetches
  });

  // Treat 401 errors as "not authenticated" rather than an error state
  const isUnauthorized = error instanceof Error && isUnauthorizedError(error);
  const isAuthenticated = !!user && !isUnauthorized;

  return {
    user,
    isLoading,
    isAuthenticated,
    refetch,
  };
}
