import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { 
  User, 
  AuthContextType, 
  AuthProviderProps, 
  LoginFormData, 
  RegisterFormData 
} from '../types/auth.types';

// Create context with default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Hook for components to easily access the context
export const useAuth = () => useContext(AuthContext);

// Authentication context provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on first render
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const { isAuthenticated: authenticated, user: authUser } = authService.checkAuth();
        
        if (authenticated && authUser) {
          setUser(authUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error checking authentication status:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (data: LoginFormData) => {
    setError(null);
    try {
      const response = await authService.login(data);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    }
  };

  // Registration function
  const register = async (data: RegisterFormData) => {
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Context value that will be provided to components
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 