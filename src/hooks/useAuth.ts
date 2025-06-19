import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../utils/auth';
import { parseJwt } from '../utils/parseJwt';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = authStorage.getToken();

  const getUserFromToken = () => {
    if (!token) return null;
    try {
      const tokenData = parseJwt(token);
      return {
        id: tokenData.sub,
        email: tokenData.email,
        name: tokenData.name || tokenData.email?.split('@')[0],
      };
    } catch (e) {
      console.error('Error parsing user from token:', e);
      return null;
    }
  };

  const user = queryClient.getQueryData(['user']) || getUserFromToken();

  if (user && !queryClient.getQueryData(['user'])) {
    queryClient.setQueryData(['user'], user);
  }

  // console.log('Current state:', {
  //   token: !!token,
  //   user,
  //   isTokenValid: authStorage.isAuthenticated(),
  //   isUserInCache: !!user,
  // });

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // console.log('Login success, data:', data);
      authStorage.setToken(data.accessToken, data.user);
      // Upewnijmy się, że dane użytkownika są poprawnie zapisywane
      queryClient.setQueryData(['user'], data.user);
      // console.log('After setting data:', {
      //   token: authStorage.getToken(),
      //   user: queryClient.getQueryData(['user']),
      // });
    },
  });

  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // console.log('Register success, data:', data);
      authStorage.setToken(data.accessToken, data.user);
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

  // Modify isAuthenticated to only check token
  const isAuthenticated = authStorage.isAuthenticated();

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
