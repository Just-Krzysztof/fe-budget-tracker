import { ReactNode } from 'react';

// Login form interface
export interface LoginFormData {
  email: string;
  password: string;
}

// Registration form interface
export interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
}

// Authentication response interface from API
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
  };
  access_token: string;
}

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
}

// Authentication context data interface
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}

// Authentication provider properties
export interface AuthProviderProps {
  children: ReactNode;
} 