import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../utils/auth';
import { parseJwt } from '../utils/parseJwt';
import type { User } from '../utils/auth';

export const useAuth = (): {
  user?: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: typeof login.mutateAsync;
  register: typeof register.mutateAsync;
  logout: typeof logout.mutate;
  error: unknown;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
} => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = authStorage.getToken();
  console.log('token',token);
  
console.log('queryClient',queryClient);

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

  const user: User | undefined =
    (queryClient.getQueryData(['user']) as User | undefined) ||
    getUserFromToken() ||
    undefined;

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
