import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
// import type {
//   LoginCredentials,
//   RegisterCredentials,
//   AuthResponse,
// } from '../types/auth.types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  // Query do sprawdzania stanu autoryzacji
  const { data: user, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!token) return null;
      try {
        return await authApi.me(token);
      } catch {
        localStorage.removeItem('token');
        return null;
      }
    },
    enabled: !!token, // query wykona się tylko jeśli jest token
    staleTime: 1000 * 60 * 5, // 5 minut
  });

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('token');
      queryClient.clear();
    },
  });

  return {
    // Stan autoryzacji
    user,
    isAuthenticated: !!user,
    isLoading: isCheckingAuth || login.isPending || register.isPending,

    // Akcje
    login: login.mutate,
    register: register.mutate,
    logout: logout.mutate,

    // Błędy
    error: login.error || register.error,

    // Statusy mutacji
    isLoggingIn: login.isPending,
    isRegistering: register.isPending,
    isLoggingOut: logout.isPending,
  };
};
