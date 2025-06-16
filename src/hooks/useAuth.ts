import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../utils/auth';
// import type {
//   LoginCredentials,
//   RegisterCredentials,
//   AuthResponse,
// } from '../types/auth.types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = authStorage.getToken();
  const user = queryClient.getQueryData(['user']);

  console.log('Current state:', {
    token: !!token,
    user,
    isTokenValid: authStorage.isAuthenticated(),
    isUserInCache: !!user,
  });

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log('Login success, data:', data);
      authStorage.setToken(data.accessToken);
      // Upewnijmy się, że dane użytkownika są poprawnie zapisywane
      queryClient.setQueryData(['user'], data.user);
      console.log('After setting data:', {
        token: authStorage.getToken(),
        user: queryClient.getQueryData(['user']),
      });
    },
  });

  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      console.log('Register success, data:', data);
      authStorage.setToken(data.accessToken);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } finally {
        authStorage.clear();
        queryClient.clear();
        navigate('/auth/login');
      }
    },
  });

  // Dodajmy więcej logów do debugowania
  const isAuthenticated = authStorage.isAuthenticated() && !!user;
  console.log('Auth state:', {
    hasToken: authStorage.isAuthenticated(),
    hasUser: !!user,
    isAuthenticated,
  });

  return {
    // Stan autoryzacji
    user,
    isAuthenticated,
    isLoading: login.isPending || register.isPending,

    // Akcje
    login: login.mutateAsync,
    register: register.mutateAsync,
    logout: logout.mutate,

    // Błędy
    error: login.error || register.error,

    // Statusy mutacji
    isLoggingIn: login.isPending,
    isRegistering: register.isPending,
    isLoggingOut: logout.isPending,
  };
};
