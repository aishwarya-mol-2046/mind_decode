import { useQuery } from "@tanstack/react-query";

interface EnvironmentInfo {
  isReplit: boolean;
  authMode: 'replit' | 'local';
}

export function useEnvironment() {
  const { data, isLoading } = useQuery<EnvironmentInfo>({
    queryKey: ['/api/environment'],
    retry: false,
    staleTime: Infinity, // Environment doesn't change
  });

  return {
    isReplit: data?.isReplit ?? false,
    authMode: data?.authMode ?? 'local',
    isLoading,
  };
}
