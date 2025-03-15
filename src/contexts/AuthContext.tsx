import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { 
  User, 
  AuthContextType, 
  AuthProviderProps, 
  LoginFormData, 
  RegisterFormData 
} from '../types/auth.types';

// Create authentication context
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => ({ access_token: '', user: {} as User }),
  register: async () => ({ access_token: '', user: {} as User }),
  logout: () => {},
});

// Authentication context provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to check authentication status
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      // First check local storage for token and user data
      const { isAuthenticated: isAuthFromStorage, user: userFromStorage } = authService.checkAuth();
      
      if (isAuthFromStorage && userFromStorage) {
        // If we have data in storage, set authenticated state
        setIsAuthenticated(true);
        setUser(userFromStorage);
        
        // Validate token in the background without blocking the UI
        authService.validateToken().catch(error => {
          console.error('Token validation error:', error);
        });
      } else {
        // No auth data in storage
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      // Don't log out the user on error, just keep the current state
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
    
    // Add event listener for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'auth_user') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthStatus]);

  // Login function
  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      
      // After login, check auth status to get the user data
      const { isAuthenticated: isAuth, user: userData } = authService.checkAuth();
      
      setIsAuthenticated(isAuth);
      setUser(userData);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Registration function
  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      
      // After registration, check auth status to get the user data
      const { isAuthenticated: isAuth, user: userData } = authService.checkAuth();
      
      setIsAuthenticated(isAuth);
      setUser(userData);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 